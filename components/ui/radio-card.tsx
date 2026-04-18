"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Option {
  id: string;
  title: string;
  description: string;
  disclaimer?: string;
}

export interface RadioCardProps {
  option: Option;
  checked: boolean;
  onChange: (id: string) => void;
  className?: string;
}

export function RadioCard({ option, checked, onChange, className }: RadioCardProps) {
  return (
    <motion.label 
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer rounded-2xl p-6 transition-all duration-300",
        checked 
          ? "bg-white border-2 border-primary shadow-apple-hover ring-4 ring-primary/10"
          : "bg-white/60 backdrop-blur-md border-2 border-[#dfdfdf] shadow-sm hover:shadow-apple hover:border-[#dfdfdf]",
        className
      )}
    >
      <div className="flex-1 pr-6 order-2 sm:order-1 mt-4 sm:mt-0">
        <span className={cn(
          "block text-xl font-bold mb-2 transition-colors",
          checked ? "text-primary" : "text-[#363636]"
        )}>
          {option.title}
        </span>
        <p className={cn(
          "text-sm transition-colors",
          checked ? "text-[#565656]" : "text-[#565656]",
          option.disclaimer ? "mb-3" : ""
        )}>
          {option.description}
        </p>
        {option.disclaimer && (
          <p className="text-xs italic text-[#565656]">Note: {option.disclaimer}</p>
        )}
      </div>
      
      <div className="relative order-1 sm:order-2 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors shrink-0" 
        style={{
          borderColor: checked ? 'var(--color-primary)' : '#565656',
          backgroundColor: checked ? 'var(--color-primary)' : 'transparent',
        }}
      >
        <input 
          type="radio" 
          name="goal" 
          className="sr-only peer" 
          checked={checked} 
          onChange={() => onChange(option.id)}
        />
        <motion.div
           initial={false}
           animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="text-white"
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      </div>
    </motion.label>
  );
}
