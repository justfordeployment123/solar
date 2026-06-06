// Browser-safe types, defaults, and pure helpers. No filesystem access here —
// see lib/calculator-settings/server.ts for the load/save side that needs `fs`.

export type TierSettings = {
  id: string;
  label: string;
  minKwh: number;
  maxKwh: number | null;
  epexGrossSpreadEurPerKwh: number;
  prlAnnualEurPerKw: number;
  srlAnnualEurPerKw: number;
  balancingMultiplier: number;
  minCostPerKwh: number;
  fallbackCostPerKwh: number;
  defaultGridFeeCentsKwh: number;
};

export type GlobalSettings = {
  engineeringFeePercent: number;
  degradationRatePercent: number;
  inflationRatePercent: number;
  marketDeclineRatePercent: number;
  // Maintenance events: any battery-replacement (or major overhaul) the
  // operator wants to bake into the cashflow. Years are 1-indexed (Year 1 is
  // the first operating year). Empty array = no maintenance event.
  maintenanceYears: number[];
  maintenanceCostPercent: number;
  vppBonusMultiplier: number;
  maxAutarkyPercent: number;
  adjustmentPercent: number;
  // Annual cycle budget reserved for the full revenue stack. The engine uses
  // this as the starting pool and debits each use-case as cycles are claimed.
  maxCyclesPerYear: number;
  // Cycles the engine reserves for each local optimization when enabled.
  requiredPeakShavingCycles: number;
  requiredPrlCycles: number;
  // Cycle targets for the traded (grid-facing) services. Anything left in the
  // pool after the local services is split according to the priority order
  // set in the engine.
  requestedEpexCycles: number;
  requestedLoadShiftingCycles: number;
  // PRL/SRL split of inverter power when BOTH services are enabled (0-1).
  // 0.5 = equal split; 0.7 = 70% PRL / 30% SRL. Ignored when only one is on.
  prlPowerShare: number;
};

export type CalculatorSettings = {
  tiers: TierSettings[];
  global: GlobalSettings;
  updatedAt: string;
};

export const DEFAULT_SETTINGS: CalculatorSettings = {
  tiers: [
    { id: 'tier-1', label: '0–30 kWh',     minKwh: 0,    maxKwh: 30,   epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.00, minCostPerKwh: 700, fallbackCostPerKwh: 900, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-2', label: '30–100 kWh',   minKwh: 30,   maxKwh: 100,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.00, minCostPerKwh: 450, fallbackCostPerKwh: 700, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-3', label: '100–400 kWh',  minKwh: 100,  maxKwh: 400,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.10, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-4', label: '400–800 kWh',  minKwh: 400,  maxKwh: 800,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.20, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-5', label: '800–2,000 kWh',minKwh: 800,  maxKwh: 2000, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-6', label: '2,000–8,000 kWh', minKwh: 2000, maxKwh: 8000, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 380, fallbackCostPerKwh: 460, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-7', label: '> 8,000 kWh',  minKwh: 8000, maxKwh: null, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 350, fallbackCostPerKwh: 430, defaultGridFeeCentsKwh: 5 },
  ],
  global: {
    engineeringFeePercent: 3.8,
    degradationRatePercent: 2.0,
    inflationRatePercent: 3.8,
    marketDeclineRatePercent: 2.0,
    maintenanceYears: [10],
    maintenanceCostPercent: 10,
    vppBonusMultiplier: 1.12,
    maxAutarkyPercent: 95,
    adjustmentPercent: 0,
    maxCyclesPerYear: 400,
    requiredPeakShavingCycles: 20,
    requiredPrlCycles: 20,
    requestedEpexCycles: 300,
    requestedLoadShiftingCycles: 300,
    prlPowerShare: 0.5,
  },
  updatedAt: new Date(0).toISOString(),
};

// Pick the tier whose [minKwh, maxKwh) range contains the given capacity.
export function pickTier(settings: CalculatorSettings, capacityKwh: number): TierSettings {
  for (const t of settings.tiers) {
    if (capacityKwh >= t.minKwh && (t.maxKwh == null || capacityKwh < t.maxKwh)) return t;
  }
  return settings.tiers[settings.tiers.length - 1];
}

// Merge an incoming (possibly older / partial) settings blob with defaults so a
// schema addition doesn't crash the engine on first read.
export function mergeWithDefaults(input: any): CalculatorSettings {
  const tiers = Array.isArray(input?.tiers)
    ? input.tiers.map((t: any) => {
        // Look up the original default tier by ID to ensure missing keys are populated safely.
        // If it's a completely new tier created by an admin, use the first default tier as a structural fallback.
        const baseTier = DEFAULT_SETTINGS.tiers.find((dt) => dt.id === t?.id) ?? DEFAULT_SETTINGS.tiers[0];
        return { ...baseTier, ...t };
      })
    : DEFAULT_SETTINGS.tiers;

  const global = { ...DEFAULT_SETTINGS.global, ...(input?.global ?? {}) };
  // Backwards compatibility: old payloads used a single `maintenanceYear`
  // integer instead of the `maintenanceYears` array. Migrate on read so
  // pre-schema-bump admins still get a maintenance event in the cashflow.
  if (!Array.isArray(global.maintenanceYears) || global.maintenanceYears.length === 0) {
    if (typeof (input?.global as any)?.maintenanceYear === 'number' && (input.global as any).maintenanceYear > 0) {
      global.maintenanceYears = [(input.global as any).maintenanceYear];
    } else {
      global.maintenanceYears = DEFAULT_SETTINGS.global.maintenanceYears;
    }
  }
  return { tiers, global, updatedAt: input?.updatedAt ?? DEFAULT_SETTINGS.updatedAt };
}
