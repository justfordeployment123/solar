
export type Persona = 'Private' | 'Installer' | 'Company' | null;

export type Goal = 
  | 'Self-Consumption' 
  | 'Peak Shaving' 
  | 'EPEX Arbitrage' 
  | 'Backup Power' 
  | 'Grid Services (VPP/Balancing)'
  | 'Load Shifting'
  | null;

export interface QuestionnaireGoals {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
}

export interface TechnicalInputs {
  region: 'North' | 'Central' | 'South' | null;
  pvSizeKwp: number | null;
  annualConsumptionKwh: number | null;
  existingBatteryCapacityKwh: number | null;
  existingBatteryManufacturer: string | null;
  currentBatteryCapacityKwh: number | null;
  inverterPowerKw: number | null;
  gridImportLimitKw: number | null;
  gridExportLimitKw: number | null;
  // Distance to the nearest substation in km. Shorter distance = lower line losses
  // for grid-facing markets (arbitrage / balancing). Optional.
  substationDistanceKm?: number | null;
  
  // Questionnaire Goal Toggles
  enableSelfConsumption?: boolean;
  enablePeakShaving?: boolean;
  enableEpex?: boolean;
  enablePrl?: boolean;
  enableSrl?: boolean;
  enableLoadShifting?: boolean;
}

export interface FinancialInputs {
  currentElectricityPriceCentsKwh: number | null;
  yearlyElectricityBillEur: number | null;
  targetBudgetEur: number | null;
  // Actual quoted system cost (CapEx). When provided (> 0) it drives ROI/payback
  // directly; otherwise the engine falls back to a capacity-based estimate.
  actualSystemCostEur?: number | null;
  vppParticipationEnabled: boolean;
  
  // Load Shifting & Peak Shaving Inputs
  dynamicFeedInTariffCentsKwh?: number | null;
  standardFeedInTariffCentsKwh?: number | null;
  gridFeesCentsKwh?: number | null;
  demandChargeEurPerKw?: number | null;
  peakShavingReductionPercentage?: number | null;

  // EV Charging upsell (Phase 2). Revenue from on-site EV chargers powered by
  // the system. Triggered when storage > 100 kWh or PV > 20 kW with battery
  // > 60 kWh.
  evChargingEnabled?: boolean | null;
  evNumChargers?: number | null;
  evPowerKw?: number | null;
  evDailyHours?: number | null;
  evSellPriceCentsKwh?: number | null;

  // Energy Community upsell (Phase 2). Revenue from selling electricity to
  // co-located consumers. Triggered when PV > 50 kW.
  communityEnabled?: boolean | null;
  communityNumParties?: number | null;
  communityKwhPerParty?: number | null;
  communitySellPriceCentsKwh?: number | null;
}

export interface CsvMetadata {
  isConfigured: boolean;
  fileName: string | null;
  rowCount: number;
  hasErrors: boolean;
  parseErrorSurface: string | null;
  fallbackToManualMode: boolean;
}

export interface RevenueStreams {
  selfConsumption: number;
  prl: number;
  srlAfrr: number;
  epexArbitrage: number;
  peakShaving: number;
  vppParticipation: number;
  loadShifting: number;
  evCharging: number;
  communitySupply: number;
}

export interface YearlyCashflow {
  year: number;
  cashflow: number;
  cumulative: number;
}

export interface SensitivityPoint {
  batterySizeKwh: number;
  totalAnnualRevenue: number;
}

export interface DerivedResults {
  annualRevenueByStream: RevenueStreams;
  totalAnnualRevenue: number;
  engineeringFee: number;
  roiPercent: number;
  paybackYears: number | null;
  yearlyProjection: YearlyCashflow[];
  sensitivityToBatterySize: SensitivityPoint[];
  autarkyPercent: number;
  // CapEx actually used in the projection (real quote if entered, else estimate)
  systemCost: number;
  totalUpfrontCost: number;
  // True when storage power exceeds the grid connection limit (output throttled)
  bottleneckActive: boolean;
  effectiveInverterPowerKw: number;
  effectiveGridExportPowerKw: number;
  calculationAssumptions: {
    degradationRatePercent: number;
    inflationRatePercent: number;
    marketDeclineRatePercent: number;
    maintenanceYear: number;
    maintenanceYears: number[];
    maintenanceCostPercent: number;
    engineeringFeePercent: number;
  };
  // Suggested extra battery capacity (kWh) when an enabled energy community
  // outstrips the available PV mid-day. null when no upgrade is needed.
  recommendedBatteryUpgradeKwh?: number | null;
}

export interface LeadFormDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  companyName?: string;
}

export interface InstallerProfileDraft {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  logoUrl?: string;
  generatedSlug?: string;
}

export interface ActiveInstaller {
  id: string; // The supbase ID of the installer
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  logoUrl?: string;
  generatedSlug: string;
}

export interface CalculatorState {
  // Slices
  persona: Persona;
  goals: QuestionnaireGoals;
  technical: TechnicalInputs;
  financial: FinancialInputs;
  csvMetadata: CsvMetadata;
  derivedResults: DerivedResults | null;
  leadDraft: LeadFormDraft;
  installerProfile: InstallerProfileDraft;
  activeInstaller: ActiveInstaller | null;
  
  // Admin-tunable calculator settings (loaded from server on app start).
  // null until the first /api/calculator-settings response lands; the engine
  // falls back to DEFAULT_SETTINGS in the meantime.
  calculatorSettings: import('@/lib/calculator-settings').CalculatorSettings | null;

  // Progress/Hydration Flags
  _hasHydrated: boolean;
  stepCompletion: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    results: boolean;
  };
}

export interface CalculatorActions {
  setHasHydrated: (state: boolean) => void;
  setCalculatorSettings: (settings: import('@/lib/calculator-settings').CalculatorSettings) => void;
  setPersona: (persona: Persona) => void;
  setGoals: (goals: Partial<QuestionnaireGoals>) => void;
  setTechnicalInputs: (inputs: Partial<TechnicalInputs>) => void;
  setFinancialInputs: (inputs: Partial<FinancialInputs>) => void;
  setCsvMetadata: (metadata: Partial<CsvMetadata>) => void;
  setLeadDraft: (draft: Partial<LeadFormDraft>) => void;
  setInstallerProfile: (draft: Partial<InstallerProfileDraft>) => void;
  setActiveInstaller: (installer: ActiveInstaller | null) => void;
  markStepComplete: (step: keyof CalculatorState['stepCompletion'], isComplete: boolean) => void;
  resetData: () => void;
}

export type CalculatorStore = CalculatorState & CalculatorActions;
