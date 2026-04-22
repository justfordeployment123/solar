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
  
  if (!content.includes("useParams")) {
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter, useParams } from 'next/navigation';");
  }
  
  if (!content.includes("const params = useParams();") && content.includes("useRouter")) {
    content = content.replace("const router = useRouter();", "const router = useRouter();\n  const params = useParams();");
  }
  
  content = content.replace(/'\/calculator\//g, '`/i/${params.slug}/');
  content = content.replace(/"\/calculator\//g, '`/i/${params.slug}/');
  
  fs.writeFileSync(file, content);
});
console.log("Patched pages.")
