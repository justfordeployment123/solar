'use server';

import { revalidatePath } from 'next/cache';
import { CalculatorSettings, DEFAULT_SETTINGS } from '@/lib/calculator-settings';
import { loadSettings, saveSettings } from '@/lib/calculator-settings-server';

type ActionState = { ok: boolean; message: string };

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = formData.get('payload');
    if (typeof payload !== 'string') {
      return { ok: false, message: 'Missing payload.' };
    }
    const parsed = JSON.parse(payload) as CalculatorSettings;
    if (!Array.isArray(parsed?.tiers) || !parsed?.global) {
      return { ok: false, message: 'Invalid payload shape.' };
    }
    await saveSettings(parsed);
    revalidatePath('/admin/calculator');
    return { ok: true, message: 'Settings saved.' };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function resetSettingsAction(): Promise<ActionState> {
  try {
    await saveSettings(DEFAULT_SETTINGS);
    revalidatePath('/admin/calculator');
    return { ok: true, message: 'Settings reset to defaults.' };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getSettingsAction(): Promise<CalculatorSettings> {
  return loadSettings();
}
