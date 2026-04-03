'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { useCalculatorStore } from '@/store/calculatorStore';

export default function Step3Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const stepCompletion = useCalculatorStore((state) => state.stepCompletion);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);
  const financial = useCalculatorStore((state) => state.financial);
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
    // If it's a checkbox vs number
    if (e.target.type === 'checkbox') {
      setFinancialInputs({ [field]: e.target.checked });
    } else {
      const value = e.target.value === '' ? null : Number(e.target.value);
      setFinancialInputs({ [field]: value });
    }
  };

  if (!mounted || !stepCompletion.step2) return null; // Hydration and route guard

  return (
    <div className="px-8 md:px-24 py-12">
      <ProgressHeader currentStep={3} totalSteps={3} title="Financial Inputs" description="Configure the financial parameters of your battery storage system to calculate your potential ROI." />



      <div className="mb-24">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#ababab] mb-10">Financial Metrics</h3>
          <div className="space-y-12 max-w-md">
            <Input 
              label="Current Electricity Price (€/kWh)" 
              type="number" 
              step="0.01" 
              placeholder="0.35" 
              value={financial.currentElectricityPriceCentsKwh ?? ''}
              onChange={handleInputChange('currentElectricityPriceCentsKwh')}
            />
            <Input 
              label="Annual Electricity Bill (€)" 
              type="number" 
              placeholder="2400" 
              value={financial.yearlyElectricityBillEur ?? ''}
              onChange={handleInputChange('yearlyElectricityBillEur')}
            />
            <Input 
              label="Target Budget (€)" 
              type="number" 
              placeholder="12500" 
              value={financial.targetBudgetEur ?? ''}
              onChange={handleInputChange('targetBudgetEur')}
            />
            <label className="flex items-center space-x-3 cursor-pointer mt-8">
              <input 
                type="checkbox"
                className="h-5 w-5 bg-black text-black border-black focus:ring-black"
                checked={financial.vppParticipationEnabled}
                onChange={handleInputChange('vppParticipationEnabled')}
              />
              <span className="text-sm font-bold text-black uppercase tracking-widest">
                Enable VPP Participation
              </span>
            </label>
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-12 flex justify-between items-center border-t border-black">
        <Link href="/calculator/step-2" className="text-sm font-bold uppercase tracking-widest text-[#ababab] hover:text-black transition-colors">
          Back
        </Link>
        <button onClick={handleNext} className="bg-black text-white px-8 py-5 text-sm font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all duration-300">
          Calculate Results
        </button>
      </footer>
    </div>
  );
}
