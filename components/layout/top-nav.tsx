"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { RotateCcw } from 'lucide-react';

export function TopNav() {
  const router = useRouter();
  const resetData = useCalculatorStore((state) => state.resetData);

  const handleReset = () => {
    resetData();
    router.push('/');
  };

  return (
    <nav 
         className="w-full py-6 left-0 right-0 bg-transparent flex justify-between items-center px-6 md:px-8 z-50 absolute top-0"
    >
      <Link href="/" className="flex items-center gap-4">
        {/* We use neutral filters so it adapts to a light theme */}
        <Image 
          src="/solar-logo.svg" 
          alt="MySolar-PV Logo" 
          width={120} 
          height={32} 
          className="h-6 md:h-8 w-auto object-contain   opacity-80" 
        />
        <div className="w-[1px] h-6 bg-[#dfdfdf]"></div>
        <Image 
          src="/ngen-logo.svg" 
          alt="Ngen Logo" 
          width={100} 
          height={32} 
          className="h-6 md:h-8 w-auto object-contain   opacity-80" 
        />
      </Link>
      
      <div className="flex items-center justify-end">
        <button 
          onClick={handleReset} 
          className="group flex items-center justify-center gap-2 px-4 py-2  hover:bg-[#ffffff]   text-[#565656] hover:text-[#e12029]"
        >
          <RotateCcw className="w-4 h-4  group-hover:-rotate-90" />
          <span className="hidden md:inline font-bold uppercase tracking-widest text-[10px]">Zurücksetzen</span>
        </button>
      </div>
    </nav>
  );
}
