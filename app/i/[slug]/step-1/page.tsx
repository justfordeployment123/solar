"use client";

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ProgressHeader } from '@/components/layout/progress-header';
import { useEffect, useState } from 'react';
import { Goal } from '@/types/calculator';
import { RadioCard } from '@/components/ui/radio-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const GOAL_OPTIONS: { id: Goal & string; title: string; description: string; disclaimer?: string }[] = [
  { id: 'Self-Consumption', title: 'Eigenverbrauch', description: 'Priorisieren Sie die lokale Nutzung von Solarenergie, um die Abhängigkeit von externen Anbietern zu verringern.' },
  { id: 'Peak Shaving', title: 'Lastspitzenkappung (Peak Shaving)', description: 'Reduzieren Sie die Leistungsentgelte, indem Sie die Batterie während der Spitzenlastzeiten entladen.' },
  { id: 'Grid Services (VPP/Balancing)', title: 'Netzstabilität (PRL/SRL)', description: 'Stellen Sie dem nationalen Übertragungsnetzbetreiber Frequenzregelreserven zur Verfügung.' },
  { id: 'EPEX Arbitrage', title: 'Energiehandel (EPEX Arbitrage)', description: 'Kaufen Sie Energie, wenn die Preise niedrig sind, und verkaufen Sie diese, wenn sie auf dem Spotmarkt hoch sind.' },
  { id: 'Backup Power', title: 'Notstromversorgung', description: 'Gewährleisten Sie die Stromverfügbarkeit bei Netzausfällen.' },
  { id: 'Load Shifting', title: 'Lastverschiebung (Load Shifting)', description: 'Nutzen Sie dynamische Tarife, um günstige Energie zu speichern und zeitversetzt optimal einzusetzen.' },
];

export default function Step1Page() {
  const router = useRouter();
  const params = useParams() as { slug: string };
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
    if (!goals.primaryGoal && goals.secondaryGoals.length === 0) {
      alert("Bitte wählen Sie mindestens ein Ziel aus, um fortzufahren.");
      return;
    }
    markStepComplete('step1', true);
    router.push(`/i/${params.slug}/step-2`);
  };

  if (!mounted) return null;

  const selectedCount =
    (goals.primaryGoal ? 1 : 0) + goals.secondaryGoals.length;

  return (
    <div className="px-6 lg:px-12 pt-10 max-w-4xl mx-auto flex flex-col min-h-full">
      <ProgressHeader
        currentStep={1}
        totalSteps={3}
        title="Was sind Ihre Ziele?"
        description="Wählen Sie aus, wie Ihr zukünftiges Batteriesystem mit dem Stromnetz und Ihrem lokalen Energieverbrauchsnetz interagieren soll."
      />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e5e5]">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#5a5859]">
          Mehrfachauswahl möglich
        </span>
        <span className="text-[0.8rem] font-bold text-[#1a1a1a]">
          <span className="text-[#e20613]">{selectedCount}</span> / {GOAL_OPTIONS.length} ausgewählt
        </span>
      </div>

      <section className="space-y-4 mb-12 flex-grow">
        {GOAL_OPTIONS.map((option) => (
          <RadioCard
            key={option.id!}
            option={option}
            checked={isSelected(option.id)}
            onChange={handleToggleGoal}
          />
        ))}
      </section>

      <footer className="mt-auto pb-10 flex justify-between items-center py-6 border-t border-[#e5e5e5] w-full">
        <Link
          prefetch={false}
          href="/"
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
