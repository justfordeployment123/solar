// Server-only filesystem persistence for calculator settings. Never import
// this from a client component — the `fs` dependency will break the browser
// bundle. Use lib/calculator-settings.ts for types and the GET /api/calculator-settings
// endpoint to read from the browser.

import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { CalculatorSettings, DEFAULT_SETTINGS, mergeWithDefaults } from './calculator-settings';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'calculator-settings.json');

// In-memory cache per server process. saveSettings invalidates it so reads stay
// fresh after the admin writes new values.
let cached: CalculatorSettings | null = null;

export async function loadSettings(): Promise<CalculatorSettings> {
  if (cached) return cached;
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
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(withTimestamp, null, 2), 'utf-8');
  cached = withTimestamp;
}
