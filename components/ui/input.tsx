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
      <div 
          className={cn("group flex flex-col gap-1.5", className)}
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-[#565656] ml-1">
          {label}
        </label>
        <div className="relative">
          <input 
            ref={ref}
            className="w-full bg-white border border-[#dfdfdf]  py-3 px-4 outline-none focus:border-primary text-[#363636] font-medium   hover:"
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
