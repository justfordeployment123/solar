'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ProgressHeader } from '@/components/layout/progress-header';
import { useEffect, useState } from 'react';
import { Goal } from '@/types/calculator';

const GOAL_OPTIONS: { id: Goal; title: string; desc: string; note?: string }[] = [
  { id: 'Self-Consumption', title: 'Self-Consumption', desc: 'Prioritize using solar energy locally to reduce dependence on external suppliers.' },
  { id: 'Peak Shaving', title: 'Peak Shaving', desc: 'Reduce power demand charges by discharging the battery during peak load periods.' },
  { id: 'Grid Services (VPP/Balancing)', title: 'Grid Balancing (PRL/SRL)', desc: 'Provide frequency control reserves to the national grid operator.', note: 'Note: This revenue stream requires a generously dimensioned battery capacity.' },
  { id: 'EPEX Arbitrage', title: 'Energy Trading (EPEX Arbitrage)', desc: 'Buy energy when prices are low and sell when they are high on the spot market.' },
  { id: 'Backup Power', title: 'Backup Power', desc: 'Ensure power availability during grid outages.' },
];

export default function Step1Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const goals = useCalculatorStore((state) => state.goals);
  const setGoals = useCalculatorStore((state) => state.setGoals);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleGoal = (goal: Goal) => {
    if (!goal) return;
    
    // Simple logic: treat all selections as secondary goals if no primary, or just toggle them in a list.
    // For simplicity, let's just make the first selected the primary, and rest secondary, 
    // or just toggle them in a combined list and derive primary.
    const allSelected = new Set(
      goals.primaryGoal ? [goals.primaryGoal, ...goals.secondaryGoals] : goals.secondaryGoals
    );

    if (allSelected.has(goal)) {
      allSelected.delete(goal);
    } else {
      allSelected.add(goal);
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

  if (!mounted) return null; // Prevent hydration errors

  return (
    <div className="px-8 md:px-24 pt-12">
      <ProgressHeader currentStep={1} totalSteps={3} title="" description="" />

      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-[0.85]">
          Your<br />Goals
        </h1>
        <p className="mt-8 text-xl text-neutral-500 max-w-xl leading-relaxed">
          Define how your battery system should interact with the grid and your local energy consumption.
        </p>
      </header>

      <section className="space-y-12">
        {GOAL_OPTIONS.map((option) => (
          <label key={option.id!} className="group flex items-start justify-between cursor-pointer border-b border-outline-variant/30 pb-8 transition-colors hover:border-black hover:border-b-black">
            <div className="flex-1 pr-10">
              <span className="block text-xl font-bold text-black mb-2">{option.title}</span>
              <p className="text-sm text-neutral-500">{option.desc}</p>
              {option.note && <p className="text-xs italic text-neutral-400 mt-2">{option.note}</p>}
            </div>
            <div className="relative inline-flex items-center h-6 w-12 border border-black bg-white group-active:scale-95 transition-transform">
              <input 
                checked={isSelected(option.id)}
                onChange={() => handleToggleGoal(option.id)}
                className="sr-only peer" 
                type="checkbox"
              />
              <div className="peer-checked:bg-black w-full h-full absolute transition-colors"></div>
              <div className="absolute left-1 top-1 bg-black w-4 h-4 transition-transform peer-checked:translate-x-6 peer-checked:bg-white"></div>
            </div>
          </label>
        ))}
      </section>

      <footer className="mt-12 pt-12 flex justify-between items-center">
        <Link href="/" className="text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
          Back
        </Link>
        <button onClick={handleNext} className="bg-black text-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all duration-300">
          Next Step
        </button>
      </footer>
    </div>
  );
}
