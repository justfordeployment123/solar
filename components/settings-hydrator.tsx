"use client";

import { useEffect } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";

// Fetches the admin-tunable calculator settings on app mount and pushes them
// into the calculator store so calculations use the operator's latest values.
// Mounted once in the root layout; the request is no-store so a fresh load
// always reflects the most recent admin save.
export function SettingsHydrator() {
  const setCalculatorSettings = useCalculatorStore((s) => s.setCalculatorSettings);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/calculator-settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((settings) => {
        if (!cancelled && settings) setCalculatorSettings(settings);
      })
      .catch(() => {
        /* fall back to DEFAULT_SETTINGS already used in the engine */
      });
    return () => {
      cancelled = true;
    };
  }, [setCalculatorSettings]);

  return null;
}
