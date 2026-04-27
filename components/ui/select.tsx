"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "ref"> {
  label: string;
  options: SelectOption[];
  tooltipText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, tooltipText, className, ...props }, ref) => {
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
          <select
            ref={ref}
            className="w-full bg-white border border-[#e5e5e5] py-3.5 px-4 pr-10 outline-none focus:border-[#e20613] text-[#1a1a1a] font-semibold text-[0.95rem] transition-colors appearance-none cursor-pointer"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#5a5859]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
