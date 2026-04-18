"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export function ProgressHeader({ currentStep, totalSteps, title, description }: ProgressHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="h-1.5 flex-1 bg-[#dfdfdf] rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#363636] mb-4"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl text-[#565656] max-w-2xl leading-relaxed"
      >
        {description}
      </motion.p>
    </motion.header>
  );
}
