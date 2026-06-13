import { TechnicalInputs, FinancialInputs, DerivedResults, RevenueStreams, YearlyCashflow, SensitivityPoint } from '@/types/calculator';
import { CalculatorSettings, DEFAULT_SETTINGS, pickTier } from '@/lib/calculator-settings';

const REGIONAL_MULTIPLIERS = {
  North: 900,
  Central: 950,
  South: 1000,
} as const;

export function normalizeElectricityPriceCents(raw: number | null | undefined): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || !(raw > 0)) return 35;
  return raw < 1 ? raw * 100 : raw;
}

function substationLossFactor(km: number | null | undefined): number {
  if (typeof km !== 'number' || !Number.isFinite(km) || km <= 1) return 1;
  return Math.max(0.85, 1 - 0.01 * (km - 1));
}

// FIX: Global defense-in-depth against NaN values coming from the UI
function safeNum(val: unknown, fallback = 0): number {
  return typeof val === 'number' && Number.isFinite(val) ? val : fallback;
}

function safeNonNegativeNum(val: unknown, fallback = 0): number {
  return Math.max(0, safeNum(val, fallback));
}

function safePercentFraction(val: unknown, fallbackPercent = 0): number {
  return Math.min(100, safeNonNegativeNum(val, fallbackPercent)) / 100;
}

function safeUnitFraction(val: unknown, fallback = 0.5): number {
  if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
  if (val < 0) return 0;
  if (val > 1) return 1;
  return val;
}

function scaleRevenueStreams(streams: RevenueStreams, factor: number): RevenueStreams {
  return {
    selfConsumption: streams.selfConsumption * factor,
    prl: streams.prl * factor,
    srlAfrr: streams.srlAfrr * factor,
    epexArbitrage: streams.epexArbitrage * factor,
    peakShaving: streams.peakShaving * factor,
    vppParticipation: streams.vppParticipation * factor,
    loadShifting: streams.loadShifting * factor,
    evCharging: streams.evCharging * factor,
    communitySupply: streams.communitySupply * factor,
  };
}

