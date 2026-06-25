import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@/types";

interface RecentAchievementsProps {
  achievements: Achievement[];
  limit?: number;
}

export default function RecentAchievements({
  achievements,
  limit = 4,
}: RecentAchievementsProps) {
  const unlockedRecent = achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => {
      const dateA = new Date(a.unlockedAt || 0).getTime();
      const dateB = new Date(b.unlockedAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);

  if (unlockedRecent.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-display text-goat-muted uppercase tracking-wide">
          Logros Recientes
        </h3>
        <Card className="bg-goat-surface border-goat-muted/30 p-4 text-center">
          <p className="text-goat-muted text-sm">
            Desbloquea logros completando entrenamientos
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-display text-goat-muted uppercase tracking-wide">
        Logros Recientes
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {unlockedRecent.map((achievement) => (
          <Card
            key={achievement.id}
            className="bg-goat-surface border-goat-yellow/30 p-3 text-center"
          >
            <div className="text-2xl mb-1">{achievement.itemIcon}</div>
            <p className="text-xs font-medium text-goat-white line-clamp-2">
              {achievement.itemName}
            </p>
          </Card>
        ))}
      </div>
      <Link href="/achievements">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs">
          Ver Todos los Logros
        </Button>
      </Link>
    </div>
  );
}
