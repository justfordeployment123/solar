"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useCalculatorStore } from "@/store/calculatorStore";
import { RevenuePie } from "@/components/charts/revenue-pie";
import { ProjectionChart } from "@/components/charts/projection-chart";
import { toPng } from "html-to-image";
import { ReportDocument } from "@/components/pdf/report-document";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Ensure PDFDownloadLink is only rendered client-side
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
        <p className="text-xl text-red-500 mb-4">
          Missing calculation data. Please configure your system.
        </p>
        <Link href="/calculator/step-1" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Start Calculator
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Link
          href="/calculator/step-2"
          className="inline-flex items-center text-sm font-medium text-[#ababab] hover:text-black transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to System Details
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Custom Battery Proposal</h1>
          <p className="text-slate-500 mt-2">
            Adjust the battery model size to see immediate updates to your projected ROI and earnings.
          </p>
        </div>
      </div>

      {/*/ Interactive Sizer /*/}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Adjust Battery Capacity</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <input
            type="range"
            min="5"
            max="30"
            step="0.5"
            value={technical.currentBatteryCapacityKwh || 5}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="font-mono text-xl font-bold w-full sm:w-32 flex items-center justify-center sm:justify-end text-slate-700 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 whitespace-nowrap">
            <span className="w-16 text-right">{(technical.currentBatteryCapacityKwh || 0).toFixed(1)}</span>
            <span className="text-sm font-normal text-slate-500 ml-1">kWh</span>
          </div>
        </div>
      </div>

      {/*/ KPI Cards /*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Est. Annual Revenue</p>
          <p className="text-3xl font-bold text-emerald-600">
            €{derivedResults.totalAnnualRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Projected ROI</p>
          <p className="text-3xl font-bold text-blue-600">
            {derivedResults.roiPercent.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Payback Period</p>
          <p className="text-3xl font-bold text-indigo-600">
            {derivedResults.paybackYears.toFixed(1)} <span className="text-lg font-medium text-indigo-400">Years</span>
          </p>
        </div>
      </div>

      {/*/ Charts /*/}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 w-full">Revenue Breakdown</h2>
          <div ref={pieRef} className="w-full bg-white p-2 flex justify-center h-[300px]">
            <RevenuePie data={derivedResults.annualRevenueByStream} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 w-full">15-Year Financial Projection</h2>
          <div ref={barRef} className="w-full bg-white p-2 h-[300px]">
            <ProjectionChart data={derivedResults.yearlyProjection} />
          </div>
        </div>
      </div>

      {/*/ PDF Export Section /*/}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm border border-blue-100 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready for a Detailed Document?</h2>
          <p className="text-slate-600 max-w-lg">
            Generate a comprehensive PDF projection including your system configuration, key financial metrics, and visual revenue breakdowns to share with stakeholders or installers.
          </p>
        </div>
        
        {isClient && (
          <div className="flex flex-col items-stretch space-y-3 min-w-[280px]">
            <button 
              onClick={generateImages}
              disabled={isGeneratingImages}
              className={`px-4 py-3 bg-white border font-medium rounded-lg transition-all ${
                isGeneratingImages 
                  ? "border-slate-200 text-slate-400 cursor-not-allowed" 
                  : "border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-sm"
              }`}
            >
              {isGeneratingImages ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rendering Charts...
                </span>
              ) : "Step 1: Capture Charts"}
            </button>
            
            {(pieChartImage && barChartImage) ? (
              <PDFDownloadLink
                document={
                  <ReportDocument
                    results={derivedResults}
                    technical={technical}
                    pieChartImage={pieChartImage}
                    barChartImage={barChartImage}
                  />
                }
                fileName={`battery-report-${technical.currentBatteryCapacityKwh}kwh.pdf`}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {/* 
                  // @ts-ignore - Some react-pdf typing issues with Next 15 / React 19 occasionally popup
                */}
                {({ loading }) =>
                  loading ? 'Generating Document...' : 'Step 2: Download PDF'
                }
              </PDFDownloadLink>
            ) : (
             <div className="text-sm tracking-wide text-center text-slate-500 bg-white/60 p-3 rounded-lg border border-slate-200 border-dashed">
                Ready to download after capture
             </div>
            )}
          </div>
        )}
      </div>
      
      {/*/ Next Steps /*/}
      <div className="mt-12 text-center border-t border-slate-200 pt-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">What's Next?</h3>
        <Link 
          href="/installers" 
          className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all hover:shadow-md"
        >
          Connect with Certified Installers
        </Link>
      </div>
    </div>
  );
}
