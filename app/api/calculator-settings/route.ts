import { NextResponse } from 'next/server';
import { loadSettings } from '@/lib/calculator-settings-server';

// Public read of the admin-tunable calculator parameters. The browser bundle
// can't read the JSON file directly, so the client store fetches this on
// startup and passes the result into the calculation engine.
export const runtime = 'nodejs';

export async function GET() {
  const settings = await loadSettings();
  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
