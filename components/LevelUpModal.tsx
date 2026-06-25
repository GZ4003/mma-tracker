"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { LevelInfo } from "@/types";

interface LevelUpModalProps {
  levelInfo: LevelInfo;
  onDismiss: () => void;
}

export default function LevelUpModal({
  levelInfo,
  onDismiss,
}: LevelUpModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-md bg-gradient-to-b from-goat-surface to-goat-bg border-2 border-goat-yellow rounded-lg p-8 text-center space-y-6 animate-level-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-6xl font-display text-goat-orange tracking-wider">
            ¡SUBE DE NIVEL!
          </h1>
          <p className="text-5xl font-display text-goat-yellow tracking-widest">
            {levelInfo.name}
          </p>
          <p className="text-goat-muted text-sm">
            ¡Has alcanzado {levelInfo.minXP.toLocaleString()} XP!
          </p>
        </div>

        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-goat-yellow to-transparent" />

        {/* Next Milestone */}
        {levelInfo.nextLevelName && (
          <div className="bg-goat-bg/50 p-4 rounded-lg border border-goat-muted/20">
            <p className="text-xs text-goat-muted mb-1">PRÓXIMO HITO</p>
            <p className="text-lg font-display text-goat-white">
              {levelInfo.nextLevelName}
            </p>
            <p className="text-xs text-goat-muted mt-2">
              {levelInfo.xpToNext?.toLocaleString()} XP para continuar
            </p>
          </div>
        )}

        {/* Dismiss Button */}
        <Button
          onClick={onDismiss}
          className="w-full bg-goat-yellow text-goat-bg hover:bg-goat-yellow/90 font-display text-lg py-6 tracking-widest"
        >
          CONTINUAR
        </Button>
      </div>
    </div>
  );
}
