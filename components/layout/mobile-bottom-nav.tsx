"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
      <div className="glass shadow-apple-hover rounded-[2rem] px-4 py-3 flex justify-between items-center pointer-events-auto border border-white/50 bg-white/70">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const StepIcon = step.icon;
          return (
            <Link 
              key={step.id} 
              href={`#${step.id}`}
              className="relative flex flex-col items-center justify-center p-2 rounded-2xl flex-1"
            >
              {isActive && (
                <motion.div 
                  layoutId="mobile-active-bg"
                  className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-10 border border-slate-100"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <motion.div 
                animate={{ 
                  color: isActive ? 'var(--color-primary)' : '#94a3b8',
                  scale: isActive ? 1.1 : 1
                }}
                className="mb-1"
              >
                <StepIcon strokeWidth={isActive ? 2.5 : 2} size={22} />
              </motion.div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400'
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
