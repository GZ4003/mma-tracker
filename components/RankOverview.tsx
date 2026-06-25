import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RANK_PROGRESSION } from "@/lib/achievements";
import type { DisciplineRank } from "@/types";

interface RankOverviewProps {
  ranks: DisciplineRank[];
}

export default function RankOverview({ ranks }: RankOverviewProps) {
  if (ranks.length === 0) {
    return null;
  }

  const sortedRanks = [...ranks].sort((a, b) => {
    const rankOrder = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Challenger"];
    return rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank);
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-display text-goat-muted uppercase tracking-wide">
        Tus Rangos
      </h3>
      <div className="space-y-2">
        {sortedRanks.slice(0, 3).map((rank) => {
          const rankInfo = RANK_PROGRESSION[rank.rank as keyof typeof RANK_PROGRESSION];

          return (
            <div
              key={rank.discipline}
              className="flex items-center gap-3 p-2 rounded-lg"
              style={{
                backgroundColor: rankInfo.borderColor + "15",
                border: `1px solid ${rankInfo.borderColor}50`,
              }}
            >
              <span className="text-xl">{rankInfo.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-goat-white capitalize">
                  {rank.discipline.replace("_", " ")}
                </p>
                <p className="text-xs text-goat-muted">{rank.rank}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/achievements">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs">
          Ver Todos los Rangos
        </Button>
      </Link>
    </div>
  );
}
