const fs = require('fs');
const revPiePath = 'components/charts/revenue-pie.tsx';
let revPieCode = fs.readFileSync(revPiePath, 'utf8');

revPieCode = revPieCode.replace(/const COLORS = \[\n  "#007AFF", \/\/ Apple Blue\n  "#34C759", \/\/ Apple Green\n  "#FF2D55", \/\/ Apple Pink\n  "#FF9500", \/\/ Apple Orange\n  "#AF52DE", \/\/ Apple Purple\n  "#5AC8FA"  \/\/ Apple Indigo\n\];/g, 'const COLORS = ["#10b981", "#059669", "#047857", "#0f766e", "#64748b", "#94a3b8"];');

fs.writeFileSync(revPiePath, revPieCode);

const projChPath = 'components/charts/projection-chart.tsx';
let projChCode = fs.readFileSync(projChPath, 'utf8');
projChCode = projChCode.replace(/'#007AFF'/g, "'#10b981'");
projChCode = projChCode.replace(/'rgba\(0, 122, 255,/g, "'rgba(16, 185, 129,");

fs.writeFileSync(projChPath, projChCode);
