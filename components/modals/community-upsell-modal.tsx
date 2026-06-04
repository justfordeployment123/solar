"use client";

import { useState } from "react";
import { X, Users } from "lucide-react";
import { useCalculatorStore } from "@/store/calculatorStore";

interface CommunityUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityUpsellModal({ isOpen, onClose }: CommunityUpsellModalProps) {
  const setFinancialInputs = useCalculatorStore((s) => s.setFinancialInputs);
  const financial = useCalculatorStore((s) => s.financial);

  const [parties, setParties] = useState<string>(financial.communityNumParties?.toString() ?? "5");
  const [kwhPerParty, setKwhPerParty] = useState<string>(financial.communityKwhPerParty?.toString() ?? "3500");
  const [sellPrice, setSellPrice] = useState<string>(financial.communitySellPriceCentsKwh?.toString() ?? "30");

  if (!isOpen) return null;

  const handleSave = () => {
    setFinancialInputs({
      communityEnabled: true,
      communityNumParties: parseFloat(parties) || 0,
      communityKwhPerParty: parseFloat(kwhPerParty) || 0,
      communitySellPriceCentsKwh: parseFloat(sellPrice) || 0,
    });
    onClose();
  };

  const handleDecline = () => {
    setFinancialInputs({ communityEnabled: false });
    onClose();
  };

  // Sufficiency preview (purely informational — the engine recomputes on save)
  const totalDemand = (parseFloat(parties) || 0) * (parseFloat(kwhPerParty) || 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#363636]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white shadow-2xl border border-[#dfdfdf] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#e20613] transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#d2d700] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1a1a1a]" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                Zusatzangebot
              </div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Strom an die Gemeinschaft verkaufen?
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#5a5859] leading-relaxed mb-6">
            Ihre PV-Anlage hat genug Reserve, um Nachbarn oder mehrere Parteien
            mit grünem Strom zu versorgen. Wir prüfen, ob die Sonnenproduktion
            reicht oder ob ein größerer Speicher sinnvoll wäre.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Anzahl Parteien" value={parties} onChange={setParties} step={1} suffix="Parteien" />
            <Field label="Verbrauch je Partei" value={kwhPerParty} onChange={setKwhPerParty} step={100} suffix="kWh/Jahr" />
            <Field label="Verkaufspreis" value={sellPrice} onChange={setSellPrice} step={0.5} suffix="Ct/kWh" />
          </div>

          {totalDemand > 0 && (
            <div className="text-xs text-[#5a5859] bg-[#fafafa] border border-[#e5e5e5] p-3 mb-6">
              Gesamtbedarf der Gemeinschaft: <strong className="text-[#1a1a1a]">{totalDemand.toLocaleString('de-DE')} kWh/Jahr</strong>.
              Reicht Ihre PV nicht aus, schlagen wir nach dem Speichern einen passenden Speicherausbau vor.
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-[#e5e5e5]">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-semibold text-[#5a5859] hover:text-[#1a1a1a] transition-colors"
            >
              Nein danke
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold bg-[#e20613] text-white hover:bg-[#b8050f] transition-colors"
            >
              In Berechnung übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, step, suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step: number;
  suffix: string;
}) {
  return (
    <div>
      <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#1a1a1a] mb-1.5">
        {label}
      </label>
      <div className="flex items-center border border-[#e5e5e5] focus-within:border-[#e20613] transition-colors">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-semibold text-[#1a1a1a] focus:outline-none"
        />
        <span className="px-3 py-2 text-xs text-[#5a5859] bg-[#fafafa] border-l border-[#e5e5e5]">
          {suffix}
        </span>
      </div>
    </div>
  );
}
