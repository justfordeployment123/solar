"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { ArrowLeft, Calculator, Euro, Check } from 'lucide-react';

export default function Step3Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const stepCompletion = useCalculatorStore((state) => state.stepCompletion);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);
  const financial = useCalculatorStore((state) => state.financial);
  const technical = useCalculatorStore((state) => state.technical);
  const setFinancialInputs = useCalculatorStore((state) => state.setFinancialInputs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !stepCompletion.step2) {
      router.replace('/calculator/step-2');
    }
  }, [mounted, stepCompletion.step2, router]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (technical.enablePeakShaving && (financial.gridFeesCentsKwh === null || financial.gridFeesCentsKwh === undefined)) {
      alert("Bitte geben Sie die Netzentgelte an, da Peak Shaving aktiviert ist.");
      return;
    }
    markStepComplete('step3', true);
    router.push('/calculator/results');
  };

  const handleInputChange = (field: keyof typeof financial) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'checkbox') {
      setFinancialInputs({ [field]: e.target.checked });
    } else {
      const value = e.target.value === '' ? null : Number(e.target.value);
      setFinancialInputs({ [field]: value });
    }
  };

  if (!mounted || !stepCompletion.step2) return null;

  return (
    <div className="px-6 lg:px-12 pt-10 max-w-4xl mx-auto flex flex-col min-h-full">
      <ProgressHeader
        currentStep={3}
        totalSteps={3}
        title="Finanzielle Kennzahlen"
        description="Konfigurieren Sie die finanziellen Parameter Ihres Batteriespeichersystems, um Ihren potenziellen ROI zu berechnen."
      />

      <div className="mb-12 flex-grow">
        <section className="bg-white border border-[#e5e5e5] p-8 lg:p-12 relative">
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#e20613]" />

          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#e20613] flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                Finanzdaten
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                Ihre wirtschaftlichen Parameter
              </h3>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <Input
              label="Aktueller Strompreis (€/kWh)"
              type="number"
              step="0.01"
              placeholder="0.35"
              tooltipText="Ihr aktueller Arbeitspreis für Strombezug in Cent pro kWh."
              value={financial.currentElectricityPriceCentsKwh ?? ''}
              onChange={handleInputChange('currentElectricityPriceCentsKwh')}
            />
            <div>
              <Input
                label="Jährliche Stromkosten (€)"
                type="number"
                placeholder="2400"
                tooltipText="Ihre geschätzten Stromkosten pro Jahr. Dient als Alternative zur direkten Eingabe des Verbrauchs."
                value={financial.yearlyElectricityBillEur ?? ''}
                onChange={handleInputChange('yearlyElectricityBillEur')}
              />
              {(() => {
                if (technical.annualConsumptionKwh && financial.currentElectricityPriceCentsKwh && financial.yearlyElectricityBillEur) {
                  const expected = technical.annualConsumptionKwh * financial.currentElectricityPriceCentsKwh;
                  const diff = Math.abs(expected - financial.yearlyElectricityBillEur);
                  const tolerance = expected * 0.2; // 20% tolerance
                  if (diff > tolerance) {
                    return (
                      <div className="mt-2 text-sm text-[#e20613] bg-[#fff5f5] p-3 rounded border border-[#ffcccc]">
                        ⚠️ <strong>Achtung:</strong> Die eingegebenen Stromkosten ({financial.yearlyElectricityBillEur} €) passen nicht zum angegebenen Verbrauch ({technical.annualConsumptionKwh} kWh) und Strompreis ({financial.currentElectricityPriceCentsKwh} €). Rechnerisch müssten diese bei ca. {Math.round(expected)} € liegen.
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
            <div>
              <Input
                label="Zielbudget (€)"
                type="number"
                placeholder="12500"
                tooltipText="Ihr geplantes Budget für den neuen Batteriespeicher."
                value={financial.targetBudgetEur ?? ''}
                onChange={handleInputChange('targetBudgetEur')}
              />
              {financial.targetBudgetEur && (
                <div className="mt-3 text-sm text-[#0066cc] bg-[#eef2ff] p-3 rounded border border-[#bbd4ff]">
                  {(() => {
                    const estimatedConsumption = technical.annualConsumptionKwh || (financial.yearlyElectricityBillEur ? (financial.yearlyElectricityBillEur / (financial.currentElectricityPriceCentsKwh || 0.35)) : 5000);
                    const recommendedKwh = Math.max(10, Math.ceil(estimatedConsumption / 1000) * 1.5, Math.floor((financial.targetBudgetEur || 0) / 1000));
                    return `💡 Basierend auf Ihren Daten empfehlen wir eine großzügige Speichergröße von ca. ${recommendedKwh} kWh für maximale Autarkie.`;
                  })()}
                </div>
              )}
              <div className="mt-3 text-sm text-[#1a1a1a] bg-[#fafafa] p-4 rounded border border-[#e5e5e5]">
                <p className="font-semibold mb-2">Sie können gewinnbringend größer auslegen, wenn Ihr System an Märkten teilnimmt:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#5a5859]">
                  <li>Strombörse: 5-8% Rendite zu erwarten</li>
                  <li>Regelenergie: 7-12% Rendite zu erwarten</li>
                  <li>Kombination (beides): 12-18% Rendite</li>
                </ul>
              </div>
            </div>

            {technical.enablePeakShaving && (
              <div className="pt-6 mt-2 border-t border-[#e5e5e5]">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 bg-[#d2d700]" />
                  <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                    Peak Shaving Daten
                  </h4>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Netzentgelte (Cent/kWh)"
                    type="number"
                    placeholder="z.B. 8.5"
                    tooltipText="Netzentgelte des Netzbetreibers. Zwingend erforderlich für Peak Shaving."
                    value={financial.gridFeesCentsKwh ?? ''}
                    onChange={handleInputChange('gridFeesCentsKwh')}
                  />
                  <Input
                    label="Leistungspreis (€/kW)"
                    type="number"
                    step="0.1"
                    placeholder="45"
                    value={financial.demandChargeEurPerKw ?? ''}
                    onChange={handleInputChange('demandChargeEurPerKw')}
                  />
                  <Input
                    label="Einsparung (%)"
                    type="number"
                    step="1"
                    placeholder="75"
                    value={financial.peakShavingReductionPercentage ?? ''}
                    onChange={handleInputChange('peakShavingReductionPercentage')}
                  />
                </div>
              </div>
            )}

            {technical.enableLoadShifting && (
              <div className="pt-6 mt-2 border-t border-[#e5e5e5]">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 bg-[#ffdb00]" />
                  <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                    Load Shifting Daten
                  </h4>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Dynamischer Tarif (Cent/kWh)"
                    type="number"
                    step="0.1"
                    placeholder="30"
                    tooltipText="Der höchste Preis in Ihrem dynamischen Stromtarif, zu dem Sie Strom nutzen möchten."
                    value={financial.dynamicFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('dynamicFeedInTariffCentsKwh')}
                  />
                  <Input
                    label="Standard Tarif (Cent/kWh)"
                    type="number"
                    step="0.1"
                    placeholder="8"
                    tooltipText="Der Basispreis oder durchschnittliche Preis in Ihrem Stromtarif."
                    value={financial.standardFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('standardFeedInTariffCentsKwh')}
                  />
                  {!technical.enablePeakShaving && (
                    <Input
                      label="Netzentgelte (Cent/kWh)"
                      type="number"
                      step="0.1"
                      placeholder="12"
                      tooltipText="Netzentgelte des Netzbetreibers, die beim Netzbezug anfallen."
                      value={financial.gridFeesCentsKwh ?? ''}
                      onChange={handleInputChange('gridFeesCentsKwh')}
                    />
                  )}
                </div>
              </div>
            )}

            <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 bg-[#fafafa] border border-[#e5e5e5] hover:border-[#e20613] transition-colors group">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={financial.vppParticipationEnabled}
                  onChange={handleInputChange('vppParticipationEnabled')}
                />
                <div className="w-6 h-6 border-2 border-[#e5e5e5] peer-checked:bg-[#e20613] peer-checked:border-[#e20613] flex items-center justify-center text-white transition-colors">
                  <Check
                    className={`w-4 h-4 ${
                      financial.vppParticipationEnabled ? 'opacity-100' : 'opacity-0'
                    }`}
                    strokeWidth={3}
                  />
                </div>
              </div>
              <span className="text-[0.8rem] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] group-hover:text-[#e20613] transition-colors">
                VPP-Teilnahme aktivieren
              </span>
            </label>
          </div>
        </section>
      </div>

      <footer className="mt-auto pb-10 flex justify-between items-center py-6 border-t border-[#e5e5e5] w-full">
        <Link
          prefetch={false}
          href="/calculator/step-2"
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#5a5859] hover:text-[#e20613] flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Zurück
        </Link>
        <Button variant="primary" onClick={handleNext}>
          <Calculator className="w-5 h-5" /> Ergebnisse berechnen
        </Button>
      </footer>
    </div>
  );
}
