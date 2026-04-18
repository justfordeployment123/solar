const fs = require('fs');
const cssPath = 'app/globals.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

cssCode = cssCode.replace(/--color-primary: #565656; \/\* Apple Blue \*\//g, '--color-primary: #e12029; /* Ngen Green */');
cssCode = cssCode.replace(/--color-secondary: #ff2d55; \/\* Apple Pink \*\//g, '--color-secondary: #565656; /* Sky Blue */');
cssCode = cssCode.replace(/--color-tertiary: #5856d6; \/\* Apple Purple \*\//g, '--color-tertiary: #565656; /* Ngen Gray */');
cssCode = cssCode.replace(/--color-background: #f8fafc;/g, '--color-background: #ffffff; /* Very Light Green */');
cssCode = cssCode.replace(/--color-surface-container-high: #f1f5f9;/g, '--color-surface-container-high: #dfdfdf;');

fs.writeFileSync(cssPath, cssCode);
