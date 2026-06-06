"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ProgressHeader } from '@/components/layout/progress-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculatorStore';
import { normalizeElectricityPriceCents } from '@/lib/calculations/engine';
import { ArrowLeft, Calculator, Euro, Check, Info } from 'lucide-react';
import { InfoModal } from '@/components/modals/info-modal';

export default function Step3Page() {
  const router = useRouter();
  const params = useParams() as { slug: string };
  const [isRegelenergieModalOpen, setIsRegelenergieModalOpen] = useState(false);

  const hasHydrated = useCalculatorStore((state) => state._hasHydrated);
  const stepCompletion = useCalculatorStore((state) => state.stepCompletion);
  const markStepComplete = useCalculatorStore((state) => state.markStepComplete);
  const financial = useCalculatorStore((state) => state.financial);
  const technical = useCalculatorStore((state) => state.technical);
  const setFinancialInputs = useCalculatorStore((state) => state.setFinancialInputs);

  useEffect(() => {
    if (hasHydrated && !stepCompletion.step2) {
      router.replace(`/i/${params.slug}/step-2`); // <--- FIX: Keeps them in the installer funnel
    }
  }, [hasHydrated, stepCompletion.step2, router, params.slug]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (technical.enablePeakShaving && (financial.demandChargeEurPerKw === null || financial.demandChargeEurPerKw === undefined)) {
      alert("Bitte geben Sie den Leistungspreis an, da Peak Shaving aktiviert ist.");
      return;
    }
    markStepComplete('step3', true);
    router.push(`/i/${params.slug}/results`);
  };

  const handleInputChange = (field: keyof typeof financial) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'checkbox') {
      setFinancialInputs({ [field]: e.target.checked });
    } else {
      if (e.target.value === '') {
        setFinancialInputs({ [field]: null });
        return;
      }
      const parsed = Math.max(0, Number(e.target.value.replace(',', '.')));
      const val = field === 'peakShavingReductionPercentage' ? Math.min(100, parsed) : parsed;
      if (Number.isFinite(val)) {
        setFinancialInputs({ [field]: val });
      }
    }
  };
  
  if (!hasHydrated || !stepCompletion.step2) return null;

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
                label="Aktueller Strompreis (Cent/kWh)"
                type="number"
                min="0"
                step="0.1"
              placeholder="35"
              tooltipText="Ihr aktueller Arbeitspreis für Strombezug in Cent pro kWh."
              value={financial.currentElectricityPriceCentsKwh ?? ''}
              onChange={handleInputChange('currentElectricityPriceCentsKwh')}
            />
            <div>
              <Input
                label="Jährliche Stromkosten (€)"
                type="number"
                min="0"
                placeholder="2400"
                tooltipText="Ihre geschätzten Stromkosten pro Jahr. Dient als Alternative zur direkten Eingabe des Verbrauchs."
                value={financial.yearlyElectricityBillEur ?? ''}
                onChange={handleInputChange('yearlyElectricityBillEur')}
              />
              {(() => {
                const rawPrice = financial.currentElectricityPriceCentsKwh;
                // Real retail prices are ~15–60 ct/kWh. A value below 3 almost
                // certainly means the user typed €/kWh (e.g. 0,35) into the Cent field.
                const looksLikeEuro = rawPrice != null && rawPrice > 0 && rawPrice < 3;
                if (looksLikeEuro) {
                  return (
                    <div className="mt-2 text-sm text-[#e20613] bg-[#fff5f5] p-3 rounded border border-[#ffcccc]">
                      ⚠️ <strong>Einheit prüfen:</strong> Dieses Feld erwartet den Preis in <strong>Cent/kWh</strong> (z.B. 35 für 0,35 €/kWh). Sie haben {rawPrice} eingegeben – das sieht nach €/kWh aus. Wir rechnen automatisch mit {normalizeElectricityPriceCents(rawPrice)} Cent.
                    </div>
                  );
                }
                if (technical.annualConsumptionKwh && rawPrice != null && financial.yearlyElectricityBillEur) {
                  const normalizedPrice = normalizeElectricityPriceCents(rawPrice);
                  const expected = technical.annualConsumptionKwh * (normalizedPrice / 100);
                  const diff = Math.abs(expected - financial.yearlyElectricityBillEur);
                  const tolerance = expected * 0.2; // 20% tolerance
                  if (diff > tolerance) {
                    return (
                      <div className="mt-2 text-sm text-[#e20613] bg-[#fff5f5] p-3 rounded border border-[#ffcccc]">
                        ⚠️ <strong>Achtung:</strong> Die eingegebenen Stromkosten ({financial.yearlyElectricityBillEur} €) passen nicht zum angegebenen Verbrauch ({technical.annualConsumptionKwh} kWh) und Strompreis ({normalizedPrice} Cent). Rechnerisch müssten diese bei ca. {Math.round(expected)} € liegen.
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
            <Input
              label="Tatsächliche Systemkosten (€)"
              type="number"
              min="0"
              placeholder="z.B. 28500"
              tooltipText="Der tatsächliche Angebotspreis für den Speicher (CapEx). Wird – falls angegeben – direkt für ROI und Amortisation verwendet. Bei leerem Feld schätzt der Rechner die Kosten anhand der Kapazität."
              value={financial.actualSystemCostEur ?? ''}
              onChange={handleInputChange('actualSystemCostEur')}
            />
            <div>
              <Input
                label="Investitionsvolumen (€)"
                type="number"
                min="0"
                placeholder="12500"
                tooltipText="Ihr geplantes Budget für den neuen Batteriespeicher."
                value={financial.targetBudgetEur ?? ''}
                onChange={handleInputChange('targetBudgetEur')}
              />
              {financial.targetBudgetEur && (
                <div className="mt-3 text-sm text-[#0066cc] bg-[#eef2ff] p-3 rounded border border-[#bbd4ff]">
                  {(() => {
                    const estimatedConsumption = technical.annualConsumptionKwh || (financial.yearlyElectricityBillEur ? (financial.yearlyElectricityBillEur / (normalizeElectricityPriceCents(financial.currentElectricityPriceCentsKwh) / 100)) : 5000);
                    // Recommended battery size is driven by consumption only.
                    // It must NOT scale with the target-budget field — that
                    // produces nonsensical sizes (e.g. 485 kWh for a 16,500 kWh
                    // home just because the budget is €485k).
                    const recommendedKwh = Math.max(10, Math.ceil(estimatedConsumption / 1000) * 1.5);
                    return `💡 Basierend auf Ihren Daten empfehlen wir eine großzügige Speichergröße von ca. ${recommendedKwh} kWh für maximale Autarkie.`;
                  })()}
                </div>
              )}
              <div className="mt-3 text-sm text-[#1a1a1a] bg-[#fafafa] p-4 rounded border border-[#e5e5e5] relative">
                <button 
                  type="button"
                  onClick={() => setIsRegelenergieModalOpen(true)}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-[#e20613] transition-colors"
                  title="Mehr über Regelenergie erfahren"
                >
                  <Info className="w-4 h-4" />
                </button>
                <p className="font-semibold mb-2 pr-6">Sie können gewinnbringend größer auslegen, wenn Ihr System an Märkten teilnimmt:</p>
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
                    label="Netzentgelt (Cent/kWh)"
                    type="number"
                    min="0"
                    placeholder="8.5"
                    tooltipText="Bitte geben Sie das Netzentgelt Ihres Netzbetreibers ein."
                    value={financial.gridFeesCentsKwh ?? ''}
                    onChange={handleInputChange('gridFeesCentsKwh')}
                  />
                  <Input
                    label="Leistungspreis (€/kW)"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="45"
                    value={financial.demandChargeEurPerKw ?? ''}
                    onChange={handleInputChange('demandChargeEurPerKw')}
                  />
                  <Input
                    label="Einsparung (%)"
                    type="number"
                    min="0"
                    max="100"
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
                    min="0"
                    step="0.1"
                    placeholder="30"
                    tooltipText="Geben Sie den Preis ein, zu dem Sie den Strom liefern möchten. Wenn Sie nichts eingeben, verwenden wir historische Marktdaten."
                    value={financial.dynamicFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('dynamicFeedInTariffCentsKwh')}
                  />
                  <Input
                    label="Standard Tarif (Cent/kWh)"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="8"
                    tooltipText="Der Basispreis oder durchschnittliche Preis in Ihrem Stromtarif."
                    value={financial.standardFeedInTariffCentsKwh ?? ''}
                    onChange={handleInputChange('standardFeedInTariffCentsKwh')}
                  />
                  {!technical.enablePeakShaving && (
                    <Input
                      label="Netzentgelt (Cent/kWh)"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="12"
                      tooltipText="Bitte geben Sie das Netzentgelt Ihres Netzbetreibers ein."
                      value={financial.gridFeesCentsKwh ?? ''}
                      onChange={handleInputChange('gridFeesCentsKwh')}
                    />
                  )}
                </div>
              </div>
            )}

            {technical.enableEpex && !technical.enablePeakShaving && !technical.enableLoadShifting && (
              <div className="pt-6 mt-2 border-t border-[#e5e5e5]">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 bg-[#e20613]" />
                  <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                    Energiehandel Daten
                  </h4>
                </div>
                <Input
                  label="Netzentgelt (Cent/kWh)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="5"
                  tooltipText="Bitte geben Sie das Netzentgelt Ihres Netzbetreibers ein. Es wird bei der EPEX-Arbitrage von der Marge abgezogen, da Netzentgelte beim Strombezug anfallen."
                  value={financial.gridFeesCentsKwh ?? ''}
                  onChange={handleInputChange('gridFeesCentsKwh')}
                />
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
          href={`/i/${params.slug}/step-2`}
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#5a5859] hover:text-[#e20613] flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Zurück
        </Link>
        <Button variant="primary" onClick={handleNext}>
          <Calculator className="w-5 h-5" /> Ergebnisse berechnen
        </Button>
      </footer>
      <InfoModal 
        isOpen={isRegelenergieModalOpen} 
        onClose={() => setIsRegelenergieModalOpen(false)}
        title="Warum an Strommärkten teilnehmen?"
      >
        <p>
          Das Stromnetz muss jederzeit im Gleichgewicht sein – Erzeugung und Verbrauch müssen exakt übereinstimmen. Da erneuerbare Energien wie Wind und Sonne stark schwanken, entstehen kurzfristige Ungleichgewichte im Netz.
        </p>
        <p>
          <strong>Ihre Chance (Regelenergie):</strong> Moderne Batteriespeicher können innerhalb von Sekundenbruchteilen Strom einspeisen oder aufnehmen, um das Netz zu stabilisieren. Die Übertragungsnetzbetreiber (ÜNB) bezahlen Sie für diese Dienstleistung außerordentlich gut (7-12% Rendite).
        </p>
        <p>
          <strong>Ihre Chance (Strombörse):</strong> Sie können Strom einkaufen, wenn er günstig ist (oder sogar negative Preise hat), und ihn verkaufen oder selbst nutzen, wenn er teuer ist (5-8% Rendite).
        </p>
        <p>
          <strong>Darum lohnt sich ein größerer Speicher:</strong> Je mehr Kapazität Sie dem Netz zur Verfügung stellen können, desto höher fallen Ihre Renditen aus. Während kleine Heimspeicher oft nur den Eigenverbrauch abdecken, öffnen größere Speicher den Zugang zu hochlukrativen Märkten wie der Primärregelleistung (PRL) und der Sekundärregelleistung (SRL).
        </p>
      </InfoModal>
    </div>
  );
}
