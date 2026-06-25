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
      <Card className="bg-goat-surface border-goat-muted/30 p-6">
        <p className="text-goat-muted text-sm">Sin logros disponibles aún.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display text-goat-white tracking-wide">
          Logros Desbloqueados
        </h2>
        <Badge className="bg-goat-yellow/20 text-goat-yellow border-goat-yellow/30">
          {unlockedCount}/{achievements.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 text-center transition-all ${
              achievement.unlocked
                ? "bg-goat-surface border-goat-yellow/50"
                : "bg-goat-bg/50 border-goat-muted/20 opacity-50"
            }`}
          >
            <div className="text-4xl mb-2">{achievement.itemIcon}</div>
            <p className="text-xs font-medium text-goat-white mb-1">
              {achievement.itemName}
            </p>
            <p className="text-xs text-goat-muted">
              {achievement.sessionsRequired} sesiones
            </p>
            {achievement.unlocked && (
              <p className="text-xs text-goat-yellow font-display mt-2">
                ✓ DESBLOQUEADO
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
