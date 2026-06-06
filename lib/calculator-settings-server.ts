// Server-only persistence for calculator settings. Never import this from a
// client component — the `fs` dependency would break the browser bundle.
// Use lib/calculator-settings.ts for types and the GET /api/calculator-settings
// endpoint to read from the browser.
//
// Storage strategy:
// - In production / when Supabase is configured: read+write a single row in
//   the `app_settings` table (key='calculator', value=JSONB). Survives deploys
//   and works on Vercel's read-only filesystem.
// - In local dev without Supabase: fall back to data/calculator-settings.json
//   so the admin still works against `npm run dev`.

import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { CalculatorSettings, DEFAULT_SETTINGS, mergeWithDefaults } from './calculator-settings';
import { createServerSupabaseClient, isSupabaseConfigured } from './supabase/server';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'calculator-settings.json');
const SETTINGS_KEY = 'calculator';

// In-memory cache per server process. saveSettings invalidates it so reads
// stay fresh after the admin writes new values. Reset on cold start.
let cached: CalculatorSettings | null = null;

export async function loadSettings(): Promise<CalculatorSettings> {
  if (cached) return cached;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', SETTINGS_KEY)
        .maybeSingle();
      if (!error && data?.value) {
        cached = mergeWithDefaults(data.value);
        return cached;
      }
    } catch {
      // Fall through to file/defaults below if the table or row is missing.
    }
  }

  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    cached = mergeWithDefaults(JSON.parse(raw));
    return cached;
  } catch {
    cached = DEFAULT_SETTINGS;
    return cached;
  }
}

export async function saveSettings(next: CalculatorSettings): Promise<void> {
  const withTimestamp = { ...next, updatedAt: new Date().toISOString() };

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: SETTINGS_KEY, value: withTimestamp }, { onConflict: 'key' });
    if (error) {
      // FIX (SS1): the previous code threw *after* potentially having
      // partially written the row, but kept the stale in-memory cache. The
      // next `loadSettings` would return stale data while the DB had the
      // new value. Invalidate the cache so the next read re-fetches truth.
      cached = null;
      throw new Error(`Supabase save failed: ${error.message}`);
    }
    cached = withTimestamp;
    return;
  }

  try {
    await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(withTimestamp, null, 2), 'utf-8');
    cached = withTimestamp;
  } catch (err) {
    // Mirror the Supabase branch: on a failed file write, force a re-read on
    // the next call instead of silently serving a stale value.
    cached = null;
    throw err;
  }
}
