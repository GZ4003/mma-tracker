"use client";

import { useState } from "react";
import { MASTERY_TITLES } from "@/lib/masteries";
import { DISCIPLINES } from "@/lib/constants";
import type { Discipline, MasteryInfo } from "@/types";

interface MasteryScaleProps {
  masteries: MasteryInfo[];
}

export default function MasteryScale({ masteries }: MasteryScaleProps) {
  const firstUnlocked = masteries.find((m) => m.unlocked);
  const [selected, setSelected] = useState<Discipline>(
    firstUnlocked?.discipline ?? masteries[0].discipline
  );

  const current = masteries.find((m) => m.discipline === selected)!;
  const titles = MASTERY_TITLES[selected];

  return (
    <div className="space-y-4">
      <h3 className="section-title text-base">Escala de Maestría</h3>

      <div className="flex flex-wrap gap-2">
        {masteries.map((m) => {
          const meta = DISCIPLINES.find((d) => d.value === m.discipline);
          const isActive = m.discipline === selected;
          return (
            <button
              key={m.discipline}
              type="button"
              onClick={() => setSelected(m.discipline)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                border: `1px solid ${isActive ? m.color : "#3f3f46"}`,
                backgroundColor: isActive ? `${m.color}20` : "transparent",
                color: isActive ? m.color : "#9CA3AF",
              }}
            >
              {meta?.emoji} {meta?.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {titles.map((title, index) => {
          const level = index + 1;
          const isCurrent = current.unlocked && level === current.level;
          const isReached = current.unlocked && level <= current.level;

          return (
            <div
              key={title}
              className="flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm"
              style={{
                backgroundColor: isCurrent ? `${current.color}20` : "transparent",
                border: `1px solid ${isCurrent ? current.color : "#27272a"}`,
                opacity: isReached ? 1 : 0.5,
              }}
            >
              <span
                className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold flex-shrink-0"
                style={{
                  color: isReached ? current.color : "#6B7280",
                  border: `1px solid ${isReached ? current.color : "#3f3f46"}`,
                }}
              >
                {level}
              </span>
              <span
                className="flex-1"
                style={{ color: isCurrent ? current.color : "#D1D5DB" }}
              >
                {title}
              </span>
              {isCurrent && (
                <span
                  className="text-xs font-display tracking-wider"
                  style={{ color: current.color }}
                >
                  ACTUAL
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
