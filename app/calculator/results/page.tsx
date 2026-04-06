"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useCalculatorStore } from "@/store/calculatorStore";
import { RevenuePie } from "@/components/charts/revenue-pie";
import { ProjectionChart } from "@/components/charts/projection-chart";
import { toPng } from "html-to-image";
import { ReportDocument } from "@/components/pdf/report-document";
import Link from "next/link";
import { ArrowLeft, Download, Battery, Zap, Euro, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div variants={itemVariants} className="glass shadow-apple rounded-3xl p-6 relative overflow-hidden group hover:shadow-apple-hover transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10 transition-transform group-hover:scale-150`} style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        <div className="p-2.5 rounded-xl text-white shadow-sm" style={{ backgroundColor: color }}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight relative z-10 mb-1">{value}</p>
      <p className="text-sm font-semibold" style={{ color }}>{subtitle}</p>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { technical, derivedResults, setTechnicalInputs } = useCalculatorStore();
  
  const [pieChartImage, setPieChartImage] = useState<string>();
  const [barChartImage, setBarChartImage] = useState<string>();
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

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
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-sm"
        >
          <Battery size={48} strokeWidth={1.5} />
        </motion.div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Data Unavailable</h2>
          <p className="text-base text-slate-500 leading-relaxed">
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href="/calculator/step-3"
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Finances
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Your ROI Projection</h1>
          <p className="text-slate-500 mt-4 text-lg max-w-xl">
            Review the simulated financial performance of your custom battery solution over its projected lifespan.
          </p>
        </div>
        
        <div className="glass p-6 rounded-3xl min-w-[280px] shadow-sm">
          <label className="text-xs font-bold uppercase tracking-widest text-[#ff9500] mb-2 block flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff9500]" /> Battery Size Simulator
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={technical.currentBatteryCapacityKwh || 0}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="font-black text-xl text-slate-800 tabular-nums w-16 text-right">
              {technical.currentBatteryCapacityKwh || 0} <span className="text-sm font-medium text-slate-500">kWh</span>
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Net Present Value" 
          value={`€${((derivedResults.yearlyProjection[14]?.cumulative || 0) + (technical.currentBatteryCapacityKwh || 10) * 1000).toLocaleString()}`} 
          subtitle="Total Profit Over Lifetime" 
          icon={TrendingUp}
          color="#34C759"
        />
        <MetricCard 
          title="Avg. Annual Return" 
          value={`€${Math.round(derivedResults.totalAnnualRevenue).toLocaleString()}`} 
          subtitle="Combined Income & Savings" 
          icon={Euro}
          color="#007AFF"
        />
        <MetricCard 
          title="Autarky Rate" 
          value={`${75}%`} 
          subtitle="Grid Independence" 
          icon={Zap}
          color="#FF9500"
        />
        <MetricCard 
          title="Break-Even Year" 
          value={`Year ${Math.ceil(derivedResults.paybackYears) || '-'}`} 
          subtitle="Return on Investment" 
          icon={Battery}
          color="#FF2D55"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass shadow-apple rounded-[2.5rem] p-8 border border-white"
        >
          <h2 className="text-xl font-extrabold text-slate-900 mb-8">Lifetime Cashflow Projection</h2>
          <div ref={barRef} className="bg-white/50 rounded-2xl p-4">
            <ProjectionChart data={derivedResults.yearlyProjection} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }}
          className="glass shadow-apple rounded-[2.5rem] p-8 border border-white flex flex-col"
        >
          <h2 className="text-xl font-extrabold text-slate-900 mb-8">Revenue Breakdown</h2>
          <div ref={pieRef} className="flex-grow flex items-center justify-center -mt-4">
            <RevenuePie data={derivedResults.annualRevenueByStream} />
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="pb-16 flex justify-center mt-12">
        <Link href="/installers" className="inline-block">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary via-tertiary to-secondary text-white px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-apple-hover cursor-pointer"
          >
            Find a Certified Installer
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
