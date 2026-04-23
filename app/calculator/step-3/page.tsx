"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ArrowLeft, ChevronRight, Calculator } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function Step3Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const stepCompletion = useCalculatorStore((state) => state.stepCompletion);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);
  const financial = useCalculatorStore((state) => state.financial);
  const technical = useCalculatorStore((state) => state.technical);
  const setFinancialInputs = useCalculatorStore((state) => state.setFinancialInputs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !stepCompletion.step2) {
      router.replace('/calculator/step-2');
    }
  }, [mounted, stepCompletion.step2, router]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    markStepComplete('step3', true);
    router.push('/calculator/results');
  };

  const handleInputChange = (field: keyof typeof financial) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'checkbox') {
      setFinancialInputs({ [field]: e.target.checked });
    } else {
      const value = e.target.value === '' ? null : Number(e.target.value);
      setFinancialInputs({ [field]: value });
    }
  };

  if (!mounted || !stepCompletion.step2) return null;

  return (
    <div className="px-6 lg:px-12 pt-8 max-w-4xl mx-auto flex flex-col min-h-full">
      <ProgressHeader currentStep={3} totalSteps={3} title="Finanzielle Kennzahlen" description="Konfigurieren Sie die finanziellen Parameter Ihres Batteriespeichersystems, um Ihren potenziellen ROI zu berechnen." />

      <div 
         className="my-8 flex-grow"
      >
        <section className="bg-[#ffffff] border border-[#dfdfdf] p-8 lg:p-12 mb-12">
          <h3  className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-8 flex items-center gap-2">
            <div className="w-2 h-2  bg-[#e12029]" /> Finanzdaten
          </h3>
          <div className="space-y-8 max-w-md">
            <div  >
              <Input 
                label="Aktueller Strompreis (€/kWh)" 
                type="number" 
                step="0.01" 
                placeholder="0.35" 
                value={financial.currentElectricityPriceCentsKwh ?? ''}
                onChange={handleInputChange('currentElectricityPriceCentsKwh')}
              />
            </div>
            <div  >
              <Input 
                label="Jährliche Stromkosten (€)" 
                type="number" 
                placeholder="2400" 
                value={financial.yearlyElectricityBillEur ?? ''}
                onChange={handleInputChange('yearlyElectricityBillEur')}
              />
            </div>
            <div  >
              <Input 
                label="Zielbudget (€)" 
                type="number" 
                placeholder="12500" 
                value={financial.targetBudgetEur ?? ''}
                onChange={handleInputChange('targetBudgetEur')}
              />
            </div>

            {technical.enablePeakShaving && (
              <div className="pt-4 border-t border-[#dfdfdf] mt-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#565656] mb-4">Peak Shaving Daten</h4>
                <div className="space-y-4">
                  <Input 
                    label="Leistungspreis (€/kW)" 
                    type="number" 
                    step="0.1" 
                    placeholder="45" 
                    value={financial.demandChargeEurPerKw ?? ''}
                    onChange={handleInputChange('demandChargeEurPerKw')}
                  />
                  <Input 
                    label="Einsparung (%)" 
                    type="number" 
                    step="1" 
                    placeholder="75" 
                    value={financial.peakShavingReductionPercentage ?? ''}
                    onChange={handleInputChange('peakShavingReductionPercentage')}
                  />
                </div>
              </div>
            )}

            {technical.enableLoadShifting && (
              <div className="pt-4 border-t border-[#dfdfdf] mt-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#565656] mb-4">Load Shifting Daten</h4>
                <div className="space-y-4">
                  <Input 
                    label="Dynamischer Tarif (Cent/kWh)" 
                    type="number" 
                    step="0.1" 
                    placeholder="30" 
                    value={financial.dynamicFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('dynamicFeedInTariffCentsKwh')}
                  />
                  <Input 
                    label="Standard Tarif (Cent/kWh)" 
                    type="number" 
                    step="0.1" 
                    placeholder="8" 
                    value={financial.standardFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('standardFeedInTariffCentsKwh')}
                  />
                  <Input 
                    label="Netzentgelte (Cent/kWh)" 
                    type="number" 
                    step="0.1" 
                    placeholder="12" 
                    value={financial.gridFeesCentsKwh ?? ''}
                    onChange={handleInputChange('gridFeesCentsKwh')}
                  />
                </div>
              </div>
            )}
            
            <label  className="flex items-center space-x-4 cursor-pointer mt-8 p-4  hover:bg-[#ffffff]  border border-transparent hover:border-[#ffffff] group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={financial.vppParticipationEnabled}
                  onChange={handleInputChange('vppParticipationEnabled')}
                />
                <div className="w-6 h-6 border-2 border-[#dfdfdf] peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center text-white">
                  <svg 
                    className={`w-4 h-4 ${financial.vppParticipationEnabled ? 'opacity-100' : 'opacity-0'}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-bold text-[#363636] uppercase tracking-widest group-hover:text-primary ">
                VPP-Teilnahme aktivieren
              </span>
            </label>
          </div>
        </section>
      </div>

      <footer className="mt-8 mb-12 flex justify-between items-center py-6 border-t border-[#dfdfdf] w-full mt-auto">
        <Link prefetch={false} href="/calculator/step-2" className="text-sm font-bold uppercase tracking-widest text-[#565656] hover:text-primary  flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4  " /> Zurück
        </Link>
        <Button variant="primary" onClick={handleNext} className="gap-2 pr-6 pl-5  text-base uppercase tracking-widest bg-[#e12029] text-white border-transparent hover:opacity-90">
          <Calculator className="w-5 h-5 mr-1" /> Ergebnisse berechnen
        </Button>
      </footer>
    </div>
  );
}
