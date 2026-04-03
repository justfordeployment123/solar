import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculatorState, CalculatorActions, CalculatorStore } from '@/types/calculator';
import { calculateResults } from '@/lib/calculations/engine';

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
    currentBatteryCapacityKwh: null,
    inverterPowerKw: null,
    gridConnectionLimitKw: null,
  },
  financial: {
    currentElectricityPriceCentsKwh: null,
    yearlyElectricityBillEur: null,
    targetBudgetEur: null,
    vppParticipationEnabled: false,
  },
  csvMetadata: {
    isConfigured: false,
    fileName: null,
    rowCount: 0,
    hasErrors: false,
    expectedColumns: ['timestamp', 'consumption_kwh'],
    acceptedDelimiters: [',', ';', '\t'],
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
      
      setGoals: (goals) =>
        set((state) => ({ goals: { ...state.goals, ...goals } })),
        
      setTechnicalInputs: (inputs) =>
        set((state) => {
          const newTechnical = { ...state.technical, ...inputs };
          const derivedResults = calculateResults(newTechnical, state.financial);
          return { technical: newTechnical, derivedResults };
        }),
        
      setFinancialInputs: (inputs) =>
        set((state) => {
          const newFinancial = { ...state.financial, ...inputs };
          const derivedResults = calculateResults(state.technical, newFinancial);
          return { financial: newFinancial, derivedResults };
        }),
        
      setCsvMetadata: (metadata) =>
        set((state) => ({ csvMetadata: { ...state.csvMetadata, ...metadata } })),
        
      setLeadDraft: (draft) =>
        set((state) => ({ leadDraft: { ...state.leadDraft, ...draft } })),
        
      setInstallerProfile: (draft) =>
        set((state) => ({ installerProfile: { ...state.installerProfile, ...draft } })),
        
      markStepComplete: (step, isComplete) =>
        set((state) => ({
          stepCompletion: { ...state.stepCompletion, [step]: isComplete },
        })),
        
      resetData: () => set(initialState),
    }),
    {
      name: 'battery-calculator-storage',
      version: 1, // Optional version schema for migrations later
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => {
        // Exclude transient states like _hasHydrated from persistence
        const { _hasHydrated, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);
