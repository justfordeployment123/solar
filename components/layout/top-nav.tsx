"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function TopNav() {
  const router = useRouter();
  const resetData = useCalculatorStore((state) => state.resetData);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReset = () => {
    resetData();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 z-50 flex justify-between items-center px-6 md:px-8 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-apple max-w-5xl mx-auto left-4 right-4 top-4 rounded-3xl py-3 border border-slate-200/50' 
          : 'w-full py-6 left-0 right-0 bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-4">
        {/* We use neutral filters so it adapts to a light theme */}
        <Image 
          src="/solar-logo.svg" 
          alt="MySolar-PV Logo" 
          width={120} 
          height={32} 
          className="h-6 md:h-8 w-auto object-contain transition-all hover:scale-105 opacity-80" 
        />
        <div className="w-[1px] h-6 bg-slate-300"></div>
        <Image 
          src="/ngen-logo.svg" 
          alt="Ngen Logo" 
          width={100} 
          height={32} 
          className="h-6 md:h-8 w-auto object-contain transition-all hover:scale-105 opacity-80" 
        />
      </Link>
      
      <div className="flex items-center justify-end">
        <button 
          onClick={handleReset} 
          className="group flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors duration-200 text-slate-500 hover:text-red-500"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
          <span className="hidden md:inline font-bold uppercase tracking-widest text-[10px]">Reset</span>
        </button>
      </div>
    </motion.nav>
  );
}
