export type Persona = 'Private' | 'Installer' | 'Company' | null;

export type Goal = 
  | 'Self-Consumption' 
  | 'Peak Shaving' 
  | 'EPEX Arbitrage' 
  | 'Backup Power' 
  | 'Grid Services (VPP/Balancing)'
  | null;

export interface QuestionnaireGoals {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
}

export interface TechnicalInputs {
  region: 'North' | 'Central' | 'South' | null;
  pvSizeKwp: number | null;
  annualConsumptionKwh: number | null;
  currentBatteryCapacityKwh: number | null;
  inverterPowerKw: number | null;
  gridConnectionLimitKw: number | null;
}

export interface FinancialInputs {
  currentElectricityPriceCentsKwh: number | null;
  yearlyElectricityBillEur: number | null;
  targetBudgetEur: number | null;
  vppParticipationEnabled: boolean;
}

export interface CsvMetadata {
  isConfigured: boolean;
  fileName: string | null;
  rowCount: number;
  hasErrors: boolean;
  expectedColumns: ('timestamp' | 'consumption_kwh')[];
  acceptedDelimiters: (',' | ';' | '\t')[];
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
  roiPercent: number;
  paybackYears: number;
  yearlyProjection: YearlyCashflow[];
  sensitivityToBatterySize: SensitivityPoint[];
}

export interface LeadFormDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
}

export interface InstallerProfileDraft {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  logoUrl?: string;
  generatedSlug?: string;
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
  setPersona: (persona: Persona) => void;
  setGoals: (goals: Partial<QuestionnaireGoals>) => void;
  setTechnicalInputs: (inputs: Partial<TechnicalInputs>) => void;
  setFinancialInputs: (inputs: Partial<FinancialInputs>) => void;
  setCsvMetadata: (metadata: Partial<CsvMetadata>) => void;
  setLeadDraft: (draft: Partial<LeadFormDraft>) => void;
  setInstallerProfile: (draft: Partial<InstallerProfileDraft>) => void;
  markStepComplete: (step: keyof CalculatorState['stepCompletion'], isComplete: boolean) => void;
  resetData: () => void;
}

export type CalculatorStore = CalculatorState & CalculatorActions;
