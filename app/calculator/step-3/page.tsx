"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ArrowLeft, ChevronRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <ProgressHeader currentStep={3} totalSteps={3} title="Financial Inputs" description="Configure the financial parameters of your battery storage system to calculate your potential ROI." />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="my-8 flex-grow"
      >
        <section className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-apple rounded-3xl p-8 lg:p-12 mb-12">
          <motion.h3 variants={itemVariants} className="text-xs font-extrabold uppercase tracking-widest text-[#ff2d55] mb-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff2d55]" /> Financial Metrics
          </motion.h3>
          <div className="space-y-8 max-w-md">
            <motion.div variants={itemVariants}>
              <Input 
                label="Current Electricity Price (€/kWh)" 
                type="number" 
                step="0.01" 
                placeholder="0.35" 
                value={financial.currentElectricityPriceCentsKwh ?? ''}
                onChange={handleInputChange('currentElectricityPriceCentsKwh')}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input 
                label="Annual Electricity Bill (€)" 
                type="number" 
                placeholder="2400" 
                value={financial.yearlyElectricityBillEur ?? ''}
                onChange={handleInputChange('yearlyElectricityBillEur')}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input 
                label="Target Budget (€)" 
                type="number" 
                placeholder="12500" 
                value={financial.targetBudgetEur ?? ''}
                onChange={handleInputChange('targetBudgetEur')}
              />
            </motion.div>
            
            <motion.label variants={itemVariants} className="flex items-center space-x-4 cursor-pointer mt-8 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={financial.vppParticipationEnabled}
                  onChange={handleInputChange('vppParticipationEnabled')}
                />
                <div className="w-6 h-6 border-2 border-slate-300 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center text-white">
                  <motion.svg 
                    initial={false}
                    animate={{ scale: financial.vppParticipationEnabled ? 1 : 0, opacity: financial.vppParticipationEnabled ? 1 : 0 }}
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800 uppercase tracking-widest group-hover:text-primary transition-colors">
                Enable VPP Participation
              </span>
            </motion.label>
          </div>
        </section>
      </motion.div>

      <footer className="mt-8 mb-12 flex justify-between items-center py-6 border-t border-slate-200 w-full mt-auto">
        <Link href="/calculator/step-2" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <Button variant="primary" onClick={handleNext} className="gap-2 pr-6 pl-5 shadow-apple-hover text-base uppercase tracking-widest bg-gradient-to-r from-primary to-tertiary text-white border-transparent hover:opacity-90">
          <Calculator className="w-5 h-5 mr-1" /> Calculate Results
        </Button>
      </footer>
    </div>
  );
}
