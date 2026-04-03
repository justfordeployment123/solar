import React from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  icon: string;
}

interface MobileBottomNavProps {
  steps: Step[];
  currentStepIndex: number;
}

export function MobileBottomNav({ steps, currentStepIndex }: MobileBottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4 flex justify-around items-center z-50">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        return (
          <Link 
            key={step.id} 
            href={`#${step.id}`}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-black font-bold' : 'text-neutral-400'}`}
          >
            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {step.icon}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-tighter">
              {step.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
