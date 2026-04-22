const fs = require("fs");

const files = [
  "app/i/[slug]/step-1/page.tsx",
  "app/i/[slug]/step-2/page.tsx",
  "app/i/[slug]/step-3/page.tsx",
  "app/i/[slug]/results/page.tsx"
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, "utf8");
  
  // Fix the broken stuff we just messed up
  content = content.replace(/`\/i\/\$\{params\.slug\}\/([^']+)'/g, "`/i/${params.slug}/$1`");
  content = content.replace(/`\/i\/\$\{params\.slug\}\/([^"]+)"/g, "{`/i/${params.slug}/$1`}");
  
  fs.writeFileSync(file, content);
});
console.log("Patched pages 2.")
