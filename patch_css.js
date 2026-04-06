const fs = require('fs');
const cssPath = 'app/globals.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

cssCode = cssCode.replace(/--color-primary: #007aff; \/\* Apple Blue \*\//g, '--color-primary: #10b981; /* Ngen Green */');
cssCode = cssCode.replace(/--color-secondary: #ff2d55; \/\* Apple Pink \*\//g, '--color-secondary: #0ea5e9; /* Sky Blue */');
cssCode = cssCode.replace(/--color-tertiary: #5856d6; \/\* Apple Purple \*\//g, '--color-tertiary: #64748b; /* Ngen Gray */');
cssCode = cssCode.replace(/--color-background: #f8fafc;/g, '--color-background: #f0fdf4; /* Very Light Green */');
cssCode = cssCode.replace(/--color-surface-container-high: #f1f5f9;/g, '--color-surface-container-high: #dcfce7;');

fs.writeFileSync(cssPath, cssCode);
