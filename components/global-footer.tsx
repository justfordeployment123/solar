"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCalculatorStore } from '@/store/calculatorStore';
import { X } from 'lucide-react';

export function GlobalFooter() {
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);
  const [modalOpen, setModalOpen] = useState(false);

  const homeLink = activeInstaller && activeInstaller.websiteUrl
    ? activeInstaller.websiteUrl
    : "https://www.mysolar-pv.de";

  const handleImpressumClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (activeInstaller) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <>
      <footer className="w-full bg-[#d9d9d9] mt-auto pt-8 pb-32 lg:pb-8 px-6 md:px-12 text-sm text-[#363636] z-10 border-t border-[#dfdfdf]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            {activeInstaller?.logoUrl ? (
              <img 
                src={activeInstaller.logoUrl} 
                alt={`${activeInstaller.companyName} Logo`} 
                className="h-12 md:h-14 w-auto object-contain" 
              />
            ) : (
              <img 
                src="/solar-logo.svg" 
                alt="MySolar PV Logo" 
                className="h-8 md:h-10 w-auto object-contain" 
              />
            )}
          </div>
          
          <div className="flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-[#565656]">
            <Link 
              prefetch={false}
              href={homeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e12029] transition-colors"
            >
              Visit our homepage
            </Link>
            
            {activeInstaller ? (
              <button 
                onClick={handleImpressumClick}
                className="hover:text-[#e12029] transition-colors font-bold uppercase tracking-widest text-xs"
              >
                Impressum
              </button>
            ) : (
              <Link 
                prefetch={false}
                href="https://www.mysolar-pv.de/impressum.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e12029] transition-colors"
              >
                Impressum
              </Link>
            )}
          </div>
        </div>
      </footer>

      {/* Impressum Modal */}
      {modalOpen && activeInstaller && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#e12029] mb-4">
              Impressum
            </h2>
            <div className="text-sm font-medium text-[#363636] space-y-4">
              <p>Provided by {activeInstaller.companyName}.</p>
              <p>Contact: {activeInstaller.phone || "N/A"} | {activeInstaller.email}</p>
              <p className="text-xs text-[#565656] mt-4 pt-4 border-t border-[#dfdfdf]">
                In partnership with My Solar GmbH.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