export function calculateResults(
  technical: TechnicalInputs,
  financial: FinancialInputs,
  settings: CalculatorSettings = DEFAULT_SETTINGS
): DerivedResults {
  const VPP_BONUS_MULTIPLIER = Math.max(1, safeNum(settings.global.vppBonusMultiplier, 1.12));
  const DEGRADATION_RATE = safePercentFraction(settings.global.degradationRatePercent, 2);
  const MARKET_DECLINE_RATE = safePercentFraction(settings.global.marketDeclineRatePercent, 2);
  const INFLATION_RATE = safeNonNegativeNum(settings.global.inflationRatePercent, 3.8) / 100;
  const MAINTENANCE_YEARS = Array.isArray(settings.global.maintenanceYears)
    ? settings.global.maintenanceYears.filter((y) => Number.isFinite(y) && y > 0).map((y) => Math.trunc(y))
    : [];
  const MAINTENANCE_COST_FRACTION = safePercentFraction(settings.global.maintenanceCostPercent, 10);
  const MAX_AUTARKY = safePercentFraction(settings.global.maxAutarkyPercent, 95);
  const ADJUSTMENT_FACTOR = Math.max(0, 1 + safeNum(settings.global.adjustmentPercent, 0) / 100);
  const ENGINEERING_FEE_FRACTION = safeNonNegativeNum(settings.global.engineeringFeePercent, 3.8) / 100;
  const MAX_CYCLES_PER_YEAR = safeNonNegativeNum(settings.global.maxCyclesPerYear, 400);
  const REQUIRED_PS_CYCLES = safeNonNegativeNum(settings.global.requiredPeakShavingCycles, 20);
  const REQUIRED_PRL_CYCLES = safeNonNegativeNum(settings.global.requiredPrlCycles, 20);
  const REQUESTED_EPEX_CYCLES = safeNonNegativeNum(settings.global.requestedEpexCycles, 300);
  const REQUESTED_LOAD_SHIFTING_CYCLES = safeNonNegativeNum(settings.global.requestedLoadShiftingCycles, 300);
  const PRL_POWER_SHARE = safeUnitFraction(settings.global.prlPowerShare, 0.5);

  const enableSelfConsumption = technical.enableSelfConsumption === true;
  const enablePeakShaving = technical.enablePeakShaving === true;
  const enableEpex = technical.enableEpex === true;
  const enablePrl = technical.enablePrl === true;
  const enableSrl = technical.enableSrl === true;
  const enableLoadShifting = technical.enableLoadShifting === true;

  const currentBatteryCapacityKwh = safeNonNegativeNum(technical.currentBatteryCapacityKwh, 0);
  const existingBatteryCapacityKwh = safeNonNegativeNum(technical.existingBatteryCapacityKwh, 0);
  const totalCapacity = existingBatteryCapacityKwh + currentBatteryCapacityKwh;
  const isNGen = technical.existingBatteryManufacturer === 'NGen';
  const controllableCapacity = currentBatteryCapacityKwh + (isNGen ? existingBatteryCapacityKwh : 0);

  // FIX: Tier selection now uses controllableCapacity instead of ignoring existing batteries
  const tier = pickTier(settings, controllableCapacity);
  const EPEX_GROSS_SPREAD_EUR_PER_KWH = tier.epexGrossSpreadEurPerKwh;
  const DEFAULT_EPEX_GRID_FEE_CENTS_KWH = tier.defaultGridFeeCentsKwh;
  const balancingTier = tier.balancingMultiplier;

  const pvSize = safeNonNegativeNum(technical.pvSizeKwp, 0);
  // FIX: Stop using gridImportLimitKw as a fallback for inverter power when PV=0
  const fallbackInverterPower = pvSize > 0 ? pvSize * 1.2 : 50;

  const actualInverterPower = typeof technical.inverterPowerKw === 'number' && Number.isFinite(technical.inverterPowerKw)
    ? Math.max(0, technical.inverterPowerKw)
    : fallbackInverterPower;

  // FIX: safeInverterPower is purely a power value (kW). Previously it was
  // min(actualInverterPower, controllableCapacity) which silently capped the
  // inverter at the battery's kWh — a 50 kWh battery was treated like a 50 kW
  // inverter regardless of what the user entered. Use the operator-declared
  // inverter power directly and let downstream code apply its own physical
  // caps (e.g. the grid-export limit on tradable services).
  const safeInverterPower = Math.max(0, actualInverterPower);

  const gridExportLimitKw = typeof technical.gridExportLimitKw === 'number' && Number.isFinite(technical.gridExportLimitKw)
    ? Math.max(0, technical.gridExportLimitKw)
    : null;

  const exportConstrainedPower = gridExportLimitKw != null
      ? Math.min(safeInverterPower, gridExportLimitKw)
      : safeInverterPower;
  const bottleneckActive = gridExportLimitKw != null && gridExportLimitKw < safeInverterPower;
  const gridThroughputFactor = safeInverterPower > 0 ? exportConstrainedPower / safeInverterPower : 0;

  const substationFactor = substationLossFactor(technical.substationDistanceKm);
  const gridRevenueFactor = gridThroughputFactor * substationFactor;

  const priceInput = normalizeElectricityPriceCents(financial.currentElectricityPriceCentsKwh);
  const userElectricityPrice = priceInput / 100;
  const baseOffset = totalCapacity * MAX_CYCLES_PER_YEAR;

  const yearlyBill = typeof financial.yearlyElectricityBillEur === 'number' && Number.isFinite(financial.yearlyElectricityBillEur) ? Math.max(0, financial.yearlyElectricityBillEur) : null;
  const derivedConsumption = yearlyBill != null && userElectricityPrice > 0 ? (yearlyBill / userElectricityPrice) : 5000;
  const maxConsumption = typeof technical.annualConsumptionKwh === 'number' && Number.isFinite(technical.annualConsumptionKwh)
    ? Math.max(0, technical.annualConsumptionKwh)
    : derivedConsumption;

  // FIX: Don't pretend a null region is a valid key into REGIONAL_MULTIPLIERS.
  // Region can legitimately be unset during step-2; fall through to the
  // Central default explicitly.
  const regionMultiplier = (technical.region && REGIONAL_MULTIPLIERS[technical.region]) ?? REGIONAL_MULTIPLIERS.Central;
  const maxPvYield = pvSize * regionMultiplier;

  let estimatedKwhOffset = Math.min(baseOffset, maxConsumption * MAX_AUTARKY, maxPvYield * 0.8);
  let scCyclesNeeded = totalCapacity > 0 ? (estimatedKwhOffset / totalCapacity) : 0;

  if (!enableSelfConsumption) {
    scCyclesNeeded = 0;
    estimatedKwhOffset = 0;
  }

  let remainingCycles = MAX_CYCLES_PER_YEAR;
  if (scCyclesNeeded > remainingCycles) {
    scCyclesNeeded = remainingCycles;
    estimatedKwhOffset = scCyclesNeeded * totalCapacity;
  }
  remainingCycles -= scCyclesNeeded;
  const selfConsumption = userElectricityPrice * estimatedKwhOffset;

  let peakShavingCycles = enablePeakShaving ? REQUIRED_PS_CYCLES : 0;
  if (peakShavingCycles > remainingCycles) peakShavingCycles = remainingCycles;
  remainingCycles -= peakShavingCycles;

  const psCycleFulfillment = REQUIRED_PS_CYCLES > 0 ? (peakShavingCycles / REQUIRED_PS_CYCLES) : 0;

  const demandChargeEurPerKw = safeNonNegativeNum(financial.demandChargeEurPerKw, 0);
  const peakShavingReductionPercentage = Math.min(100, safeNonNegativeNum(financial.peakShavingReductionPercentage, 0));
  // NOTE (bug 4): a real cap by actual peak demand kW is not currently
  // collected in the UI. The reduction percentage is the only knob we have
  // today, so we use the inverter power as the upper bound on the shaved
  // kW (an inverter physically can't discharge more than its nameplate).
  const peakShaving = (enablePeakShaving && peakShavingCycles > 0)
    ? safeInverterPower * demandChargeEurPerKw * (peakShavingReductionPercentage / 100) * psCycleFulfillment
    : 0;

  let prlMicroCycles = enablePrl ? REQUIRED_PRL_CYCLES : 0;
  if (prlMicroCycles > remainingCycles) prlMicroCycles = remainingCycles;
  remainingCycles -= prlMicroCycles;
  const prlCycleFulfillment = REQUIRED_PRL_CYCLES > 0 ? (prlMicroCycles / REQUIRED_PRL_CYCLES) : 0;

  const epexGridFeeCentsKwh = typeof financial.gridFeesCentsKwh === 'number' && Number.isFinite(financial.gridFeesCentsKwh)
    ? Math.max(0, financial.gridFeesCentsKwh)
    : DEFAULT_EPEX_GRID_FEE_CENTS_KWH;
  const epexNetSpread = Math.max(0, EPEX_GROSS_SPREAD_EUR_PER_KWH - epexGridFeeCentsKwh / 100);

  const dynamicTariff = safeNonNegativeNum(financial.dynamicFeedInTariffCentsKwh, 0);
  const standardTariff = safeNonNegativeNum(financial.standardFeedInTariffCentsKwh, 0);
  const loadShiftingGridFees = epexGridFeeCentsKwh;
  const loadShiftingProfitSpread = Math.max(0, (dynamicTariff - standardTariff - loadShiftingGridFees) / 100);

  const requestedEpex = enableEpex ? REQUESTED_EPEX_CYCLES : 0;
  const requestedLoadShifting = (enableLoadShifting && loadShiftingProfitSpread > 0) ? REQUESTED_LOAD_SHIFTING_CYCLES : 0;

  let epexCycles = 0;
  let loadShiftingCycles = 0;

  if (epexNetSpread >= loadShiftingProfitSpread) {
    epexCycles = Math.min(requestedEpex, remainingCycles);
    remainingCycles -= epexCycles;
    loadShiftingCycles = Math.min(requestedLoadShifting, remainingCycles);
    remainingCycles -= loadShiftingCycles;
  } else {
    loadShiftingCycles = Math.min(requestedLoadShifting, remainingCycles);
    remainingCycles -= loadShiftingCycles;
    epexCycles = Math.min(requestedEpex, remainingCycles);
    remainingCycles -= epexCycles;
  }

  const epexArbitrage = epexCycles > 0
    ? controllableCapacity * epexCycles * epexNetSpread * 0.90 * gridRevenueFactor
    : 0;

  // FIX: Added gridRevenueFactor to Load Shifting for parity with EPEX Arbitrage
  const loadShifting = loadShiftingCycles > 0
    ? controllableCapacity * loadShiftingCycles * 0.90 * loadShiftingProfitSpread * gridRevenueFactor
    : 0;

  const PRL_ANNUAL_EUR_PER_KW = tier.prlAnnualEurPerKw;
  const SRL_ANNUAL_EUR_PER_KW = tier.srlAnnualEurPerKw;

  let srlPower = 0;
  let prlPower = 0;

  // FIX: PRL/SRL power split is now configurable. When both services are on,
  // split according to prlPowerShare (0-1). When only one is on, it claims
  // the full grid-constrained power.
  if (enableSrl && enablePrl) {
    prlPower = exportConstrainedPower * PRL_POWER_SHARE;
    srlPower = exportConstrainedPower * (1 - PRL_POWER_SHARE);
  } else if (enableSrl) {
    srlPower = exportConstrainedPower;
  } else if (enablePrl) {
    prlPower = exportConstrainedPower;
  }

  const prl = prlPower * PRL_ANNUAL_EUR_PER_KW * prlCycleFulfillment * balancingTier * substationFactor;
  // FIX: SRL (aFRR) is primarily a capacity reservation market. Unlike PRL,
  // it does not mandate continuous heavy micro-cycling, so we do not penalize it with cycle fulfillment here.
  const srlAfrr = srlPower * SRL_ANNUAL_EUR_PER_KW * balancingTier * substationFactor;

  let vppParticipation = 0;
  if (financial.vppParticipationEnabled) {
    // FIX: Include LoadShifting in the VPP delta. VPP operators can also
    // co-optimize load-shifting schedules, so a coordinated site earns a
    // bonus on top of every grid-facing stream.
    const epexBonus = epexArbitrage * (VPP_BONUS_MULTIPLIER - 1);
    const prlBonus = prl * (VPP_BONUS_MULTIPLIER - 1);
    const srlBonus = srlAfrr * (VPP_BONUS_MULTIPLIER - 1);
    const loadShiftingBonus = loadShifting * (VPP_BONUS_MULTIPLIER - 1);
    vppParticipation = epexBonus + prlBonus + srlBonus + loadShiftingBonus;
  }

  const minCostPerKwh = tier.minCostPerKwh;
  const fallbackCostPerKwh = tier.fallbackCostPerKwh;

  const minSystemCost = currentBatteryCapacityKwh * minCostPerKwh;
  const estimatedSystemCost = currentBatteryCapacityKwh * fallbackCostPerKwh;
  let systemCost: number;

  const actualCost = typeof financial.actualSystemCostEur === 'number' && Number.isFinite(financial.actualSystemCostEur) ? Math.max(0, financial.actualSystemCostEur) : null;
  const targetBudget = typeof financial.targetBudgetEur === 'number' && Number.isFinite(financial.targetBudgetEur) ? Math.max(0, financial.targetBudgetEur) : null;

  if (actualCost != null && actualCost > 0) {
    systemCost = actualCost;
  } else if (targetBudget != null && targetBudget > 0) {
    systemCost = Math.max(minSystemCost, targetBudget);
  } else {
    systemCost = Math.max(estimatedSystemCost, minSystemCost);
  }

  const engineeringFee = systemCost * ENGINEERING_FEE_FRACTION;
  const totalUpfrontCost = systemCost + engineeringFee;

  let evCharging = 0;
  const evNumChargers = safeNonNegativeNum(financial.evNumChargers, 0);
  const evPowerKw = safeNonNegativeNum(financial.evPowerKw, 0);
  const evDailyHours = safeNonNegativeNum(financial.evDailyHours, 0);
  const evSellPriceCentsKwh = safeNonNegativeNum(financial.evSellPriceCentsKwh, 0);

  if (financial.evChargingEnabled && evNumChargers > 0 && evPowerKw > 0 && evDailyHours > 0 && evSellPriceCentsKwh > 0) {
    const hours = Math.min(evDailyHours, 24);
    const sellPriceEurPerKwh = evSellPriceCentsKwh / 100;
    const retailEurPerKwh = priceInput / 100;
    const marginEurPerKwh = Math.max(0, sellPriceEurPerKwh - retailEurPerKwh);
    const annualKwhDelivered = evNumChargers * evPowerKw * hours * 365;
    evCharging = annualKwhDelivered * marginEurPerKwh;
  }

  let communitySupply = 0;
  let recommendedBatteryUpgradeKwh: number | null = null;

  const communityNumParties = safeNonNegativeNum(financial.communityNumParties, 0);
  const communityKwhPerParty = safeNonNegativeNum(financial.communityKwhPerParty, 0);
  const communitySellPriceCentsKwh = typeof financial.communitySellPriceCentsKwh === 'number' && Number.isFinite(financial.communitySellPriceCentsKwh)
    ? Math.max(0, financial.communitySellPriceCentsKwh)
    : 30;

  if (financial.communityEnabled && communityNumParties > 0 && communityKwhPerParty > 0) {
    const sellPriceEurPerKwh = evSellPriceCentsKwh / 100;
    const opportunityCostEurPerKwh = (standardTariff > 0 ? standardTariff : 8) / 100;
    const marginEurPerKwh = Math.max(0, sellPriceEurPerKwh - opportunityCostEurPerKwh);

    const totalDemandKwh = communityNumParties * communityKwhPerParty;
    const excessPvYield = Math.max(0, maxPvYield - estimatedKwhOffset);

    const suppliedKwh = Math.min(totalDemandKwh, excessPvYield);
    communitySupply = suppliedKwh * marginEurPerKwh;

if (totalDemandKwh > excessPvYield) {
      recommendedBatteryUpgradeKwh = null; // Battery cannot generate energy for a PV shortfall
    } else if (totalDemandKwh > estimatedKwhOffset) {
      const shiftShortfallKwh = (totalDemandKwh - estimatedKwhOffset) / 365;
      recommendedBatteryUpgradeKwh = Math.ceil(shiftShortfallKwh / 10) * 10;
    }
  }

  const rawAnnualRevenueByStream: RevenueStreams = {
    selfConsumption,
    prl,
    srlAfrr,
    epexArbitrage,
    peakShaving,
    vppParticipation,
    loadShifting,
    evCharging,
    communitySupply,
  };

  const annualRevenueByStream = scaleRevenueStreams(rawAnnualRevenueByStream, ADJUSTMENT_FACTOR);
  const baseAnnualRevenue = Object.values(annualRevenueByStream).reduce((sum, val) => sum + val, 0);

  const yearlyProjection: YearlyCashflow[] = [];
  let cumulative = -totalUpfrontCost;

  let totalOperatingCashflow15Years = 0;
  let paybackYears: number | null = null;

  yearlyProjection.push({ year: 0, cashflow: -totalUpfrontCost, cumulative: -totalUpfrontCost });

  // FIX: Use the 15-year cashflow horizon explicitly as a constant so the
  // maintenance-year check below is obviously bounded.
  const PROJECTION_YEARS = 15;

  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    const degradationFactor = Math.pow(1 - DEGRADATION_RATE, year - 1);
    const marketDeclineFactor = Math.pow(1 - MARKET_DECLINE_RATE, year - 1);

    const tradedRevenue = (rawAnnualRevenueByStream.prl + rawAnnualRevenueByStream.srlAfrr + rawAnnualRevenueByStream.epexArbitrage + rawAnnualRevenueByStream.vppParticipation + rawAnnualRevenueByStream.loadShifting) * marketDeclineFactor;
    const inflationFactor = Math.pow(1 + INFLATION_RATE, year - 1);
    const localRevenue = (rawAnnualRevenueByStream.selfConsumption + rawAnnualRevenueByStream.peakShaving + rawAnnualRevenueByStream.evCharging + rawAnnualRevenueByStream.communitySupply) * inflationFactor;

    const yearRevenue = (tradedRevenue + localRevenue) * degradationFactor * ADJUSTMENT_FACTOR;
    // FIX: Support multiple maintenance events (e.g. battery-replacement at
    // year 10 AND year 20). Years outside the 15-year projection are
    // deliberately ignored — they exist for the data model but don't affect
    // the displayed cashflow. Previously a single maintenanceYear > 15 was
    // silently dropped.
    const yearCost = MAINTENANCE_YEARS.includes(year) ? systemCost * MAINTENANCE_COST_FRACTION : 0;

    const cashflow = yearRevenue - yearCost;
    cumulative += cashflow;
    totalOperatingCashflow15Years += cashflow;

    yearlyProjection.push({ year, cashflow, cumulative });

    if (cumulative >= 0 && paybackYears === null) {
      if (cashflow > 0) {
        const previousCumulative = cumulative - cashflow;
        paybackYears = year - 1 + (-previousCumulative / cashflow);
      } else {
        paybackYears = year;
      }
    }
  }

  const roiPercent = totalUpfrontCost > 0 ? ((totalOperatingCashflow15Years - totalUpfrontCost) / totalUpfrontCost) * 100 : 0;

  const calculateTestRevenue = (testSize: number) => {
    if (testSize === 0) return 0;
    const testTotalCapacity = existingBatteryCapacityKwh + testSize;
    const testControllableCapacity = testSize + (isNGen ? existingBatteryCapacityKwh : 0);

    let testRemainingCycles = MAX_CYCLES_PER_YEAR;
    const baseTestCapacity = currentBatteryCapacityKwh > 0 ? currentBatteryCapacityKwh : 100;
    const testInverterPower = Math.max(0, actualInverterPower * (testSize / baseTestCapacity));

    const testExportConstrainedPower = gridExportLimitKw != null
      ? Math.min(testInverterPower, gridExportLimitKw)
      : testInverterPower;
    const testGridThroughputFactor = testInverterPower > 0 ? testExportConstrainedPower / testInverterPower : 0;
    const testGridRevenueFactor = testGridThroughputFactor * substationFactor;

    const testBaseOffset = testTotalCapacity * 250;
    let testEstimatedKwhOffset = Math.min(testBaseOffset, maxConsumption * MAX_AUTARKY, maxPvYield * 0.8);
    let testScCyclesNeeded = testTotalCapacity > 0 ? (testEstimatedKwhOffset / testTotalCapacity) : 0;
    if (!enableSelfConsumption) { testScCyclesNeeded = 0; testEstimatedKwhOffset = 0; }
    if (testScCyclesNeeded > testRemainingCycles) { testScCyclesNeeded = testRemainingCycles; testEstimatedKwhOffset = testScCyclesNeeded * testTotalCapacity; }
    testRemainingCycles -= testScCyclesNeeded;
    const testSelfConsumption = userElectricityPrice * testEstimatedKwhOffset;

    let testPeakShavingCycles = enablePeakShaving ? REQUIRED_PS_CYCLES : 0;
    if (testPeakShavingCycles > testRemainingCycles) testPeakShavingCycles = testRemainingCycles;
    testRemainingCycles -= testPeakShavingCycles;

    const testPsCycleFulfillment = REQUIRED_PS_CYCLES > 0 ? (testPeakShavingCycles / REQUIRED_PS_CYCLES) : 0;
    const testPeakShaving = (enablePeakShaving && testPeakShavingCycles > 0)
      ? testInverterPower * demandChargeEurPerKw * (peakShavingReductionPercentage / 100) * testPsCycleFulfillment
      : 0;

    let testPrlMicroCycles = enablePrl ? REQUIRED_PRL_CYCLES : 0;
    if (testPrlMicroCycles > testRemainingCycles) testPrlMicroCycles = testRemainingCycles;
    testRemainingCycles -= testPrlMicroCycles;

    const testPrlCycleFulfillment = REQUIRED_PRL_CYCLES > 0 ? (testPrlMicroCycles / REQUIRED_PRL_CYCLES) : 0;

    const testTier = pickTier(settings, testControllableCapacity);
    const testEpexGridFeeCentsKwh = typeof financial.gridFeesCentsKwh === 'number' && Number.isFinite(financial.gridFeesCentsKwh)
      ? Math.max(0, financial.gridFeesCentsKwh)
      : testTier.defaultGridFeeCentsKwh;
    const testEpexNetSpread = Math.max(0, testTier.epexGrossSpreadEurPerKwh - testEpexGridFeeCentsKwh / 100);

    let testEpexCycles = 0;
    let testLoadShiftingCycles = 0;

    if (testEpexNetSpread >= loadShiftingProfitSpread) {
      testEpexCycles = Math.min(requestedEpex, testRemainingCycles);
      testRemainingCycles -= testEpexCycles;
      testLoadShiftingCycles = Math.min(requestedLoadShifting, testRemainingCycles);
      testRemainingCycles -= testLoadShiftingCycles;
    } else {
      testLoadShiftingCycles = Math.min(requestedLoadShifting, testRemainingCycles);
      testRemainingCycles -= testLoadShiftingCycles;
      testEpexCycles = Math.min(requestedEpex, testRemainingCycles);
      testRemainingCycles -= testEpexCycles;
    }

    const testEpexArbitrage = testEpexCycles > 0 ? testControllableCapacity * testEpexCycles * testEpexNetSpread * 0.90 * testGridRevenueFactor : 0;
    const testLoadShifting = testLoadShiftingCycles > 0 ? testControllableCapacity * testLoadShiftingCycles * 0.90 * loadShiftingProfitSpread * testGridRevenueFactor : 0;

    let testSrlPower = 0;
    let testPrlPower = 0;
    if (enableSrl && enablePrl) {
      testPrlPower = testExportConstrainedPower * PRL_POWER_SHARE;
      testSrlPower = testExportConstrainedPower * (1 - PRL_POWER_SHARE);
    } else if (enableSrl) {
      testSrlPower = testExportConstrainedPower;
    } else if (enablePrl) {
      testPrlPower = testExportConstrainedPower;
    }

    const testPrl = testPrlPower * testTier.prlAnnualEurPerKw * testPrlCycleFulfillment * testTier.balancingMultiplier * substationFactor;
    const testSrlAfrr = testSrlPower * testTier.srlAnnualEurPerKw * testTier.balancingMultiplier * substationFactor;

    let testVppParticipation = 0;
    if (financial.vppParticipationEnabled) {
      // FIX: mirror the main path — include load-shifting in the VPP bonus.
      testVppParticipation = (testEpexArbitrage + testPrl + testSrlAfrr + testLoadShifting) * (VPP_BONUS_MULTIPLIER - 1);
    }

    let testCommunitySupply = 0;
    if (financial.communityEnabled && communityNumParties > 0 && communityKwhPerParty > 0) {
      const sellPriceEurPerKwh = communitySellPriceCentsKwh / 100;
      const opportunityCostEurPerKwh = (standardTariff > 0 ? standardTariff : 8) / 100;
      const marginEurPerKwh = Math.max(0, sellPriceEurPerKwh - opportunityCostEurPerKwh);

      const totalDemandKwh = communityNumParties * communityKwhPerParty;
      const testExcessPvYield = Math.max(0, maxPvYield - testEstimatedKwhOffset);

      const testSuppliedKwh = Math.min(totalDemandKwh, testExcessPvYield);
      testCommunitySupply = testSuppliedKwh * marginEurPerKwh;
    }

    // FIX: Applied ADJUSTMENT_FACTOR to sensitivity output to mirror baseAnnualRevenue
    return (testSelfConsumption + testPeakShaving + testEpexArbitrage + testLoadShifting + testPrl + testSrlAfrr + testVppParticipation + testCommunitySupply) * ADJUSTMENT_FACTOR;
  };

  const sensitivityToBatterySize: SensitivityPoint[] = [0.5, 1, 1.5, 2].map(multiplier => {
    const baseTestCapacity = currentBatteryCapacityKwh > 0 ? currentBatteryCapacityKwh : 100;
    const testSize = baseTestCapacity * multiplier;
    const testRevenue = calculateTestRevenue(testSize);
    return { batterySizeKwh: testSize, totalAnnualRevenue: testRevenue };
  });

  const autarkyPercent = maxConsumption > 0
    ? Math.min(Math.round(MAX_AUTARKY * 100), Math.round((estimatedKwhOffset / maxConsumption) * 100))
    : 0;

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
    bottleneckActive,
    effectiveInverterPowerKw: safeInverterPower,
    effectiveGridExportPowerKw: exportConstrainedPower,
    calculationAssumptions: {
      degradationRatePercent: DEGRADATION_RATE * 100,
      inflationRatePercent: INFLATION_RATE * 100,
      marketDeclineRatePercent: MARKET_DECLINE_RATE * 100,
      maintenanceYear: MAINTENANCE_YEARS[0] ?? 0,
      maintenanceYears: [...MAINTENANCE_YEARS].sort((a, b) => a - b),
      maintenanceCostPercent: MAINTENANCE_COST_FRACTION * 100,
      engineeringFeePercent: ENGINEERING_FEE_FRACTION * 100,
    },
    recommendedBatteryUpgradeKwh,
  };
}
