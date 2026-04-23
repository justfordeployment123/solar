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
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer p-6 transition-colors",
        checked
          ? "bg-white border-2 border-[#e20613]"
          : "bg-white border-2 border-[#e5e5e5] hover:border-[#1a1a1a]",
        className
      )}
    >
      {/* Active side bar */}
      {checked && (
        <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#e20613]" />
      )}

      <div className="flex-1 pr-6 order-2 sm:order-1 mt-4 sm:mt-0">
        <span
          className={cn(
            "block text-lg md:text-xl font-bold tracking-tight mb-2 transition-colors",
            checked ? "text-[#e20613]" : "text-[#1a1a1a]"
          )}
        >
          {option.title}
        </span>
        <p
          className={cn(
            "text-sm md:text-[0.95rem] text-[#5a5859] font-medium leading-relaxed",
            option.disclaimer ? "mb-3" : ""
          )}
        >
          {option.description}
        </p>
        {option.disclaimer && (
          <p className="text-xs italic text-[#5a5859]">Hinweis: {option.disclaimer}</p>
        )}
      </div>

      <div
        className={cn(
          "relative order-1 sm:order-2 flex items-center justify-center w-8 h-8 border-2 shrink-0 transition-colors",
          checked
            ? "bg-[#e20613] border-[#e20613]"
            : "bg-white border-[#e5e5e5] group-hover:border-[#1a1a1a]"
        )}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={() => onChange(option.id)}
        />
        <div className={cn("text-white transition-opacity", checked ? "opacity-100" : "opacity-0")}>
          <Check size={16} strokeWidth={3} />
        </div>
      </div>
    </label>
  );
}
