"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Copy, BatteryCharging } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "energy-solutions-gmbh";
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/i/${slug}`);
  }, [slug]);

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      alert("URL in die Zwischenablage kopiert!");
    }
  };

  return (
    <>
      {/* Top stripe */}
      <div className="fixed top-0 left-0 right-0 z-40 flex w-full h-[6px]">
        <div className="flex-1 bg-[#e20613]" />
        <div className="flex-1 bg-[#d2d700]" />
        <div className="flex-1 bg-[#ffdb00]" />
      </div>

      {/* Header */}
      <header className="fixed top-[6px] left-0 right-0 w-full z-40 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link prefetch={false} href="/" className="flex items-center gap-3">
            <img
              src="/solar-logo.svg"
              alt="MySolar PV Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline text-[#5a5859] ml-2 text-xs font-bold uppercase tracking-[0.18em]">
              Partner-Portal
            </span>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 pt-32 pb-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-[#e20613] flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
        </div>

        <div className="inline-flex items-center gap-2 bg-[#fff5f5] border border-[#e20613]/20 px-3 py-1 mb-6">
          <span className="w-2 h-2 bg-[#e20613]" />
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
            Fertig
          </span>
        </div>

        <h1 className="text-[2.75rem] md:text-[4.25rem] font-bold tracking-tight text-[#1a1a1a] leading-[1.02] mb-6">
          Erfolgreich <span className="text-[#e20613]">erstellt</span>
        </h1>

        <p className="text-lg text-[#5a5859] max-w-xl leading-relaxed mb-12 font-medium">
          Ihr individueller Batteriespeicher-Rechner wurde erfolgreich generiert.
          Sie können ihn nun mit Ihren Kunden teilen.
        </p>

        <div className="relative bg-white border border-[#e5e5e5] p-8 mb-12 w-full max-w-xl text-left">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#e20613]" />
            Ihr persönlicher Link
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <p className="text-[#1a1a1a] font-mono font-semibold text-sm md:text-base break-all bg-[#fafafa] p-4 border border-[#e5e5e5] flex-grow">
              {url}
            </p>
            <button
              onClick={copyToClipboard}
              className="p-4 bg-[#e20613] text-white hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-[0.18em] text-xs"
              title="In die Zwischenablage kopieren"
            >
              <Copy className="w-4 h-4" />
              <span className="md:hidden">Kopieren</span>
            </button>
          </div>
        </div>

        <Link prefetch={false} href={`/i/${slug}/step-1`}>
          <Button variant="primary">
            Rechner starten <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </main>
    </>
  );
}

export default function InstallersSuccessPage() {
  return (
    <div className="bg-white min-h-screen text-[#1a1a1a] font-opensans flex flex-col items-center justify-center relative overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
