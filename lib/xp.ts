import {
  LEVELS,
  XP_BASE,
  XP_STREAK_BONUS,
  XP_STREAK_MAX_BONUS,
  XP_LONG_SESSION_BONUS,
} from "./constants";
import type { LevelInfo } from "@/types";

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

export function getLevelFromXP(totalXP: number): number {
  let level = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      level = i;
      break;
    }
  }
  return level;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  const levelIndex = getLevelFromXP(totalXP);
  const current = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1] ?? null;

  const xpInLevel = totalXP - current.minXP;
  const xpForLevel = next ? next.minXP - current.minXP : 0;
  const progressPercent = next
    ? Math.min((xpInLevel / xpForLevel) * 100, 100)
    : 100;

  return {
    name: current.name,
    minXP: current.minXP,
    maxXP: next?.minXP ?? current.minXP,
    nextLevelName: next?.name ?? null,
    progressPercent,
    xpToNext: next ? next.minXP - totalXP : null,
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
