import { calculateResults } from '../lib/calculations/engine';
import { TechnicalInputs, FinancialInputs } from '../types/calculator';

function testEngine() {
  const technical: TechnicalInputs = {
    pvSizeKwp: 10,
    annualConsumptionKwh: 4000,
    currentBatteryCapacityKwh: 10,
    inverterPowerKw: 10,
    gridImportLimitKw: 30,
    gridExportLimitKw: 30,
    region: 'South',
  };

  const financialOptOut: FinancialInputs = {
    currentElectricityPriceCentsKwh: 30,
    yearlyElectricityBillEur: 1200,
    targetBudgetEur: 10000,
    vppParticipationEnabled: false,
  };

  const financialOptIn: FinancialInputs = {
    ...financialOptOut,
    vppParticipationEnabled: true,
  };

  console.log("--- Testing VPP Opt-Out ---");
  const resultOut = calculateResults(technical, financialOptOut);
  console.log("Total ROI:", resultOut.roiPercent.toFixed(2), "%");
  console.log("EPEX:", resultOut.annualRevenueByStream.epexArbitrage);
  console.log("PRL:", resultOut.annualRevenueByStream.prl);

  console.log("\n--- Testing VPP Opt-In (12% Bonus) ---");
  const resultIn = calculateResults(technical, financialOptIn);
  console.log("Total ROI:", resultIn.roiPercent.toFixed(2), "%");
  console.log("EPEX:", resultIn.annualRevenueByStream.epexArbitrage);
  console.log("PRL:", resultIn.annualRevenueByStream.prl);
  
  if (
    resultIn.annualRevenueByStream.epexArbitrage === resultOut.annualRevenueByStream.epexArbitrage * 1.12 &&
    resultIn.annualRevenueByStream.prl === resultOut.annualRevenueByStream.prl * 1.12
  ) {
    console.log("\n✅ SUCCESS: VPP 12% Bonus applied correctly.");
  } else {
    console.error("\n❌ ERROR: VPP Bonus not applied correctly.");
  }

  const yearlyProjection = resultOut.yearlyProjection;
  console.log(`\n✅ SUCCESS: Generated ${yearlyProjection.length} year projection.`);
  console.log("Year 10 cashflow (includes maintenance):", yearlyProjection[9].cashflow);

}

testEngine();
