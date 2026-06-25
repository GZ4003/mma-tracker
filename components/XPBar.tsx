import { Progress } from "@/components/ui/progress";
import type { LevelInfo } from "@/types";

interface XPBarProps {
  currentXP: number;
  levelInfo: LevelInfo;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function XPBar({
  currentXP,
  levelInfo,
  showLabel = true,
  size = "md",
}: XPBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-goat-muted">
            {levelInfo.name}
          </span>
          <span className="text-xs text-goat-muted">
            {currentXP} / {levelInfo.maxXP} XP
          </span>
        </div>
      )}
      <Progress
        value={levelInfo.progressPercent}
        className={`${sizeClasses[size]} bg-goat-surface`}
      />
    </div>
  );
}
