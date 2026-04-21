'use client';

import React, { useState, useRef } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';

export function CsvUploader() {
  const store = useCalculatorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    store.setCsvMetadata({
      fileName: file.name,
      hasErrors: false,
      parseErrorSurface: null,
      isConfigured: false,
      rowCount: 0
    });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        
        if (data.length === 0) {
          store.setCsvMetadata({
            hasErrors: true,
            parseErrorSurface: 'CSV file is empty.'
          });
          setIsProcessing(false);
          return;
        }

        const firstRow = data[0];
        if (!('timestamp' in firstRow)) {
          store.setCsvMetadata({
            hasErrors: true,
            parseErrorSurface: 'Missing expected column "timestamp"'
          });
          setIsProcessing(false);
          return;
        }
        if (!('consumption_kwh' in firstRow)) {
          store.setCsvMetadata({
            hasErrors: true,
            parseErrorSurface: 'Missing expected column "consumption_kwh"'
          });
          setIsProcessing(false);
          return;
        }

        let totalConsumption = 0;
        let hasInvalidData = false;

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const val = parseFloat(row.consumption_kwh);
          if (isNaN(val)) {
            hasInvalidData = true;
            break;
          }
          totalConsumption += val;
        }

        if (hasInvalidData) {
          store.setCsvMetadata({
            hasErrors: true,
            parseErrorSurface: 'Invalid data format in consumption_kwh column. Must be numeric.'
          });
          setIsProcessing(false);
          return;
        }

        store.setTechnicalInputs({ annualConsumptionKwh: Math.round(totalConsumption) });
        store.setCsvMetadata({
          isConfigured: true,
          rowCount: data.length,
          hasErrors: false,
          parseErrorSurface: null,
        });
        
        setIsProcessing(false);
      },
      error: (error: Error) => {
        store.setCsvMetadata({
          hasErrors: true,
          parseErrorSurface: `Parse error: ${error.message}`
        });
        setIsProcessing(false);
      }
    });

    // Reset file input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium text-slate-900">Upload Smart Meter Data (CSV)</h3>
      <p className="text-sm text-slate-500">
        Upload your smart meter CSV containing <strong>timestamp</strong> and <strong>consumption_kwh</strong> columns to automatically calculate your annual consumption.
      </p>

      <div className="flex items-center space-x-4">
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
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Select CSV File'}
        </Button>
        {store.csvMetadata.fileName && (
          <span className="text-sm font-medium text-slate-700">
            {store.csvMetadata.fileName}
          </span>
        )}
      </div>

      {store.csvMetadata.hasErrors && store.csvMetadata.parseErrorSurface && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          Error: {store.csvMetadata.parseErrorSurface}
        </div>
      )}

      {store.csvMetadata.isConfigured && !store.csvMetadata.hasErrors && (
        <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md border border-emerald-200">
          Successfully processed {store.csvMetadata.rowCount} rows. Total consumption updated.
        </div>
      )}
    </div>
  );
}
