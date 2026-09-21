"use client";

import { useMmaMode } from "@/hooks/useMmaMode";
import PageHeader from "@/components/PageHeader";
import AchievementsPanel from "@/components/AchievementsPanel";
import GlobalRankCard from "@/components/GlobalRankCard";
import MasteriesSection from "@/components/MasteriesSection";
import MasteryScale from "@/components/MasteryScale";
import RankProgression from "@/components/RankProgression";

export default function Achievements() {
  const mma = useMmaMode();

  if (!mma.isLoaded || !mma.isSetupComplete) {
    return null;
  }

  const achievements = mma.getAchievements();
  const ranks = mma.getDisciplineRanks();
  const levelInfo = mma.getLevelInfo();
  const masteries = mma.getMasteries();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Logros y Rangos"
        subtitle="Desbloquea equipo y sube de rango en cada disciplina"
      />

      {/* Rango Global */}
      {mma.profile && (
        <GlobalRankCard totalXP={mma.profile.totalXP} levelInfo={levelInfo} />
      )}

      {/* Maestrías por disciplina */}
      <MasteriesSection masteries={masteries} />

      {/* Escala de niveles de maestría */}
      <div className="bg-mma-surface border-mma-muted/30 rounded-lg p-4">
        <MasteryScale masteries={masteries} />
      </div>

      {/* Rank Progression Guide & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rank Scale */}
        <div className="bg-mma-surface border-mma-muted/30 rounded-lg p-4">
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
