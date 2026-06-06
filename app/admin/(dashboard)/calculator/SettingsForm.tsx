"use client";

import { useActionState, useState, useTransition } from 'react';
import { CalculatorSettings, DEFAULT_SETTINGS, TierSettings, GlobalSettings } from '@/lib/calculator-settings';
import { saveSettingsAction, resetSettingsAction } from './actions';

type ActionState = { ok: boolean; message: string };
const INITIAL_STATE: ActionState = { ok: false, message: '' };

export function SettingsForm({ initialSettings }: { initialSettings: CalculatorSettings }) {
  const [settings, setSettings] = useState<CalculatorSettings>(initialSettings);
  const [state, formAction, pending] = useActionState(saveSettingsAction, INITIAL_STATE);
  const [resetPending, startResetTransition] = useTransition();

  const updateTier = (idx: number, patch: Partial<TierSettings>) => {
    setSettings((s) => ({ ...s, tiers: s.tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t)) }));
  };

  const updateGlobal = (patch: Partial<GlobalSettings>) => {
    setSettings((s) => ({ ...s, global: { ...s.global, ...patch } }));
  };

  const onReset = () => {
    if (!confirm('Reset all settings to defaults? This will discard any unsaved changes.')) return;
    startResetTransition(async () => {
      const res = await resetSettingsAction();
      if (res.ok) setSettings(DEFAULT_SETTINGS);
      else alert(res.message);
    });
  };

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="payload" value={JSON.stringify(settings)} />

      {/* Global settings */}
      <section className="bg-brand-white rounded-lg shadow-sm border border-brand-lighter-gray p-6">
        <h2 className="text-lg font-bold text-brand-dark-gray mb-4">Global Parameters</h2>

        {/* Adjustment slider — the headline +/-% knob from the brief */}
        <div className="mb-6 p-4 bg-brand-lighter-gray/50 rounded">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-brand-dark-gray">
              Global Adjustment ({settings.global.adjustmentPercent >= 0 ? '+' : ''}{settings.global.adjustmentPercent}%)
            </label>
            <span className="text-xs text-brand-light-gray">Applied as a flat multiplier to the final result</span>
          </div>
          <input
            type="range"
            min={-20}
            max={20}
            step={0.5}
            value={settings.global.adjustmentPercent}
            onChange={(e) => updateGlobal({ adjustmentPercent: parseFloat(e.target.value) })}
            className="w-full accent-brand-red"
          />
          <div className="flex justify-between text-xs text-brand-light-gray mt-1">
            <span>-20%</span><span>0%</span><span>+20%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField label="Engineering fee (%)" value={settings.global.engineeringFeePercent} onChange={(v) => updateGlobal({ engineeringFeePercent: v })} step={0.1} />
          <NumberField label="Battery degradation (%/yr)" value={settings.global.degradationRatePercent} onChange={(v) => updateGlobal({ degradationRatePercent: v })} step={0.1} />
          <NumberField label="Inflation rate (%/yr)" value={settings.global.inflationRatePercent} onChange={(v) => updateGlobal({ inflationRatePercent: v })} step={0.1} />
          <NumberField label="Market decline (%/yr)" value={settings.global.marketDeclineRatePercent} onChange={(v) => updateGlobal({ marketDeclineRatePercent: v })} step={0.1} />
          <MaintenanceYearsField
            value={settings.global.maintenanceYears}
            onChange={(years) => updateGlobal({ maintenanceYears: years })}
          />
          <NumberField label="Maintenance cost (%)" value={settings.global.maintenanceCostPercent} onChange={(v) => updateGlobal({ maintenanceCostPercent: v })} step={1} />
          <NumberField label="VPP bonus (×)" value={settings.global.vppBonusMultiplier} onChange={(v) => updateGlobal({ vppBonusMultiplier: v })} step={0.01} />
          <NumberField label="Max autarky (%)" value={settings.global.maxAutarkyPercent} onChange={(v) => updateGlobal({ maxAutarkyPercent: v })} step={1} />
          <NumberField label="Max cycles/year" value={settings.global.maxCyclesPerYear} onChange={(v) => updateGlobal({ maxCyclesPerYear: v })} step={10} />
          <NumberField label="Required PS cycles" value={settings.global.requiredPeakShavingCycles} onChange={(v) => updateGlobal({ requiredPeakShavingCycles: v })} step={1} />
          <NumberField label="Required PRL cycles" value={settings.global.requiredPrlCycles} onChange={(v) => updateGlobal({ requiredPrlCycles: v })} step={1} />
          <NumberField label="Requested EPEX cycles" value={settings.global.requestedEpexCycles} onChange={(v) => updateGlobal({ requestedEpexCycles: v })} step={10} />
          <NumberField label="Requested LoadShift cycles" value={settings.global.requestedLoadShiftingCycles} onChange={(v) => updateGlobal({ requestedLoadShiftingCycles: v })} step={10} />
          <NumberField label="PRL power share (0–1)" value={settings.global.prlPowerShare} onChange={(v) => updateGlobal({ prlPowerShare: v })} step={0.05} />
        </div>
      </section>

      {/* Per-tier settings */}
      <section className="bg-brand-white rounded-lg shadow-sm border border-brand-lighter-gray overflow-hidden">
        <div className="p-6 border-b border-brand-lighter-gray">
          <h2 className="text-lg font-bold text-brand-dark-gray">System Size Tiers</h2>
          <p className="text-sm text-brand-light-gray mt-1">
            Each tier covers a range of battery capacity (kWh). Calculations pick the matching tier per customer.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-brand-lighter-gray/50 border-b border-brand-lighter-gray">
                <th className="p-3 font-semibold text-brand-dark-gray">Tier</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">EPEX spread (€/kWh)</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">PRL (€/kW/yr)</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">aFRR/SRL (€/kW/yr)</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">Balancing ×</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">Min cost (€/kWh)</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">Fallback cost (€/kWh)</th>
                <th className="p-3 font-semibold text-brand-dark-gray text-right">Default Netzentgelt (ct)</th>
              </tr>
            </thead>
            <tbody>
              {settings.tiers.map((t, i) => (
                <tr key={t.id} className="border-b border-brand-lighter-gray last:border-0">
                  <td className="p-3 text-brand-dark-gray font-medium whitespace-nowrap">{t.label}</td>
                  <td className="p-3"><CellInput value={t.epexGrossSpreadEurPerKwh} step={0.01} onChange={(v) => updateTier(i, { epexGrossSpreadEurPerKwh: v })} /></td>
                  <td className="p-3"><CellInput value={t.prlAnnualEurPerKw} step={1}    onChange={(v) => updateTier(i, { prlAnnualEurPerKw: v })} /></td>
                  <td className="p-3"><CellInput value={t.srlAnnualEurPerKw} step={1}    onChange={(v) => updateTier(i, { srlAnnualEurPerKw: v })} /></td>
                  <td className="p-3"><CellInput value={t.balancingMultiplier} step={0.01} onChange={(v) => updateTier(i, { balancingMultiplier: v })} /></td>
                  <td className="p-3"><CellInput value={t.minCostPerKwh} step={10}      onChange={(v) => updateTier(i, { minCostPerKwh: v })} /></td>
                  <td className="p-3"><CellInput value={t.fallbackCostPerKwh} step={10} onChange={(v) => updateTier(i, { fallbackCostPerKwh: v })} /></td>
                  <td className="p-3"><CellInput value={t.defaultGridFeeCentsKwh} step={0.1} onChange={(v) => updateTier(i, { defaultGridFeeCentsKwh: v })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Save bar */}
      <div className="sticky bottom-0 bg-brand-white border-t border-brand-lighter-gray p-4 flex items-center justify-between -mx-8 px-8">
        <div className="text-sm">
          {state.message && (
            <span className={state.ok ? 'text-green-600' : 'text-brand-red'}>{state.message}</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            disabled={resetPending}
            className="px-4 py-2 text-sm font-medium text-brand-light-gray hover:text-brand-red border border-brand-lighter-gray rounded-md transition-colors disabled:opacity-50"
          >
            {resetPending ? 'Resetting...' : 'Reset to defaults'}
          </button>
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 text-sm font-semibold text-white bg-brand-red rounded-md hover:bg-brand-red/90 transition-colors disabled:opacity-50"
          >
            {pending ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </div>
    </form>
  );
}

function NumberField({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark-gray mb-1">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-brand-lighter-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
      />
    </div>
  );
}

function CellInput({ value, onChange, step }: { value: number; onChange: (v: number) => void; step: number }) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-24 px-2 py-1 border border-brand-lighter-gray rounded text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
    />
  );
}

function MaintenanceYearsField({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  // Comma-separated input so the admin can list multiple battery-replacement
  // years (e.g. "10, 20"). Empty / non-numeric tokens are dropped silently.
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark-gray mb-1">Maintenance years (comma-sep)</label>
      <input
        type="text"
        value={value.join(', ')}
        onChange={(e) => {
          const years = e.target.value
            .split(',')
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => Number.isFinite(n) && n > 0);
          onChange(years);
        }}
        className="w-full px-3 py-2 border border-brand-lighter-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
      />
    </div>
  );
}
