import React from 'react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export function ProgressHeader({ currentStep, totalSteps, title, description }: ProgressHeaderProps) {
  return (
    <header className="mb-20">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-outline">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
      </div>
      <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-black mb-4">
        {title}
      </h1>
      <p className="mt-8 text-xl text-neutral-500 max-w-xl leading-relaxed">
        {description}
      </p>
    </header>
  );
}
