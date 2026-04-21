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
    <div  className="glass   p-6 relative overflow-hidden group hover: ">
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
  const { technical, derivedResults, setTechnicalInputs } = useCalculatorStore();
  
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
          <h2 className="text-4xl font-black tracking-tight text-[#363636]">Data Unavailable</h2>
          <p className="text-base text-[#565656] leading-relaxed">
            We couldn't find your calculation data. Please configure your system settings.
          </p>
        </div>
        <Link href="/calculator/step-1">
          <Button variant="primary" className="mt-4">Start Calculator</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 sm:px-8 space-y-12">
      <div   className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href="/calculator/step-3"
            className="inline-flex items-center text-xs font-bold text-[#565656] hover:text-primary  uppercase tracking-widest mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4  " />
            Back to Finances
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#363636]">Your ROI Projection</h1>
          <p className="text-[#565656] mt-4 text-lg max-w-xl">
            Review the simulated financial performance of your custom battery solution over its projected lifespan.
          </p>
        </div>
        
        <div className="glass p-6  min-w-[280px] ">
          <label className="text-xs font-bold uppercase tracking-widest text-[#e12029] mb-2 block flex items-center gap-2">
            <div className="w-2 h-2  bg-[#e12029]" /> Battery Size Simulator
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
          title="Net Present Value" 
          value={`€${((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString()}`} 
          subtitle="Total Profit Over Lifetime" 
          icon={TrendingUp}
          color="#565656"
        />
        <MetricCard 
          title="Avg. Annual Return" 
          value={`€${Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}`} 
          subtitle="Combined Income & Savings" 
          icon={Euro}
          color="#565656"
        />
        <MetricCard 
          title="Autarky Rate" 
          value={`${75}%`} 
          subtitle="Grid Independence" 
          icon={Zap}
          color="#565656"
        />
        <MetricCard 
          title="Break-Even Year" 
          value={`Year ${Math.ceil(derivedResults.paybackYears) || '-'}`} 
          subtitle="Return on Investment" 
          icon={Battery}
          color="#e12029"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
             className="lg:col-span-2 glass  ] p-8 border border-white"
        >
          <h2 className="text-xl font-extrabold text-[#363636] mb-8">Lifetime Cashflow Projection</h2>
          <div ref={barRef} className="bg-white/50  p-4">
            <ProjectionChart data={derivedResults.yearlyProjection} />
          </div>
        </div>

        <div 
             className="glass  ] p-8 border border-white flex flex-col"
        >
          <h2 className="text-xl font-extrabold text-[#363636] mb-8">Revenue Breakdown</h2>
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
              {isGeneratingImages ? "Preparing Report..." : "Generate PDF Report"}
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
                    />
                  }
                  fileName="my-solar-battery-report.pdf"
                >
                  {({ loading }: any) => (
                    <Button variant="outline" fullWidth className="border-2">
                       <Download className="w-4 h-4 mr-2" />
                       {loading ? "Generating PDF..." : "Download PDF Now"}
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
          Request Personalized Offer
        </button>
        <Link href="/installers" className="inline-block">
          <div 
              className="bg-[#e12029] text-white px-10 py-5  font-black text-lg uppercase tracking-widest  cursor-pointer"
          >
            Find a Certified Installer
          </div>
        </Link>
      </div>
      
      <LeadCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
