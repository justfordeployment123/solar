"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref"> {
  label: string;
  tooltipText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, tooltipText, className, ...props }, ref) => {
    return (
      <div className={cn("group flex flex-col gap-2", className)}>
        <div className="flex items-center gap-1.5">
          <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
            {label}
          </label>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">{tooltipText || "Informationen zu diesem Feld."}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
