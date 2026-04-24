"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useCalculatorStore } from "@/store/calculatorStore";
import { RevenuePie } from "@/components/charts/revenue-pie";
import { ProjectionChart } from "@/components/charts/projection-chart";
import { toPng } from "html-to-image";
import { ReportDocument } from "@/components/pdf/report-document";
import { LeadCaptureModal } from "@/components/modals/lead-capture-modal";
import Link from "next/link";
import { ArrowLeft, Download, Battery, Zap, Euro, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  accent: string;
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] p-6 relative">
      <span className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accent }} />
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
          {title}
        </h3>
        <div
          className="w-9 h-9 flex items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <Icon size={18} strokeWidth={2.5} className="text-white" />
        </div>
      </div>
      <p className="text-[2rem] md:text-[2.25rem] font-bold text-[#1a1a1a] tracking-tight leading-none mb-2">
        {value}
      </p>
      <p className="text-xs font-semibold text-[#5a5859]">{subtitle}</p>
    </div>
  );
}

export default function ResultsPage() {
  const { technical, derivedResults, setTechnicalInputs, activeInstaller } = useCalculatorStore();

  const [pieChartImage, setPieChartImage] = useState<string>();
  const [barChartImage, setBarChartImage] = useState<string>();
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechnicalInputs({ currentBatteryCapacityKwh: parseFloat(e.target.value) });
  };

  const generateImages = async () => {
    setIsGeneratingImages(true);
    try {
      if (pieRef.current) {
        const pieDataUrl = await toPng(pieRef.current, { cacheBust: true, pixelRatio: 2 });
        setPieChartImage(pieDataUrl);
      }
      if (barRef.current) {
        const barDataUrl = await toPng(barRef.current, { cacheBust: true, pixelRatio: 2 });
        setBarChartImage(barDataUrl);
      }
    } catch (err) {
      console.error("Failed to generate images", err);
    } finally {
      setIsGeneratingImages(false);
    }
  };

  if (!derivedResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center space-y-8">
        <div className="w-20 h-20 bg-[#e20613] flex items-center justify-center text-white">
          <Battery size={40} strokeWidth={1.75} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Daten nicht verfügbar
          </h2>
          <p className="text-base text-[#5a5859] leading-relaxed">
            Wir konnten Ihre Berechnungsdaten nicht finden. Bitte konfigurieren Sie Ihre
            Systemeinstellungen.
          </p>
        </div>
        <Link prefetch={false} href="/calculator/step-1">
          <Button variant="primary">Rechner starten</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 sm:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href="/calculator/step-3"
            className="inline-flex items-center text-[0.7rem] font-bold text-[#5a5859] hover:text-[#e20613] uppercase tracking-[0.2em] mb-6 group transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Zurück zu den Finanzen
          </Link>
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight text-[#1a1a1a] leading-[1.05]">
            ROI-Prognose
          </h1>
          <p className="text-[#5a5859] mt-4 text-base md:text-lg max-w-xl leading-relaxed font-medium">
            Überprüfen Sie die simulierte finanzielle Performance Ihrer individuellen
            Batterielösung über deren prognostizierte Lebensdauer.
          </p>
        </div>

        {/* Battery slider */}
        <div className="bg-white border border-[#e5e5e5] p-6 min-w-[280px] relative mt-8 md:mt-0">
          <div className="absolute -top-10 right-0 inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#e20613]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
              Ihr Ergebnis
            </span>
          </div>
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#d2d700]" /> Batteriegröße-Simulator
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={technical.currentBatteryCapacityKwh || 0}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#e5e5e5] appearance-none cursor-pointer accent-[#e20613]"
            />
            <span className="font-bold text-xl text-[#1a1a1a] tabular-nums w-16 text-right">
              {technical.currentBatteryCapacityKwh || 0}
              <span className="text-xs font-semibold text-[#5a5859] ml-1">kWh</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Kapitalwert (NPV)"
          value={`€${((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString('de-DE', { maximumFractionDigits: 0 })}`}
          subtitle="Gesamtgewinn über Lebensdauer"
          icon={TrendingUp}
          accent="#1a1a1a"
        />
        <MetricCard
          title="Durchschn. Jahresertrag"
          value={`€${Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}`}
          subtitle="Einnahmen & Einsparungen"
          icon={Euro}
          accent="#5a5859"
        />
        <MetricCard
          title="Autarkiegrad"
          value={`${75}%`}
          subtitle="Netzunabhängigkeit"
          icon={Zap}
          accent="#d2d700"
        />
        <MetricCard
          title="Deckungsjahr"
          value={`Jahr ${Math.ceil(derivedResults.paybackYears) || '-'}`}
          subtitle="Kapitalrendite (ROI)"
          icon={Battery}
          accent="#e20613"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e5e5e5] p-8 relative">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#e20613]" />
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613] mb-2">
            Diagramm
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
            Cashflow-Prognose über die Lebensdauer
          </h2>
          <div ref={barRef} className="bg-white p-2">
            <ProjectionChart data={derivedResults.yearlyProjection} />
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-8 flex flex-col relative">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-2">
            Aufschlüsselung
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
            Einnahmen
          </h2>
          <div ref={pieRef} className="flex-grow flex items-center justify-center">
            <RevenuePie data={derivedResults.annualRevenueByStream} />
          </div>

          <div className="mt-8 pt-6 border-t border-[#e5e5e5] space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={generateImages}
              disabled={isGeneratingImages}
            >
              {isGeneratingImages ? "Bericht wird vorbereitet..." : "PDF-Bericht erstellen"}
            </Button>

            {isClient && pieChartImage && barChartImage && (
              <PDFDownloadLink
                document={
                  <ReportDocument
                    technical={technical}
                    derivedResults={derivedResults}
                    pieChartImage={pieChartImage}
                    barChartImage={barChartImage}
                    activeLogo={activeInstaller?.logoUrl || "/solar-logo.png"}
                    companyName={activeInstaller?.companyName || ""}
                  />
                }
                fileName="mein-solar-batterie-bericht.pdf"
              >
                {({ loading }: any) => (
                  <Button variant="outline" fullWidth>
                    <Download className="w-4 h-4" />
                    {loading ? "PDF wird generiert..." : "PDF herunterladen"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>

      {/* CTA band */}
      <div className="relative bg-[#1a1a1a] text-white p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[4px] flex">
          <span className="flex-1 bg-[#e20613]" />
          <span className="flex-1 bg-[#d2d700]" />
          <span className="flex-1 bg-[#ffdb00]" />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#ffdb00] mb-3">
              Nächster Schritt
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              Erhalten Sie ein individuelles Angebot von zertifizierten Partnern.
            </h3>
            <p className="mt-3 text-white/75 text-sm md:text-base leading-relaxed">
              Basierend auf Ihren Berechnungen - unverbindlich und kostenlos.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 bg-[#e20613] text-white font-bold uppercase tracking-[0.2em] text-xs md:text-sm px-7 py-4 hover:bg-[#ffdb00] hover:text-black transition-colors whitespace-nowrap"
          >
            Angebot anfordern
          </button>
        </div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
