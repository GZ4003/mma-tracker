import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DISCIPLINES } from "@/lib/constants";
import type { MasteryInfo } from "@/types";

interface MasteriesSectionProps {
  masteries: MasteryInfo[];
}

export default function MasteriesSection({ masteries }: MasteriesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display text-mma-white tracking-wide">
        Maestrías
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {masteries.map((mastery) => {
          const meta = DISCIPLINES.find((d) => d.value === mastery.discipline);
          const label = meta?.label ?? mastery.discipline.replace("_", " ");

          if (!mastery.unlocked) {
            return (
              <Card
                key={mastery.discipline}
                className="bg-mma-bg/50 border-mma-muted/20 p-5 space-y-3 opacity-60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta?.emoji}</span>
                  <p className="text-sm font-medium text-mma-white capitalize">
                    {label}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-4 gap-2">
                  <span className="text-3xl">🔒</span>
                  <p className="text-xs text-mma-muted text-center">
                    Empieza a entrenar para desbloquear
                  </p>
                </div>
              </Card>
            );
          }

          return (
            <Card
              key={mastery.discipline}
              className="bg-mma-surface p-5 space-y-3"
              style={{ border: `2px solid ${mastery.color}` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{meta?.emoji}</span>
                <p className="text-sm font-medium text-mma-white capitalize">
                  {label}
                </p>
              </div>

              <p
                className="text-lg font-display tracking-wide"
                style={{ color: mastery.color }}
              >
                {mastery.title}
              </p>

              <div className="flex items-center justify-between text-xs text-mma-muted">
                <span>{mastery.sessions} sesiones</span>
                <span>Nivel {mastery.level} / 10</span>
              </div>

              <Progress value={mastery.progressPercent} className="h-1.5" />

              {mastery.sessionsToNextLevel !== null ? (
                <p className="text-xs text-mma-muted text-center">
                  {mastery.sessionsToNextLevel} sesiones para el próximo nivel
                </p>
              ) : (
                <p
                  className="text-xs font-display text-center tracking-wider"
                  style={{ color: mastery.color }}
                >
                  NIVEL MÁXIMO
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
