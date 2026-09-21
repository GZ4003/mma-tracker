import { DISCIPLINES } from "@/lib/constants";
import type { MasteryInfo } from "@/types";

interface MasteryBadgeProps {
  mastery: MasteryInfo;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = { sm: "w-20 h-20", md: "w-32 h-32", lg: "w-48 h-48" };
const EMOJI_SIZES = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" };
const LABEL_SIZES = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };

export default function MasteryBadge({ mastery, size = "md" }: MasteryBadgeProps) {
  const meta = DISCIPLINES.find((d) => d.value === mastery.discipline);

  return (
    <div className={`${SIZE_CLASSES[size]} relative flex-shrink-0`}>
      <div
        className="absolute inset-0 rounded-lg blur-lg opacity-30"
        style={{ backgroundColor: mastery.color }}
      />
      <div
        className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-0.5"
        style={{
          background: `radial-gradient(circle, ${mastery.color}25 0%, ${mastery.color}10 100%)`,
          border: `2px solid ${mastery.color}`,
          boxShadow: `0 0 20px ${mastery.color}50, inset 0 0 15px ${mastery.color}15`,
        }}
      >
        <span className={`${EMOJI_SIZES[size]} leading-none`}>{meta?.emoji}</span>
        <span
          className={`${LABEL_SIZES[size]} font-sans font-bold tracking-wide`}
          style={{ color: mastery.color }}
        >
          Nv {mastery.level}
        </span>
      </div>
    </div>
  );
}
