"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { UploadCloud, ArrowLeft, ChevronRight } from 'lucide-react';
import { CsvUploader } from '@/components/forms/csv-uploader';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function Step2Page() {
  const router = useRouter();
  const params = useParams() as { slug: string };
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
    router.push(`/i/${params.slug}/step-3`);
  };

  const handleInputChange = (field: keyof typeof technical) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    setTechnicalInputs({ [field]: value });
  };

  if (!mounted || !stepCompletion.step1) return null;

  return (
    <div className="px-6 lg:px-12 pt-8 max-w-5xl mx-auto flex flex-col min-h-full">
      <ProgressHeader currentStep={2} totalSteps={3} title="Systemdetails" description="Konfigurieren Sie die technischen Parameter Ihrer Photovoltaik-Anlage und Ihres Batteriespeichers." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 my-8 flex-grow">
        <section 
           className="flex flex-col gap-6"
        >
          <h3  className="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
            <div className="w-2 h-2  bg-primary" /> Technische Daten
          </h3>
          <div className="space-y-6">
            <div  >
              <Select 
                label="Region" 
                options={[
                  { value: '', label: 'Region wählen' },
                  { value: 'North', label: 'Norddeutschland' },
                  { value: 'Central', label: 'Mitteldeutschland' },
                  { value: 'South', label: 'Süddeutschland' },
                ]}
                value={technical.region || ''}
                onChange={(e) => setTechnicalInputs({ region: e.target.value as any })}
              />
            </div>
            <div  className="grid grid-cols-2 gap-4">
              <Input 
                label="PV-Größe (kWp)" 
                type="number" 
                placeholder="10" 
                value={technical.pvSizeKwp ?? ''}
                onChange={handleInputChange('pvSizeKwp')}
              />
              <Input 
                label="Jährlicher Verbrauch (kWh)" 
                type="number" 
                placeholder="5000" 
                value={technical.annualConsumptionKwh ?? ''}
                onChange={handleInputChange('annualConsumptionKwh')}
              />
            </div>
            <div  >
              <Input 
                label="Aktuelle Batteriekapazität (kWh)" 
                type="number" 
                placeholder="0" 
                value={technical.currentBatteryCapacityKwh ?? ''}
                onChange={handleInputChange('currentBatteryCapacityKwh')}
              />
            </div>
            <div  className="grid grid-cols-2 gap-4">
              <Input 
                label="Wechselrichterleistung (kW)" 
                type="number" 
                placeholder="8" 
                value={technical.inverterPowerKw ?? ''}
                onChange={handleInputChange('inverterPowerKw')}
              />
              <Input 
                label="Netzlimit (kW)" 
                type="number" 
                placeholder="30" 
                value={technical.gridConnectionLimitKw ?? ''}
                onChange={handleInputChange('gridConnectionLimitKw')}
              />
            </div>
          </div>
        </section>

        <section 
             className="flex flex-col gap-6"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-2 flex items-center gap-2">
            <div className="w-2 h-2  bg-[#e12029]" /> Smart Data
          </h3>
          <CsvUploader />
        </section>

      </div>

      <footer className="mt-8 mb-12 flex justify-between items-center py-6 border-t border-[#dfdfdf] w-full mt-auto">
        <Link prefetch={false} href={`/i/${params.slug}/step-1`} className="text-sm font-bold uppercase tracking-widest text-[#565656] hover:text-primary  flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4  " /> Zurück
        </Link>
        <Button variant="primary" onClick={handleNext} className="gap-2 pr-4  text-base uppercase tracking-widest bg-[#363636] text-white hover:bg-primary border-transparent">
          Nächster Schritt <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
