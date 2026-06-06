import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculatorState, CalculatorActions, CalculatorStore } from '@/types/calculator';
import { calculateResults } from '@/lib/calculations/engine';
import { DEFAULT_SETTINGS } from '@/lib/calculator-settings';

const initialState: CalculatorState = {
  persona: null,
  goals: {
    primaryGoal: null,
    secondaryGoals: [],
  },
  technical: {
    region: null,
    pvSizeKwp: null,
    annualConsumptionKwh: null,
    existingBatteryCapacityKwh: null,
    existingBatteryManufacturer: null,
    currentBatteryCapacityKwh: null,
    inverterPowerKw: null,
    gridImportLimitKw: null,
    gridExportLimitKw: null,
    substationDistanceKm: null,
    enableSelfConsumption: false,
    enablePeakShaving: false,
    enableEpex: false,
    enablePrl: false,
    enableSrl: false,
    enableLoadShifting: false,
  },
  financial: {
    currentElectricityPriceCentsKwh: null,
    yearlyElectricityBillEur: null,
    targetBudgetEur: null,
    actualSystemCostEur: null,
    vppParticipationEnabled: false,
    dynamicFeedInTariffCentsKwh: null,
    standardFeedInTariffCentsKwh: null,
    gridFeesCentsKwh: null,
    demandChargeEurPerKw: null,
    peakShavingReductionPercentage: null,
    evChargingEnabled: false,
    evNumChargers: null,
    evPowerKw: null,
    evDailyHours: null,
    evSellPriceCentsKwh: null,
    communityEnabled: false,
    communityNumParties: null,
    communityKwhPerParty: null,
    communitySellPriceCentsKwh: null,
  },
  csvMetadata: {
    isConfigured: false,
    fileName: null,
    rowCount: 0,
    hasErrors: false,
    parseErrorSurface: null,
    fallbackToManualMode: false,
  },
  derivedResults: null,
  leadDraft: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  installerProfile: {
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  },
  activeInstaller: null,
  calculatorSettings: null,
  _hasHydrated: false,
  stepCompletion: {
    step1: false,
    step2: false,
    step3: false,
    results: false,
  },
};

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      ...initialState,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      setPersona: (persona) => set({ persona }),
      
      setGoals: (goalsPayload) =>
        set((state) => {
          const newGoals = { ...state.goals, ...goalsPayload };
          const allGoals = [newGoals.primaryGoal, ...newGoals.secondaryGoals];

          // FIX: Z2 — the technical `enable*` flags are also toggled from the
          // results page directly. We treat them as the source of truth for
          // what revenue streams are active and only ADD a flag when a goal
          // implies it. A user who has explicitly toggled PRL ON in the
          // results page no longer gets it silently disabled when they later
          // re-pick a goal in step-1.
          const newTechnical = {
            ...state.technical,
            enableSelfConsumption: state.technical.enableSelfConsumption === true || allGoals.includes('Self-Consumption'),
            enablePeakShaving: state.technical.enablePeakShaving === true || allGoals.includes('Peak Shaving'),
            enableEpex: state.technical.enableEpex === true || allGoals.includes('EPEX Arbitrage'),
            enablePrl: state.technical.enablePrl === true || allGoals.includes('Grid Services (VPP/Balancing)'),
            enableSrl: state.technical.enableSrl === true || allGoals.includes('Grid Services (VPP/Balancing)'),
            enableLoadShifting: state.technical.enableLoadShifting === true || allGoals.includes('Load Shifting')
          };

          const derivedResults = calculateResults(newTechnical, state.financial, state.calculatorSettings ?? DEFAULT_SETTINGS);
          return { goals: newGoals, technical: newTechnical, derivedResults };
        }),
        
      setTechnicalInputs: (inputs) =>
        set((state) => {
          const newTechnical = { ...state.technical, ...inputs };
          const derivedResults = calculateResults(newTechnical, state.financial, state.calculatorSettings ?? DEFAULT_SETTINGS);
          return { technical: newTechnical, derivedResults };
        }),

      setFinancialInputs: (inputs) =>
        set((state) => {
          const newFinancial = { ...state.financial, ...inputs };
          const derivedResults = calculateResults(state.technical, newFinancial, state.calculatorSettings ?? DEFAULT_SETTINGS);
          return { financial: newFinancial, derivedResults };
        }),

      // Called by the SettingsHydrator on app startup once /api/calculator-settings
      // has responded. Re-derives results with the freshly-loaded admin overrides
      // so the in-memory derivedResults stays consistent with the displayed UI.
      // FIX (Z1): always recompute. The old `state.derivedResults && ...` guard
      // meant that on a hard reload — when partialize has just stripped
      // `derivedResults` and the user hasn't touched any input yet — the
      // engine was never re-run, leaving the user staring at the
      // "Daten nicht verfügbar" empty state. Recomputing on every settings
      // update is cheap and idempotent.
      setCalculatorSettings: (settings) =>
        set((state) => {
          const derivedResults = calculateResults(state.technical, state.financial, settings);
          return { calculatorSettings: settings, derivedResults };
        }),
        
      setCsvMetadata: (metadata) =>
        set((state) => ({ csvMetadata: { ...state.csvMetadata, ...metadata } })),
        
      setLeadDraft: (draft) =>
        set((state) => ({ leadDraft: { ...state.leadDraft, ...draft } })),
        
      setInstallerProfile: (draft) =>
        set((state) => ({ installerProfile: { ...state.installerProfile, ...draft } })),
        
      setActiveInstaller: (installer) =>
        set(() => ({ activeInstaller: installer })),
        
      markStepComplete: (step, isComplete) =>
        set((state) => ({
          stepCompletion: { ...state.stepCompletion, [step]: isComplete },
        })),
        
      resetData: () => set((state) => ({
        ...initialState,
        activeInstaller: state.activeInstaller,
        persona: state.persona,
      })),
    }),
    {
      name: 'battery-calculator-storage',
      version: 1, // Optional version schema for migrations later
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
partialize: (state) => {
        // FIX: Exclude derivedResults so returning users never see stale calculations
        // while the app is hydrating the latest admin settings.
        const { _hasHydrated, calculatorSettings, derivedResults, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);
