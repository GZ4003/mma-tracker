export type Discipline =
  | "wrestling"
  | "bjj"
  | "boxing"
  | "kickboxing"
  | "muay_thai"
  | "mma";

export type SessionType = "training" | "meal";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "pre_workout"
  | "post_workout";

export interface Session {
  id: string;
  type: SessionType;
  date: string;
  createdAt: string;

  // Training-specific
  discipline?: Discipline;
  duration?: number;
  notes?: string;
  techniques?: string[];
  energy?: number;

  // Meal-specific
  mealType?: MealType;
  mealDescription?: string;

  // Computed
  xpEarned?: number;
}

export interface Challenge {
  id: string;
  month: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  completed: boolean;
  completedAt?: string;
  progress?: number;
}

export interface Profile {
  name: string;
  totalXP: number;
  level: number;
  streak: number;
  lastTrainingDate: string | null;
  disciplines: Discipline[];
  joinedAt: string;
}

export interface Achievement {
  id: string;
  discipline: string;
  sessionsRequired: number;
  item: string;
  itemName: string;
  itemIcon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GoatModeData {
  profile: Profile;
  sessions: Session[];
  challenges: Challenge[];
  achievements: Achievement[];
  version: number;
}

export interface LevelInfo {
  name: string;
  minXP: number;
  maxXP: number;
  nextLevelName: string | null;
  progressPercent: number;
  xpToNext: number | null;
}

export interface ProgressStats {
  totalSessions: number;
  totalDuration: number;
  sessionsByDiscipline: Record<Discipline, number>;
  xpByDay: Array<{ date: string; xp: number }>;
  personalBests: {
    longestSession: number;
    highestEnergySession: number;
    mostXPInDay: number;
  };
}

export interface DisciplineRank {
  discipline: Discipline;
  rank: string;
  sessionsCount: number;
  nextRank?: string;
  sessionsToNextRank?: number;
}

export interface UseGoatModeReturn {
  profile: Profile | null;
  sessions: Session[];
  challenges: Challenge[];
  achievements: Achievement[];
  isSetupComplete: boolean;
  isLoaded: boolean;
  levelUpInfo: LevelInfo | null;
  achievementInfo?: Achievement | null;

  completeSetup: (name: string, disciplines: Discipline[]) => void;
  logSession: (
    data: Omit<Session, "id" | "createdAt" | "xpEarned" | "type">
  ) => void;
  logMeal: (
    data: Pick<Session, "date" | "mealType" | "mealDescription" | "notes">
  ) => void;
  completeChallenge: (challengeId: string) => void;
  dismissLevelUp: () => void;
  dismissAchievement?: () => void;

  getProgress: () => ProgressStats;
  getLevelInfo: () => LevelInfo;
  getCurrentChallenges: () => Array<Challenge & { progress: number }>;
  getDisciplineRanks: () => DisciplineRank[];
  getAchievements: () => Achievement[];
}
