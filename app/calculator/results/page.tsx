"use client";

import { useState, useEffect, useRef } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import { RevenuePie } from "@/components/charts/revenue-pie";
import { ProjectionChart } from "@/components/charts/projection-chart";
import { toPng } from "html-to-image";
import { LeadCaptureModal } from "@/components/modals/lead-capture-modal";
import { ReferralModal } from "@/components/modals/referral-modal";
import { EvUpsellModal } from "@/components/modals/ev-upsell-modal";
import { CommunityUpsellModal } from "@/components/modals/community-upsell-modal";
import { RevenueAccordion } from "@/components/layout/revenue-accordion";
import Link from "next/link";
import { ArrowLeft, Download, Battery, Zap, Euro, TrendingUp, Share2, Info, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  tooltipText,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  tooltipText?: string;
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] p-6 relative">
      <span className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accent }} />
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
            {title}
          </h3>
          {tooltipText && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs leading-relaxed">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
  const { technical, financial, derivedResults, setTechnicalInputs, setFinancialInputs, activeInstaller, _hasHydrated } = useCalculatorStore();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isEvModalOpen, setIsEvModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Phase-2 upsell triggers per the client's brief. We show each prompt once
  // per session so it doesn't nag returning users; sessionStorage keys are
  // namespaced to keep dev vs. prod cleanly separated.
useEffect(() => {
    if (!derivedResults) return;
    const battery = technical.currentBatteryCapacityKwh ?? 0;
    const pv = technical.pvSizeKwp ?? 0;
    const evTrigger = battery > 100 || (pv > 20 && battery > 60);
    const communityTrigger = pv > 50;

if (evTrigger && !financial.evChargingEnabled && !sessionStorage.getItem('upsell:ev')) {
      sessionStorage.setItem('upsell:ev', '1');
      setIsEvModalOpen(true);
    } 
    // FIX: Removed 'else' so both modals can trigger independently in the same session
    if (communityTrigger && !financial.communityEnabled && !sessionStorage.getItem('upsell:community')) {
      sessionStorage.setItem('upsell:community', '1');
      setIsCommunityModalOpen(true);
    }
  }, [
    derivedResults, 
    technical.currentBatteryCapacityKwh, 
    technical.pvSizeKwp, 
    financial.evChargingEnabled, 
    financial.communityEnabled
  ]);

  // Capture the user's configured battery capacity on first render by reading
  // the (zustand-persist) store directly. Previously sliderMax was initialized
  // to 100 and a "lock effect" updated it only after _hasHydrated flipped — if
  // the user dragged the slider in that window the value was clamped to 100
  // and the lock then captured that small value, making it impossible to drag
  // back up to the original size (the "1100 -> 100, can't move back" bug).
  const [initialCapacity, setInitialCapacity] = useState<number>(() =>
    typeof window !== 'undefined'
      ? (useCalculatorStore.getState().technical.currentBatteryCapacityKwh ?? 0)
      : 0
  );

  // Fallback in case zustand-persist hadn't hydrated at first render.
  useEffect(() => {
    if (initialCapacity === 0 && _hasHydrated && (technical.currentBatteryCapacityKwh ?? 0) > 0) {
      setInitialCapacity(technical.currentBatteryCapacityKwh ?? 0);
    }
  }, [_hasHydrated, initialCapacity, technical.currentBatteryCapacityKwh]);

  // Safety net via Math.max: the slider's max can never fall below the user's
  // current value, so a drag can't clamp the value down and trap the user.
  const sliderMax = Math.max(100, initialCapacity * 3, technical.currentBatteryCapacityKwh ?? 0);
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (Number.isFinite(val)) {
      setTechnicalInputs({ currentBatteryCapacityKwh: Math.max(0, val) });
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

  // FIX: Move autarky declaration above handleDownloadPdf to prevent TDZ closure crash
  const autarkyPercent = derivedResults.autarkyPercent;
  const assumptions = derivedResults.calculationAssumptions ?? {
    degradationRatePercent: 2,
    inflationRatePercent: 3.8,
    marketDeclineRatePercent: 2,
    maintenanceYear: 10,
    maintenanceYears: [10],
    maintenanceCostPercent: 10,
    engineeringFeePercent: 3.8,
  };
  const formatPercent = (value: number) =>
    value.toLocaleString('de-DE', { maximumFractionDigits: 1 });

  // PDF flow: capture the chart refs to PNG, POST everything to the server
  // route /api/report which renders the PDF with @react-pdf/renderer in Node,
  // then trigger the download. The previous client-side `pdf().toBlob()` path
  // failed silently for some users (React 19 + Next 16 + Turbopack bundling
  // of @react-pdf/renderer). Server-side rendering avoids those bundler
  // pitfalls and keeps the library out of the browser bundle entirely.
  const handleDownloadPdf = async () => {
    if (!derivedResults) {
      alert("Keine Berechnungsdaten vorhanden.");
      return;
    }
    setIsGeneratingImages(true);
    try {
      // Capture charts with a per-chart timeout so a hung SVG conversion (a
      // known recharts/echarts + html-to-image edge case) can't freeze the
      // whole flow. A null ref or a failed capture is non-fatal — the PDF
      // still renders, just without that chart. Previously the handler
      // returned silently if either ref was null, producing the user-visible
      // symptom "nothing happens when I click the button".
      const captureChart = async (el: HTMLDivElement | null): Promise<string | undefined> => {
        if (!el) return undefined;
        try {
          return await Promise.race([
            toPng(el, { cacheBust: true, pixelRatio: 2 }),
            new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 8000)),
          ]);
        } catch (e) {
          console.warn("Chart capture failed", e);
          return undefined;
        }
      };
      const [pieChartImage, barChartImage] = await Promise.all([
        captureChart(pieRef.current),
        captureChart(barRef.current),
      ]);

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technical,
          financial,
          derivedResults,
          pieChartImage,
          barChartImage,
          activeLogo: activeInstaller?.logoUrl || "/solar-logo.png",
          companyName: activeInstaller?.companyName || "",
          autarkyPercent,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Server ${res.status}: ${detail}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mein-solar-batterie-bericht.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert(
        "PDF-Erstellung fehlgeschlagen. Bitte versuchen Sie es erneut.\n\n" +
        (err instanceof Error ? err.message : "Unbekannter Fehler.")
      );
    } finally {
      setIsGeneratingImages(false);
    }
  };

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
              min={0}
              max={sliderMax}
              step="1"
              value={technical.currentBatteryCapacityKwh ?? 0}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#e5e5e5] appearance-none cursor-pointer accent-[#e20613] transition-all duration-150"
            />
            <span className="font-bold text-xl text-[#1a1a1a] tabular-nums w-20 text-right transition-all duration-200">
              {technical.currentBatteryCapacityKwh || 0}
              <span className="text-xs font-semibold text-[#5a5859] ml-1">kWh</span>
            </span>
          </div>
          {initialCapacity > 0 && (
            <div className="mt-2 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.18em]">
              <span className="text-[#5a5859]">−100%</span>
              <span
                className={
                  (technical.currentBatteryCapacityKwh ?? 0) >= initialCapacity
                    ? 'text-[#1a8a1a]'
                    : 'text-[#e20613]'
                }
              >
                {((((technical.currentBatteryCapacityKwh ?? 0) - initialCapacity) / initialCapacity) * 100 >= 0 ? '+' : '')}
                {Math.round((((technical.currentBatteryCapacityKwh ?? 0) - initialCapacity) / initialCapacity) * 100)}% gegenüber Empfehlung
              </span>
              <span className="text-[#5a5859]">+200%</span>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#e5e5e5] space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#e20613]"
                checked={technical.enablePrl === true || technical.enableSrl === true}
                onChange={(e) => setTechnicalInputs({ enablePrl: e.target.checked, enableSrl: e.target.checked })}
              />
              <span className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#e20613] transition-colors">
                Netzstabilität (PRL/SRL)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#e20613]"
                checked={technical.enableEpex === true}
                onChange={(e) => setTechnicalInputs({ enableEpex: e.target.checked })}
              />
              <span className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#e20613] transition-colors">
                Energiehandel (EPEX)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#e20613]"
                checked={financial.vppParticipationEnabled}
                onChange={(e) => setFinancialInputs({ vppParticipationEnabled: e.target.checked })}
              />
              <span className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#e20613] transition-colors">
                VPP-Teilnahme
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Negative ROI Warning */}
      {(derivedResults.yearlyProjection[derivedResults.yearlyProjection.length - 1]?.cumulative || 0) < 0 && (
        <div className="bg-[#fff5f5] border-l-4 border-[#e20613] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#e20613] mb-2">Hinweis zur Wirtschaftlichkeit</h3>
          <div className="text-sm md:text-base text-[#1a1a1a] leading-relaxed space-y-2">
            <p>Es ist gut und sinnvoll, dass Sie Ihren Speicher etwas überdimensionieren wollen. Aber dann sollten Sie auch:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Das Gerät am Arbitrage-Markt (EPEX Spot) teilnehmen lassen.</li>
              <li>Dem Regelenergiemarkt zur Verfügung stellen, um die Netzbetreiber netzdienlich zu unterstützen.</li>
            </ol>
            <p className="text-sm italic text-[#5a5859] mt-2">(Ganz unter uns: Damit können Sie wirklich Geld verdienen.)</p>
          </div>
        </div>
      )}

      {/* Bottleneck Warning: grid connection smaller than storage power */}
      {derivedResults.bottleneckActive && (
        <div className="bg-[#fffbe6] border-l-4 border-[#d2a800] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#8a6d00] mb-2">Hinweis: Netzanschluss-Engpass (Bottleneck)</h3>
          <p className="text-sm md:text-base text-[#1a1a1a] leading-relaxed">
            Ihre nutzbare Speicherleistung ({derivedResults.effectiveInverterPowerKw.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kW) übersteigt Ihr Netzeinspeise-Limit ({(technical.gridExportLimitKw ?? 0).toLocaleString('de-DE', { maximumFractionDigits: 1 })} kW).
            Die netzdienlichen Erträge (Arbitrage & Regelenergie) wurden entsprechend auf die tatsächlich
            nutzbare Anschlussleistung gedrosselt. Ein stärkerer Netzanschluss würde die Erträge erhöhen.
          </p>
        </div>
      )}

      {/* Energy Community Battery Upgrade Suggestion */}
      {derivedResults.recommendedBatteryUpgradeKwh != null && derivedResults.recommendedBatteryUpgradeKwh > 0 && (
        <div className="bg-[#eef7ff] border-l-4 border-[#0066cc] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0066cc] mb-2">Empfehlung: Speicher vergrößern</h3>
          <p className="text-sm md:text-base text-[#1a1a1a] leading-relaxed">
            Der Strombedarf Ihrer Energiegemeinschaft übersteigt die tägliche PV-Erzeugung.
            Mit ca. <strong>+{derivedResults.recommendedBatteryUpgradeKwh} kWh</strong> zusätzlicher Speicherkapazität
            können Sie mittags günstig nachladen und die Lücke schließen.
          </p>
        </div>
      )}

      {/* NEW: Inflation Info Box (Client Request) */}
      <div className="bg-[#f8fafc] border-l-4 border-[#5a5859] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#5a5859] mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Hinweis zur Berechnung</h3>
            <p className="text-sm text-[#5a5859] leading-relaxed">
              Für die Berechnung der Eigenverbrauchsoptimierung wurde eine Strompreissteigerungsrate von <strong>{formatPercent(assumptions.inflationRatePercent)} % pro Jahr</strong> angenommen.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Kumulierter Gewinn"
          value={formatCurrency(derivedResults.yearlyProjection[derivedResults.yearlyProjection.length - 1]?.cumulative || 0)}
          subtitle="Gesamtergebnis nach 15 Jahren"
          icon={TrendingUp}
          accent="#1a1a1a"
          tooltipText={`Beinhaltet ${formatPercent(assumptions.engineeringFeePercent)}% Engineering-Gebühr für die genaue Erfassung von Ist-Daten und Infrastruktur. (Fördermittel möglich).`}
        />
        <MetricCard
          title="Jahresertrag Jahr 1"
          value={formatCurrency(derivedResults.totalAnnualRevenue)}
          subtitle="Einnahmen & Einsparungen"
          icon={Euro}
          accent="#5a5859"
        />
        <MetricCard
          title="Autarkiegrad"
          value={`${autarkyPercent}%`}
          subtitle="Netzunabhängigkeit"
          icon={Zap}
          accent="#d2d700"
        />
        <MetricCard
          title="Deckungsjahr"
          value={
            derivedResults.paybackYears !== null 
              ? `Jahr ${Math.ceil(derivedResults.paybackYears)}` 
              : "Keine Amortisation"
          }
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
              onClick={handleDownloadPdf}
              disabled={isGeneratingImages}
            >
              <Download className="w-4 h-4" />
              {isGeneratingImages ? "PDF wird erstellt..." : "PDF-Bericht herunterladen"}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <RevenueAccordion
          inflationRatePercent={assumptions.inflationRatePercent}
          sensitivityToBatterySize={derivedResults.sensitivityToBatterySize}
        />
      </div>

      {/* NEW: Catalog Downloads */}
      <div className="bg-[#f8fafc] border border-[#e5e5e5] p-8 md:p-12 text-center mt-4">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3">
          Erfahren Sie mehr über unsere Technologie
        </h3>
        <p className="text-[#5a5859] mb-8 max-w-2xl mx-auto leading-relaxed">
          Laden Sie sich unsere detaillierten Produktkataloge herunter.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 px-6"
            onClick={() => window.open("https://neehkgiayqkpvnuwqcnu.supabase.co/storage/v1/object/public/Catalog%20Bucket/marketing-1.pdf", "_blank")}
          >
            <Download className="w-4 h-4 mr-2" />
            Gesamtkatalog (39 Seiten)
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 px-6"
            onClick={() => window.open("https://neehkgiayqkpvnuwqcnu.supabase.co/storage/v1/object/public/Catalog%20Bucket/marketing-2.pdf", "_blank")}
          >
            <Download className="w-4 h-4 mr-2" />
            Broschüre Landwirtschaft
          </Button>
        </div>
      </div>

      {/* CTA band */}
      <div className="relative bg-[#1a1a1a] text-white p-8 md:p-12 overflow-hidden mt-4">
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
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsReferralModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/30 font-bold uppercase tracking-[0.2em] text-xs md:text-sm px-6 py-4 hover:border-white hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4" /> Freund empfehlen
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 bg-[#e20613] text-white font-bold uppercase tracking-[0.2em] text-xs md:text-sm px-7 py-4 hover:bg-[#ffdb00] hover:text-black transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              Angebot anfordern
            </button>
          </div>
        </div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
      <EvUpsellModal isOpen={isEvModalOpen} onClose={() => setIsEvModalOpen(false)} />
      <CommunityUpsellModal isOpen={isCommunityModalOpen} onClose={() => setIsCommunityModalOpen(false)} />
    </div>
  );
}
