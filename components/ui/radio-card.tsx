"use client";

import React from 'react';
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
    <label 
        className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer  p-6  ",
        checked 
          ? "bg-white border-2 border-primary"
          : "bg-[#ffffff] border-2 border-[#dfdfdf]  hover: hover:border-[#dfdfdf]",
        className
      )}
    >
      <div className="flex-1 pr-6 order-2 sm:order-1 mt-4 sm:mt-0">
        <span className={cn(
          "block text-xl font-bold mb-2 ",
          checked ? "text-primary" : "text-[#363636]"
        )}>
          {option.title}
        </span>
        <p className={cn(
          "text-sm ",
          checked ? "text-[#565656]" : "text-[#565656]",
          option.disclaimer ? "mb-3" : ""
        )}>
          {option.description}
        </p>
        {option.disclaimer && (
          <p className="text-xs italic text-[#565656]">Hinweis: {option.disclaimer}</p>
        )}
      </div>
      
      <div className="relative order-1 sm:order-2 flex items-center justify-center w-8 h-8  border-2  shrink-0" 
        style={{
          borderColor: checked ? 'var(--color-primary)' : '#565656',
          backgroundColor: checked ? 'var(--color-primary)' : 'transparent',
        }}
      >
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={() => onChange(option.id)}
        />
        <div
              className="text-white"
        >
          <Check size={16} strokeWidth={3} />
        </div>
      </div>
    </label>
  );
}
