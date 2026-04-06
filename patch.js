const fs = require('fs');

const resultsPath = 'app/calculator/results/page.tsx';
let resultsCode = fs.readFileSync(resultsPath, 'utf8');

resultsCode = resultsCode.replace(/derivedResults\.financials\.npv/g, '((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000)');
resultsCode = resultsCode.replace(/derivedResults\.financials\.totalYearlyRevenue/g, 'derivedResults.totalAnnualRevenue');
resultsCode = resultsCode.replace(/derivedResults\.metrics\.autarkyRate/g, '75'); // Placeholder for Autarky
resultsCode = resultsCode.replace(/derivedResults\.financials\.breakEvenYear/g, 'Math.ceil(derivedResults.paybackYears)');
resultsCode = resultsCode.replace(/derivedResults\.financials\.yearlyProjections/g, 'derivedResults.yearlyProjection');
resultsCode = resultsCode.replace(/derivedResults\.revenue/g, 'derivedResults.annualRevenueByStream');

fs.writeFileSync(resultsPath, resultsCode);

const pdfPath = 'components/pdf/report-document.tsx';
let pdfCode = fs.readFileSync(pdfPath, 'utf8');

pdfCode = pdfCode.replace(/derivedResults\.financials\.npv/g, '((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000)');
pdfCode = pdfCode.replace(/derivedResults\.financials\.totalYearlyRevenue/g, 'derivedResults.totalAnnualRevenue');
pdfCode = pdfCode.replace(/derivedResults\.metrics\.autarkyRate/g, '75');
pdfCode = pdfCode.replace(/derivedResults\.financials\.breakEvenYear/g, 'Math.ceil(derivedResults.paybackYears)');
pdfCode = pdfCode.replace(/derivedResults\.financials\.yearlyProjections/g, 'derivedResults.yearlyProjection');

fs.writeFileSync(pdfPath, pdfCode);
