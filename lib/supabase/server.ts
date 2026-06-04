import { createClient } from '@supabase/supabase-js';

// Server client bypassing RLS with service role key, or falling back to anon key
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-service-key'
  );
}

// True when no real Supabase URL is configured. Lets pages short-circuit a
// 7-second DNS hang against the mock host on local dev setups.
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co'));
}
