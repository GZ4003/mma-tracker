"use client";

import { useState } from "react";
import Link from "next/link";
import { useMmaMode } from "@/hooks/useMmaMode";
import { Button } from "@/components/ui/button";
import SetupScreen from "@/components/SetupScreen";
import FighterProfile from "@/components/FighterProfile";
import StreakCounter from "@/components/StreakCounter";
import ActivityFeed from "@/components/ActivityFeed";
import ChallengeCard from "@/components/ChallengeCard";
import LevelUpModal from "@/components/LevelUpModal";
import AchievementUnlockedModal from "@/components/AchievementUnlockedModal";
import RecentAchievements from "@/components/RecentAchievements";
import MasteryOverview from "@/components/MasteryOverview";
import PageHeader from "@/components/PageHeader";
import EditSessionModal from "@/components/EditSessionModal";
import DeleteSessionDialog from "@/components/DeleteSessionDialog";
import type { Session } from "@/types";

export default function Dashboard() {
  const mma = useMmaMode();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deletingSession, setDeletingSession] = useState<Session | null>(null);

  if (!mma.isLoaded) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
        <div className="bg-mma-surface animate-pulse h-48 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-mma-surface animate-pulse h-32 rounded-lg" />
          <div className="bg-mma-surface animate-pulse h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!mma.isSetupComplete) {
    return <SetupScreen onComplete={mma.completeSetup} />;
  }

  const levelInfo = mma.getLevelInfo();
  const currentChallenges = mma.getCurrentChallenges();
  const masteries = mma.getMasteries();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Panel de Control" subtitle="Tu progreso como luchador" />

      {/* Fighter Profile */}
      {mma.profile && (
        <FighterProfile profile={mma.profile} levelInfo={levelInfo} />
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
          {mma.profile && (
            <StreakCounter
              streak={mma.profile.streak}
              lastTrainingDate={mma.profile.lastTrainingDate}
            />
          )}
        </div>
      </div>

      {/* Masteries Overview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <MasteryOverview masteries={masteries} />
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
                onComplete={mma.completeChallenge}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements & Ranks */}
        <div className="space-y-6">
          <div className="bg-mma-surface border-mma-muted/30 rounded-lg p-4">
            <RecentAchievements achievements={mma.achievements} limit={3} />
          </div>
          <div className="bg-mma-surface border-mma-muted/30 rounded-lg p-4">
            <MasteryOverview masteries={masteries} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-lg font-display text-mma-white tracking-wide">
          Actividad Reciente
        </h2>
        <ActivityFeed
          sessions={mma.sessions}
          limit={5}
          onEdit={setEditingSession}
          onDelete={setDeletingSession}
        />
      </div>

      {/* Level Up Modal */}
      {mma.levelUpInfo && (
        <LevelUpModal
          levelInfo={mma.levelUpInfo}
          onDismiss={mma.dismissLevelUp}
        />
      )}

      {/* Achievement Unlocked Modal */}
      {mma.achievementInfo && (
        <AchievementUnlockedModal
          achievement={mma.achievementInfo}
          onDismiss={mma.dismissAchievement || (() => {})}
        />
      )}

      <EditSessionModal
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSave={mma.editSession}
      />
      <DeleteSessionDialog
        session={deletingSession}
        onClose={() => setDeletingSession(null)}
        onConfirm={mma.deleteSession}
      />
    </div>
  );
}
