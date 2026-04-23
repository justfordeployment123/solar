"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UploadCloud, ArrowRight, Check, X, Building2, BatteryCharging } from 'lucide-react';
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
    <div className="bg-white min-h-screen text-[#1a1a1a] font-opensans flex flex-col">
      {/* Top accent stripe */}
      <div className="flex w-full h-[6px]">
        <div className="flex-1 bg-[#e20613]" />
        <div className="flex-1 bg-[#d2d700]" />
        <div className="flex-1 bg-[#ffdb00]" />
      </div>

      {/* Header */}
      <header className="w-full border-b border-[#e5e5e5] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link prefetch={false} href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e20613] flex items-center justify-center">
              <BatteryCharging className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-[#1a1a1a] text-lg">
              MySolar<span className="text-[#e20613]">·PV</span>
            </span>
          </Link>
          <Link
            prefetch={false}
            href="/"
            className="group flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] hover:border-[#e20613] text-[#5a5859] hover:text-[#e20613] transition-colors"
          >
            <span className="hidden md:inline font-bold uppercase tracking-[0.18em] text-[10px]">
              Abbrechen
            </span>
            <X className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 w-full py-16 md:py-24 flex-grow">
        <header className="mb-16 md:mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#fff5f5] border border-[#e20613]/20 px-3 py-1 mb-6">
            <span className="w-2 h-2 bg-[#e20613]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#e20613]">
              Partner-Portal
            </span>
          </div>
          <h1 className="text-[2.75rem] md:text-[4.25rem] font-bold tracking-tight leading-[1.02] text-[#1a1a1a]">
            White-Label <span className="text-[#e20613]">Rechner</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#5a5859] leading-relaxed font-medium">
            Erstellen Sie Ihre individuelle Instanz des Batteriespeicher-Rechners.
            Generieren Sie ein maßgeschneidertes Tool zur Gewinnung hochwertiger Leads.
          </p>
        </header>

        {!showForm ? (
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white border border-[#e5e5e5] p-10 md:p-14 text-center">
              <span className="absolute top-0 left-0 right-0 h-[4px] flex">
                <span className="flex-1 bg-[#e20613]" />
                <span className="flex-1 bg-[#d2d700]" />
                <span className="flex-1 bg-[#ffdb00]" />
              </span>
              <div className="w-14 h-14 mx-auto mb-6 bg-[#e20613] flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a] mb-4">
                Sind Sie Installateur?
              </h2>
              <p className="text-[#5a5859] font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                Möchten Sie diesen Batterierechner für Ihr Unternehmen nutzen und
                Ihr eigenes Branding einsetzen?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push('/calculator/step-1')}>
                  Nein, danke
                </Button>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Ja, ich möchte <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <form className="lg:col-span-8 flex flex-col gap-8" onSubmit={handleSubmit}>
              <div className="bg-white border border-[#e5e5e5] p-8 md:p-10 relative">
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#e20613]" />
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#e20613] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                      Schritt 01
                    </div>
                    <h3 className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                      Unternehmensdaten
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Telefonnummer"
                      id="tel"
                      name="tel"
                      placeholder="+49 ..."
                      type="tel"
                      value={installerProfile.phone}
                      onChange={(e: any) => setInstallerProfile({ phone: e.target.value })}
                    />
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
                  </div>

                  <Input
                    label="Website URL"
                    id="websiteUrl"
                    name="websiteUrl"
                    placeholder="https://www.firma.de"
                    type="url"
                    value={installerProfile.websiteUrl || ""}
                    onChange={(e: any) => setInstallerProfile({ websiteUrl: e.target.value })}
                  />

                  <div className="pt-2">
                    <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859] mb-2 block">
                      Unternehmenslogo
                    </label>
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#e5e5e5] bg-[#fafafa] hover:border-[#e20613] hover:bg-[#fff5f5] transition-colors cursor-pointer group"
                    >
                      <input
                        className="hidden"
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <div className="w-12 h-12 bg-[#e20613] flex items-center justify-center mb-4">
                        <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-[#1a1a1a]">
                        Klicken Sie zum Hochladen
                      </p>
                      <p className="text-xs text-[#5a5859] mt-2 font-medium">
                        SVG, PNG oder JPG · Max. 2 MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Wird generiert..." : "Rechner generieren"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#e5e5e5] p-8 relative">
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d2d700]" /> Vorschau
                </div>
                <div className="aspect-square bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center relative overflow-hidden mb-5">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo Vorschau"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-8"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[#a1a1a1] gap-3">
                      <Building2 className="w-12 h-12" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                        Einrichtung erforderlich
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#5a5859] leading-relaxed font-medium">
                  Dieses Logo wird auf der benutzerdefinierten Oberfläche angezeigt,
                  die Sie mit Ihren Kunden teilen.
                </p>
              </div>

              <div className="bg-white border border-[#e5e5e5] p-8 relative">
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#ffdb00]" />
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffdb00]" /> Partner-Vorteile
                </div>
                <ul className="space-y-4">
                  {[
                    "White-Label-Branding für alle Exporte",
                    "Individuelle lokale Installationskosten",
                    "Zugang zum Lead-Generierungs-Dashboard",
                    "Priorisierter Support und Onboarding",
                  ].map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm font-medium text-[#1a1a1a]"
                    >
                      <div className="mt-0.5 w-5 h-5 flex-shrink-0 bg-[#e20613] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
