import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISCIPLINES } from "@/lib/constants";
import type { MasteryInfo } from "@/types";

interface MasteryOverviewProps {
  masteries: MasteryInfo[];
}

export default function MasteryOverview({ masteries }: MasteryOverviewProps) {
  const unlocked = [...masteries]
    .filter((m) => m.unlocked)
    .sort((a, b) => b.level - a.level || b.sessions - a.sessions)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-display text-mma-muted uppercase tracking-wide">
        Tus Maestrías
      </h3>

      {unlocked.length === 0 ? (
        <p className="text-xs text-mma-muted">
          Registrá un entrenamiento para empezar a desbloquear maestrías.
        </p>
      ) : (
        <div className="space-y-2">
          {unlocked.map((mastery) => {
            const meta = DISCIPLINES.find((d) => d.value === mastery.discipline);
            return (
              <div
                key={mastery.discipline}
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{
                  backgroundColor: mastery.color + "15",
                  border: `1px solid ${mastery.color}50`,
                }}
              >
                <span className="text-xl">{meta?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-mma-white capitalize">
                    {meta?.label ?? mastery.discipline}
                  </p>
                  <p className="text-xs text-mma-muted">{mastery.title}</p>
                </div>
                <span
                  className="text-xs font-display px-2 py-0.5 rounded"
                  style={{ color: mastery.color, border: `1px solid ${mastery.color}50` }}
                >
                  Nv {mastery.level}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/achievements">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs">
          Ver Todas las Maestrías
        </Button>
      </Link>
    </div>
  );
}
