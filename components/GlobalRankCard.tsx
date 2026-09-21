import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LevelInfo } from "@/types";

interface GlobalRankCardProps {
  totalXP: number;
  levelInfo: LevelInfo;
}

export default function GlobalRankCard({ totalXP, levelInfo }: GlobalRankCardProps) {
  return (
    <Card className="bg-mma-surface border-mma-muted/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-mma-muted uppercase tracking-wider mb-1">
            Rango Global
          </p>
          <p className="text-3xl font-display text-mma-white tracking-wide">
            {levelInfo.name}
          </p>
        </div>
        <p className="text-sm text-mma-muted text-right">
          {totalXP} XP
          {levelInfo.xpToNext !== null && (
            <>
              <br />
              {levelInfo.xpToNext} para {levelInfo.nextLevelName}
            </>
          )}
        </p>
      </div>
      <Progress value={levelInfo.progressPercent} className="h-3 bg-mma-bg" />
    </Card>
  );
}
