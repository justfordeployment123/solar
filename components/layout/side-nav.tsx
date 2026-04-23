"use client";

import React from 'react';
import Link from 'next/link';
import { useCalculatorStore } from '@/store/calculatorStore';

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
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);
  const basePath = activeInstaller ? `/i/${activeInstaller.generatedSlug}` : '/calculator';

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-88px)] w-72 bg-white border-r border-[#e5e5e5] p-8 sticky top-[88px] overflow-y-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-[#e20613]" />
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#e20613]">
            Rechner
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
          Schritt-Übersicht
        </h2>
        <p className="text-sm text-[#5a5859] mt-2 font-medium">
          Schritt {currentStepIndex + 1} von {steps.length}
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const stepPath = step.id === '3' ? 'results' : `step-${step.id}`;

          return (
            <Link
              key={step.id}
              href={`${basePath}/${stepPath}`}
              className={`relative flex items-center gap-4 p-4 border transition-colors group ${
                isActive
                  ? 'border-[#e20613] bg-[#fff5f5] text-[#e20613] font-bold'
                  : isPast
                  ? 'border-transparent text-[#1a1a1a] hover:border-[#e5e5e5] hover:bg-[#fafafa]'
                  : 'border-transparent text-[#5a5859] hover:border-[#e5e5e5] hover:bg-[#fafafa]'
              }`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 transition-colors ${
                  isActive
                    ? 'bg-[#e20613] text-white'
                    : isPast
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-[#f4f4f4] text-[#5a5859]'
                }`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] opacity-70">
                  Schritt {step.id}
                </span>
                <span className="font-semibold text-sm tracking-tight">{step.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom brand stripe */}
      <div className="mt-8 pt-6 border-t border-[#e5e5e5] flex items-center gap-1">
        <span className="w-6 h-[3px] bg-[#e20613]" />
        <span className="w-6 h-[3px] bg-[#d2d700]" />
        <span className="w-6 h-[3px] bg-[#ffdb00]" />
      </div>
    </aside>
  );
}
