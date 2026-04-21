"use client";

import React from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';

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
    <aside className="hidden lg:flex flex-col h-[calc(100vh-88px)] w-72 bg-white border-r border-[#dfdfdf] p-8 sticky top-[88px] overflow-y-auto">
      <div className="mb-10">
        <div 
            className="text-xs font-bold text-primary uppercase tracking-widest mb-2"
        >
          Calculator
        </div>
        <h2 
             className="text-2xl font-black text-[#363636] tracking-tight"
        >
          Steps Overview
        </h2>
        <p 
             className="text-sm text-[#565656] mt-2 font-medium"
        >
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          
          return (
            <Link 
              key={step.id} 
              href={`#${step.id}`}
              className={`relative flex items-center gap-4 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary group ${
                isActive 
                  ? 'text-primary bg-primary/5 font-bold ' 
                  : isPast 
                    ? 'text-[#565656] hover:bg-[#ffffff]' 
                    : 'text-[#565656] hover:bg-[#ffffff]'
              }`}
            >
              {isActive && (
                <div 
                  
                  className="absolute inset-0 bg-white  border border-primary/20  -z-10"
                   />
              )}
              
              <div className={`flex items-center justify-center w-8 h-8   ${
                isActive ? 'bg-primary text-white ' : isPast ? 'bg-[#dfdfdf] text-[#565656]' : 'bg-[#ffffff] text-[#565656]'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm tracking-wide z-10">{step.title}</span>
            </Link>
          );
        })}
      </nav>

      <button 
          onClick={() => {
          if (window.confirm("Are you sure you want to reset data?")) {
            window.location.href = '/';
          }
        }} 
        className="mt-8 flex items-center justify-center gap-2 py-4 border-2 border-[#dfdfdf] text-[#565656] text-xs font-bold hover:bg-[#ffffff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary uppercase tracking-widest group"
      >
        <RotateCcw className="w-4 h-4 group-hover:-rotate-90 " />
        Reset Data
      </button>
    </aside>
  );
}
