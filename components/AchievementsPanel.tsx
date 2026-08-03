import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Achievement } from "@/types";

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export default function AchievementsPanel({
  achievements,
}: AchievementsPanelProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (achievements.length === 0) {
    return (
      <Card className="bg-mma-surface border-mma-muted/30 p-6">
        <p className="text-mma-muted text-sm">Sin logros disponibles aún.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display text-mma-white tracking-wide">
          Logros Desbloqueados
        </h2>
        <Badge className="bg-mma-yellow/20 text-mma-yellow border-mma-yellow/30">
          {unlockedCount}/{achievements.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 text-center transition-all ${
              achievement.unlocked
                ? "bg-mma-surface border-mma-yellow/50"
                : "bg-mma-bg/50 border-mma-muted/20 opacity-50"
            }`}
          >
            <div className="text-4xl mb-2">{achievement.itemIcon}</div>
            <p className="text-xs font-medium text-mma-white mb-1">
              {achievement.itemName}
            </p>
            <p className="text-xs text-mma-muted">
              {achievement.sessionsRequired} sesiones
            </p>
            {achievement.unlocked && (
              <p className="text-xs text-mma-yellow font-display mt-2">
                ✓ DESBLOQUEADO
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
