import { Progress } from "@/components/ui/progress";
import { RANK_PROGRESSION } from "@/lib/achievements";
import type { DisciplineRank } from "@/types";

interface DisciplineRanksProps {
  ranks: DisciplineRank[];
}

export default function DisciplineRanks({ ranks }: DisciplineRanksProps) {
  if (ranks.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-muted-foreground text-sm">
          Completa tu perfil para ver tus rangos.
        </p>
      </div>
    );
  }

  const getThemeStyles = (rank: string) => {
    const themes: Record<string, { bgGradient: string; borderGlow: string; shine: string; textGlow: string; badgeBg: string }> = {
      "Hierro": {
        bgGradient: "linear-gradient(135deg, #1E3A8A20 0%, #1E40AF20 100%)",
        borderGlow: "inset 0 0 30px #1E40AF20",
        shine: "linear-gradient(135deg, #3B82F630 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 15px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F625 0%, rgba(59,130,246,0.1) 100%)",
      },
      "Bronce": {
        bgGradient: "linear-gradient(135deg, #1E3A8A20 0%, #2563EB20 100%)",
        borderGlow: "inset 0 0 30px #2563EB20",
        shine: "linear-gradient(135deg, #60A5FA30 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 15px #2563EB)",
        badgeBg: "radial-gradient(circle, #2563EB25 0%, rgba(37,99,235,0.1) 100%)",
      },
      "Plata": {
        bgGradient: "linear-gradient(135deg, #1E3A8A20 0%, #3B82F620 100%)",
        borderGlow: "inset 0 0 30px #3B82F620, inset 0 0 60px #60A5FA15",
        shine: "linear-gradient(135deg, #93C5FD40 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 15px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F630 0%, rgba(59,130,246,0.15) 100%)",
      },
      "Oro": {
        bgGradient: "linear-gradient(135deg, #0F172A20 0%, #1E3A8A20 100%)",
        borderGlow: "inset 0 0 30px #2563EB20, inset 0 0 60px #3B82F615",
        shine: "linear-gradient(135deg, #60A5FA40 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 20px #2563EB)",
        badgeBg: "radial-gradient(circle, #2563EB30 0%, rgba(37,99,235,0.15) 100%)",
      },
      "Platino": {
        bgGradient: "linear-gradient(135deg, #0F172A20 0%, #1E40AF20 100%)",
        borderGlow: "inset 0 0 30px #3B82F620, inset 0 0 60px #60A5FA20",
        shine: "linear-gradient(135deg, #BFDBFE40 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 15px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F635 0%, rgba(59,130,246,0.2) 100%)",
      },
      "Esmeralda": {
        bgGradient: "linear-gradient(135deg, #0F172A20 0%, #1E40AF20 100%)",
        borderGlow: "inset 0 0 30px #2563EB20, inset 0 0 60px #3B82F620",
        shine: "linear-gradient(135deg, #93C5FD50 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 15px #2563EB)",
        badgeBg: "radial-gradient(circle, #2563EB30 0%, rgba(37,99,235,0.2) 100%)",
      },
      "Diamante": {
        bgGradient: "linear-gradient(135deg, #0F172A20 0%, #1E40AF25 100%)",
        borderGlow: "inset 0 0 30px #3B82F625, inset 0 0 60px #60A5FA20",
        shine: "linear-gradient(135deg, #DBEAFE50 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 20px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F635 0%, rgba(59,130,246,0.25) 100%)",
      },
      "Maestro": {
        bgGradient: "linear-gradient(135deg, #0F172A25 0%, #1E3A8A25 100%)",
        borderGlow: "inset 0 0 30px #3B82F630, inset 0 0 60px #60A5FA20",
        shine: "linear-gradient(135deg, #BFDBFE50 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 20px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F640 0%, rgba(59,130,246,0.25) 100%)",
      },
      "Gran Maestro": {
        bgGradient: "linear-gradient(135deg, #0F172A30 0%, #1E40AF30 100%)",
        borderGlow: "inset 0 0 30px #3B82F630, inset 0 0 60px #60A5FA25",
        shine: "linear-gradient(135deg, #93C5FD50 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 25px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F640 0%, rgba(59,130,246,0.3) 100%)",
      },
      "Challenger": {
        bgGradient: "linear-gradient(135deg, #0F172A35 0%, #1E3A8A35 100%)",
        borderGlow: "inset 0 0 30px #3B82F640, inset 0 0 60px #60A5FA30",
        shine: "linear-gradient(135deg, #DBEAFE60 0%, transparent 100%)",
        textGlow: "drop-shadow(0 0 25px #3B82F6)",
        badgeBg: "radial-gradient(circle, #3B82F650 0%, rgba(59,130,246,0.3) 100%)",
      },
    };
    return themes[rank] || themes["Hierro"];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-sans font-bold text-foreground">
        Tus Rangos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ranks.map((rank) => {
          const rankInfo = RANK_PROGRESSION[rank.rank as keyof typeof RANK_PROGRESSION];
          const theme = getThemeStyles(rank.rank);
          const progressPercent = rank.nextRank
            ? ((rank.sessionsCount - rankInfo.minSessions) /
                (rank.sessionsToNextRank || 1)) *
              100
            : 100;

          return (
            <div key={rank.discipline} className="relative group">
              {/* Glow Background */}
              <div
                className="absolute -inset-1 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"
                style={{
                  backgroundColor: rankInfo.borderColor,
                  zIndex: -1,
                }}
              />

              {/* Main Card */}
              <div
                className="relative rounded-2xl p-6 space-y-5 overflow-hidden transition-all duration-300 group-hover:scale-105"
                style={{
                  background: theme.bgGradient,
                  border: rankInfo.borderStyle,
                  boxShadow: `0 0 30px ${rankInfo.borderColor}40, ${theme.borderGlow}, 0 10px 20px rgba(0,0,0,0.2)`,
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Shine Effect */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/3 rounded-2xl pointer-events-none opacity-25"
                  style={{
                    background: theme.shine,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-5">
                  {/* Header with Rank Visual */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Disciplina
                      </p>
                      <p className="text-lg font-sans font-bold text-foreground capitalize">
                        {rank.discipline.replace("_", " ")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {rank.sessionsCount} sesiones
                      </p>
                    </div>

                    {/* Rank Badge */}
                    <div
                      className="w-24 h-24 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                      style={{
                        background: theme.badgeBg,
                        border: rankInfo.borderStyle,
                        boxShadow: `0 0 25px ${rankInfo.borderColor}50, inset 0 0 15px ${rankInfo.borderColor}20`,
                      }}
                    >
                      <span
                        className="text-3xl font-sans font-bold"
                        style={{
                          color: rankInfo.color,
                          textShadow: `0 0 15px ${rankInfo.borderColor}`,
                          filter: theme.textGlow,
                        }}
                      >
                        {rank.rank.slice(0, 1)}
                      </span>
                      <span
                        className="text-xs font-sans font-bold mt-1"
                        style={{
                          color: rankInfo.color,
                        }}
                      >
                        {rank.rank.length > 5 ? rank.rank.slice(0, 3) : rank.rank}
                      </span>
                    </div>
                  </div>

                  {/* Rank Name */}
                  <div>
                    <p
                      className="text-2xl font-sans font-bold tracking-wide"
                      style={{
                        color: rankInfo.color,
                        textShadow: `0 0 15px ${rankInfo.borderColor}`,
                        filter: theme.textGlow,
                      }}
                    >
                      {rank.rank}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rankInfo.description.split(" — ")[0]}
                    </p>
                  </div>

                  {/* Progress */}
                  {rank.nextRank && rank.sessionsToNextRank !== undefined && (
                    <div className="space-y-3 pt-3" style={{ borderTop: `1px solid ${rankInfo.borderColor}40` }}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground uppercase tracking-wider">Próximo:</span>
                        <span
                          className="font-sans font-bold"
                          style={{ color: rankInfo.color }}
                        >
                          {rank.nextRank}
                        </span>
                      </div>
                      <Progress value={Math.min(progressPercent, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {rank.sessionsToNextRank} sesiones
                      </p>
                    </div>
                  )}

                  {!rank.nextRank && (
                    <div className="pt-3" style={{ borderTop: `1px solid ${rankInfo.borderColor}40` }}>
                      <p
                        className="text-sm font-sans font-bold text-center tracking-wider"
                        style={{ color: rankInfo.color, filter: theme.textGlow }}
                      >
                        MÁXIMO RANGO
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
