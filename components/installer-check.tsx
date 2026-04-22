"use client";

import { useEffect, useRef } from 'react';
import { ActiveInstaller } from '@/types/calculator';
import { useCalculatorStore } from '@/store/calculatorStore';

export function InstallerCheck({ installer }: { installer: ActiveInstaller }) {
  const setActiveInstaller = useCalculatorStore((state) => state.setActiveInstaller);
  const isSet = useRef(false);

  useEffect(() => {
    if (!isSet.current) {
      setActiveInstaller(installer);
      isSet.current = true;
    }
  }, [installer, setActiveInstaller]);

  return null;
}
