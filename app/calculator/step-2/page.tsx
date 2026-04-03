'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCalculatorStore } from '@/store/calculatorStore';
import { UploadCloud } from 'lucide-react';

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
      <ProgressHeader currentStep={2} totalSteps={3} title="System Details" description="Configure the technical parameters of your solar and battery storage system." />



      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 mb-24">
        {/* Technical Column */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#ababab] mb-10">Technical Specifications</h3>
          <div className="space-y-12">
            <Select 
              label="Region" 
              options={[
                { value: '', label: 'Select a region' },
                { value: 'North', label: 'North Germany' },
                { value: 'Central', label: 'Central Germany' },
                { value: 'South', label: 'South Germany' },
              ]}
              value={technical.region || ''}
              onChange={(e) => setTechnicalInputs({ region: e.target.value as any })}
            />
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

        {/* Load Profile Column */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#ababab] mb-10">Load Profile</h3>
          <label htmlFor="csv-upload" className="border border-dashed border-[#c6c6c6] bg-transparent p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-black transition-colors cursor-pointer group block w-full">
            <input type="file" accept=".csv" id="csv-upload" className="hidden" />
            <div className="w-16 h-16 rounded-full bg-[#f9f9f9] flex items-center justify-center border border-[#c6c6c6] group-hover:border-black transition-colors">
              <UploadCloud className="w-6 h-6 text-[#a1a1aa] group-hover:text-black transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-black mb-1">Upload Load Profile CSV</p>
              <p className="text-[10px] uppercase tracking-widest text-[#ababab]">Drag & Drop or Click</p>
            </div>
            <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-xs">
              Upload your historical 15-minute interval smart meter data to get maximum precision out of your projections.
            </p>
          </label>
        </section>

      </div>

      <footer className="mt-6 pt-0 flex justify-between items-center">
        <Link href="/calculator/step-1" className="text-sm font-bold uppercase tracking-widest text-[#ababab] hover:text-black transition-colors">
          Back
        </Link>
        <button onClick={handleNext} className="bg-black text-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all duration-300 rounded-full">
          Next Step
        </button>
      </footer>
    </div>
  );
}
