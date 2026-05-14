"use client";

import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#363636]/60 backdrop-blur-sm" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-[#ffffff] shadow-2xl p-8 border border-[#dfdfdf] max-h-[90vh] overflow-y-auto" 
        style={{ animation: 'fade-in 150ms ease-out' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#e20613] transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-[#e20613]" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
            {title}
          </h2>
        </div>
        
        <div className="text-sm md:text-base text-[#5a5859] leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
