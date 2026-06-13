'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, X, Info, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PreviewStats {
  totalConsumptionKwh: number;
  maxPeakKw: number;
  dataPoints: number;
  days: number;
}

export function CsvUploader() {
  const store = useCalculatorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  // Mapping Config
  const [dateCol, setDateCol] = useState<string>('');
  const [valCol, setValCol] = useState<string>('');
  const [unit, setUnit] = useState<string>('kWh');
  const [interval, setIntervalStr] = useState<string>('15');

  // Derived
  const [previewStats, setPreviewStats] = useState<PreviewStats | null>(null);
  const [mappingError, setMappingError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawFile(file);
    setIsProcessing(true);

Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true, // FIX: Offload parsing to web worker so the UI doesn't freeze on large files
      complete: (fullResults) => {
        const data = fullResults.data as Record<string, string>[];
        if (data.length === 0) {
          store.setCsvMetadata({
            hasErrors: true,
            parseErrorSurface: 'Die CSV-Datei ist leer.',
            isConfigured: false,
            rowCount: 0,
            fileName: file.name,
            fallbackToManualMode: false
          });
          setIsProcessing(false);
          return;
        }

        const detectedHeaders = fullResults.meta.fields || Object.keys(data[0]);
        setHeaders(detectedHeaders);
        setParsedData(data);

        // Smart auto-select headers
        const guessDate = detectedHeaders.find(h => /time|date|zeit|datum/i.test(h)) || detectedHeaders[0] || '';
        const guessVal = detectedHeaders.find(h => /consumption|wert|kwh|leistung|verbrauch/i.test(h)) || detectedHeaders[1] || '';

        setDateCol(guessDate);
        setValCol(guessVal);

        setIsModalOpen(true);
        setIsProcessing(false);
      },
      error: (err: Error) => {
        store.setCsvMetadata({
          hasErrors: true,
          parseErrorSurface: `Einlesefehler: ${err.message}`,
          isConfigured: false,
          rowCount: 0,
          fileName: file.name,
          fallbackToManualMode: false
        });
        setIsProcessing(false);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!isModalOpen || parsedData.length === 0 || !valCol) return;

    let total = 0;
    let maxKw = 0;
    let validCount = 0;

    const isKw = unit === 'kW';
    const isW = unit === 'W';
    const isKwh = unit === 'kWh';
    const intervalMins = parseInt(interval) || 15;
    const hoursPerInterval = intervalMins / 60;

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const valRaw = row[valCol];

      if (valRaw == null || valRaw === '') continue;

      // FIX: Safely strip German thousands separators before parsing the decimal comma
      const valRawClean = String(valRaw).trim().replace(/\./g, '').replace(',', '.');
      const val = parseFloat(valRawClean);
      // FIX (CSVU.1 CRITICAL): the old `if (!Number.isFinite(val))` branch
      // was inverted — it processed INVALID values and silently skipped valid
      // ones. The preview was always 0 kWh, and the user could apply an
      // import that wiped their annualConsumptionKwh down to 0. Skip invalid
      // rows and count the valid ones.
      if (!Number.isFinite(val)) continue;
      validCount++;
      let powerKw = 0;
      let energyKwh = 0;

      if (isKwh) {
        energyKwh = val;
        powerKw = energyKwh / hoursPerInterval;
      } else if (isKw) {
        powerKw = val;
        energyKwh = powerKw * hoursPerInterval;
      } else if (isW) {
        powerKw = val / 1000;
        energyKwh = powerKw * hoursPerInterval;
      }

      total += energyKwh;
      if (powerKw > maxKw) maxKw = powerKw;
    }

    if (validCount === 0) {
      // FIX (CSVU.2): was "Konnte Nein numerischen Werte…" — broken German.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMappingError("Konnte keine numerischen Werte in der gewählten Verbrauchs-Spalte finden.");
      setPreviewStats(null);
    } else {
      setMappingError(null);
      setPreviewStats({
        totalConsumptionKwh: total,
        maxPeakKw: maxKw,
        dataPoints: validCount,
        days: validCount * (intervalMins / (60 * 24))
      });
    }
  }, [parsedData, valCol, unit, interval, isModalOpen]);

  // FIX (CSVU.7): single source of truth for the "< 350 days → annualize" rule.
  // The same formula is used by both the live preview footer and the apply
  // handler — if the rule ever changes, only this helper needs editing.
  const annualizeIfShort = (totalKwh: number, days: number) =>
    days > 0 && days < 350 ? (totalKwh / days) * 365 : totalKwh;

  const handleApply = () => {
    if (!previewStats || mappingError) return;

    // Scale up to 365 days if the data is shorter (optional smarts, here we just use the raw total if it's close,
    // but to be safe and accurate, let's extrapolate to an annual value if it's less than a year)
    const annualizedConsumption = annualizeIfShort(previewStats.totalConsumptionKwh, previewStats.days);

    // FIX (CSVU.3): the engine never reads `gridImportLimitKw` (T1) and the
    // step-2 input's tooltip is now honest about it being reserved. Don't
    // persist a number that has no effect on the calculation.
    store.setTechnicalInputs({
      annualConsumptionKwh: Math.round(annualizedConsumption),
    });

    store.setCsvMetadata({
      isConfigured: true,
      rowCount: previewStats.dataPoints,
      hasErrors: false,
      parseErrorSurface: null,
      fileName: rawFile?.name || 'import.csv',
      fallbackToManualMode: false
    });

    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRawFile(null);
    setParsedData([]);
  };

  return (
    <div className="space-y-4 rounded-lg border border-[#e5e5e5] p-6 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#e20613]" />
            Smart-Meter Daten importieren
          </h3>
          <p className="text-sm text-[#5a5859] mt-2 max-w-xl leading-relaxed">
            Laden Sie Ihren Smart-Meter Export (CSV) hoch. Wir unterstützen nahezu alle Formate. Das genaue Format (Intervall, Einheit) passen wir im nächsten Schritt gemeinsam an.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6 items-start">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="csv-upload"
        />
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          {isProcessing ? 'Wird gelesen...' : 'Eigene CSV-Datei auswählen'}
        </Button>
        <a href="/muster-lastgang.csv" download className="w-full sm:w-auto block">
          <Button variant="outline" type="button" className="w-full sm:w-auto bg-[#fafafa] hover:bg-[#f0f0f0] text-[#5a5859] border-[#e5e5e5]">
            <Download className="w-4 h-4 mr-2" />
            Muster-CSV herunterladen
          </Button>
        </a>
      </div>

      {store.csvMetadata.fileName && store.csvMetadata.isConfigured && !store.csvMetadata.hasErrors && (
        <div className="mt-4 flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-3 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="truncate break-all">&quot;{store.csvMetadata.fileName}&quot; erfolgreich importiert.</span>
        </div>
      )}

      {store.csvMetadata.hasErrors && store.csvMetadata.parseErrorSurface && (
        <div className="flex items-center gap-2 text-sm text-[#e20613] bg-[#fff5f5] p-3 rounded-md border border-[#ffcccc] mt-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Fehler beim Upload: {store.csvMetadata.parseErrorSurface}</span>
        </div>
      )}

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full rounded shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a1a]">CSV-Format anpassen</h2>
                <p className="text-sm text-[#5a5859] mt-1">Datei: {rawFile?.name}</p>
              </div>
              <button onClick={closeModal} className="text-[#5a5859] hover:text-[#e20613] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Spalte für Datum/Uhrzeit"
                  options={headers.map(h => ({ value: h, label: h }))}
                  value={dateCol}
                  onChange={(e) => setDateCol(e.target.value)}
                  tooltipText="Wählen Sie die Spalte, die den Zeitstempel der Messung enthält."
                />
                <Select
                  label="Spalte für Verbrauch/Leistung"
                  options={headers.map(h => ({ value: h, label: h }))}
                  value={valCol}
                  onChange={(e) => setValCol(e.target.value)}
                  tooltipText="Wählen Sie die Spalte mit den eigentlichen Messwerten."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Einheit der Werte"
                  options={[
                    { value: 'kWh', label: 'Arbeit in Kilowattstunden (kWh)' },
                    { value: 'kW', label: 'Leistung in Kilowatt (kW)' },
                    { value: 'W', label: 'Leistung in Watt (W)' },
                  ]}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  tooltipText="Sind es Leistungswerte (W/kW) oder Energiemengen (kWh) pro Intervall?"
                />
                <Select
                  label="Zeitintervall der Messung"
                  options={[
                    { value: '15', label: '15 Minuten' },
                    { value: '60', label: '60 Minuten (1 Stunde)' },
                  ]}
                  value={interval}
                  onChange={(e) => setIntervalStr(e.target.value)}
                  tooltipText="In welchen Abständen wurden die Werte aufgezeichnet?"
                />
              </div>

              <div className="bg-[#fafafa] border border-[#e5e5e5] p-5 rounded">
                <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d2d700]" /> Live-Vorschau
                </h4>
                
                {mappingError ? (
                  <div className="text-[#e20613] text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {mappingError}
                  </div>
                ) : previewStats ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-[#e5e5e5] pb-2">
                      <span className="text-[#5a5859]">Gefundene Datenpunkte:</span>
                      <span className="font-semibold text-[#1a1a1a]">
                        {previewStats.dataPoints.toLocaleString()} (<span className="text-[#e20613]">{Math.round(previewStats.days)} Tage</span>)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-[#e5e5e5] pb-2">
                      <span className="text-[#5a5859]">Hochgerechneter Jahresverbrauch:</span>
                      <span className="font-semibold text-[#1a1a1a]">
                        {Math.round(annualizeIfShort(previewStats.totalConsumptionKwh, previewStats.days)).toLocaleString()} kWh
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#5a5859] flex items-center gap-1">
                        Maximale Lastspitze 
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="max-w-xs text-xs">Wichtig für Peak Shaving Berechnungen.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <span className="font-semibold text-[#1a1a1a]">{previewStats.maxPeakKw.toFixed(1)} kW</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-6 border-t border-[#e5e5e5] bg-[#fafafa] flex justify-end gap-4">
              <Button variant="outline" onClick={closeModal}>Abbrechen</Button>
              <Button variant="primary" onClick={handleApply} disabled={!!mappingError || !previewStats}>
                Daten übernehmen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
