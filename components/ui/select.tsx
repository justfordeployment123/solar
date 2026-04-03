import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className={`group ${className}`}>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
        {label}
      </label>
      <select 
        className="w-full bg-transparent border-0 border-b border-outline py-3 px-0 focus:ring-0 focus:border-black text-black font-medium appearance-none cursor-pointer"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
