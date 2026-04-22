import { TechnicalInputs, FinancialInputs, DerivedResults, RevenueStreams, YearlyCashflow, SensitivityPoint } from '@/types/calculator';

const REGIONAL_MULTIPLIERS = {
  North: 900,
  Central: 950,
  South: 1000,
};

const VPP_BONUS_MULTIPLIER = 1.12;
const DEGRADATION_RATE = 0.025; // 2.5% annual degradation
const MAINTENANCE_YEAR = 10;
const COST_PER_KWH = 1000;

export function calculateResults(
  technical: TechnicalInputs,
  financial: FinancialInputs
): DerivedResults {
  // Graceful fallbacks for missing inputs
  const currentBatteryCapacityKwh = technical.currentBatteryCapacityKwh || 10;
  const regionMultiplier = technical.region ? REGIONAL_MULTIPLIERS[technical.region] : REGIONAL_MULTIPLIERS['Central'];
  const pvSizeKwp = technical.pvSizeKwp || 10;
  
  // Dummy solar generation based on region
  const solarGeneration = pvSizeKwp * regionMultiplier;
  
// --- Updated Base Revenue Streams ---
    
    // 1. EPEX Arbitrage (Placeholder: assumes 1 cycle/day, €0.10 spread, 90% efficiency)
    let epexArbitrage = technical.enableEpex !== false ? currentBatteryCapacityKwh * 300 * 0.10 * 0.90 : 0;
    
    // 2. PRL calculation based on regelleistung.net average
    const PRL_ANNUAL_EUR_PER_KW = (2350 / 1000) * 52;
    let prl = technical.enablePrl !== false ? currentBatteryCapacityKwh * PRL_ANNUAL_EUR_PER_KW : 0;
    
    // 3. SRL/aFRR (Placeholder)
    const SRL_ANNUAL_EUR_PER_KW = 18;
    let srlAfrr = technical.enableSrl !== false ? currentBatteryCapacityKwh * SRL_ANNUAL_EUR_PER_KW : 0;
    
    // 4. VPP Participation (Requirement: ~€450/mo per 41.9 kWh)
    let vppParticipation = 0;
    const VPP_ANNUAL_PER_KWH = (450 * 12) / 41.9; // ~€128.87
    
    if (financial.vppParticipationEnabled) {
      epexArbitrage *= VPP_BONUS_MULTIPLIER;
      prl *= VPP_BONUS_MULTIPLIER;
      srlAfrr *= VPP_BONUS_MULTIPLIER;
      vppParticipation = technical.enablePrl !== false || technical.enableSrl !== false ? currentBatteryCapacityKwh * VPP_ANNUAL_PER_KWH : 0;
    }
    
    // 5. Self-Consumption (Requirement: User Price * Offset * 90% efficiency)
    const userElectricityPrice = (financial.currentElectricityPriceCentsKwh || 35) / 100;
    const estimatedKwhOffset = currentBatteryCapacityKwh * 250;
    let selfConsumption = technical.enableSelfConsumption !== false ? userElectricityPrice * estimatedKwhOffset * 0.90 : 0;
    
    // 6. Peak Shaving (Placeholder)
    let peakShaving = technical.enablePeakShaving !== false ? (technical.gridConnectionLimitKw || 0) * 45 : 0;
    
    const annualRevenueByStream: RevenueStreams = {
      selfConsumption,
      prl,
      srlAfrr,
      epexArbitrage,
      peakShaving,
      vppParticipation
    };
  
  // Total base year
  const baseAnnualRevenue = Object.values(annualRevenueByStream).reduce((sum, val) => sum + val, 0);
  
  const systemCost = currentBatteryCapacityKwh * COST_PER_KWH;
  
  // Predict 15 years
  const yearlyProjection: YearlyCashflow[] = [];
  let cumulative = -systemCost;
  let totalRevenue15Years = 0;
  let paybackYears = 0;
  
  for (let year = 1; year <= 15; year++) {
    // Apply battery degradation linearly to ALL active revenue streams
    // because total functional capacity impacts self-consumption offset and peak shaving scaling
    const degradationFactor = Math.pow(1 - DEGRADATION_RATE, year - 1);
    
    const yearRevenue = (prl + srlAfrr + epexArbitrage + vppParticipation + selfConsumption + peakShaving) * degradationFactor;
    
    let yearCost = 0;
    
    if (year === MAINTENANCE_YEAR) {
      yearCost = systemCost * 0.1; // 10% of system cost for maintenance
    }
    
    const cashflow = yearRevenue - yearCost;
    cumulative += cashflow;
    totalRevenue15Years += cashflow;
    
    yearlyProjection.push({
      year,
      cashflow,
      cumulative
    });
    
    if (cumulative >= 0 && paybackYears === 0) {
      paybackYears = year - 1 + ((cumulative - cashflow) / cashflow * -1); // interpolate exact year
    }
  }
  
  if (paybackYears === 0) {
    paybackYears = 15; // Did not payback in 15 years
  }
  
  // Total cost over 15 years = Initial + Maintenance
  const totalCost = systemCost + (systemCost * 0.1);
  const roiPercent = ((totalRevenue15Years) / totalCost) * 100;
  
  // Calculate sensitivity
  const sensitivityToBatterySize: SensitivityPoint[] = [0.5, 1, 1.5, 2].map(multiplier => {
    const testSize = currentBatteryCapacityKwh * multiplier;
    // Simple proportional revenue scaling for dummy sensitivity
    const testRevenue = baseAnnualRevenue * (testSize / currentBatteryCapacityKwh);
    return {
      batterySizeKwh: testSize,
      totalAnnualRevenue: testRevenue
    };
  });
  
  return {
    annualRevenueByStream,
    totalAnnualRevenue: baseAnnualRevenue,
    roiPercent,
    paybackYears,
    yearlyProjection,
    sensitivityToBatterySize
  };
}