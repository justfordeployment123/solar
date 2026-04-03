'use client';

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
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md flex justify-between items-center px-4 md:px-10 py-6 border-b-0 font-inter tracking-tight">
      <Link href="/" className="flex items-center gap-3 md:gap-6">
        <Image src="/solar-logo.svg" alt="MySolar-PV Logo" width={140} height={40} className="h-6 md:h-8 w-auto object-contain brightness-0 invert" />
        <div className="w-[1px] h-6 md:h-8 bg-neutral-600"></div>
        <Image src="/ngen-logo.svg" alt="Ngen Logo" width={120} height={40} className="h-6 md:h-8 w-auto object-contain brightness-0 invert" />
      </Link>
      <div className="flex items-center justify-end">
        <button onClick={handleReset} className="text-neutral-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors duration-200 flex items-center justify-center p-0 md:p-0 rounded-full">
          <span className="hidden md:inline">Reset Data</span>
          <RotateCcw className="w-5 h-5 md:hidden" />
        </button>
      </div>
    </nav>
  );
}
