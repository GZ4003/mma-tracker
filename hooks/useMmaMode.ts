"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MmaModeData,
  Profile,
  Session,
  Challenge,
  Discipline,
  LevelInfo,
  ProgressStats,
  UseMmaModeReturn,
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
import { showToast } from "@/components/Toast";
import { createAuditEntry, describeSession } from "@/lib/auditLog";
import type { AuditEntry } from "@/types";

const LAST_PENALTY_CHECK_KEY = "lastPenaltyCheck";
const WEEKLY_MIN_SESSIONS = 2;
const WEEKLY_PENALTY_XP = 120;

// --- Week helpers (weeks run Monday–Sunday, using local time) ---

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Monday (at local midnight) of the week containing `d`.
function getWeekStart(d: Date): Date {
  const s = startOfDay(d);
  const day = s.getDay(); // 0 = Sunday ... 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day;
  s.setDate(s.getDate() + diff);
  return s;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse a "YYYY-MM-DD" string as a LOCAL date (avoids UTC off-by-one at midnight).
function parseLocalDate(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}

const DEFAULT_DATA: MmaModeData = {
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
  auditLog: [],
  version: SCHEMA_VERSION,
};

async function readFromStorage(): Promise<MmaModeData | null> {
  try {
    const res = await fetch('/api/user-data');
    if (!res.ok) return null;
    const data = await res.json();
    // Return null if data is empty object (first time user)
    return Object.keys(data).length > 0 ? (data as MmaModeData) : null;
  } catch {
    console.error("Failed to read from API");
    return null;
  }
}

async function writeToStorage(data: MmaModeData): Promise<void> {
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

export function useMmaMode(): UseMmaModeReturn {
  const [data, setData] = useState<MmaModeData>(DEFAULT_DATA);
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
        if (!stored.auditLog) {
          stored.auditLog = [];
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

        const newAuditEntries: AuditEntry[] = [
          createAuditEntry(
            "session_logged",
            `Registraste ${describeSession(newSession)} (+${xpEarned} XP)`,
            xpEarned,
            newSession
          ),
        ];
        if (newLevel > oldLevel) {
          const info = getLevelInfo(newTotalXP);
          newAuditEntries.push(
            createAuditEntry(
              "level_up",
              `Subiste de nivel: ${info.name}`,
              0,
              null
            )
          );
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
          auditLog: [...prev.auditLog, ...newAuditEntries],
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

  const editSession = useCallback(
    (
      sessionId: string,
      updates: Pick<
        Session,
        "discipline" | "date" | "duration" | "notes" | "techniques" | "energy"
      >
    ) => {
      setData((prev) => {
        const previousSession = prev.sessions.find((s) => s.id === sessionId);
        if (!previousSession) return prev;

        const updatedSession: Session = { ...previousSession, ...updates };
        const auditEntry = createAuditEntry(
          "session_edited",
          `Editaste ${describeSession(previousSession)}`,
          0,
          previousSession
        );

        return {
          ...prev,
          sessions: prev.sessions.map((s) =>
            s.id === sessionId ? updatedSession : s
          ),
          auditLog: [...prev.auditLog, auditEntry],
        };
      });
    },
    []
  );

  const deleteSession = useCallback((sessionId: string) => {
    setData((prev) => {
      const session = prev.sessions.find((s) => s.id === sessionId);
      if (!session) return prev;

      const xpToRemove = session.xpEarned ?? 0;
      const newTotalXP = Math.max(0, prev.profile.totalXP - xpToRemove);
      const auditEntry = createAuditEntry(
        "session_deleted",
        `Eliminaste ${describeSession(session)} (-${xpToRemove} XP)`,
        -xpToRemove,
        session
      );

      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalXP: newTotalXP,
          level: getLevelFromXP(newTotalXP),
        },
        sessions: prev.sessions.filter((s) => s.id !== sessionId),
        auditLog: [...prev.auditLog, auditEntry],
      };
    });
  }, []);

  const restoreSession = useCallback((auditEntryId: string) => {
    setData((prev) => {
      const deleteEntry = prev.auditLog.find(
        (e) => e.id === auditEntryId && e.actionType === "session_deleted"
      );
      if (!deleteEntry || !deleteEntry.snapshot) return prev;

      const alreadyRestored = prev.auditLog.some(
        (e) =>
          e.actionType === "session_restored" &&
          e.relatedEntryId === auditEntryId
      );
      if (alreadyRestored) return prev;

      const restoredSession = deleteEntry.snapshot;
      const xpToRestore = restoredSession.xpEarned ?? 0;
      const newTotalXP = prev.profile.totalXP + xpToRestore;
      const auditEntry = createAuditEntry(
        "session_restored",
        `Restauraste ${describeSession(restoredSession)} (+${xpToRestore} XP)`,
        xpToRestore,
        restoredSession,
        auditEntryId
      );

      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalXP: newTotalXP,
          level: getLevelFromXP(newTotalXP),
        },
        sessions: [restoredSession, ...prev.sessions],
        auditLog: [...prev.auditLog, auditEntry],
      };
    });
  }, []);

  const revertSessionEdit = useCallback((auditEntryId: string) => {
    setData((prev) => {
      const editEntry = prev.auditLog.find(
        (e) => e.id === auditEntryId && e.actionType === "session_edited"
      );
      if (!editEntry || !editEntry.snapshot) return prev;

      const alreadyReverted = prev.auditLog.some(
        (e) =>
          e.actionType === "session_edited" &&
          e.relatedEntryId === auditEntryId
      );
      if (alreadyReverted) return prev;

      const previousVersion = editEntry.snapshot;
      const sessionExists = prev.sessions.some(
        (s) => s.id === previousVersion.id
      );
      if (!sessionExists) return prev;

      const auditEntry = createAuditEntry(
        "session_edited",
        `Revertiste ${describeSession(previousVersion)} a la versión anterior`,
        0,
        previousVersion,
        auditEntryId
      );

      return {
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === previousVersion.id ? previousVersion : s
        ),
        auditLog: [...prev.auditLog, auditEntry],
      };
    });
  }, []);

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

  // Deduct XP for each fully-passed week in which fewer than 2 training
  // sessions were logged. Runs once per app open (see PenaltyChecker).
  const checkWeeklyPenalty = useCallback(() => {
    if (typeof window === "undefined") return;

    const now = new Date();
    const stored = window.localStorage.getItem(LAST_PENALTY_CHECK_KEY);

    // First run ever: record today and don't apply penalties retroactively.
    if (!stored) {
      window.localStorage.setItem(LAST_PENALTY_CHECK_KEY, toISODate(now));
      return;
    }

    const currentWeekStart = getWeekStart(now);
    const trainingSessions = data.sessions.filter((s) => s.type === "training");

    // Evaluate every fully-passed week from the week of the last check up to
    // (but not including) the current, still-in-progress week. The week that
    // contained the last check was in progress then and is now complete, so it
    // is evaluated exactly once here — no double-counting, no gaps.
    let weeksPenalized = 0;
    let weekStart = getWeekStart(parseLocalDate(stored));

    while (weekStart.getTime() < currentWeekStart.getTime()) {
      const weekEnd = addDays(weekStart, 7); // exclusive upper bound
      const sessionCount = trainingSessions.filter((s) => {
        if (!s.date) return false;
        const d = parseLocalDate(s.date);
        return d.getTime() >= weekStart.getTime() && d.getTime() < weekEnd.getTime();
      }).length;

      if (sessionCount < WEEKLY_MIN_SESSIONS) {
        weeksPenalized += 1;
      }
      weekStart = weekEnd;
    }

    // Record that we've processed everything up to today.
    window.localStorage.setItem(LAST_PENALTY_CHECK_KEY, toISODate(now));

    if (weeksPenalized > 0) {
      const penalty = weeksPenalized * WEEKLY_PENALTY_XP;
      setData((prev) => {
        const newXP = Math.max(0, prev.profile.totalXP - penalty);
        const auditEntry = createAuditEntry(
          "penalty_applied",
          `Penalización semanal por entrenamiento insuficiente (${weeksPenalized} ${
            weeksPenalized === 1 ? "semana" : "semanas"
          })`,
          -penalty,
          null
        );
        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalXP: newXP,
            level: getLevelFromXP(newXP),
          },
          auditLog: [...prev.auditLog, auditEntry],
        };
      });
      showToast("You missed training last week. -120 XP");
    }
  }, [data.sessions]);

  return {
    profile: isSetupComplete ? data.profile : null,
    sessions: data.sessions,
    challenges: data.challenges,
    achievements: data.achievements,
    auditLog: data.auditLog,
    isSetupComplete,
    isLoaded,
    levelUpInfo,
    achievementInfo,
    completeSetup,
    logSession,
    logMeal,
    editSession,
    deleteSession,
    restoreSession,
    revertSessionEdit,
    completeChallenge,
    dismissLevelUp,
    dismissAchievement,
    getProgress,
    getLevelInfo: getLevelInfoMemo,
    getCurrentChallenges,
    getDisciplineRanks,
    getAchievements,
    checkWeeklyPenalty,
  };
}
