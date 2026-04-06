"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref"> {
  label: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("group flex flex-col gap-1.5", className)}
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
          {label}
        </label>
        <div className="relative">
          <input 
            ref={ref}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium transition-all shadow-sm hover:shadow-md"
            {...props}
          />
        </div>
      </motion.div>
    );
  }
);
Input.displayName = "Input";
