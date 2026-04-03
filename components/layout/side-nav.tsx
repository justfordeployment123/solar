import React from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
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
              <step.icon className="w-4 h-4" />
              <span className="font-inter text-sm">{step.title}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={() => {
          if (window.confirm("Are you sure you want to reset data?")) {
            window.location.href = '/';
          }
        }} className="mt-auto py-4 border border-white text-white text-xs font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest bg-transparent mix-blend-difference invert dark:invert-0 dark:mix-blend-normal rounded-full">
        Reset Data
      </button>
    </aside>
  );
}
