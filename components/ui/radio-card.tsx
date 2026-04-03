import React from 'react';

interface Option {
  id: string;
  title: string;
  description: string;
  disclaimer?: string;
}

interface RadioCardProps {
  option: Option;
  checked: boolean;
  onChange: (id: string) => void;
  className?: string;
}

export function RadioCard({ option, checked, onChange, className = '' }: RadioCardProps) {
  return (
    <label 
      className={`group flex items-start justify-between cursor-pointer border-b border-outline-variant/30 pb-8 transition-colors hover:border-black ${className}`}
    >
      <div className="flex-1 pr-10">
        <span className="block text-xl font-bold text-black mb-2">{option.title}</span>
        <p className={`text-sm text-neutral-500 ${option.disclaimer ? 'mb-3' : ''}`}>
          {option.description}
        </p>
        {option.disclaimer && (
          <p className="text-xs italic text-neutral-400">Note: {option.disclaimer}</p>
        )}
      </div>
      <div className="relative inline-flex items-center h-6 w-12 border border-black bg-white group-active:scale-95 transition-transform shrink-0">
        <input 
          type="radio" 
          name="goal" 
          className="sr-only peer" 
          checked={checked} 
          onChange={() => onChange(option.id)}
        />
        <div className={`w-full h-full absolute transition-colors ${checked ? 'bg-black' : ''}`}></div>
        <div className={`absolute left-1 top-1 w-4 h-4 transition-transform ${checked ? 'bg-white translate-x-6' : 'bg-black'}`}></div>
      </div>
    </label>
  );
}
