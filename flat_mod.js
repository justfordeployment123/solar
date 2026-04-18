const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (!file.match(/node_modules|\.git|\.next/)) {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    } else {
      if (file.match(/\.(tsx|ts|css|html|js)$/) && !file.includes('flat_mod.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
}

const files = walkSync('./');
let count = 0;

files.forEach(file => {
  let original = fs.readFileSync(file, 'utf8');
  let content = original;

  // 1. Remove Framer Motion Types & Imports
  content = content.replace(/HTMLMotionProps<"button">/g, 'React.ButtonHTMLAttributes<HTMLButtonElement>');
  content = content.replace(/HTMLMotionProps<"[a-zA-Z0-9]+">/g, 'React.HTMLAttributes<HTMLElement>');
  content = content.replace(/.*from\s+['"]framer-motion['"];?\n?/g, '');
  
  // 2. Remove tags
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');
  content = content.replace(/<motion\.([a-zA-Z0-9_]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9_]+)>/g, '</$1>');

  // 3. Remove framer motion props
  const propsToRemove = ['initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap', 'transition'];
  propsToRemove.forEach(prop => {
    const strRegex = new RegExp(`\\b${prop}="[^"]*"\\s*`, 'g');
    content = content.replace(strRegex, ' ');
    // Match up to 2 nested brace layers
    const jsxRegex = new RegExp(`\\b${prop}=\\{([^}{]*|\\{[^}{]*\\})*\\}\\s*`, 'g');
    content = content.replace(jsxRegex, ' ');
  });

  // 4. Remove rounded strings, shadow strings, transitions/duration, and translate classes
  content = content.replace(/\brounded(?:-[a-zA-Z0-9\[\]\.]+)?\b/g, '');
  content = content.replace(/\b(?:drop-)?shadow(?:-[a-zA-Z0-9\[\]\-\.]+)?\b/g, '');
  content = content.replace(/\btransition(?:-[a-zA-Z0-9\-]+)?\b/g, '');
  content = content.replace(/\bduration-\d+\b/g, '');
  content = content.replace(/\bease-(in|out|linear|in-out)\b/g, '');
  content = content.replace(/\bdelay-\d+\b/g, '');
  // Remove hover translation / scaling that could cause "animations"
  content = content.replace(/\b(?:hover:|group-hover:)-?(?:scale|translate-[xy])-[a-zA-Z0-9\[\]\-\.]+\b/g, '');

  if (file.endsWith('.css')) {
    content = content.replace(/box-shadow:[^;]+;/g, 'box-shadow: none;');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
  }
});

console.log(`Updated files: ${count}`);
