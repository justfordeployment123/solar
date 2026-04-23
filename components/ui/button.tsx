"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', fullWidth = false, className, ...props }, ref) => {

    const baseStyles =
      "relative inline-flex items-center justify-center font-bold uppercase tracking-[0.18em] text-xs md:text-sm px-7 py-4 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#e20613] text-white border-[#e20613] hover:bg-[#1a1a1a] hover:border-[#1a1a1a]",
      secondary:
        "bg-[#1a1a1a] text-white border-[#1a1a1a] hover:bg-[#e20613] hover:border-[#e20613]",
      outline:
        "bg-transparent text-[#1a1a1a] border-[#e5e5e5] hover:border-[#1a1a1a]",
      ghost:
        "bg-transparent text-[#5a5859] border-transparent hover:text-[#e20613]",
      glass:
        "bg-white text-[#1a1a1a] border-[#e5e5e5] hover:border-[#e20613]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], fullWidth ? "w-full" : "", className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
