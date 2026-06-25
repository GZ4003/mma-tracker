import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import XPBar from "./XPBar";
import RankBadge from "./RankBadge";
import type { Profile, LevelInfo } from "@/types";

interface FighterProfileProps {
  profile: Profile;
  levelInfo: LevelInfo;
  topRank?: string;
}

export default function FighterProfile({
  profile,
  levelInfo,
  topRank,
}: FighterProfileProps): JSX.Element {
  return (
    <Card className="bg-goat-surface border-goat-muted/30 p-6">
      <div className="space-y-6">
        {/* Name, Global Rank, and Rank Badge */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-display text-goat-white tracking-wide">
              {profile.name}
            </h2>
            <p className="text-sm text-goat-muted mt-1">LUCHADOR</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              className="bg-goat-orange/20 text-goat-orange border-goat-orange/30 px-3 py-1 text-xs font-display tracking-widest"
            >
              {levelInfo.name}
            </Badge>
            {topRank && (
              <RankBadge rank={topRank as import("@/lib/achievements").Rank} size="sm" />
            )}
          </div>
        </div>

        {/* XP Bar */}
        <XPBar
          currentXP={profile.totalXP}
          levelInfo={levelInfo}
          showLabel={true}
          size="lg"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-goat-muted/20">
          <div>
            <p className="text-xs text-goat-muted">NIVEL</p>
            <p className="text-2xl font-display text-goat-yellow">
              {profile.level + 1}
            </p>
          </div>
          <div>
            <p className="text-xs text-goat-muted">XP TOTAL</p>
            <p className="text-2xl font-display text-goat-white">
              {profile.totalXP}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
