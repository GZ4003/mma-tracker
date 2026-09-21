import { MASTERY_LEVEL_THRESHOLDS, getMasteryLevel } from "@/lib/xp";
import type { Discipline, Mastery } from "@/types";

export const MASTERY_TITLES: Record<Discipline, string[]> = {
  wrestling: [
    "Rookie Wrestler",
    "Takedown Artist",
    "Scrambler",
    "Shooter",
    "Chain Wrestler",
    "Dominant Grappler",
    "Cage General",
    "Submission Hunter",
    "Octagon Veteran",
    "Wrestling God",
  ],
  bjj: [
    "White Belt",
    "Stripe Chaser",
    "Guard Player",
    "Submission Hunter",
    "Technical Grappler",
    "Mat General",
    "Brown Belt Contender",
    "Black Belt Candidate",
    "Black Belt",
    "BJJ Legend",
  ],
  boxing: [
    "Southpaw Rookie",
    "Brawler",
    "Combo Striker",
    "Ring General",
    "Sharp Shooter",
    "Body Snatcher",
    "Slick Boxer",
    "Champion Contender",
    "Ring Commander",
    "Boxing God",
  ],
  kickboxing: [
    "Raw Kicker",
    "Low Kick Specialist",
    "Switch Hitter",
    "Combo Fighter",
    "K1 Contender",
    "Head Hunter",
    "Muay Warrior",
    "Ring Destroyer",
    "Kickboxing General",
    "Kickboxing God",
  ],
  muay_thai: [
    "Nak Muay",
    "Teep Specialist",
    "Elbow Fighter",
    "Clinch Warrior",
    "Thai Boxer",
    "Knee Destroyer",
    "Art of 8 Limbs",
    "Muay Thai General",
    "Nak Suek",
    "Muay Thai God",
  ],
  mma: [
    "Street Fighter",
    "Cross Trainer",
    "Well Rounded",
    "Cage Fighter",
    "Submission Threat",
    "Complete Fighter",
    "MMA Specialist",
    "Octagon General",
    "MMA Veteran",
    "MMA God",
  ],
};

export const MASTERY_COLORS: Record<Discipline, string> = {
  wrestling: "#0066FF",
  bjj: "#00B4FF",
  boxing: "#FF4B1F",
  kickboxing: "#38BDF8",
  muay_thai: "#FF6B00",
  mma: "#9333EA",
};

export function getMasteryTitle(discipline: Discipline, level: number): string {
  return MASTERY_TITLES[discipline][level - 1];
}

export function createDefaultMasteries(): Record<Discipline, Mastery> {
  return {
    wrestling: { sessions: 0, level: 1 },
    bjj: { sessions: 0, level: 1 },
    boxing: { sessions: 0, level: 1 },
    kickboxing: { sessions: 0, level: 1 },
    muay_thai: { sessions: 0, level: 1 },
    mma: { sessions: 0, level: 1 },
  };
}

export interface MasteryProgress {
  sessionsToNextLevel: number | null;
  progressPercent: number;
}

export function getMasteryProgress(sessions: number, level: number): MasteryProgress {
  const currentThreshold = MASTERY_LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = MASTERY_LEVEL_THRESHOLDS[level];

  if (nextThreshold === undefined) {
    return { sessionsToNextLevel: null, progressPercent: 100 };
  }

  const progressPercent =
    ((sessions - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return {
    sessionsToNextLevel: nextThreshold - sessions,
    progressPercent: Math.min(Math.max(progressPercent, 0), 100),
  };
}

export { getMasteryLevel };
