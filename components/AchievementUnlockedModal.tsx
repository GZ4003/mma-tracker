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
        className="w-full max-w-md bg-gradient-to-b from-mma-surface to-mma-bg border-2 border-mma-orange rounded-lg p-8 text-center space-y-6 animate-level-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-6xl font-display text-mma-orange tracking-wider">
            ¡LOGRO!
          </h1>
          <p className="text-4xl">{achievement.itemIcon}</p>
          <p className="text-2xl font-display text-mma-yellow tracking-widest">
            {achievement.itemName}
          </p>
          <p className="text-mma-muted text-sm">
            Desbloqueado después de {achievement.sessionsRequired} sesiones
          </p>
        </div>

        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-mma-orange to-transparent" />

        {/* Message */}
        <div className="bg-mma-bg/50 p-4 rounded-lg border border-mma-muted/20">
          <p className="text-sm text-mma-white">
            ¡Has conseguido tu primer equipo en{" "}
            <span className="text-mma-orange font-display">
              {achievement.discipline}
            </span>
            !
          </p>
        </div>

        {/* Dismiss Button */}
        <Button
          onClick={onDismiss}
          className="w-full bg-mma-orange text-mma-bg hover:bg-mma-orange/90 font-display text-lg py-6 tracking-widest"
        >
          ¡INCREÍBLE!
        </Button>
      </div>
    </div>
  );
}
