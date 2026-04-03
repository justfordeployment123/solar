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
  
  // Dummy base revenue streams
  let epexArbitrage = currentBatteryCapacityKwh * 80;
  let prl = currentBatteryCapacityKwh * 50;
  let srlAfrr = currentBatteryCapacityKwh * 30;
  let vppParticipation = 0;
  
  if (financial.vppParticipationEnabled) {
    epexArbitrage *= VPP_BONUS_MULTIPLIER;
    prl *= VPP_BONUS_MULTIPLIER;
    srlAfrr *= VPP_BONUS_MULTIPLIER;
    vppParticipation = currentBatteryCapacityKwh * 25;
  }
  
  const selfConsumption = (technical.annualConsumptionKwh || 4000) * 0.15 + (solarGeneration * 0.05); // dummy formula
  const peakShaving = (technical.gridConnectionLimitKw || 0) * 45;
  
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
    // Apply battery degradation to battery-dependent streams
    const degradationFactor = Math.pow(1 - DEGRADATION_RATE, year - 1);
    
    const batteryDependentRevenue = (prl + srlAfrr + epexArbitrage + vppParticipation) * degradationFactor;
    const fixedRevenue = selfConsumption + peakShaving;
    
    let yearRevenue = batteryDependentRevenue + fixedRevenue;
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