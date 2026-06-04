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
          
          const newTechnical = {
            ...state.technical,
            enableSelfConsumption: allGoals.includes('Self-Consumption'),
            enablePeakShaving: allGoals.includes('Peak Shaving'),
            enableEpex: allGoals.includes('EPEX Arbitrage'),
            enablePrl: allGoals.includes('Grid Services (VPP/Balancing)'),
            enableSrl: allGoals.includes('Grid Services (VPP/Balancing)'),
            enableLoadShifting: allGoals.includes('Load Shifting')
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
      setCalculatorSettings: (settings) =>
        set((state) => {
          const derivedResults = state.derivedResults
            ? calculateResults(state.technical, state.financial, settings)
            : state.derivedResults;
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
        // Exclude transient states from persistence. calculatorSettings is
        // re-fetched from the server on every app load so the admin's latest
        // tuning takes effect immediately, even on returning sessions.
        const { _hasHydrated, calculatorSettings, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);
