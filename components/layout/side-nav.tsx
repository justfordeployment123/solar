"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <aside className="hidden lg:flex flex-col h-[calc(100vh-88px)] w-72 bg-white border-r border-slate-200 p-8 sticky top-[88px] overflow-y-auto">
      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs font-bold text-primary uppercase tracking-widest mb-2"
        >
          Calculator
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black text-slate-900 tracking-tight"
        >
          Steps Overview
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-500 mt-2 font-medium"
        >
          Step {currentStepIndex + 1} of {steps.length}
        </motion.p>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          
          return (
            <Link 
              key={step.id} 
              href={`#${step.id}`}
              className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'text-primary bg-primary/5 font-bold shadow-sm' 
                  : isPast 
                    ? 'text-slate-600 hover:bg-slate-50' 
                    : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute inset-0 bg-white rounded-2xl border border-primary/20 shadow-apple-hover -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                isActive ? 'bg-primary text-white shadow-md' : isPast ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm tracking-wide z-10">{step.title}</span>
            </Link>
          );
        })}
      </nav>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (window.confirm("Are you sure you want to reset data?")) {
            window.location.href = '/';
          }
        }} 
        className="mt-8 flex items-center justify-center gap-2 py-4 border-2 border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest rounded-2xl group"
      >
        <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
        Reset Data
      </motion.button>
    </aside>
  );
}
