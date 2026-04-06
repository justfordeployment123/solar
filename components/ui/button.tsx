"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', fullWidth = false, className, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full px-6 py-3 overflow-hidden group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary";
    
    const variants = {
      primary: "bg-primary text-white shadow-apple hover:shadow-apple-hover border border-transparent",
      secondary: "bg-secondary text-white shadow-apple hover:shadow-apple-hover border border-transparent",
      outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary/5",
      ghost: "bg-transparent text-slate-500 hover:text-primary hover:bg-slate-100",
      glass: "glass text-slate-800 hover:bg-white/80",
    };

    return (
      <motion.button 
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], fullWidth ? "w-full" : "", className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 rounded-full" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
