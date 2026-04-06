"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TopNav } from '@/components/layout/top-nav';
import { SideNav } from '@/components/layout/side-nav';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Target, Zap, BarChart3 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const steps = [
  { id: '1', title: 'Your Goals', icon: Target },
  { id: '2', title: 'System Details', icon: Zap },
  { id: '3', title: 'Results Dashboard', icon: BarChart3 },
];

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  let currentIndex = 0;
  if (pathname.includes('/step-1')) currentIndex = 0;
  else if (pathname.includes('/step-2')) currentIndex = 1;
  else if (pathname.includes('/step-3') || pathname.includes('/results')) currentIndex = 2;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
      
      <TopNav />
      
      <div className="flex flex-1 pt-[88px] md:pt-[104px] max-w-[1400px] mx-auto w-full relative z-10">
        <SideNav steps={steps} currentStepIndex={currentIndex} />
        
        <main className="flex-1 w-full pb-32 lg:pb-12 h-content lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <MobileBottomNav steps={steps} currentStepIndex={currentIndex} />
    </div>
  );
}
