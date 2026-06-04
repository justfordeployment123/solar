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
  maintenanceYear: number;
  maintenanceCostPercent: number;
  vppBonusMultiplier: number;
  maxAutarkyPercent: number;
  adjustmentPercent: number;
};

export type CalculatorSettings = {
  tiers: TierSettings[];
  global: GlobalSettings;
  updatedAt: string;
};

export const DEFAULT_SETTINGS: CalculatorSettings = {
  tiers: [
    { id: 'tier-1', label: '0–30 kW',     minKwh: 0,    maxKwh: 30,   epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.00, minCostPerKwh: 700, fallbackCostPerKwh: 900, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-2', label: '30–100 kW',   minKwh: 30,   maxKwh: 100,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.00, minCostPerKwh: 450, fallbackCostPerKwh: 700, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-3', label: '100–400 kW',  minKwh: 100,  maxKwh: 400,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.10, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-4', label: '400–800 kW',  minKwh: 400,  maxKwh: 800,  epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.20, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-5', label: '800–2,000 kW',minKwh: 800,  maxKwh: 2000, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 400, fallbackCostPerKwh: 500, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-6', label: '2,000–8,000 kW', minKwh: 2000, maxKwh: 8000, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 380, fallbackCostPerKwh: 460, defaultGridFeeCentsKwh: 5 },
    { id: 'tier-7', label: '> 8,000 kW',  minKwh: 8000, maxKwh: null, epexGrossSpreadEurPerKwh: 0.25, prlAnnualEurPerKw: 122.2, srlAnnualEurPerKw: 180, balancingMultiplier: 1.25, minCostPerKwh: 350, fallbackCostPerKwh: 430, defaultGridFeeCentsKwh: 5 },
  ],
  global: {
    engineeringFeePercent: 3.8,
    degradationRatePercent: 2.0,
    inflationRatePercent: 3.8,
    marketDeclineRatePercent: 2.0,
    maintenanceYear: 10,
    maintenanceCostPercent: 10,
    vppBonusMultiplier: 1.12,
    maxAutarkyPercent: 95,
    adjustmentPercent: 0,
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
  const tiers = Array.isArray(input?.tiers) && input.tiers.length === DEFAULT_SETTINGS.tiers.length
    ? input.tiers.map((t: any, i: number) => ({ ...DEFAULT_SETTINGS.tiers[i], ...t }))
    : DEFAULT_SETTINGS.tiers;
  const global = { ...DEFAULT_SETTINGS.global, ...(input?.global ?? {}) };
  return { tiers, global, updatedAt: input?.updatedAt ?? DEFAULT_SETTINGS.updatedAt };
}
