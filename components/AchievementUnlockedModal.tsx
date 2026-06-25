"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@/types";

interface AchievementUnlockedModalProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export default function AchievementUnlockedModal({
  achievement,
  onDismiss,
}: AchievementUnlockedModalProps) {
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
        className="w-full max-w-md bg-gradient-to-b from-goat-surface to-goat-bg border-2 border-goat-orange rounded-lg p-8 text-center space-y-6 animate-level-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-6xl font-display text-goat-orange tracking-wider">
            ¡LOGRO!
          </h1>
          <p className="text-4xl">{achievement.itemIcon}</p>
          <p className="text-2xl font-display text-goat-yellow tracking-widest">
            {achievement.itemName}
          </p>
          <p className="text-goat-muted text-sm">
            Desbloqueado después de {achievement.sessionsRequired} sesiones
          </p>
        </div>

        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-goat-orange to-transparent" />

        {/* Message */}
        <div className="bg-goat-bg/50 p-4 rounded-lg border border-goat-muted/20">
          <p className="text-sm text-goat-white">
            ¡Has conseguido tu primer equipo en{" "}
            <span className="text-goat-orange font-display">
              {achievement.discipline}
            </span>
            !
          </p>
        </div>

        {/* Dismiss Button */}
        <Button
          onClick={onDismiss}
          className="w-full bg-goat-orange text-goat-bg hover:bg-goat-orange/90 font-display text-lg py-6 tracking-widest"
        >
          ¡INCREÍBLE!
        </Button>
      </div>
    </div>
  );
}
