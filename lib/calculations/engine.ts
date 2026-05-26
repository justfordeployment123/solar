import { TechnicalInputs, FinancialInputs, DerivedResults, RevenueStreams, YearlyCashflow, SensitivityPoint } from '@/types/calculator';

const REGIONAL_MULTIPLIERS = {
  North: 900,
  Central: 950,
  South: 1000,
};

const VPP_BONUS_MULTIPLIER = 1.12;
const DEGRADATION_RATE = 0.02; // 2% annual degradation
const MARKET_DECLINE_RATE = 0.02; // 2% annual market decline for traded services
const INFLATION_RATE = 0.038; // 3.8% annual inflation for retail electricity prices
const MAINTENANCE_YEAR = 10;

// Maximum share of annual consumption a (well-sized) battery can self-supply.
// Real systems never reach 100% (winter / multi-day clouds), but an oversized
// battery on a small load can realistically approach this. Tunable.
const MAX_AUTARKY = 0.95;

// Average captured intraday spread on the spot market (EPEX), €/kWh per full
// cycle. Calibrated so a ~1,000 kWh system trading ~300 cycles yields the
// €60–70k/yr range confirmed as realistic by the field team. Tunable.
const EPEX_SPREAD_EUR_PER_KWH = 0.25;

// Real German retail electricity is ~15–60 ct/kWh. The price field is in
// Cent/kWh, but users frequently type the €/kWh figure (e.g. 0.35 instead of
// 35). Anything below 3 "cents" is implausible as a retail price and is treated
// as €/kWh and scaled up. Exported so the input forms validate consistently.
export function normalizeElectricityPriceCents(raw: number | null | undefined): number {
  if (raw == null || !(raw > 0)) return 35; // sensible default
  return raw < 3 ? raw * 100 : raw;
}

// Balancing-market access scales with fleet size (N-Gen pools many storage
// systems as a BSP), so larger storage earns a higher effective return. Applied
// on top of the per-kW PRL/SRL rates. Tunable.
function balancingTierMultiplier(capacityKwh: number): number {
  if (capacityKwh >= 500) return 1.15;
  if (capacityKwh >= 200) return 1.10;
  if (capacityKwh >= 100) return 1.05;
  return 1.0;
}

// Distance to the nearest substation drives line losses for grid-facing markets.
// <=1 km is treated as effectively loss-free; beyond that ~1% loss per km, with a
// floor so very remote sites still model a usable (if reduced) baseline. Tunable.
function substationLossFactor(km: number | null | undefined): number {
  if (km == null || km <= 1) return 1;
  return Math.max(0.85, 1 - 0.01 * (km - 1));
}

