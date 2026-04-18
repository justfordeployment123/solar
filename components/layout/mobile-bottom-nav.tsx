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
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 pointer-events-none">
      <div className="glass  ] px-4 py-3 flex justify-between items-center pointer-events-auto border border-white/50 bg-white/70">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const StepIcon = step.icon;
          return (
            <Link 
              key={step.id} 
              href={`#${step.id}`}
              className="relative flex flex-col items-center justify-center p-2  flex-1"
            >
              {isActive && (
                <div 
                  
                  className="absolute inset-0 bg-white   -z-10 border border-[#ffffff]"
                   />
              )}
              <div 
                 className="mb-1"
              >
                <StepIcon strokeWidth={isActive ? 2.5 : 2} size={22} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight  ${
                isActive ? 'text-primary' : 'text-[#565656]'
              }`}>
                {step.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
