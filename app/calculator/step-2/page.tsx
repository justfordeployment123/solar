"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { UploadCloud, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="px-6 lg:px-12 pt-8 max-w-5xl mx-auto flex flex-col min-h-full">
      <ProgressHeader currentStep={2} totalSteps={3} title="System Details" description="Configure the technical parameters of your solar and battery storage system." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 my-8 flex-grow">
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.h3 variants={itemVariants} className="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" /> Technical Specs
          </motion.h3>
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
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
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
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
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input 
                label="Current Battery Capacity (kWh)" 
                type="number" 
                placeholder="0" 
                value={technical.currentBatteryCapacityKwh ?? ''}
                onChange={handleInputChange('currentBatteryCapacityKwh')}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <Input 
                label="Inverter Power (kW)" 
                type="number" 
                placeholder="8" 
                value={technical.inverterPowerKw ?? ''}
                onChange={handleInputChange('inverterPowerKw')}
              />
              <Input 
                label="Grid Limit (kW)" 
                type="number" 
                placeholder="30" 
                value={technical.gridConnectionLimitKw ?? ''}
                onChange={handleInputChange('gridConnectionLimitKw')}
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e12029]" /> Smart Data
          </h3>
          <motion.label 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            htmlFor="csv-upload" 
            className="flex-grow min-h-[300px] rounded-3xl border-2 border-dashed border-[#dfdfdf] bg-white/50 backdrop-blur-sm p-12 text-center flex flex-col items-center justify-center gap-6 hover:border-primary hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-apple-glass"
          >
            <input type="file" accept=".csv" id="csv-upload" className="hidden" />
            <div className="w-20 h-20 rounded-full bg-[#ffffff] flex items-center justify-center border-2 border-[#ffffff] group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors relative overflow-hidden">
               <motion.div 
                 animate={{ y: [0, -5, 0] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               >
                 <UploadCloud className="w-8 h-8 text-[#565656] group-hover:text-primary transition-colors" />
               </motion.div>
            </div>
            <div>
              <p className="text-lg font-bold text-[#363636] mb-1">Upload Load Profile</p>
              <p className="text-xs uppercase tracking-widest text-[#565656] font-semibold mb-2">.CSV File</p>
            </div>
            <p className="text-sm text-[#565656] max-w-[250px] leading-relaxed">
              Upload your historical 15-minute interval smart meter data to get maximum precision out of your projections.
            </p>
          </motion.label>
        </motion.section>

      </div>

      <footer className="mt-8 mb-12 flex justify-between items-center py-6 border-t border-[#dfdfdf] w-full mt-auto">
        <Link href="/calculator/step-1" className="text-sm font-bold uppercase tracking-widest text-[#565656] hover:text-primary transition-colors flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <Button variant="primary" onClick={handleNext} className="gap-2 pr-4 shadow-apple text-base uppercase tracking-widest bg-[#363636] text-white hover:bg-primary border-transparent">
          Next Step <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
