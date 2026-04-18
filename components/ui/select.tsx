"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div 
          className={cn("group flex flex-col gap-1.5", className)}
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-[#565656] ml-1">
          {label}
        </label>
        <div className="relative">
          <select 
            ref={ref}
            className="w-full bg-white border border-[#dfdfdf]  py-3 px-4 pr-10 outline-none focus:border-primary text-[#363636] font-medium   hover: appearance-none cursor-pointer"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#565656]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
