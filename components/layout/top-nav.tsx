'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';

export function TopNav() {
  const router = useRouter();
  const resetData = useCalculatorStore((state) => state.resetData);

  const handleReset = () => {
    resetData();
    router.push('/');
  };

  const handleSaveProgress = () => {
    alert("Progress is automatically saved to your browser!");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md flex justify-between items-center px-10 py-6 border-b-0 font-inter tracking-tight">
      <Link href="/" className="text-xl font-bold uppercase tracking-tighter text-black dark:text-white">
        Battery Storage
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <button onClick={handleReset} className="text-neutral-500 hover:text-black transition-colors duration-200">
          Reset Data
        </button>
        <Link href="#" className="text-neutral-500 hover:text-black transition-colors duration-200">
          Resources
        </Link>
        <Link href="#" className="text-neutral-500 hover:text-black transition-colors duration-200">
          Support
        </Link>
      </div>
      <button onClick={handleSaveProgress} className="bg-black text-white px-6 py-2 text-sm font-bold active:opacity-70 transition-opacity border-black hover:bg-white hover:text-black border">
        Save Progress
      </button>
    </nav>
  );
}
