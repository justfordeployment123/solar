const fs = require('fs');
const revPiePath = 'components/charts/revenue-pie.tsx';
let revPieCode = fs.readFileSync(revPiePath, 'utf8');

revPieCode = revPieCode.replace(/const COLORS = \[\n  "#565656", \/\/ Apple Blue\n  "#dfdfdf", \/\/ Apple Green\n  "#FF2D55", \/\/ Apple Pink\n  "#FF9500", \/\/ Apple Orange\n  "#AF52DE", \/\/ Apple Purple\n  "#5AC8FA"  \/\/ Apple Indigo\n\];/g, 'const COLORS = ["#e12029", "#059669", "#047857", "#0f766e", "#565656", "#94a3b8"];');

fs.writeFileSync(revPiePath, revPieCode);

const projChPath = 'components/charts/projection-chart.tsx';
let projChCode = fs.readFileSync(projChPath, 'utf8');
projChCode = projChCode.replace(/'#565656'/g, "'#e12029'");
projChCode = projChCode.replace(/'rgba\(0, 122, 255,/g, "'rgba(16, 185, 129,");

fs.writeFileSync(projChPath, projChCode);
