const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if(!file.match(/node_modules|\.git|\.next/)) {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.match(/\.(tsx|ts|css|html|js)$/) && !file.includes('apply_brand') && !file.includes('fix_all_colors.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const map = {
    // dark-grey: #363636
    'slate-950': '#363636',
    'slate-900': '#363636',
    'slate-800': '#363636',
    // light-grey: #565656
    'slate-700': '#565656',
    'slate-600': '#565656',
    'slate-500': '#565656',
    'slate-400': '#565656',
    // lighter-grey: #dfdfdf
    'slate-300': '#dfdfdf',
    'slate-200': '#dfdfdf',
    // white: #ffffff
    'slate-100': '#ffffff',
    'slate-50': '#ffffff',
    
    // green mapping
    'green-600': '#e12029',
    'green-500': '#e12029',
    'green-400': '#e12029',
    'green-100': '#dfdfdf',
    'green-50': '#ffffff',
    
    // red
    'red-600': '#e12029',
    'red-500': '#e12029',
    'red-400': '#e12029',
    'red-100': '#dfdfdf',
    'red-50': '#ffffff',
};

const rxPrefixes = ['bg-', 'text-', 'border-', 'from-', 'via-', 'to-', 'ring-', 'fill-', 'stroke-'];

const files = walkSync('./');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace inline hex colors like #dfdfdf, #565656 etc
  content = content.replace(/#dfdfdf/ig, '#dfdfdf');
  content = content.replace(/#565656/ig, '#565656');
  
  for (const [twColor, hexColor] of Object.entries(map)) {
    for (const p of rxPrefixes) {
      // replace bg-[#363636] with bg-[#363636]
      // using regex to ensure whole word match (not slate-9000 config)
      const rx = new RegExp(`${p}${twColor}\\b`, 'g');
      content = content.replace(rx, `${p}[${hexColor}]`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedCount++;
  }
});

console.log(`Updated files: ${changedCount}`);
