"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GoatModeData,
  Profile,
  Session,
  Challenge,
  Discipline,
  LevelInfo,
  ProgressStats,
  UseGoatModeReturn,
  Achievement,
  DisciplineRank,
} from "@/types";
import { STORAGE_KEY, SCHEMA_VERSION, DISCIPLINES } from "@/lib/constants";
import {
  calculateSessionXP,
  getLevelFromXP,
  getLevelInfo,
  calculateStreak,
} from "@/lib/xp";
import {
  generateMonthChallenges,
  getCurrentYearMonth,
  computeChallengeProgress,
} from "@/lib/challenges";
import {
  generateAchievements,
  getRankForSessions,
  getNextRankInfo,
  RANK_PROGRESSION,
} from "@/lib/achievements";

const DEFAULT_DATA: GoatModeData = {
  profile: {
    name: "",
    totalXP: 0,
    level: 0,
    streak: 0,
    lastTrainingDate: null,
    disciplines: [],
    joinedAt: new Date().toISOString(),
  },
  sessions: [],
  challenges: [],
  achievements: [],
  version: SCHEMA_VERSION,
};

async function readFromStorage(): Promise<GoatModeData | null> {
  try {
    const res = await fetch('/api/user-data');
    if (!res.ok) return null;
    const data = await res.json();
    // Return null if data is empty object (first time user)
    return Object.keys(data).length > 0 ? (data as GoatModeData) : null;
  } catch {
    console.error("Failed to read from API");
    return null;
  }
}

