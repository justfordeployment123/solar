"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { X, BatteryCharging } from 'lucide-react';

export function GlobalFooter() {
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/' || pathname === '';

  const homeLink = activeInstaller && activeInstaller.websiteUrl
    ? activeInstaller.websiteUrl
    : "https://www.mysolar-pv.de";

  const handleImpressumClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (activeInstaller) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  if (isLandingPage) return null;

  return (
    <>
      <footer className="w-full bg-[#1a1a1a] text-white mt-auto z-10 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {activeInstaller?.logoUrl ? (
              <img
                src={activeInstaller.logoUrl}
                alt={`${activeInstaller.companyName} Logo`}
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : (
              <img
                src="/solar-logo.svg"
                alt="MySolar PV Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="w-8 h-[3px] bg-[#e20613]" />
            <span className="w-8 h-[3px] bg-[#d2d700]" />
            <span className="w-8 h-[3px] bg-[#ffdb00]" />
          </div>

          <div className="flex gap-6 md:gap-8 items-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/70">
            <Link
              prefetch={false}
              href={homeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ffdb00] transition-colors"
            >
              Homepage
            </Link>

            {activeInstaller ? (
              <button
                onClick={handleImpressumClick}
                className="hover:text-[#ffdb00] transition-colors font-bold uppercase tracking-[0.18em] text-[0.7rem]"
              >
                Impressum
              </button>
            ) : (
              <Link
                prefetch={false}
                href="https://www.mysolar-pv.de/impressum.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffdb00] transition-colors"
              >
                Impressum
              </Link>
            )}
          </div>
        </div>
      </footer>

      {modalOpen && activeInstaller && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full relative border border-[#e5e5e5]">
            <div className="h-[4px] flex">
              <span className="flex-1 bg-[#e20613]" />
              <span className="flex-1 bg-[#d2d700]" />
              <span className="flex-1 bg-[#ffdb00]" />
            </div>
            <div className="p-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#5a5859] hover:text-[#e20613] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613] mb-3">
                Impressum
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                {activeInstaller.companyName}
              </h2>
              <div className="text-sm text-[#1a1a1a] space-y-2">
                <p>
                  <span className="font-semibold">Kontakt:</span>{' '}
                  {activeInstaller.phone || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">E-Mail:</span>{' '}
                  {activeInstaller.email}
                </p>
              </div>
              <p className="text-xs text-[#5a5859] mt-6 pt-6 border-t border-[#e5e5e5]">
                In Partnerschaft mit My Solar GmbH.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
