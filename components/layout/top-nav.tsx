"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { RotateCcw, BatteryCharging } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-[#e5e5e5]">
      {/* Tri-color accent stripe */}
      <div className="flex w-full h-[4px]">
        <div className="flex-1 bg-[#e20613]" />
        <div className="flex-1 bg-[#d2d700]" />
        <div className="flex-1 bg-[#ffdb00]" />
      </div>

      <div className="flex justify-between items-center px-6 md:px-8 py-4">
        <Link prefetch={false} href={homeHref} className="flex items-center gap-3">
          {activeInstaller?.logoUrl ? (
            <img
              src={activeInstaller.logoUrl}
              alt={`${activeInstaller.companyName} Logo`}
              className="h-10 md:h-12 w-auto object-contain"
            />
          ) : (
            <>
              <div className="w-9 h-9 bg-[#e20613] flex items-center justify-center">
                <BatteryCharging className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-[#1a1a1a] text-lg hidden sm:inline">
                MySolar<span className="text-[#e20613]">·PV</span>
              </span>
            </>
          )}
        </Link>

        <button
          onClick={handleReset}
          className="group flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] hover:border-[#e20613] text-[#5a5859] hover:text-[#e20613] transition-colors"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
          <span className="hidden md:inline font-bold uppercase tracking-[0.18em] text-[10px]">
            Zurücksetzen
          </span>
        </button>
      </div>
    </nav>
  );
}
