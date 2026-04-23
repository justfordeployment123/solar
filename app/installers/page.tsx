"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UploadCloud, ArrowRight, Image as ImageIcon, Check, X, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';

export default function InstallersPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { installerProfile, setInstallerProfile } = useCalculatorStore();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        companyName: installerProfile.companyName,
        contactName: installerProfile.contactName || "Default Contact",
        email: installerProfile.email,
        phone: installerProfile.phone,
        websiteUrl: installerProfile.websiteUrl,
        logoUrl: logoPreview,
      };
      
      const res = await fetch("/api/installers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.url) {
        router.push(data.url);
      } else {
        alert("Failed: " + (data.error || "Unknown"));
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen text-slate-900 font-sans relative overflow-hidden flex flex-col">
      <header className="absolute top-0 w-full z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link prefetch={false} href="/" className="flex items-center gap-4">
            <Image 
  priority 
  src="/solar-logo.svg" 
  alt="MySolar-PV Logo" 
  width={120}  // You may need to increase this to prevent blurriness/clipping
  height={48} // Match your new maximum height here
  className="h-10 md:h-12 w-auto object-contain opacity-80" 
/>

          </Link>
          <Link prefetch={false} href="/" className="group flex items-center justify-center gap-2 px-4 py-2  hover:bg-slate-100   text-slate-500 hover:text-slate-800">
            <span className="hidden md:inline font-bold uppercase tracking-widest text-[10px]">Cancel</span>
            <X className="w-4 h-4  " />
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24 md:pt-40 max-w-6xl mx-auto px-6 md:px-12 w-full relative z-10 flex-grow">
        <div    >
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#e12029] mb-6">
              Partner-Portal
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mx-auto md:mx-0">
              Erstellen Sie Ihre White-Label-Instanz des Batteriespeicher-Rechners. Generieren Sie ein maßgeschneidertes Tool zur Gewinnung hochwertiger Leads.
            </p>
          </header>

          {!showForm ? (
            <div className="max-w-2xl mx-auto bg-[#ffffff] p-10 border border-[#dfdfdf] text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 text-[#363636]">
                Sind Sie ein Installateur und möchten diesen Batterierechner für sich und Ihr Unternehmen nutzen?
              </h2>
              <div className="flex gap-6 justify-center mt-4">
                <Button variant="outline" className="px-8 py-4 border-2 border-slate-300" onClick={() => router.push('/calculator/step-1')}>
                  Nein, danke
                </Button>
                <Button variant="primary" className="px-8 py-4 bg-[#e12029] text-white hover:opacity-90" onClick={() => setShowForm(true)}>
                  Ja, ich möchte
                </Button>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <form className="lg:col-span-8 flex flex-col gap-10" onSubmit={handleSubmit}>
              <div className="bg-[#ffffff] p-8 md:p-10 border border-[#dfdfdf]">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                  <div className="w-2 h-2  bg-primary" /> Unternehmensdaten
                </h3>
                
                <div className="space-y-8">
                  <Input 
                    label="Unternehmensname" 
                    id="companyName" 
                    name="companyName" 
                    placeholder="Energy Solutions GmbH" 
                    required 
                    value={installerProfile.companyName}
                    onChange={(e: any) => setInstallerProfile({ companyName: e.target.value })}
                  />
                  
                  <Input 
                    label="Ansprechpartner" 
                    id="contactName" 
                    name="contactName" 
                    placeholder="Erika Mustermann" 
                    required 
                    value={installerProfile.contactName}
                    onChange={(e: any) => setInstallerProfile({ contactName: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-1 gap-8">
                    <Input 
                      label="Telefonnummer" 
                      id="tel" 
                      name="tel" 
                      placeholder="+49 ..." 
                      type="tel"
                      value={installerProfile.phone}
                      onChange={(e: any) => setInstallerProfile({ phone: e.target.value })}
                    />
                  </div>

                  <Input 
                    label="E-Mail-Adresse" 
                    id="email" 
                    name="email" 
                    placeholder="admin@firma.de" 
                    type="email" 
                    required 
                    value={installerProfile.email}
                    onChange={(e: any) => setInstallerProfile({ email: e.target.value })}
                  />

                  <Input 
                    label="Website URL" 
                    id="websiteUrl" 
                    name="websiteUrl" 
                    placeholder="https://www.firma.de" 
                    type="url"
                    value={installerProfile.websiteUrl || ""}
                    onChange={(e: any) => setInstallerProfile({ websiteUrl: e.target.value })}
                  />
                  
                  <div className="pt-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1 mb-2 block">
                      Unternehmenslogo
                    </label>
                    <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300  bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30  cursor-pointer group">
                      <input className="hidden" id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                      <div className="w-16 h-16  bg-white  flex items-center justify-center mb-4  ">
                        <UploadCloud className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Klicken Sie zum Hochladen oder ziehen Sie die Datei hierher</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">SVG, PNG oder JPG (Max. 2MB)</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={loading} className="gap-3  text-base uppercase tracking-widest bg-[#e12029] text-white w-full md:w-auto py-4 px-10 border-transparent hover:opacity-95">
                  {loading ? "Wird generiert..." : "Rechner generieren"} <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-[#ffffff] p-8 border border-[#dfdfdf]">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2  bg-[#e12029]" /> Vorschau
                </div>
                <div className="aspect-square bg-slate-50  flex items-center justify-center relative border border-slate-200 overflow-hidden mb-6 ">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo Vorschau" fill style={{ objectFit: 'contain' }} className="p-8" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 gap-3">
                      <Building2 className="w-12 h-12 opacity-50" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Einrichtung erforderlich</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Dieses Logo wird stolz auf der benutzerdefinierten Oberfläche angezeigt, die Sie mit Ihren Kunden teilen.
                </p>
              </div>

              <div className="bg-[#ffffff] p-8 border border-[#dfdfdf]">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#e12029] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2  bg-[#e12029]" /> Partner-Vorteile
                </div>
                <ul className="space-y-4">
                  {[
                    "White-Label-Branding für alle Exporte",
                    "Individuelle lokale Installationskosten",
                    "Zugang zum Lead-Generierungs-Dashboard",
                    "Priorisierter Support und Onboarding"
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
          )}
        </div>
      </main>

    </div>
  );
}
