import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  lastTrainingDate: string | null;
}

export default function StreakCounter({
  streak,
  lastTrainingDate,
}: StreakCounterProps) {
  const today = new Date().toISOString().split("T")[0];
  const isActive =
    lastTrainingDate === today ||
    (lastTrainingDate
      ? new Date(lastTrainingDate).toISOString().split("T")[0] ===
        new Date(new Date().getTime() - 86400000).toISOString().split("T")[0]
      : false);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg bg-goat-surface border border-goat-muted/30 ${
        isActive ? "animate-streak-pulse" : ""
      }`}
    >
      <Flame
        size={20}
        className={isActive ? "text-goat-orange" : "text-goat-muted"}
      />
      <div>
        <p className="text-xs text-goat-muted">RACHA</p>
        <p className="text-lg font-display text-goat-white">{streak}</p>
      </div>
    </div>
  );
}
