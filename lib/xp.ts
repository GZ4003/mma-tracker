import {
  XP_BASE,
  XP_STREAK_BONUS,
  XP_STREAK_MAX_BONUS,
  XP_LONG_SESSION_BONUS,
} from "./constants";
import type { LevelInfo } from "@/types";

export const RANKS = [
  { level: 1, xp: 0, name: "Iron" },
  { level: 2, xp: 500, name: "Bronze" },
  { level: 3, xp: 1000, name: "Silver" },
  { level: 4, xp: 2000, name: "Gold" },
  { level: 5, xp: 3500, name: "Platinum" },
  { level: 6, xp: 5500, name: "Emerald" },
  { level: 7, xp: 8000, name: "Diamond" },
  { level: 8, xp: 12000, name: "Master" },
  { level: 9, xp: 17000, name: "Grandmaster" },
  { level: 10, xp: 25000, name: "Challenger" },
] as const;

export function calculateSessionXP(duration: number, streak: number): number {
  let xp = XP_BASE;

  const streakBonus = Math.min(
    streak * XP_STREAK_BONUS,
    XP_STREAK_MAX_BONUS
  );
  xp += streakBonus;

  if (duration > 90) {
    xp += XP_LONG_SESSION_BONUS;
  }

  return xp;
}

// Single source of truth for turning a totalXP value into a level. Call this
// after every XP change so profile.level can never drift out of sync with
// profile.totalXP.
export function recalculateLevel(xp: number): number {
  let level: number = RANKS[0].level;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].xp) {
      level = RANKS[i].level;
      break;
    }
  }
  return level;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  const currentIndex = recalculateLevel(totalXP) - 1;
  const current = RANKS[currentIndex];
  const next = RANKS[currentIndex + 1] ?? null;

  const xpInLevel = totalXP - current.xp;
  const xpForLevel = next ? next.xp - current.xp : 0;
  const progressPercent = next
    ? Math.min((xpInLevel / xpForLevel) * 100, 100)
    : 100;

  return {
    name: current.name,
    minXP: current.xp,
    maxXP: next?.xp ?? current.xp,
    nextLevelName: next?.name ?? null,
    progressPercent,
    xpToNext: next ? next.xp - totalXP : null,
  };
}

export function calculateStreak(
  lastTrainingDate: string | null,
  todayDate: string
): { newStreak: number; isNewDay: boolean } {
  if (!lastTrainingDate) {
    return { newStreak: 1, isNewDay: true };
  }

  const last = new Date(lastTrainingDate);
  const today = new Date(todayDate);
  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return { newStreak: 0, isNewDay: false };
  } else if (diffDays === 1) {
    return { newStreak: 1, isNewDay: true };
  } else {
    return { newStreak: -999, isNewDay: true };
  }
}
