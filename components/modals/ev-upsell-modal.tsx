"use client";

import { useState } from "react";
import { X, Zap } from "lucide-react";
import { useCalculatorStore } from "@/store/calculatorStore";

interface EvUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvUpsellModal({ isOpen, onClose }: EvUpsellModalProps) {
  const setFinancialInputs = useCalculatorStore((s) => s.setFinancialInputs);
  const financial = useCalculatorStore((s) => s.financial);

  const [numChargers, setNumChargers] = useState<string>(financial.evNumChargers?.toString() ?? "2");
  const [powerKw, setPowerKw] = useState<string>(financial.evPowerKw?.toString() ?? "22");
  const [dailyHours, setDailyHours] = useState<string>(financial.evDailyHours?.toString() ?? "4");
  const [sellPrice, setSellPrice] = useState<string>(financial.evSellPriceCentsKwh?.toString() ?? "55");

  if (!isOpen) return null;

  const handleSave = () => {
    setFinancialInputs({
      evChargingEnabled: true,
      evNumChargers: parseFloat(numChargers) || 0,
      evPowerKw: parseFloat(powerKw) || 0,
      evDailyHours: parseFloat(dailyHours) || 0,
      evSellPriceCentsKwh: parseFloat(sellPrice) || 0,
    });
    onClose();
  };

  const handleDecline = () => {
    setFinancialInputs({ evChargingEnabled: false });
    onClose();
  };

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
            <div className="w-10 h-10 bg-[#e20613] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
                Zusatzangebot
              </div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                E-Ladestationen am Standort?
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#5a5859] leading-relaxed mb-6">
            Ihre Anlagengröße eignet sich hervorragend, um E-Ladepunkte zu
            betreiben. Geben Sie ein paar Eckdaten an, und wir nehmen die
            zusätzliche Marge in Ihre Wirtschaftlichkeitsrechnung auf.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Field label="Anzahl Ladepunkte" value={numChargers} onChange={setNumChargers} step={1} suffix="Stk." />
            <Field label="Leistung pro Punkt" value={powerKw} onChange={setPowerKw} step={1} suffix="kW" />
            <Field label="Tägliche Auslastung" value={dailyHours} onChange={setDailyHours} step={0.5} suffix="h/Tag" />
            <Field label="Verkaufspreis" value={sellPrice} onChange={setSellPrice} step={1} suffix="Ct/kWh" />
          </div>

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
