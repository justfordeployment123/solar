'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { useCalculatorStore } from '@/store/calculatorStore';

export default function Step2Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const stepCompletion = useCalculatorStore((state) => state.stepCompletion);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);
  const technical = useCalculatorStore((state) => state.technical);
  const setTechnicalInputs = useCalculatorStore((state) => state.setTechnicalInputs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !stepCompletion.step1) {
      router.replace('/calculator/step-1');
    }
  }, [mounted, stepCompletion.step1, router]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    markStepComplete('step2', true);
    router.push('/calculator/step-3');
  };

  const handleInputChange = (field: keyof typeof technical) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    setTechnicalInputs({ [field]: value });
  };

  if (!mounted || !stepCompletion.step1) return null; // Hydration and route guard

  return (
    <div className="px-8 md:px-24 py-12">
      <ProgressHeader currentStep={2} totalSteps={3} title="System Details" description="Technical info" />

      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-4">System Details</h1>
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          Configure the technical parameters of your solar and battery storage system.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 mb-24">
        {/* Technical Column */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#ababab] mb-10">Technical Specifications</h3>
          <div className="space-y-12">
            <Input 
              label="PV Size (kWp)" 
              type="number" 
              placeholder="10" 
              value={technical.pvSizeKwp ?? ''}
              onChange={handleInputChange('pvSizeKwp')}
            />
            <Input 
              label="Annual Consumption (kWh)" 
              type="number" 
              placeholder="5000" 
              value={technical.annualConsumptionKwh ?? ''}
              onChange={handleInputChange('annualConsumptionKwh')}
            />
            <Input 
              label="Current Battery Capacity (kWh)" 
              type="number" 
              placeholder="0" 
              value={technical.currentBatteryCapacityKwh ?? ''}
              onChange={handleInputChange('currentBatteryCapacityKwh')}
            />
            <Input 
              label="Inverter Power (kW)" 
              type="number" 
              placeholder="8" 
              value={technical.inverterPowerKw ?? ''}
              onChange={handleInputChange('inverterPowerKw')}
            />
            <Input 
              label="Grid Connection Limit (kW)" 
              type="number" 
              placeholder="30" 
              value={technical.gridConnectionLimitKw ?? ''}
              onChange={handleInputChange('gridConnectionLimitKw')}
            />
          </div>
        </section>

      </div>

      <footer className="mt-24 pt-12 flex justify-between items-center border-t border-black">
        <Link href="/calculator/step-1" className="text-sm font-bold uppercase tracking-widest text-[#ababab] hover:text-black transition-colors">
          Back
        </Link>
        <button onClick={handleNext} className="bg-black text-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all duration-300">
          Next Step
        </button>
      </footer>
    </div>
  );
}
