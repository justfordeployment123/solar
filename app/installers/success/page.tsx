"use client";

import Link from 'next/link';
import { CheckCircle, ArrowRight, Share2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function InstallersSuccessPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-green-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />

      <header className="fixed top-0 w-full z-50 glass border-b border-white/50 px-6 md:px-12 py-6 flex justify-between items-center text-center mx-auto max-w-7xl relative">
        <Link href="/" className="text-xl font-black uppercase tracking-tight text-slate-900 mx-auto md:mx-0">
          Solar PV<span className="text-primary ml-1">Partner Portal</span>
        </Link>
      </header>

      <main className="w-full max-w-screen-md px-6 py-32 text-center relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
          className="relative mb-12"
        >
          <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl" />
          <CheckCircle className="w-24 h-24 text-green-500 relative" strokeWidth={2} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6"
        >
          Success!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Your customized battery storage calculator has been successfully generated. You can now start sharing it with your clients.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass border border-white shadow-apple-hover p-8 rounded-3xl mb-12 flex flex-col gap-4 max-w-lg mx-auto text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Share2 className="w-24 h-24" />
          </div>
          <p className="text-xs text-primary font-black uppercase tracking-widest relative z-10">Your Unique Link</p>
          <div className="flex items-center gap-4 relative z-10">
            <p className="text-slate-800 font-mono font-medium text-sm md:text-base break-all bg-white p-4 rounded-xl border border-slate-200 flex-grow shadow-sm">
              https://featurenotimplemented.com/i/energy-solutions-gmbh
            </p>
            <button className="p-4 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition-colors" title="Copy to clipboard">
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/calculator/step-1">
            <Button variant="primary" className="px-10 py-6 text-lg shadow-apple-hover uppercase tracking-widest gap-3 rounded-full hover:scale-105 transition-transform bg-slate-900 hover:bg-slate-800 border-transparent text-white">
              Launch Calculator
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </main>

    </div>
  );
}
