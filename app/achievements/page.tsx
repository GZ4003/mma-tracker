"use client";

import { useGoatMode } from "@/hooks/useGoatMode";
import PageHeader from "@/components/PageHeader";
import AchievementsPanel from "@/components/AchievementsPanel";
import DisciplineRanks from "@/components/DisciplineRanks";
import RankProgression from "@/components/RankProgression";

export default function Achievements() {
  const goat = useGoatMode();

  if (!goat.isLoaded || !goat.isSetupComplete) {
    return null;
  }

  const achievements = goat.getAchievements();
  const ranks = goat.getDisciplineRanks();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Logros y Rangos"
        subtitle="Desbloquea equipo y sube de rango en cada disciplina"
      />

      {/* Rankings by Discipline */}
      <DisciplineRanks ranks={ranks} />

      {/* Rank Progression Guide & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rank Scale */}
        <div className="bg-goat-surface border-goat-muted/30 rounded-lg p-4">
          <RankProgression currentRank={ranks.length > 0 ? (ranks[0].rank as import("@/lib/achievements").Rank) : undefined} />
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2">
          <AchievementsPanel achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
