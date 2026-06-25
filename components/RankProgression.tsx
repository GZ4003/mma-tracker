import { RANK_PROGRESSION } from "@/lib/achievements";
import type { Rank } from "@/lib/achievements";

interface RankProgressionProps {
  currentRank?: Rank;
}

const RANK_PALETTE: Record<string, { color: string; border: string; bg: string; style: string }> = {
  "Hierro": { color: "#8B8B8B", border: "#666666", bg: "#2D2D2D", style: "solid" },
  "Bronce": { color: "#CD7F32", border: "#B8621B", bg: "#3D2815", style: "dashed" },
  "Plata": { color: "#E8E8E8", border: "#B0B0B0", bg: "#2A2A2A", style: "dotted" },
  "Oro": { color: "#60A5FA", border: "#3B82F6", bg: "#1E3A8A", style: "solid" },
  "Platino": { color: "#00D4FF", border: "#00A8CC", bg: "#002D40", style: "double" },
  "Esmeralda": { color: "#0DFF6F", border: "#00CC44", bg: "#003D1A", style: "dashed" },
  "Diamante": { color: "#00F0FF", border: "#00B8D4", bg: "#003D4D", style: "dotted" },
  "Maestro": { color: "#0EA5E9", border: "#0369A1", bg: "#003D5C", style: "solid" },
  "Gran Maestro": { color: "#FF1744", border: "#CC0000", bg: "#4D0000", style: "double" },
  "Challenger": { color: "#BFDBFE", border: "#0EA5E9", bg: "#0C2D4D", style: "dashed" },
};

export default function RankProgression({ currentRank }: RankProgressionProps) {
  const ranks: Rank[] = [
    "Hierro",
    "Bronce",
    "Plata",
    "Oro",
    "Platino",
    "Esmeralda",
    "Diamante",
    "Maestro",
    "Gran Maestro",
    "Challenger",
  ];

  return (
    <div className="space-y-4">
      <h3 className="section-title text-base">
        Escala de Rangos
      </h3>
      <div className="space-y-3">
        {ranks.map((rank) => {
          const isCurrent = rank === currentRank;
          const palette = RANK_PALETTE[rank];

          return (
            <div
              key={rank}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 font-bold text-sm cursor-default"
              style={{
                backgroundColor: isCurrent ? palette.bg : "transparent",
                border: `2px ${palette.style} ${palette.border}`,
                boxShadow: isCurrent ? `0 0 12px ${palette.border}60` : "none",
                transform: isCurrent ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              <span
                className="text-base font-black w-7 h-7 flex items-center justify-center rounded-md"
                style={{
                  color: palette.color,
                  backgroundColor: palette.bg,
                  border: `2px ${palette.style} ${palette.border}`,
                }}
              >
                {rank.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <p style={{ color: palette.color }} className="text-sm font-bold">
                  {rank}
                </p>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {RANK_PROGRESSION[rank].description.split(" — ")[0]}
                </p>
              </div>
              {isCurrent && (
                <div className="text-xs font-black px-2 py-1 rounded" style={{ color: palette.color, backgroundColor: palette.bg, border: `1px ${palette.style} ${palette.border}` }}>
                  ★
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
