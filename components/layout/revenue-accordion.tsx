"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function RevenueAccordion() {
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
            Durch "Peak Shaving" entlädt sich der Batteriespeicher exakt in den Momenten des höchsten Verbrauchs, kappt die Spitze ab und spart so direkt hohe Leistungspreise ein.
          </p>
        </AccordionItem>

        <AccordionItem title="Eigenverbrauchsoptimierung">
          <p>
            Dies ist der klassische Nutzen eines Speichers: Überschüssiger Solarstrom vom Tag wird gespeichert und in den Abend- und Nachtstunden verbraucht. 
            Das senkt den Bezug von teurem Netzstrom und erhöht die Autarkie Ihres Unternehmens.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}
