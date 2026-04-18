"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ProgressHeader } from '@/components/layout/progress-header';
import { useEffect, useState } from 'react';
import { Goal } from '@/types/calculator';
import { RadioCard } from '@/components/ui/radio-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const GOAL_OPTIONS: { id: Goal & string; title: string; description: string; disclaimer?: string }[] = [
  { id: 'Self-Consumption', title: 'Self-Consumption', description: 'Prioritize using solar energy locally to reduce dependence on external suppliers.' },
  { id: 'Peak Shaving', title: 'Peak Shaving', description: 'Reduce power demand charges by discharging the battery during peak load periods.' },
  { id: 'Grid Services (VPP/Balancing)', title: 'Grid Balancing (PRL/SRL)', description: 'Provide frequency control reserves to the national grid operator.' },
  { id: 'EPEX Arbitrage', title: 'Energy Trading (EPEX Arbitrage)', description: 'Buy energy when prices are low and sell when they are high on the spot market.' },
  { id: 'Backup Power', title: 'Backup Power', description: 'Ensure power availability during grid outages.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Step1Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const goals = useCalculatorStore((state) => state.goals);
  const setGoals = useCalculatorStore((state) => state.setGoals);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleGoal = (goal: string) => {
    const goalValue = goal as Goal;
    if (!goalValue) return;
    
    const allSelected = new Set(
      goals.primaryGoal ? [goals.primaryGoal, ...goals.secondaryGoals] : goals.secondaryGoals
    );

    if (allSelected.has(goalValue)) {
      allSelected.delete(goalValue);
    } else {
      allSelected.add(goalValue);
    }

    const selectedArray = Array.from(allSelected);
    const primaryGoal = selectedArray.length > 0 ? selectedArray[0] : null;
    const secondaryGoals = selectedArray.length > 1 ? selectedArray.slice(1) : [];

    setGoals({ primaryGoal, secondaryGoals });
  };

  const isSelected = (goal: Goal) => {
    if (!goal) return false;
    return goals.primaryGoal === goal || goals.secondaryGoals.includes(goal);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    markStepComplete('step1', true);
    router.push('/calculator/step-2');
  };

  if (!mounted) return null;

  return (
    <div className="px-6 lg:px-12 pt-8 max-w-4xl mx-auto flex flex-col min-h-full">
      <ProgressHeader 
        currentStep={1} 
        totalSteps={3} 
        title="What are your goals?" 
        description="Select how your future battery system should interact with the grid and your local energy consumption network." 
      />

      <section 
         className="space-y-4 my-8 flex-grow"
      >
        {GOAL_OPTIONS.map((option) => (
          <div key={option.id!}  >
            <RadioCard 
              option={option}
              checked={isSelected(option.id)}
              onChange={handleToggleGoal}
            />
          </div>
        ))}
      </section>

      <footer className="mt-12 pb-12 flex justify-between items-center py-6 border-t border-[#dfdfdf] w-full mt-auto">
        <Link href="/" className="text-sm font-bold uppercase tracking-widest text-[#565656] hover:text-primary  flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4  " /> Back
        </Link>
        <Button variant="primary" onClick={handleNext} className="gap-2 pr-4  text-base uppercase tracking-widest bg-[#363636] text-white hover:bg-primary border-transparent">
          Next Step <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </div>
  );
}
