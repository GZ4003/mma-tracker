"use client";

import { useEffect, useRef } from "react";
import { useGoatMode } from "@/hooks/useGoatMode";

// Runs the weekly XP penalty check once per app open, at startup.
// Rendered in the root layout so it fires regardless of the current page.
export default function PenaltyChecker() {
  const { isLoaded, isSetupComplete, checkWeeklyPenalty } = useGoatMode();
  const hasRun = useRef(false);

  useEffect(() => {
    if (isLoaded && isSetupComplete && !hasRun.current) {
      hasRun.current = true;
      checkWeeklyPenalty();
    }
  }, [isLoaded, isSetupComplete, checkWeeklyPenalty]);

  return null;
}