async function writeToStorage(data: GoatModeData): Promise<void> {
  try {
    await fetch('/api/user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    console.error("Failed to write to API");
  }
}

export function useGoatMode(): UseGoatModeReturn {
  const [data, setData] = useState<GoatModeData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelInfo | null>(null);
  const [achievementInfo, setAchievementInfo] = useState<Achievement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const stored = await readFromStorage();
      if (stored) {
        const currentMonth = getCurrentYearMonth();
        const hasCurrentMonth = stored.challenges.some(
          (c) => c.month === currentMonth
        );
        if (!hasCurrentMonth) {
          stored.challenges.push(...generateMonthChallenges(currentMonth));
        }
        setData(stored);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      writeToStorage(data);
    }
  }, [data, isLoaded]);

  const isSetupComplete = Boolean(data.profile.name);

  const completeSetup = useCallback(
    (name: string, disciplines: Discipline[]) => {
      const currentMonth = getCurrentYearMonth();
      const disciplineNames = disciplines.map(d => d.toLowerCase().replace("_", " "));
      setData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          name,
          disciplines,
          joinedAt: new Date().toISOString(),
        },
        challenges: generateMonthChallenges(currentMonth),
        achievements: generateAchievements(disciplineNames),
      }));
    },
    []
  );

  const logSession = useCallback(
    (sessionData: Omit<Session, "id" | "createdAt" | "xpEarned" | "type">) => {
      const today = sessionData.date;
      const streakResult = calculateStreak(
        data.profile.lastTrainingDate,
        today
      );

      let newStreak: number;
      if (!streakResult.isNewDay) {
        newStreak = data.profile.streak;
      } else if (streakResult.newStreak === -999) {
        newStreak = 1;
      } else {
        newStreak = data.profile.streak + 1;
      }

      const xpEarned = calculateSessionXP(sessionData.duration ?? 0, newStreak);
      const newTotalXP = data.profile.totalXP + xpEarned;
      const oldLevel = data.profile.level;
      const newLevel = getLevelFromXP(newTotalXP);

      const newSession: Session = {
        ...sessionData,
        id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: "training",
        createdAt: new Date().toISOString(),
        xpEarned,
      };

      setData((prev) => {
        let newlyUnlockedAchievement: Achievement | null = null;
        const updatedAchievements = prev.achievements.map((ach) => {
          if (ach.discipline.toLowerCase() === sessionData.discipline?.toLowerCase()) {
            const disciplineSessions = [newSession, ...prev.sessions].filter(
              (s) => s.type === "training" && s.discipline === sessionData.discipline
            ).length;
            if (disciplineSessions >= ach.sessionsRequired && !ach.unlocked) {
              const unlocked = {
                ...ach,
                unlocked: true,
                unlockedAt: new Date().toISOString(),
              };
              newlyUnlockedAchievement = unlocked;
              return unlocked;
            }
          }
          return ach;
        });

        if (newlyUnlockedAchievement) {
          setAchievementInfo(newlyUnlockedAchievement);
        }

        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalXP: newTotalXP,
            level: newLevel,
            streak: newStreak,
            lastTrainingDate: streakResult.isNewDay
              ? today
              : prev.profile.lastTrainingDate,
          },
          sessions: [newSession, ...prev.sessions],
          achievements: updatedAchievements,
        };
      });

      if (newLevel > oldLevel) {
        setLevelUpInfo(getLevelInfo(newTotalXP));
      }
    },
    [data.profile]
  );

  const logMeal = useCallback(
    (
      mealData: Pick<Session, "date" | "mealType" | "mealDescription" | "notes">
    ) => {
      const newMeal: Session = {
        ...mealData,
        id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: "meal",
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        sessions: [newMeal, ...prev.sessions],
      }));
    },
    []
  );

  const completeChallenge = useCallback((challengeId: string) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              completed: true,
              completedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo(null);
  }, []);

  const dismissAchievement = useCallback(() => {
    setAchievementInfo(null);
  }, []);

  const getLevelInfoMemo = useCallback((): LevelInfo => {
    return getLevelInfo(data.profile.totalXP);
  }, [data.profile.totalXP]);

  const getProgress = useCallback((): ProgressStats => {
    const trainingSessions = data.sessions.filter((s) => s.type === "training");

    const today = new Date();
    const xpByDay: Array<{ date: string; xp: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayXP = trainingSessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
      xpByDay.push({ date: dateStr, xp: dayXP });
    }

    const sessionsByDiscipline = {} as Record<Discipline, number>;
    DISCIPLINES.forEach(({ value }) => {
      sessionsByDiscipline[value] = trainingSessions.filter(
        (s) => s.discipline === value
      ).length;
    });

    const longestSession = Math.max(
      0,
      ...trainingSessions.map((s) => s.duration ?? 0)
    );
    const highestEnergySession = Math.max(
      0,
      ...trainingSessions.map((s) => s.energy ?? 0)
    );

    const xpPerDay = new Map<string, number>();
    trainingSessions.forEach((s) => {
      xpPerDay.set(s.date, (xpPerDay.get(s.date) ?? 0) + (s.xpEarned ?? 0));
    });
    const mostXPInDay = Math.max(0, ...Array.from(xpPerDay.values()));

    return {
      totalSessions: trainingSessions.length,
      totalDuration: trainingSessions.reduce(
        (sum, s) => sum + (s.duration ?? 0),
        0
      ),
      sessionsByDiscipline,
      xpByDay,
      personalBests: {
        longestSession,
        highestEnergySession,
        mostXPInDay,
      },
    };
  }, [data.sessions]);

  const getCurrentChallenges = useCallback(
    (): Array<Challenge & { progress: number }> => {
      const currentMonth = getCurrentYearMonth();
      return data.challenges
        .filter((c) => c.month === currentMonth)
        .map((c) => ({
          ...c,
          progress: computeChallengeProgress(c, data.sessions),
        }));
    },
    [data.challenges, data.sessions]
  );

  const getDisciplineRanks = useCallback((): DisciplineRank[] => {
    const trainingSessions = data.sessions.filter((s) => s.type === "training");

    return data.profile.disciplines.map((discipline) => {
      const disciplineSessions = trainingSessions.filter(
        (s) => s.discipline === discipline
      ).length;
      const currentRank = getRankForSessions(disciplineSessions);
      const nextRankInfo = getNextRankInfo(currentRank);

      return {
        discipline,
        rank: currentRank,
        sessionsCount: disciplineSessions,
        nextRank: nextRankInfo?.rank,
        sessionsToNextRank: nextRankInfo ? nextRankInfo.sessionsNeeded - disciplineSessions : undefined,
      };
    });
  }, [data.profile.disciplines, data.sessions]);

  const getAchievements = useCallback((): Achievement[] => {
    return data.achievements;
  }, [data.achievements]);

  return {
    profile: isSetupComplete ? data.profile : null,
    sessions: data.sessions,
    challenges: data.challenges,
    achievements: data.achievements,
    isSetupComplete,
    isLoaded,
    levelUpInfo,
    achievementInfo,
    completeSetup,
    logSession,
    logMeal,
    completeChallenge,
    dismissLevelUp,
    dismissAchievement,
    getProgress,
    getLevelInfo: getLevelInfoMemo,
    getCurrentChallenges,
    getDisciplineRanks,
    getAchievements,
  };
}
