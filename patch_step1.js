const fs = require('fs');
const cssPath = 'app/globals.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

cssCode = cssCode.replace(/\.text-gradient\s*\{\s*background:\s*linear-gradient\([^}]+\s*-webkit-background-clip:[^}]+\s*-webkit-text-fill-color:[^}]+\s*background-clip:\s*text;\s*\}/g, '.text-gradient { color: var(--color-primary); }');
fs.writeFileSync(cssPath, cssCode);
