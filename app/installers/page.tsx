"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UploadCloud, ArrowRight, Image as ImageIcon, Check, X, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function InstallersPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans relative overflow-hidden flex flex-col">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%]  bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute center right-[-10%] w-[40%] h-[50%]  bg-tertiary/10 blur-[150px] pointer-events-none" />

      <header className="fixed top-0 w-full z-50 glass border-b border-white/50 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4">
            <Image priority src="/solar-logo.svg" alt="MySolar-PV Logo" width={120} height={32} className="h-6 md:h-8 w-auto object-contain opacity-80  " />
            <div className="w-[1px] h-6 bg-slate-300"></div>
            <Image priority src="/ngen-logo.svg" alt="Ngen Logo" width={100} height={32} className="h-6 md:h-8 w-auto object-contain opacity-80  " />
          </Link>
          <Link href="/" className="group flex items-center justify-center gap-2 px-4 py-2  hover:bg-slate-100   text-slate-500 hover:text-slate-800">
            <span className="hidden md:inline font-bold uppercase tracking-widest text-[10px]">Cancel</span>
            <X className="w-4 h-4  " />
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24 md:pt-40 max-w-6xl mx-auto px-6 md:px-12 w-full relative z-10 flex-grow">
        <div    >
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#e12029] mb-6">
              Partner Portal
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mx-auto md:mx-0">
              Create your white-labeled instance of the battery storage calculator. Generate a customized tool to capture high-quality leads.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <form className="lg:col-span-8 flex flex-col gap-10" action="/installers/success">
              <div className="glass  ] p-8 md:p-10 border border-white">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                  <div className="w-2 h-2  bg-primary" /> Company Details
                </h3>
                
                <div className="space-y-8">
                  <Input label="Company Name" id="companyName" name="companyName" placeholder="Energy Solutions GmbH" required />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="Telephone Number" id="tel" name="tel" placeholder="+44 ..." type="tel" />
                    <Input label="Mobile Number" id="mobile" name="mobile" placeholder="+44 ..." type="tel" />
                  </div>

                  <Input label="Email Address" id="email" name="email" placeholder="admin@company.com" type="email" required />
                  
                  <div className="pt-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1 mb-2 block">
                      Company Logo
                    </label>
                    <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300  bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30  cursor-pointer group">
                      <input className="hidden" id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                      <div className="w-16 h-16  bg-white  flex items-center justify-center mb-4  ">
                        <UploadCloud className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">SVG, PNG, or JPG (Max 2MB)</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" className="gap-3  text-base uppercase tracking-widest bg-[#e12029] text-white w-full md:w-auto py-4 px-10 border-transparent hover:opacity-95">
                  Generate Calculator <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            <aside className="lg:col-span-4 space-y-8">
              <div className="glass   p-8 border border-white">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2  bg-[#e12029]" /> Visual Preview
                </div>
                <div className="aspect-square bg-slate-50  flex items-center justify-center relative border border-slate-200 overflow-hidden mb-6 ">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo Preview" fill style={{ objectFit: 'contain' }} className="p-8" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 gap-3">
                      <Building2 className="w-12 h-12 opacity-50" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Setup Needed</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  This logo will appear proudly on the custom interface shared with your clients.
                </p>
              </div>

              <div className="glass   p-8 border border-white">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2  bg-[#e12029]" /> Partner Benefits
                </div>
                <ul className="space-y-4">
                  {[
                    "White-label branding for all exports",
                    "Custom localized installation costs",
                    "Lead generation dashboard access",
                    "Priority support and onboarding"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <div className="mt-0.5 p-1  bg-green-100 text-green-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="glass border-t border-white/50 w-full py-8 mt-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 relative z-10">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
          © 2026 Solar PV
        </div>
        <nav className="flex gap-8 mt-4 md:mt-0">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary ">
            Visit Homepage
          </Link>
        </nav>
      </footer>
    </div>
  );
}
