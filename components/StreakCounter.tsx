import { Flame } from "lucide-react";
import { toISODate } from "@/lib/weekUtils";

interface StreakCounterProps {
  streak: number;
  lastTrainingDate: string | null;
}

export default function StreakCounter({
  streak,
  lastTrainingDate,
}: StreakCounterProps) {
  const today = toISODate(new Date());
  const yesterday = toISODate(new Date(Date.now() - 86400000));
  const isActive =
    lastTrainingDate === today ||
    (lastTrainingDate ? lastTrainingDate === yesterday : false);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg bg-mma-surface border border-mma-muted/30 ${
        isActive ? "animate-streak-pulse" : ""
      }`}
    >
      <Flame
        size={20}
        className={isActive ? "text-mma-orange" : "text-mma-muted"}
      />
      <div>
        <p className="text-xs text-mma-muted">RACHA</p>
        <p className="text-lg font-display text-mma-white">{streak}</p>
      </div>
    </div>
  );
}
