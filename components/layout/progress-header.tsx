"use client";

import React from 'react';

export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export function ProgressHeader({ currentStep, totalSteps, title, description }: ProgressHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header 
         className="mb-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Schritt {currentStep} von {totalSteps}
        </span>
        <div className="h-1.5 flex-1 bg-[#dfdfdf]  overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-primary"
             style={{ width: `${progressPercentage}%` }}
             />
        </div>
      </div>
      <h1 
           className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#363636] mb-4"
      >
        {title}
      </h1>
      <p 
           className="text-lg md:text-xl text-[#565656] max-w-2xl leading-relaxed"
      >
        {description}
      </p>
    </header>
  );
}
