const fs = require('fs');
const file = 'app/api/leads/route.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  "const supabase = createServerSupabaseClient();",
  "const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';\n    if (supabaseUrl === 'your_supabase_url' || supabaseUrl.includes('mock.supabase')) {\n      console.log('Mocking db insert for lead');\n      return NextResponse.json({ success: true, message: 'Mock Lead submitted successfully' }, { status: 200 });\n    }\n    const supabase = createServerSupabaseClient();"
);
fs.writeFileSync(file, code);
