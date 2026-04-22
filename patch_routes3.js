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
    if (content === fs.readFileSync(file, "utf8")) {
      content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter, useParams } from "next/navigation";');
    }
  }
  
  if (!content.includes("const params = useParams") && content.includes("useRouter")) {
    content = content.replace("const router = useRouter();", "const router = useRouter();\n  const params = useParams<{ slug: string }>();");
  }
  
  content = content.replace(/href="\/calculator\/([^"]+)"/g, "href={`/i/${params.slug}/$1`}");
  content = content.replace(/router\.push\('\/calculator\/([^']+)'\)/g, "router.push(`/i/${params.slug}/$1`)");
  
  fs.writeFileSync(file, content);
});
console.log("Patched correctly.");
