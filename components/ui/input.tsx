import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className={`group ${className}`}>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
        {label}
      </label>
      <input 
        className="w-full bg-transparent border-0 border-b border-outline py-3 px-0 focus:ring-0 focus:border-black text-black font-medium"
        {...props}
      />
    </div>
  );
}