export function calculateResults(
  technical: TechnicalInputs,
  financial: FinancialInputs
): DerivedResults {
  // --- Graceful Fallbacks & Initialization ---
  const currentBatteryCapacityKwh = technical.currentBatteryCapacityKwh ?? 0;
  const existingBatteryCapacityKwh = technical.existingBatteryCapacityKwh ?? 0;
  const totalCapacity = existingBatteryCapacityKwh + currentBatteryCapacityKwh;
  const isNGen = technical.existingBatteryManufacturer === 'NGen';
  const controllableCapacity = currentBatteryCapacityKwh + (isNGen ? existingBatteryCapacityKwh : 0);

const gridImportLimitKw = technical.gridImportLimitKw ?? 100;
  const pvSize = technical.pvSizeKwp ?? 0;
  const fallbackInverterPower = pvSize > 0 ? pvSize * 1.2 : gridImportLimitKw;
  const actualInverterPower = technical.inverterPowerKw ?? fallbackInverterPower;

  // --- Cycle Budget Allocation (Physics Enforced) ---
  let remainingCycles = 400; // Absolute physical limit of equivalent full cycles per year for LFP
  const safeInverterPower = Math.min(actualInverterPower, controllableCapacity); // 1C Cap Limit

  // --- Bottleneck: a grid connection smaller than the storage power throttles
  // everything that flows through the grid (arbitrage + balancing). When no grid
  // limit is given we assume the connection is adequate. ---
  const gridExportLimitKw = technical.gridExportLimitKw ?? null;
  const exportConstrainedPower =
    gridExportLimitKw != null
      ? Math.min(safeInverterPower, gridExportLimitKw)
      : safeInverterPower;
  const bottleneckActive = gridExportLimitKw != null && gridExportLimitKw < safeInverterPower;
  const gridThroughputFactor = safeInverterPower > 0 ? exportConstrainedPower / safeInverterPower : 1;

  // Line losses to the nearest substation derate grid-facing revenue.
  const substationFactor = substationLossFactor(technical.substationDistanceKm);
  // Combined derate applied to every grid-facing (traded) stream.
  const gridRevenueFactor = gridThroughputFactor * substationFactor;

  // 1. Self-Consumption (Highest Priority)
  // normalizeElectricityPriceCents tolerates a €/kWh value typed into the
  // Cent/kWh field (e.g. 0.35 -> 35) so the result is never off by 100x.
  const priceInput = normalizeElectricityPriceCents(financial.currentElectricityPriceCentsKwh);
  const userElectricityPrice = priceInput / 100; // cents -> euros
  const baseOffset = totalCapacity * 250;
  
  // Safely determine consumption: prioritize explicit kWh, then bill, then default to 5000.
// Safely determine consumption: prioritize explicit kWh, then bill (guarding against divide-by-zero), then default to 5000.
  const derivedConsumption = financial.yearlyElectricityBillEur != null && userElectricityPrice > 0
    ? (financial.yearlyElectricityBillEur / userElectricityPrice) 
    : 5000;
  const maxConsumption = technical.annualConsumptionKwh ?? derivedConsumption;

// Use a type assertion or keyof check, but fallback safely
  const regionKey = technical.region as keyof typeof REGIONAL_MULTIPLIERS;
  const regionMultiplier = REGIONAL_MULTIPLIERS[regionKey] ?? 950;
  // Use strictly the provided PV size, or 0 if none. No ghost arrays.
  const maxPvYield = (technical.pvSizeKwp ?? 0) * regionMultiplier;
  
  // Self-consumption is capped by: (a) what the battery can shift annually,
  // (b) the share of load a battery can realistically cover (MAX_AUTARKY — an
  // oversized battery on a small load approaches near-full self-supply), and
  // (c) what the PV array actually produces.
  let estimatedKwhOffset = Math.min(baseOffset, maxConsumption * MAX_AUTARKY, maxPvYield * 0.8);

  let scCyclesNeeded = totalCapacity > 0 ? (estimatedKwhOffset / totalCapacity) : 0;
  if (technical.enableSelfConsumption === false) {
    scCyclesNeeded = 0;
    estimatedKwhOffset = 0;
  }
  
  if (scCyclesNeeded > remainingCycles) {
    scCyclesNeeded = remainingCycles;
    estimatedKwhOffset = scCyclesNeeded * totalCapacity;
  }
  remainingCycles -= scCyclesNeeded;

  // Each self-consumed kWh avoids buying a kWh at the full retail price. The
  // MAX_AUTARKY cap above (not a flat efficiency haircut) is what keeps this
  // below 100% of the bill.
  const selfConsumption = userElectricityPrice * estimatedKwhOffset;

  // 2. Peak Shaving
  const REQUIRED_PS_CYCLES = 20;
  let peakShavingCycles = technical.enablePeakShaving === false ? 0 : REQUIRED_PS_CYCLES;
  if (peakShavingCycles > remainingCycles) peakShavingCycles = remainingCycles;
  remainingCycles -= peakShavingCycles;
  
  // Scale revenue based on how much of the required budget was secured
  const psCycleFulfillment = REQUIRED_PS_CYCLES > 0 ? (peakShavingCycles / REQUIRED_PS_CYCLES) : 0;
  
  const demandChargeEurPerKw = financial.demandChargeEurPerKw ?? 0; 
  const peakShavingReductionPercentage = financial.peakShavingReductionPercentage ?? 0;
  const peakShaving = (technical.enablePeakShaving !== false && peakShavingCycles > 0)
    ? safeInverterPower * demandChargeEurPerKw * (peakShavingReductionPercentage / 100) * psCycleFulfillment 
    : 0;

// 3. Grid Services (PRL Micro-Cycling Penalty)
  const REQUIRED_PRL_CYCLES = 20;
  let prlMicroCycles = technical.enablePrl === false ? 0 : REQUIRED_PRL_CYCLES;
  if (prlMicroCycles > remainingCycles) prlMicroCycles = remainingCycles;
  remainingCycles -= prlMicroCycles;
  
  const prlCycleFulfillment = REQUIRED_PRL_CYCLES > 0 ? (prlMicroCycles / REQUIRED_PRL_CYCLES) : 0;
  // 4. EPEX Arbitrage
  let epexCycles = technical.enableEpex === false ? 0 : 300;
  if (epexCycles > remainingCycles) epexCycles = remainingCycles;
  remainingCycles -= epexCycles;

  // Spot arbitrage = energy cycled × captured spread × round-trip efficiency,
  // throttled by any grid bottleneck and substation line losses.
  let epexArbitrage = epexCycles > 0
    ? controllableCapacity * epexCycles * EPEX_SPREAD_EUR_PER_KWH * 0.90 * gridRevenueFactor
    : 0;

  // 5. Load Shifting
  const dynamicTariff = financial.dynamicFeedInTariffCentsKwh ?? 0;
  const standardTariff = financial.standardFeedInTariffCentsKwh ?? 0;
  const gridFees = financial.gridFeesCentsKwh ?? 0;
  const loadShiftingProfitCents = Math.max(0, dynamicTariff - standardTariff - gridFees);
  
  let loadShiftingCycles = (technical.enableLoadShifting === false || loadShiftingProfitCents <= 0) ? 0 : 300;
  if (loadShiftingCycles > remainingCycles) loadShiftingCycles = remainingCycles;
  remainingCycles -= loadShiftingCycles;
  
  const loadShifting = loadShiftingCycles > 0 ? controllableCapacity * loadShiftingCycles * 0.90 * (loadShiftingProfitCents / 100) : 0;

  // --- Grid Services Power Allocation (Physics Enforced) ---
  // Formula: 2350 €/MW/week = 2.35 €/kW/week * 52 = ~122.2 €/kW/year
  const PRL_ANNUAL_EUR_PER_KW = (2350 / 1000) * 52; 
  const SRL_ANNUAL_EUR_PER_KW = 150; 
  

let srlPower = 0;
  let prlPower = 0;

  if (technical.enableSrl !== false && technical.enablePrl !== false) {
    srlPower = exportConstrainedPower * 0.5;
    prlPower = exportConstrainedPower * 0.5;
  } else if (technical.enableSrl !== false) {
    srlPower = exportConstrainedPower;
  } else if (technical.enablePrl !== false) {
    prlPower = exportConstrainedPower;
  }

// Larger fleets earn a higher effective balancing return; substation distance
  // adds line losses. (Power is already bottleneck-limited via exportConstrainedPower.)
  const balancingTier = balancingTierMultiplier(controllableCapacity);
  let prl = prlPower * PRL_ANNUAL_EUR_PER_KW * prlCycleFulfillment * balancingTier * substationFactor;
  let srlAfrr = srlPower * SRL_ANNUAL_EUR_PER_KW * balancingTier * substationFactor; // aFRR uses capacity, not heavy throughput

  // --- VPP Participation Optimization Lift ---
  const vppParticipation = 0; // Ensures no double-counting of base streams
  if (financial.vppParticipationEnabled) {
    epexArbitrage *= VPP_BONUS_MULTIPLIER;
    prl *= VPP_BONUS_MULTIPLIER;
    srlAfrr *= VPP_BONUS_MULTIPLIER;
  }

  // --- Fix Budget Exploit & CapEx Logic ---
  let minCostPerKwh = 700;
  let fallbackCostPerKwh = 900;
  
  if (currentBatteryCapacityKwh >= 500) {
    minCostPerKwh = 200;
    fallbackCostPerKwh = 300;
  } else if (currentBatteryCapacityKwh >= 100) {
    minCostPerKwh = 350;
    fallbackCostPerKwh = 500;
  } else if (currentBatteryCapacityKwh >= 30) {
    minCostPerKwh = 450;
    fallbackCostPerKwh = 700;
  }

  const minSystemCost = currentBatteryCapacityKwh * minCostPerKwh;
  // CapEx Logic: a real quote (actualSystemCostEur) always wins. Otherwise we
  // fall back to the capacity-based estimate, floored by the physical minimum.
  const estimatedSystemCost = currentBatteryCapacityKwh * fallbackCostPerKwh;
  let systemCost: number;

  if ((financial.actualSystemCostEur ?? 0) > 0) {
    systemCost = financial.actualSystemCostEur as number;
  } else {
    systemCost = estimatedSystemCost;
    if ((financial.targetBudgetEur ?? 0) > 0 && (financial.targetBudgetEur ?? 0) < minSystemCost) {
      // Enforce the physical floor if the budget is impossibly low
      systemCost = minSystemCost;
    }
  }

  const engineeringFee = systemCost * 0.038;
  const totalUpfrontCost = systemCost + engineeringFee;

  const annualRevenueByStream: RevenueStreams = {
    selfConsumption,
    prl,
    srlAfrr,
    epexArbitrage,
    peakShaving,
    vppParticipation,
    loadShifting
  };

  const baseAnnualRevenue = Object.values(annualRevenueByStream).reduce((sum, val) => sum + val, 0);

  // --- 15-Year Financial Projection ---
  const yearlyProjection: YearlyCashflow[] = [];
  let cumulative = -totalUpfrontCost;
  let totalRevenue15Years = 0;
  let paybackYears: number | null = null;

  yearlyProjection.push({
    year: 0,
    cashflow: -totalUpfrontCost,
    cumulative: -totalUpfrontCost
  });

  for (let year = 1; year <= 15; year++) {
    // Battery degrades regardless of use case
    const degradationFactor = Math.pow(1 - DEGRADATION_RATE, year - 1);
    
    // Grid traded markets decline due to saturation
    const marketDeclineFactor = Math.pow(1 - MARKET_DECLINE_RATE, year - 1);
    const tradedRevenue = (annualRevenueByStream.prl + annualRevenueByStream.srlAfrr + annualRevenueByStream.epexArbitrage + annualRevenueByStream.vppParticipation + annualRevenueByStream.loadShifting) * marketDeclineFactor;
    
    // Local revenue increases as retail electricity becomes more expensive
    const inflationFactor = Math.pow(1 + INFLATION_RATE, year - 1);
    const localRevenue = (annualRevenueByStream.selfConsumption + annualRevenueByStream.peakShaving) * inflationFactor;

    const yearRevenue = (tradedRevenue + localRevenue) * degradationFactor;
    let yearCost = (year === MAINTENANCE_YEAR) ? systemCost * 0.1 : 0;

    const cashflow = yearRevenue - yearCost;
    cumulative += cashflow;
    totalRevenue15Years += cashflow;

    yearlyProjection.push({
      year,
      cashflow,
      cumulative
    });

if (cumulative >= 0 && paybackYears === null) {
      if (cashflow > 0) {
        const previousCumulative = cumulative - cashflow;
        paybackYears = year - 1 + (-previousCumulative / cashflow);
      } else {
        paybackYears = year;
      }
    }
  }

  // ROI: Net Cumulative Profit (Revenue - Maintenance) / Day 1 CapEx
  // Guard against division by zero for 0 kWh test scenarios
  const roiPercent = totalUpfrontCost > 0 ? (totalRevenue15Years / totalUpfrontCost) * 100 : 0;

  // --- Sensitivity Analysis ---
  const calculateTestRevenue = (testSize: number) => {
    if (testSize === 0) return 0;
    const testTotalCapacity = existingBatteryCapacityKwh + testSize;
    const testControllableCapacity = testSize + (isNGen ? existingBatteryCapacityKwh : 0);
    
let testRemainingCycles = 400;
    const testInverterPower = Math.min(actualInverterPower, testControllableCapacity); // 1C Limit
    
    // Constrain sensitivity test power by grid export limits (bottleneck) and
    // derate grid-facing revenue by both the bottleneck and substation losses.
    const testExportConstrainedPower = gridExportLimitKw != null
      ? Math.min(testInverterPower, gridExportLimitKw)
      : testInverterPower;
    const testGridThroughputFactor = testInverterPower > 0 ? testExportConstrainedPower / testInverterPower : 1;
    const testGridRevenueFactor = testGridThroughputFactor * substationFactor;

    const testBaseOffset = testTotalCapacity * 250;
    let testEstimatedKwhOffset = Math.min(testBaseOffset, maxConsumption * MAX_AUTARKY, maxPvYield * 0.8);
    let testScCyclesNeeded = testTotalCapacity > 0 ? (testEstimatedKwhOffset / testTotalCapacity) : 0;
    if (technical.enableSelfConsumption === false) { testScCyclesNeeded = 0; testEstimatedKwhOffset = 0; }
    if (testScCyclesNeeded > testRemainingCycles) { testScCyclesNeeded = testRemainingCycles; testEstimatedKwhOffset = testScCyclesNeeded * testTotalCapacity; }
    testRemainingCycles -= testScCyclesNeeded;
    const testSelfConsumption = userElectricityPrice * testEstimatedKwhOffset;

// Test Peak Shaving
    const testRequiredPsCycles = 20;
    let testPeakShavingCycles = technical.enablePeakShaving === false ? 0 : testRequiredPsCycles;
    if (testPeakShavingCycles > testRemainingCycles) testPeakShavingCycles = testRemainingCycles;
    testRemainingCycles -= testPeakShavingCycles;
    
    const testPsCycleFulfillment = testRequiredPsCycles > 0 ? (testPeakShavingCycles / testRequiredPsCycles) : 0;
    const testPeakShaving = (technical.enablePeakShaving !== false && testPeakShavingCycles > 0) 
      ? testInverterPower * demandChargeEurPerKw * (peakShavingReductionPercentage / 100) * testPsCycleFulfillment 
      : 0;

    // Test PRL Micro-Cycles
    const testRequiredPrlCycles = 20;
    let testPrlMicroCycles = technical.enablePrl === false ? 0 : testRequiredPrlCycles;
    if (testPrlMicroCycles > testRemainingCycles) testPrlMicroCycles = testRemainingCycles;
    testRemainingCycles -= testPrlMicroCycles;
    
    const testPrlCycleFulfillment = testRequiredPrlCycles > 0 ? (testPrlMicroCycles / testRequiredPrlCycles) : 0;
    

    let testEpexCycles = technical.enableEpex === false ? 0 : 300;
    if (testEpexCycles > testRemainingCycles) testEpexCycles = testRemainingCycles;
    testRemainingCycles -= testEpexCycles;
    let testEpexArbitrage = testEpexCycles > 0 ? testControllableCapacity * testEpexCycles * EPEX_SPREAD_EUR_PER_KWH * 0.90 * testGridRevenueFactor : 0;

    let testLoadShiftingCycles = (technical.enableLoadShifting === false || loadShiftingProfitCents <= 0) ? 0 : 300;
    if (testLoadShiftingCycles > testRemainingCycles) testLoadShiftingCycles = testRemainingCycles;
    testRemainingCycles -= testLoadShiftingCycles;
    const testLoadShifting = testLoadShiftingCycles > 0 ? testControllableCapacity * testLoadShiftingCycles * 0.90 * (loadShiftingProfitCents / 100) : 0;

let testSrlPower = 0;
    let testPrlPower = 0;
    if (technical.enableSrl !== false && technical.enablePrl !== false) {
      testSrlPower = testExportConstrainedPower * 0.5;
      testPrlPower = testExportConstrainedPower * 0.5;
    } else if (technical.enableSrl !== false) {
      testSrlPower = testExportConstrainedPower;
    } else if (technical.enablePrl !== false) {
      testPrlPower = testExportConstrainedPower;
    }

    const testBalancingTier = balancingTierMultiplier(testControllableCapacity);
    let testPrl = testPrlPower * PRL_ANNUAL_EUR_PER_KW * testPrlCycleFulfillment * testBalancingTier * substationFactor;
    let testSrlAfrr = testSrlPower * SRL_ANNUAL_EUR_PER_KW * testBalancingTier * substationFactor;

    if (financial.vppParticipationEnabled) {
      testEpexArbitrage *= VPP_BONUS_MULTIPLIER;
      testPrl *= VPP_BONUS_MULTIPLIER;
      testSrlAfrr *= VPP_BONUS_MULTIPLIER;
    }
    
    return testSelfConsumption + testPeakShaving + testEpexArbitrage + testLoadShifting + testPrl + testSrlAfrr;
  };

const sensitivityToBatterySize: SensitivityPoint[] = [0.5, 1, 1.5, 2].map(multiplier => {
    // If capacity is 0, use a baseline like 100kWh to show what *could* happen
    const baseTestCapacity = currentBatteryCapacityKwh > 0 ? currentBatteryCapacityKwh : 100; 
    const testSize = baseTestCapacity * multiplier;
    const testRevenue = calculateTestRevenue(testSize); // Calculate unconditionally
    return {
      batterySizeKwh: testSize,
      totalAnnualRevenue: testRevenue
    };
  });

  // --- Calculate Autarky Rate ---
  let autarkyPercent = 30; // Baseline without battery
  if (maxConsumption === 0) {
    autarkyPercent = 100; // Completely grid-independent if 0 load
  } else if (totalCapacity > 0) {
    autarkyPercent = Math.min(95, Math.round(30 + ((totalCapacity * 250) / maxConsumption) * 100));
  }

  return {
    annualRevenueByStream,
    totalAnnualRevenue: baseAnnualRevenue,
    engineeringFee,
    roiPercent,
    paybackYears,
    yearlyProjection,
    sensitivityToBatterySize,
    autarkyPercent,
    systemCost,
    totalUpfrontCost,
    bottleneckActive
  };
}