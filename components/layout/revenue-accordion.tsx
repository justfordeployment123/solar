"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SensitivityPoint } from "@/types/calculator";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#e5e5e5] bg-white rounded-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors focus:outline-none"
      >
        <span className="font-bold text-[#1a1a1a]">{title}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 text-sm md:text-base text-[#5a5859] leading-relaxed border-t border-[#e5e5e5]">
          {children}
        </div>
      )}
    </div>
  );
}

interface RevenueAccordionProps {
  inflationRatePercent?: number;
  // FIX (Acc.1): the engine has been producing `sensitivityToBatterySize`
  // (4 data points at 0.5× / 1× / 1.5× / 2× the current capacity) but no UI
  // surface ever showed it. Render a small table so the calculation isn't
  // wasted and the user can see "what if I doubled my battery".
  sensitivityToBatterySize?: SensitivityPoint[];
}

const formatCurrencyShort = (val: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

export function RevenueAccordion({
  inflationRatePercent = 3.8,
  sensitivityToBatterySize,
}: RevenueAccordionProps) {
  const formattedInflation = inflationRatePercent.toLocaleString('de-DE', { maximumFractionDigits: 1 });
  const hasSensitivity = Array.isArray(sensitivityToBatterySize) && sensitivityToBatterySize.length > 0;

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="w-2 h-2 bg-[#e20613]" />
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Ihre Einnahmequellen im Detail
        </h3>
      </div>

      <div className="space-y-3">
        <AccordionItem title="Regelenergie (PRL/SRL) & Netzstabilität">
          <p>
            Das Stromnetz muss eine konstante Frequenz von 50 Hertz halten. Bei Abweichungen durch Über- oder Unterproduktion springt die Regelenergie ein.
            Batteriespeicher eignen sich hervorragend für diesen Markt, da sie innerhalb von Millisekunden reagieren können (Primärregelleistung).
            Die Übertragungsnetzbetreiber honorieren diese ständige Bereitstellung mit sehr attraktiven und verlässlichen Zahlungen, was dies oft zur lukrativsten Einnahmequelle für größere Speicher macht.
          </p>
        </AccordionItem>

        <AccordionItem title="Strombörse (EPEX Spot Arbitrage)">
          <p>
            An der europäischen Strombörse (EPEX Spot) schwanken die Strompreise stündlich. Mit einem intelligent gesteuerten Speicher können Sie Strom aus dem Netz einkaufen,
            wenn die Preise extrem niedrig oder sogar negativ sind, und ihn in Zeiten hoher Preise selbst nutzen oder teuer zurück ins Netz verkaufen.
          </p>
        </AccordionItem>

        <AccordionItem title="Lastspitzenkappung (Peak Shaving)">
          <p>
            Gewerbliche Stromkunden zahlen oft nicht nur für die verbrauchte Energie (kWh), sondern auch einen sogenannten Leistungspreis für die höchste Leistungsspitze (kW) des Jahres.
            Durch &quot;Peak Shaving&quot; entlädt sich der Batteriespeicher exakt in den Momenten des höchsten Verbrauchs, kappt die Spitze ab und spart so direkt hohe Leistungspreise ein.
          </p>
        </AccordionItem>

        <AccordionItem title="Eigenverbrauchsoptimierung">
          <div className="space-y-4">
            <p>
              Dies ist der klassische Nutzen eines Speichers: Überschüssiger Solarstrom vom Tag wird gespeichert und in den Abend- und Nachtstunden verbraucht.
              Das senkt den Bezug von teurem Netzstrom und erhöht die Autarkie Ihres Unternehmens.
            </p>
            <div className="bg-[#eef2ff] border border-[#bbd4ff] p-4 rounded-md flex gap-3 items-start">
              <Info className="w-5 h-5 text-[#0066cc] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#1a1a1a]">
                Für die Berechnung der Eigenverbrauchsoptimierung wurde eine Strompreissteigerungsrate von {formattedInflation} % angenommen.
              </p>
            </div>
          </div>
        </AccordionItem>

        {hasSensitivity && (
          <AccordionItem title="Sensitivität: Jahresertrag bei unterschiedlichen Speichergrößen">
            <p className="mb-3">
              Wie verändert sich Ihr prognostizierter Jahresertrag, wenn Sie den Speicher kleiner oder größer dimensionieren?
              Die folgende Tabelle zeigt den Brutto-Jahresertrag für 50 %, 100 %, 150 % und 200 % Ihrer aktuellen Konfiguration.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#5a5859] uppercase text-[0.7rem] tracking-[0.15em] border-b border-[#e5e5e5]">
                    <th className="text-left py-2 pr-4 font-bold">Speichergröße</th>
                    <th className="text-right py-2 font-bold">Jahresertrag (Brutto)</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityToBatterySize!.map((point) => (
                    <tr key={point.batterySizeKwh} className="border-b border-[#f1f5f9] last:border-0">
                      <td className="py-2 pr-4 font-semibold text-[#1a1a1a]">
                        {Math.round(point.batterySizeKwh).toLocaleString('de-DE')} kWh
                      </td>
                      <td className="py-2 text-right tabular-nums text-[#1a1a1a] font-semibold">
                        {formatCurrencyShort(point.totalAnnualRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionItem>
        )}
      </div>
    </div>
  );
}
