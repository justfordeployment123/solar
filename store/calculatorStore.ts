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
    dynamicFeedInTariffCentsKwh: null,
    standardFeedInTariffCentsKwh: null,
    gridFeesCentsKwh: null,
    demandChargeEurPerKw: null,
    peakShavingReductionPercentage: null,
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
  activeInstaller: null,
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
          
          const derivedResults = calculateResults(newTechnical, state.financial);
          return { goals: newGoals, technical: newTechnical, derivedResults };
        }),
        
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
        // Exclude transient states like _hasHydrated from persistence
        const { _hasHydrated, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);
