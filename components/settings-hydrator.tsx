"use client";

import { useEffect, useRef } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";

// Fetches the admin-tunable calculator settings on app mount and pushes them
// into the calculator store so calculations use the operator's latest values.
// Mounted once in the root layout; the request is no-store so a fresh load
// always reflects the most recent admin save.
export function SettingsHydrator() {
  const setCalculatorSettings = useCalculatorStore((s) => s.setCalculatorSettings);
  // FIX (H3): ref-guard against React StrictMode's double-mount in dev.
  // The previous `cancelled` flag only suppressed state writes — the network
  // request still went out twice. A small JSON payload, but worth avoiding.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    let cancelled = false;
    fetch("/api/calculator-settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((settings) => {
        if (!cancelled && settings) setCalculatorSettings(settings);
      })
      .catch((err) => {
        // FIX (H2): surface fetch failures so prod issues are diagnosable.
        // The engine still falls back to DEFAULT_SETTINGS in this case.
        console.warn("[SettingsHydrator] /api/calculator-settings fetch failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [setCalculatorSettings]);

  return null;
}
