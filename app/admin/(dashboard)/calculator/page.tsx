import { loadSettings } from '@/lib/calculator-settings-server';
import { SettingsForm } from './SettingsForm';

export const revalidate = 0;

export default async function CalculatorSettingsPage() {
  const settings = await loadSettings();
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark-gray">Calculator Settings</h1>
        <p className="text-sm text-brand-light-gray mt-1">
          Tune calculation parameters per system-size tier. Changes apply to all calculations after save.
          Last updated: <span className="font-mono">{new Date(settings.updatedAt).toLocaleString('de-DE')}</span>
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
