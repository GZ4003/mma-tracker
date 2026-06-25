"use client";

import Link from "next/link";
import { useGoatMode } from "@/hooks/useGoatMode";
import { Button } from "@/components/ui/button";
import SetupScreen from "@/components/SetupScreen";
import FighterProfile from "@/components/FighterProfile";
import StreakCounter from "@/components/StreakCounter";
import ActivityFeed from "@/components/ActivityFeed";
import ChallengeCard from "@/components/ChallengeCard";
import LevelUpModal from "@/components/LevelUpModal";
import AchievementUnlockedModal from "@/components/AchievementUnlockedModal";
import RecentAchievements from "@/components/RecentAchievements";
import RankOverview from "@/components/RankOverview";
import PageHeader from "@/components/PageHeader";

export default function Dashboard() {
  const goat = useGoatMode();

  if (!goat.isLoaded) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
        <div className="bg-goat-surface animate-pulse h-48 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-goat-surface animate-pulse h-32 rounded-lg" />
          <div className="bg-goat-surface animate-pulse h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!goat.isSetupComplete) {
    return <SetupScreen onComplete={goat.completeSetup} />;
  }

  const levelInfo = goat.getLevelInfo();
  const currentChallenges = goat.getCurrentChallenges();
  const ranks = goat.getDisciplineRanks();
  const topRank = ranks.length > 0 ? ranks.reduce((top, current) => {
    const rankOrder = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Challenger"];
    return rankOrder.indexOf(current.rank) > rankOrder.indexOf(top.rank) ? current : top;
  }).rank : undefined;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Panel de Control" subtitle="Tu progreso como luchador" />

      {/* Fighter Profile */}
      {goat.profile && (
        <FighterProfile profile={goat.profile} levelInfo={levelInfo} topRank={topRank} />
      )}

      {/* Quick Actions & Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Log Buttons */}
        <div className="space-y-4">
          <h3 className="section-title text-lg">
            Registro Rápido
          </h3>
          <Link href="/registrar/entrenamiento" className="block group">
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium text-lg py-6 tracking-widest transition-all duration-300 transform hover:shadow-lg hover:scale-105 active:scale-95">
              + Entrenamiento
            </Button>
          </Link>
          <Link href="/registrar/comida" className="block group">
            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 font-medium text-lg py-6 tracking-widest transition-all duration-300 transform hover:shadow-lg hover:scale-105 active:scale-95">
              + Comida
            </Button>
          </Link>
        </div>

        {/* Streak & Ranks */}
        <div className="space-y-4">
          <h3 className="section-title text-lg">
            Progreso
          </h3>
          {goat.profile && (
            <StreakCounter
              streak={goat.profile.streak}
              lastTrainingDate={goat.profile.lastTrainingDate}
            />
          )}
        </div>
      </div>

      {/* Ranks Overview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <RankOverview ranks={ranks} />
      </div>

      {/* Active Challenges & Recent Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Challenges */}
        <div className="md:col-span-2 space-y-5">
          <h2 className="section-title text-2xl">
            Desafíos Activos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onComplete={goat.completeChallenge}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements & Ranks */}
        <div className="space-y-6">
          <div className="bg-goat-surface border-goat-muted/30 rounded-lg p-4">
            <RecentAchievements achievements={goat.achievements} limit={3} />
          </div>
          <div className="bg-goat-surface border-goat-muted/30 rounded-lg p-4">
            <RankOverview ranks={ranks} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-lg font-display text-goat-white tracking-wide">
          Actividad Reciente
        </h2>
        <ActivityFeed sessions={goat.sessions} limit={5} />
      </div>

      {/* Level Up Modal */}
      {goat.levelUpInfo && (
        <LevelUpModal
          levelInfo={goat.levelUpInfo}
          onDismiss={goat.dismissLevelUp}
        />
      )}

      {/* Achievement Unlocked Modal */}
      {goat.achievementInfo && (
        <AchievementUnlockedModal
          achievement={goat.achievementInfo}
          onDismiss={goat.dismissAchievement || (() => {})}
        />
      )}
    </div>
  );
}
