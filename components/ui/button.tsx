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
    
    const baseStyles = "relative inline-flex items-center justify-center font-semibold    px-6 py-3 overflow-hidden group ";
    
    const variants = {
      primary: "bg-primary text-white  hover: border border-transparent",
      secondary: "bg-secondary text-white  hover: border border-transparent",
      outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary/5",
      ghost: "bg-transparent text-[#565656] hover:text-primary hover:bg-[#ffffff]",
      glass: "glass text-[#363636] hover:bg-white/80",
    };

    return (
      <button 
        ref={ref}
          className={cn(baseStyles, variants[variant], fullWidth ? "w-full" : "", className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-white/20 translate-y-full     z-0 " />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
