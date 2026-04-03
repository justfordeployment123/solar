import React from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  icon: string;
  completed?: boolean;
}

interface SideNavProps {
  steps: Step[];
  currentStepIndex: number;
}

export function SideNav({ steps, currentStepIndex }: SideNavProps) {
  return (
    <aside className="hidden md:flex flex-col h-[calc(100vh-88px)] w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-8 sticky top-[88px]">
      <div className="mb-10">
        <h2 className="text-lg font-black text-black dark:text-white uppercase tracking-widest">Calculator</h2>
        <p className="text-xs text-neutral-400 mt-1">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>

      <nav className="flex-grow space-y-4 flex flex-col gap-4 flex-1">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          return (
            <Link 
              key={step.id} 
              href={`#${step.id}`}
              className={`flex items-center gap-3 p-3 transition-transform duration-200 ${isActive ? 'text-black font-bold bg-white border border-black translate-x-1' : 'text-neutral-400 hover:bg-neutral-200 active:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-sm">{step.icon}</span>
              <span className="font-inter text-sm">{step.title}</span>
            </Link>
          );
        })}
      </nav>

      <button className="mt-auto py-4 border border-black text-black text-xs font-bold hover:bg-black hover:text-white transition-colors uppercase tracking-widest">
        Reset Data
      </button>
    </aside>
  );
}
