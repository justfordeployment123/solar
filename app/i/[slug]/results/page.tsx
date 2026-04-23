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
import { Input } from "@/components/ui/input";

// Ensure PDFDownloadLink is only rendered client-side
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

function MetricCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div  className="bg-[#ffffff] border border-[#dfdfdf] p-6 relative overflow-hidden group hover: ">
      <div className="flex justify-between items-start mb-4 relative z-10">
        
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#565656]">{title}</h3>
        <div className="p-2.5  text-white " style={{ backgroundColor: color }}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-3xl md:text-4xl font-black text-[#363636] tracking-tight relative z-10 mb-1">{value}</p>
      <p className="text-sm font-semibold" style={{ color }}>{subtitle}</p>
    </div>
  );
}

export default function ResultsPage() {
  const params = typeof window !== "undefined" ? { slug: window.location.pathname.split("/")[2] } : { slug: "" };
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
        <div 
            className="w-24 h-24 bg-[#ffffff]  flex items-center justify-center mb-4 text-[#e12029] "
        >
          <Battery size={48} strokeWidth={1.5} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-black tracking-tight text-[#363636]">Daten nicht verfügbar</h2>
          <p className="text-base text-[#565656] leading-relaxed">
            Wir konnten Ihre Berechnungsdaten nicht finden. Bitte konfigurieren Sie Ihre Systemeinstellungen.
          </p>
        </div>
        <Link prefetch={false} href={`/i/${params.slug}/step-1`}>
          <Button variant="primary" className="mt-4">Rechner starten</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 sm:px-8 space-y-12">
      <div   className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href={`/i/${params.slug}/step-3`}
            className="inline-flex items-center text-xs font-bold text-[#565656] hover:text-primary  uppercase tracking-widest mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4  " />
            Zurück zu den Finanzen
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#363636]">Ihre ROI-Prognose</h1>
          <p className="text-[#565656] mt-4 text-lg max-w-xl">
            Überprüfen Sie die simulierte finanzielle Performance Ihrer individuellen Batterielösung über deren prognostizierte Lebensdauer.
          </p>
        </div>
        
        <div className="bg-[#ffffff] border border-[#dfdfdf] p-6  min-w-[280px] ">
          <label className="text-xs font-bold uppercase tracking-widest text-[#e12029] mb-2 block flex items-center gap-2">
            <div className="w-2 h-2  bg-[#e12029]" /> Batteriegröße-Simulator
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={technical.currentBatteryCapacityKwh || 0}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#dfdfdf]  appearance-none cursor-pointer accent-primary"
            />
            <span className="font-black text-xl text-[#363636] tabular-nums w-16 text-right">
              {technical.currentBatteryCapacityKwh || 0} <span className="text-sm font-medium text-[#565656]">kWh</span>
            </span>
          </div>
        </div>
      </div>

      <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Kapitalwert (NPV)" 
          value={`€${((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString('de-DE', { 
  maximumFractionDigits: 0 
})}`} 
          subtitle="Gesamtgewinn über Lebensdauer" 
          icon={TrendingUp}
          color="#565656"
        />
        <MetricCard 
          title="Durchschn. Jahresertrag" 
          value={`€${Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}`} 
          subtitle="Einnahmen & Einsparungen" 
          icon={Euro}
          color="#565656"
        />
        <MetricCard 
          title="Autarkiegrad" 
          value={`${75}%`} 
          subtitle="Netzunabhängigkeit" 
          icon={Zap}
          color="#565656"
        />
        <MetricCard 
          title="Deckungsjahr" 
          value={`Jahr ${Math.ceil(derivedResults.paybackYears) || '-'}`} 
          subtitle="Kapitalrendite (ROI)" 
          icon={Battery}
          color="#e12029"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
             className="lg:col-span-2 bg-[#ffffff] p-8 border border-[#dfdfdf]"
        >
          <h2 className="text-xl font-extrabold text-[#363636] mb-8">Cashflow-Prognose über die Lebensdauer</h2>
          <div ref={barRef} className="bg-white/50  p-4">
            <ProjectionChart data={derivedResults.yearlyProjection} />
          </div>
        </div>

        <div 
             className="bg-[#ffffff] border border-[#dfdfdf] p-8 flex flex-col"
        >
          <h2 className="text-xl font-extrabold text-[#363636] mb-8">Einnahmen-Aufschlüsselung</h2>
          <div ref={pieRef} className="flex-grow flex items-center justify-center -mt-4">
            <RevenuePie data={derivedResults.annualRevenueByStream} />
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#dfdfdf]">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={generateImages} 
              disabled={isGeneratingImages}
              className="mb-4"
            >
              {isGeneratingImages ? "Bericht wird vorbereitet..." : "PDF-Bericht erstellen"}
            </Button>
            
            {isClient && pieChartImage && barChartImage && (
              <div   >
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
                    <Button variant="outline" fullWidth className="border-2">
                       <Download className="w-4 h-4 mr-2" />
                       {loading ? "PDF wird generiert..." : "PDF jetzt herunterladen"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pb-16 flex justify-center gap-4 mt-12 flex-wrap">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#363636] text-white px-10 py-5 font-black text-lg uppercase tracking-widest cursor-pointer"
        >
          Individuelles Angebot anfordern
        </button>
      </div>
      
      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
