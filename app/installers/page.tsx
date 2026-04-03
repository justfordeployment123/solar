'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UploadCloud, ArrowRight, Image as ImageIcon, Camera, Check, X } from 'lucide-react';
import { useState } from 'react';

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
    <div className="bg-white min-h-screen text-[#1a1c1c] font-inter">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-10 py-6 border-b-0">
        <Link href="/" className="flex items-center gap-6">
          <Image src="/solar-logo.svg" alt="MySolar-PV Logo" width={140} height={40} className="h-8 w-auto object-contain" />
          <div className="w-[1px] h-8 bg-neutral-300"></div>
          <Image src="/ngen-logo.svg" alt="Ngen Logo" width={120} height={40} className="h-8 w-auto object-contain" />
        </Link>
        <Link href="/" className="text-[#5e5e5e] hover:text-black transition-colors text-sm font-bold uppercase tracking-widest flex items-center justify-center p-2 md:p-0">
          <span className="hidden md:inline">Cancel</span>
          <X className="w-6 h-6 md:hidden" />
        </Link>
      </header>

      <main className="pt-40 max-w-screen-lg mx-auto px-8 pb-32">
        <header className="mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6">Partner Registration</h1>
          <p className="text-xl text-[#777777] max-w-2xl leading-relaxed">
            Create your white-labeled instance of the battery storage calculator. Enter your company details below to generate a customized tool for your clients.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-24">
          {/* Form Area */}
          <form className="md:col-span-8 flex flex-col gap-12" action="/installers/success">
            {/* Input Group: Company Name */}
            <div className="space-y-4">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="companyName">Company Name</label>
              <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="companyName" name="companyName" placeholder="Energy Solutions GmbH" type="text" required />
            </div>

            {/* Input Group: Contact Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="tel">Telephone Number</label>
                <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="tel" name="tel" placeholder="+44 ..." type="tel"/>
              </div>
              <div className="group">
                <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="mobile">Mobile Number</label>
                <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="mobile" name="mobile" placeholder="+44 ..." type="tel"/>
              </div>
            </div>

            <div className="group">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="email">Email Address</label>
              <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="email" name="email" placeholder="admin@company.com" type="email" required />
            </div>

            {/* File Upload Area */}
            <div className="space-y-4 pt-4">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777]">Company Logo</label>
              <div className="border border-dashed border-[#c6c6c6] p-12 text-center hover:border-black transition-colors cursor-pointer group">
                <input className="hidden" id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                <label className="cursor-pointer" htmlFor="logo-upload">
                  <UploadCloud className="w-9 h-9 text-[#777777] group-hover:text-black mb-4 mx-auto" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-[0.6875rem] text-[#777777] mt-2 uppercase tracking-tight">SVG, PNG, or JPG (Max 2MB)</p>
                </label>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button className="w-full md:w-auto px-12 py-5 bg-black text-white font-bold text-lg hover:bg-[#1a1c1c] border border-black transition-all duration-300 group flex items-center justify-center gap-4" type="submit">
                Generate My Calculator
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Sidebar / Metadata */}
          <aside className="md:col-span-4 space-y-12">
            <div className="space-y-4">
              <p className="text-[0.75rem] font-bold uppercase tracking-widest text-[#777777]">Visual Preview</p>
              <div className="aspect-square bg-[#f3f3f4] flex items-center justify-center relative border border-[#c6c6c6] overflow-hidden">
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo Preview" layout="fill" objectFit="contain" className="p-8" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-[#c6c6c6]" />
                    </div>
                    <Camera className="w-8 h-8 text-[#777777] z-10 relative" />
                  </>
                )}
              </div>
              <p className="text-[0.6875rem] text-[#777777] leading-relaxed italic">
                This logo will appear on the customized calculator interface shared with your clients.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <p className="text-[0.75rem] font-bold uppercase tracking-widest text-[#777777]">Benefits</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 pt-1" />
                  <span className="text-sm font-medium">White-label branding for all PDF exports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 pt-1" />
                  <span className="text-sm font-medium">Custom localized installation costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 pt-1" />
                  <span className="text-sm font-medium">Lead generation dashboard access</span>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <footer className="w-full max-w-screen-2xl mx-auto px-10 py-12 flex justify-between items-center text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#777777] border-t border-[#c6c6c6]/30">
        <div>© 2026 MySolar PV</div>
        <div className="flex gap-8">
          <Link className="hover:text-black transition-colors" href="#">Privacy</Link>
          <Link className="hover:text-black transition-colors" href="#">Terms</Link>
          <Link className="hover:text-black transition-colors" href="#">Support</Link>
        </div>
      </footer>
    </div>
  );
}
