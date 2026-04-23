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
    <header className="mb-12">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
          Schritt {currentStep} · {totalSteps}
        </span>
        <div className="h-[3px] flex-1 bg-[#e5e5e5] overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#e20613] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-[0.7rem] font-bold tabular-nums text-[#1a1a1a]">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <h1 className="text-[2.25rem] md:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-tight text-[#1a1a1a] mb-4 leading-[1.05]">
        {title}
      </h1>
      <p className="text-base md:text-lg text-[#5a5859] max-w-2xl leading-relaxed font-medium">
        {description}
      </p>
    </header>
  );
}
