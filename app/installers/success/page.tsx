"use client";

import Link from 'next/link';
import { CheckCircle, ArrowRight, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstallersSuccessPage() {
  return (
    <div className="bg-[#ffffff] min-h-screen text-[#363636] font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%]  bg-[#e12029]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%]  bg-primary/10 blur-[150px] pointer-events-none" />

      <header className="fixed top-0 w-full z-50 glass border-b border-white/50 px-6 md:px-12 py-6 flex justify-between items-center text-center mx-auto max-w-7xl relative">
        <Link href="/" className="text-xl font-black uppercase tracking-tight text-[#363636] mx-auto md:mx-0">
          Solar PV<span className="text-primary ml-1"> Partner-Portal</span>
        </Link>
      </header>

      <main className="w-full max-w-screen-md px-6 py-32 text-center relative z-10 flex flex-col items-center">
        <div 
             className="relative mb-12"
        >
          <div className="absolute -inset-4 bg-[#e12029]/20  blur-xl" />
          <CheckCircle className="w-24 h-24 text-[#e12029] relative" strokeWidth={2} />
        </div>
        
        <h1 
             className="text-5xl md:text-7xl font-black tracking-tight text-[#363636] mb-6"
        >
          Erfolg!
        </h1>
        
        <p 
             className="text-xl text-[#565656] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Ihr individueller Batteriespeicher-Rechner wurde erfolgreich generiert. Sie können ihn nun mit Ihren Kunden teilen.
        </p>

        <div 
             className="glass border border-white  p-8  mb-12 flex flex-col gap-4 max-w-lg mx-auto text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Share2 className="w-24 h-24" />
          </div>
          <p className="text-xs text-primary font-black uppercase tracking-widest relative z-10">Ihr persönlicher Link</p>
          <div className="flex items-center gap-4 relative z-10">
            <p className="text-[#363636] font-mono font-medium text-sm md:text-base break-all bg-white p-4  border border-[#dfdfdf] flex-grow ">
              https://featurenotimplemented.com/i/energy-solutions-gmbh
            </p>
            <button className="p-4 bg-primary text-white   hover:bg-primary/90 " title="In die Zwischenablage kopieren">
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
             >
          <Link href="/calculator/step-1">
            <Button variant="primary" className="px-10 py-6 text-lg  uppercase tracking-widest gap-3    bg-[#363636] hover:bg-[#363636] border-transparent text-white">
              Rechner starten
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </main>

    </div>
  );
}
