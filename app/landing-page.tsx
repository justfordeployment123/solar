'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Persona } from '@/types/calculator';
import {
  User,
  Sun,
  Building,
  ArrowRight,
  BatteryCharging,
  Zap,
  ShieldCheck,
  LineChart,
  Leaf,
  Wallet,
  PlugZap,
  ClipboardList,
  Settings2,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const setPersona = useCalculatorStore((state) => state.setPersona);
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);
  const setActiveInstaller = useCalculatorStore((state) => state.setActiveInstaller);

  useEffect(() => {
    setActiveInstaller(null);
  }, [setActiveInstaller]);

  const handleSelect = (persona: Persona) => {
    setPersona(persona);
    if (persona === 'Installer') {
      router.push('/installers');
    } else {
      router.push('/calculator/step-1');
    }
  };

  const personas: {
    key: Persona;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'Private',
      title: 'Privatperson',
      description:
        'Ich bin Eigenheimbesitzer und möchte meinen Energieverbrauch optimieren sowie meine Stromrechnung senken.',
      icon: User,
    },
    {
      key: 'Installer',
      title: 'Solarinstallateur',
      description:
        'Ich bin Installateur oder Dienstleister, registriert für Verkauf und Konfiguration von Photovoltaikanlagen.',
      icon: Sun,
    },
    {
      key: 'Company',
      title: 'Unternehmen',
      description:
        'Ich vertrete ein Unternehmen, das großflächige Energiespeicherlösungen und Netzdienstleistungen sucht.',
      icon: Building,
    },
  ];

  const benefits = [
    {
      icon: Wallet,
      title: 'Bis zu 70% weniger Stromkosten',
      text: 'Maximale Eigenverbrauchsquote durch intelligente Speicherstrategien.',
    },
    {
      icon: LineChart,
      title: 'Transparente Wirtschaftlichkeit',
      text: 'Klar nachvollziehbare Kalkulation - Amortisation in Echtzeit sichtbar.',
    },
    {
      icon: Leaf,
      title: 'Saubere Energiezukunft',
      text: 'CO₂-Reduktion messbar und dokumentiert für Ihr Nachhaltigkeitsziel.',
    },
    {
      icon: PlugZap,
      title: 'Netzunabhängigkeit',
      text: 'Notstromfähig und vorbereitet für dynamische Stromtarife.',
    },
  ];

  const steps = [
    {
      icon: ClipboardList,
      step: '01',
      title: 'Profil wählen',
      text:
        'Wählen Sie, ob Sie Privatkunde, Installateur oder Unternehmen sind. Der Rechner passt sich Ihrem Kontext an.',
      image:
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&q=80&auto=format&fit=crop',
    },
    {
      icon: Settings2,
      step: '02',
      title: 'Verbrauch konfigurieren',
      text:
        'Geben Sie Verbrauchsdaten ein oder importieren Sie Lastprofile - wir berechnen die optimale Speichergröße.',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=80&auto=format&fit=crop',
    },
    {
      icon: CheckCircle2,
      step: '03',
      title: 'Angebot erhalten',
      text:
        'Sie erhalten ein konkretes, vergleichbares Angebot von zertifizierten Partnern in Ihrer Region.',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80&auto=format&fit=crop',
    },
  ];

  return (
    <div
      data-page="landing"
      className="bg-white min-h-screen flex flex-col font-opensans text-[#1a1a1a]"
    >
      {/* Top accent strip - MySolar brand triad */}
      <div className="flex w-full h-[6px]">
        <div className="flex-1 bg-[#e20613]" />
        <div className="flex-1 bg-[#d2d700]" />
        <div className="flex-1 bg-[#ffdb00]" />
      </div>

      {/* Header */}
      <header className="w-full border-b border-[#e5e5e5] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/solar-logo.svg"
              alt="MySolar PV Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          <span className="hidden md:inline text-xs font-semibold uppercase tracking-[0.2em] text-[#5a5859]">
            Batteriespeicher-Plattform
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full bg-white border-b border-[#e5e5e5] overflow-hidden">
        {/* Background grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse at top right, black 30%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at top right, black 30%, transparent 75%)',
          }}
        />
        {/* Soft red glow */}
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[#e20613] opacity-[0.06] blur-3xl pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-14 md:pt-20 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-[#fff5f5] border border-[#e20613]/20 px-3 py-1 mb-6">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 bg-[#e20613] animate-ping opacity-60" />
                <span className="relative w-2 h-2 bg-[#e20613]" />
              </span>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#e20613]">
                Batteriespeicher-Rechner
              </span>
            </div>

            <h1 className="text-[2.75rem] md:text-[4.5rem] font-bold leading-[0.98] tracking-tight text-[#1a1a1a]">
              Wer sind <span className="text-[#e20613]">Sie?</span>
              <span className="block text-[1.4rem] md:text-[1.9rem] font-semibold text-[#5a5859] mt-3 md:mt-5 leading-tight">
                Ihr Speicher. Ihre Zahlen. Ihr Angebot.
              </span>
            </h1>

            <p className="mt-6 text-[1.05rem] md:text-[1.15rem] text-[#5a5859] font-medium max-w-xl leading-relaxed">
              Präzise Kalkulation, faire Konfiguration und transparente
              Angebote - individuell für Privatkunden, Installateure und
              Unternehmen.
            </p>

            {/* Feature bullets */}
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-xl">
              {[
                { icon: Wallet, label: '70 % weniger Stromkosten' },
                { icon: LineChart, label: 'Live-ROI-Analyse' },
                { icon: ShieldCheck, label: 'Zertifizierte Partner' },
                { icon: Leaf, label: 'CO₂-Reduktion messbar' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 border border-[#e5e5e5] bg-white/60"
                >
                  <div className="w-8 h-8 flex-shrink-0 bg-[#e20613] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[0.85rem] font-bold text-[#1a1a1a] leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#personas"
                className="group inline-flex items-center gap-3 bg-[#e20613] text-white font-bold uppercase tracking-[0.18em] text-xs md:text-sm px-7 py-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <span>Jetzt konfigurieren</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-3 bg-transparent border border-[#e5e5e5] text-[#1a1a1a] font-bold uppercase tracking-[0.18em] text-xs md:text-sm px-7 py-4 hover:border-[#1a1a1a] transition-colors"
              >
                <span>So funktioniert's</span>
              </a>
            </div>

            {/* Social proof row */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  '#e20613',
                  '#1a1a1a',
                  '#d2d700',
                  '#ffdb00',
                ].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 border-2 border-white flex items-center justify-center text-[0.65rem] font-bold text-white"
                    style={{ backgroundColor: c, color: i >= 2 ? '#000' : '#fff' }}
                  >
                    {['AK', 'MS', 'TB', 'JH'][i]}
                  </div>
                ))}
                <div className="w-9 h-9 border-2 border-white bg-white flex items-center justify-center text-[0.6rem] font-bold text-[#1a1a1a] shadow-sm">
                  +2k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#ffdb00]">
                  <span className="text-sm">★★★★★</span>
                  <span className="text-[0.75rem] font-bold text-[#1a1a1a] ml-1">4.9</span>
                </div>
                <div className="text-[0.7rem] font-semibold text-[#5a5859] mt-0.5">
                  2.400+ Haushalte vertrauen uns
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - self-contained product preview mockup */}
          <div className="lg:col-span-6 relative">
            {/* Dashboard mockup card */}
            <div className="relative bg-white border border-[#e5e5e5] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e20613]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffdb00]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d2d700]" />
                </div>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                  mysolar-pv.de / ergebnis
                </div>
                <div className="w-10" />
              </div>

              {/* Tri-color stripe */}
              <div className="h-[3px] flex">
                <span className="flex-1 bg-[#e20613]" />
                <span className="flex-1 bg-[#d2d700]" />
                <span className="flex-1 bg-[#ffdb00]" />
              </div>

              {/* Dashboard content */}
              <div className="p-5 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#e20613] mb-1">
                      Ihr Ergebnis
                    </div>
                    <div className="text-lg md:text-xl font-bold tracking-tight text-[#1a1a1a]">
                      ROI-Prognose
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                      Speicher
                    </div>
                    <div className="text-sm font-bold text-[#1a1a1a]">12 kWh</div>
                  </div>
                </div>

                {/* Primary metric */}
                <div className="bg-[#1a1a1a] text-white p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e20613]" />
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/60">
                        Gewinn · Lebensdauer
                      </div>
                      <div className="text-[2rem] md:text-[2.5rem] font-bold leading-none mt-1 tabular-nums">
                        €24.780
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/60">
                        Autarkie
                      </div>
                      <div className="text-xl font-bold text-[#ffdb00] mt-1">75 %</div>
                    </div>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                      Cashflow · 10 Jahre
                    </div>
                    <div className="text-[0.7rem] font-bold text-[#e20613]">+183 %</div>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[22, 34, 28, 45, 40, 58, 52, 68, 74, 82].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i >= 7 ? '#e20613' : i >= 4 ? '#1a1a1a' : '#d0d0d0',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5 text-[0.55rem] font-semibold text-[#5a5859] tracking-wider">
                    <span>J1</span>
                    <span>J5</span>
                    <span>J10</span>
                  </div>
                </div>

                {/* Revenue streams legend */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e5e5e5]">
                  {[
                    { color: '#e20613', label: 'Eigenverbrauch', value: '54%' },
                    { color: '#d2d700', label: 'Peak Shaving', value: '28%' },
                    { color: '#ffdb00', label: 'VPP', value: '18%' },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2" style={{ backgroundColor: s.color }} />
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#5a5859]">
                          {s.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#1a1a1a]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero stats strip */}
        <div className="relative border-t border-[#e5e5e5] bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e5e5e5]">
            {[
              { value: '12.400+', label: 'Berechnungen' },
              { value: '500+', label: 'Zertifizierte Partner' },
              { value: '70%', label: 'Ø Kostenersparnis' },
              { value: '< 60 s', label: 'Bis zum Ergebnis' },
            ].map(({ value, label }, i) => (
              <div key={i} className="py-6 md:py-7 px-4 md:px-6 flex flex-col">
                <div className="text-[1.5rem] md:text-[1.9rem] font-bold tracking-tight text-[#1a1a1a] leading-none">
                  {value}
                </div>
                <div className="mt-2 text-[0.7rem] md:text-xs font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona cards */}
      <section id="personas" className="w-full bg-[#fafafa] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
              Schritt 1
            </span>
            <h2 className="mt-3 text-[2rem] md:text-[2.75rem] font-bold tracking-tight leading-tight text-[#1a1a1a]">
              Wählen Sie Ihr Profil
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.map(({ key, title, description, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className="group relative bg-white text-left p-8 md:p-10 border border-[#e5e5e5] hover:border-[#e20613] transition-colors flex flex-col justify-between min-h-[340px]"
              >
                <span className="absolute top-0 left-0 h-[4px] w-0 bg-[#e20613] group-hover:w-full transition-all duration-300" />

                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 bg-[#f4f4f4] group-hover:bg-[#e20613] flex items-center justify-center transition-colors">
                    <Icon className="w-7 h-7 text-[#e20613] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#1a1a1a] mb-3">
                      {title}
                    </h3>
                    <p className="text-sm md:text-[0.95rem] text-[#5a5859] font-medium leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e5e5e5] flex items-center justify-between">
                  <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                    Weiter
                  </span>
                  <ArrowRight className="w-5 h-5 text-[#e20613] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section A: Warum Batteriespeicher */}
      <section className="w-full bg-white border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
              Warum Batteriespeicher
            </span>
            <h2 className="mt-3 text-[2rem] md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-[#1a1a1a]">
              Intelligente Energiespeicherung für die neue Stromwelt.
            </h2>
            <p className="mt-6 text-[1rem] md:text-[1.1rem] text-[#5a5859] font-medium leading-relaxed max-w-xl">
              Ein moderner Batteriespeicher wandelt Ihre Photovoltaikanlage in
              ein verlässliches Kraftwerk. Mehr Eigenverbrauch, weniger
              Netzbezug, maximale Unabhängigkeit von Strompreis-Schwankungen -
              planbar, skalierbar und zukunftssicher.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-5 border border-[#e5e5e5] bg-white"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-[#e20613] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[0.95rem] mb-1">
                      {title}
                    </h4>
                    <p className="text-[0.85rem] text-[#5a5859] leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 md:gap-4 aspect-[5/6]">
              <div className="col-span-4 row-span-4 relative overflow-hidden border border-[#e5e5e5]">
                <img
                  src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80&auto=format&fit=crop"
                  alt="Photovoltaik Modul Nahaufnahme"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 row-span-3 col-start-5 relative overflow-hidden border border-[#e5e5e5] bg-[#d2d700] flex items-center justify-center">
                <div className="text-center px-2">
                  <div className="text-[2rem] md:text-[2.5rem] font-bold leading-none text-black">
                    70%
                  </div>
                  <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-widest text-black">
                    Weniger Kosten
                  </div>
                </div>
              </div>
              <div className="col-span-2 row-span-3 col-start-5 row-start-4 relative overflow-hidden border border-[#e5e5e5]">
                <img
                  src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900&q=80&auto=format&fit=crop"
                  alt="Erneuerbare Energie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-4 row-span-2 row-start-5 relative overflow-hidden border border-[#e5e5e5] bg-[#1a1a1a] flex items-center px-6">
                <div>
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-white/60">
                    Speicherkapazität
                  </div>
                  <div className="mt-1 text-[1.3rem] md:text-[1.6rem] font-bold text-white leading-tight">
                    5 – 50 kWh modular
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: So funktioniert's */}
      <section id="how" className="w-full bg-[#fafafa] border-t border-[#e5e5e5] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                So funktioniert's
              </span>
              <h2 className="mt-3 text-[2rem] md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-[#1a1a1a]">
                In drei Schritten zum passenden Speicher.
              </h2>
            </div>
            <p className="text-[#5a5859] font-medium max-w-md leading-relaxed">
              Kein Verkaufsgespräch, keine versteckten Kosten. Nur ein klarer,
              transparenter Prozess - von der ersten Minute an.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ icon: Icon, step, title, text, image }) => (
              <article
                key={step}
                className="bg-white border border-[#e5e5e5] flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 font-bold text-[#e20613] text-sm tracking-widest">
                    {step}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  <div className="w-11 h-11 bg-[#e20613] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] mb-3">
                    {title}
                  </h3>
                  <p className="text-sm text-[#5a5859] font-medium leading-relaxed">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 bg-white border border-[#e5e5e5]">
            <div className="flex items-start gap-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#e5e5e5]">
              <div className="w-10 h-10 flex-shrink-0 bg-[#d2d700] flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] mb-1">Präzise Berechnung</h4>
                <p className="text-sm text-[#5a5859] leading-relaxed">
                  Echtzeit-Kalkulation basierend auf Ihrem Verbrauchsprofil.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#e5e5e5]">
              <div className="w-10 h-10 flex-shrink-0 bg-[#ffdb00] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] mb-1">Zertifizierte Partner</h4>
                <p className="text-sm text-[#5a5859] leading-relaxed">
                  Nur geprüfte Installateure und Lösungen.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 md:p-8">
              <div className="w-10 h-10 flex-shrink-0 bg-[#e20613] flex items-center justify-center">
                <BatteryCharging className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] mb-1">Maßgeschneidert</h4>
                <p className="text-sm text-[#5a5859] leading-relaxed">
                  Für Privat, Installateur und Unternehmen gleichermaßen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA band */}
      <section className="w-full bg-[#e20613] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold tracking-tight leading-tight">
              Bereit für Ihren individuellen Speicher-Rechner?
            </h2>
            <p className="mt-3 text-white/85 text-[0.95rem] md:text-base leading-relaxed">
              Starten Sie jetzt - in unter einer Minute zum ersten Ergebnis.
            </p>
          </div>
          <button
            onClick={() => handleSelect('Private')}
            className="group inline-flex items-center gap-3 bg-white text-[#e20613] font-bold uppercase tracking-[0.2em] text-xs md:text-sm px-7 py-4 hover:bg-[#ffdb00] hover:text-black transition-colors"
          >
            <span>Jetzt starten</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#e20613] flex items-center justify-center">
              <BatteryCharging className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">
              © MySolar·PV - Batteriespeicher-Plattform
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-8 h-[3px] bg-[#e20613]" />
            <span className="w-8 h-[3px] bg-[#d2d700]" />
            <span className="w-8 h-[3px] bg-[#ffdb00]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
