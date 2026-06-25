import { RANK_PROGRESSION } from "@/lib/achievements";
import type { Rank } from "@/lib/achievements";

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
}

export default function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const rankInfo = RANK_PROGRESSION[rank];

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-40 h-40",
    lg: "w-56 h-56",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-5xl",
    lg: "text-8xl",
  };

  const getThemeStyles = () => {
    const themes: Record<string, { bgGradient: string; glowColor: string; shine: string }> = {
      "Hierro": {
        bgGradient: "radial-gradient(circle, #1E3A8A25 0%, #1E40AF25 100%)",
        glowColor: "#1E3A8A",
        shine: "linear-gradient(135deg, #3B82F630 0%, transparent 100%)",
      },
      "Bronce": {
        bgGradient: "radial-gradient(circle, #1E3A8A25 0%, #2563EB25 100%)",
        glowColor: "#2563EB",
        shine: "linear-gradient(135deg, #60A5FA30 0%, transparent 100%)",
      },
      "Plata": {
        bgGradient: "radial-gradient(circle, #1E3A8A30 0%, #3B82F630 100%)",
        glowColor: "#3B82F6",
        shine: "linear-gradient(135deg, #93C5FD50 0%, transparent 100%)",
      },
      "Oro": {
        bgGradient: "radial-gradient(circle, #0F172A25 0%, #1E3A8A30 100%)",
        glowColor: "#2563EB",
        shine: "linear-gradient(135deg, #60A5FA50 0%, transparent 100%)",
      },
      "Platino": {
        bgGradient: "radial-gradient(circle, #0F172A30 0%, #1E40AF30 100%)",
        glowColor: "#3B82F6",
        shine: "linear-gradient(135deg, #BFDBFE40 0%, transparent 100%)",
      },
      "Esmeralda": {
        bgGradient: "radial-gradient(circle, #0F172A35 0%, #1E40AF35 100%)",
        glowColor: "#60A5FA",
        shine: "linear-gradient(135deg, #93C5FD50 0%, transparent 100%)",
      },
      "Diamante": {
        bgGradient: "radial-gradient(circle, #0F172A40 0%, #1E40AF40 100%)",
        glowColor: "#93C5FD",
        shine: "linear-gradient(135deg, #DBEAFE60 0%, transparent 100%)",
      },
      "Maestro": {
        bgGradient: "radial-gradient(circle, #0F172A45 0%, #1E3A8A45 100%)",
        glowColor: "#3B82F6",
        shine: "linear-gradient(135deg, #BFDBFE50 0%, transparent 100%)",
      },
      "Gran Maestro": {
        bgGradient: "radial-gradient(circle, #0F172A50 0%, #1E40AF50 100%)",
        glowColor: "#60A5FA",
        shine: "linear-gradient(135deg, #93C5FD60 0%, transparent 100%)",
      },
      "Challenger": {
        bgGradient: "radial-gradient(circle, #1E40AF50 0%, #3B82F660 100%)",
        glowColor: "#2563EB",
        shine: "linear-gradient(135deg, #DBEAFE60 0%, transparent 100%)",
      },
    };
    return themes[rank] || themes["Hierro"];
  };

  const theme = getThemeStyles();

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Subtle Glow */}
      <div
        className="absolute inset-0 rounded-lg blur-lg opacity-25"
        style={{
          backgroundColor: theme.glowColor,
        }}
      />

      {/* Rotating Border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `conic-gradient(from 0deg, ${rankInfo.borderColor}, transparent, ${rankInfo.borderColor})`,
          opacity: 0.4,
          animation: "spin 4s linear infinite",
        }}
      />

      {/* Main Badge */}
      <div
        className="absolute inset-0 rounded-lg flex items-center justify-center font-sans font-bold"
        style={{
          background: theme.bgGradient,
          border: `4px solid ${rankInfo.borderColor}`,
          boxShadow: `
            0 0 30px ${rankInfo.borderColor}60,
            0 0 50px ${rankInfo.borderColor}30,
            inset 0 0 30px ${rankInfo.borderColor}15,
            inset 0 0 15px ${rankInfo.borderColor}08
          `,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Inner Shine */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: theme.shine,
          }}
        />

        {/* Rank Name */}
        <div className="relative z-10 text-center">
          <p
            className={`${textSizes[size]} font-sans font-black tracking-wider`}
            style={{
              color: rankInfo.color,
              textShadow: `
                0 0 20px ${rankInfo.borderColor},
                0 0 40px ${rankInfo.borderColor}80,
                2px 2px 4px rgba(0,0,0,0.8)
              `,
            }}
          >
            {rank.slice(0, 1)}
          </p>
          <p
            className="text-xs font-sans tracking-widest mt-1"
            style={{
              color: rankInfo.color,
              textShadow: `0 0 10px ${rankInfo.borderColor}`,
            }}
          >
            {rank}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
