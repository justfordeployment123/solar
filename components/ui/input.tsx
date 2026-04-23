"use client";

import React from 'react';
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
      <div className={cn("group flex flex-col gap-2", className)}>
        <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className="w-full bg-white border border-[#e5e5e5] py-3.5 px-4 outline-none focus:border-[#e20613] text-[#1a1a1a] font-semibold text-[0.95rem] transition-colors placeholder:text-[#a1a1a1] placeholder:font-medium"
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
