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
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);

  const homeHref = activeInstaller ? `/i/${activeInstaller.generatedSlug}` : '/';

  const handleReset = () => {
    resetData();
    router.push(homeHref);
  };

  return (
    <nav 
         className="w-full py-6 left-0 right-0 bg-transparent flex justify-between items-center px-6 md:px-8 z-50 absolute top-0"
    >
      <Link prefetch={false} href={homeHref} className="flex items-center gap-4">
        {/* We use neutral filters so it adapts to a light theme */}
        {activeInstaller?.logoUrl ? (
          <img 
            src={activeInstaller.logoUrl} 
            alt={`${activeInstaller.companyName} Logo`} 
            className="h-14 md:h-16 w-auto object-contain opacity-80" 
          />
        ) : (
          <Image 
            src="/solar-logo.svg" 
            alt="MySolar-PV Logo" 
            width={120} 
            height={48} 
            className="h-10 md:h-12 w-auto object-contain opacity-80" 
          />
        )}
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
