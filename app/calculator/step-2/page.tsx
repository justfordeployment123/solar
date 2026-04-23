"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ArrowLeft, ChevronRight, Zap, Database } from 'lucide-react';
import { CsvUploader } from '@/components/forms/csv-uploader';

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

  if (!mounted || !stepCompletion.step1) return null;

  return (
    <div className="px-6 lg:px-12 pt-10 max-w-5xl mx-auto flex flex-col min-h-full">
      <ProgressHeader
        currentStep={2}
        totalSteps={3}
        title="Systemdetails"
        description="Konfigurieren Sie die technischen Parameter Ihrer Photovoltaik-Anlage und Ihres Batteriespeichers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 flex-grow">
        {/* Technische Daten */}
        <section className="bg-white border border-[#e5e5e5] p-8 relative">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#e20613]" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#e20613] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                Teil 01
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                Technische Daten
              </h3>
            </div>
          </div>

          <div className="space-y-6">
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
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="PV-Größe (kWp)"
                type="number"
                placeholder="10"
                value={technical.pvSizeKwp ?? ''}
                onChange={handleInputChange('pvSizeKwp')}
              />
              <Input
                label="Jährl. Verbrauch (kWh)"
                type="number"
                placeholder="5000"
                value={technical.annualConsumptionKwh ?? ''}
                onChange={handleInputChange('annualConsumptionKwh')}
              />
            </div>
            <Input
              label="Aktuelle Batteriekapazität (kWh)"
              type="number"
              placeholder="0"
              value={technical.currentBatteryCapacityKwh ?? ''}
              onChange={handleInputChange('currentBatteryCapacityKwh')}
            />
            <div className="grid grid-cols-2 gap-4">
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

        {/* Smart Data */}
        <section className="bg-white border border-[#e5e5e5] p-8 relative">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#d2d700] flex items-center justify-center">
              <Database className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                Teil 02
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                Smart Data
              </h3>
            </div>
          </div>
          <CsvUploader />
        </section>
      </div>

      <footer className="mt-auto pb-10 flex justify-between items-center py-6 border-t border-[#e5e5e5] w-full">
        <Link
          prefetch={false}
          href="/calculator/step-1"
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#5a5859] hover:text-[#e20613] flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Zurück
        </Link>
        <Button variant="primary" onClick={handleNext}>
          Nächster Schritt <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
