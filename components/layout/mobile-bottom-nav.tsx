"use client";

import React from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface MobileBottomNavProps {
  steps: Step[];
  currentStepIndex: number;
}

export function MobileBottomNav({ steps, currentStepIndex }: MobileBottomNavProps) {
  return (
    <div className="lg:hidden sticky bottom-6 z-50 mx-6 mb-6 pointer-events-none">
      <div className="bg-white border border-[#e5e5e5] px-2 py-2 flex justify-between items-stretch shadow-lg pointer-events-auto">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const StepIcon = step.icon;
          return (
            <Link
              key={step.id}
              href={`#${step.id}`}
              className={`relative flex flex-col items-center justify-center p-2 flex-1 border-t-2 transition-colors ${
                isActive ? 'border-[#e20613]' : 'border-transparent'
              }`}
            >
              <div
                className={`mb-1 w-8 h-8 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#e20613] text-white'
                    : isPast
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-[#f4f4f4] text-[#5a5859]'
                }`}
              >
                <StepIcon strokeWidth={2} size={16} />
              </div>
              <span
                className={`text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
                  isActive ? 'text-[#e20613]' : 'text-[#5a5859]'
                }`}
              >
                {step.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
