"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "energy-solutions-gmbh";
  const url = typeof window !== "undefined" ? `${window.location.origin}/i/${slug}` : `https://example.com/i/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("URL in die Zwischenablage kopiert!");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#ffffff] border-b border-[#dfdfdf] px-6 md:px-12 py-6 flex justify-between items-center text-center mx-auto max-w-7xl relative">
        <Link prefetch={false} href="/" className="text-xl font-black uppercase tracking-tight text-[#363636] mx-auto md:mx-0">
          Solar PV<span className="text-primary ml-1"> Partner-Portal</span>
        </Link>
      </header>

      <main className="w-full max-w-screen-md px-6 py-32 text-center relative z-10 flex flex-col items-center">
        <div className="relative mb-12">
          <CheckCircle className="w-24 h-24 text-[#e12029] relative" strokeWidth={2} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#363636] mb-6">
          Erfolg!
        </h1>
        
        <p className="text-xl text-[#565656] max-w-2xl mx-auto leading-relaxed mb-12">
          Ihr individueller Batteriespeicher-Rechner wurde erfolgreich generiert. Sie können ihn nun mit Ihren Kunden teilen.
        </p>

        <div className="bg-[#ffffff] border border-[#dfdfdf] p-8 mb-12 flex flex-col gap-4 max-w-lg mx-auto text-left relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Share2 className="w-24 h-24" />
          </div>
          <p className="text-xs text-primary font-black uppercase tracking-widest relative z-10">Ihr persönlicher Link</p>
          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10 w-full">
            <p className="text-[#363636] font-mono font-medium text-sm md:text-base break-all bg-white p-4 border border-[#dfdfdf] flex-grow w-full">
              {url}
            </p>
            <button onClick={copyToClipboard} className="p-4 bg-primary text-white hover:bg-primary/90 w-full md:w-auto" title="In die Zwischenablage kopieren">
              <Copy className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        <div>
          <Link prefetch={false} href={`/i/${slug}/step-1`}>
            <Button variant="primary" className="px-10 py-6 text-lg uppercase tracking-widest gap-3 bg-[#363636] hover:bg-[#363636] border-transparent text-white">
              Rechner starten
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}

export default function InstallersSuccessPage() {
  return (
    <div className="bg-[#ffffff] min-h-screen text-[#363636] font-sans flex flex-col items-center justify-center relative overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
