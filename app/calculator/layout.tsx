'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TopNav } from '@/components/layout/top-nav';
import { SideNav } from '@/components/layout/side-nav';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Check } from 'lucide-react';

const steps = [
  { id: '1', title: 'Why a Battery?', icon: Check },
  { id: '2', title: 'System Details', icon: Check },
  { id: '3', title: 'Results', icon: Check },
];

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  let currentIndex = 0;
  if (pathname.includes('/step-1')) currentIndex = 0;
  else if (pathname.includes('/step-2')) currentIndex = 1;
  else if (pathname.includes('/step-3')) currentIndex = 2; // Although results is step-3 or results.
  else if (pathname.includes('/results')) currentIndex = 2;

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex flex-col font-inter text-[#1a1c1c]">
      <TopNav />
      
      <div className="flex flex-1 pt-[88px]">
        <SideNav steps={steps} currentStepIndex={currentIndex} />
        
        <main className="flex-1 w-full pb-32 md:pb-12">
          {children}
        </main>
      </div>
      
      <MobileBottomNav steps={steps} currentStepIndex={currentIndex} />
    </div>
  );
}
