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

export interface Mastery {
  sessions: number;
  level: number;
}

export interface Profile {
  name: string;
  totalXP: number;
  level: number;
  streak: number;
  lastTrainingDate: string | null;
  disciplines: Discipline[];
  joinedAt: string;
  masteries: Record<Discipline, Mastery>;
}

export interface MasteryInfo {
  discipline: Discipline;
  sessions: number;
  level: number;
  title: string;
  color: string;
  sessionsToNextLevel: number | null;
  progressPercent: number;
  unlocked: boolean;
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

export type AuditActionType =
  | "session_logged"
  | "session_edited"
  | "session_deleted"
  | "session_restored"
  | "penalty_applied"
  | "xp_adjusted"
  | "level_up";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actionType: AuditActionType;
  description: string;
  xpDelta: number;
  snapshot: Session | null;
  // Id of the audit entry this one undoes (a restore points at the delete
  // it reverses; a revert points at the edit it reverses). Used to hide the
  // restore/revert action once it has already been used.
  relatedEntryId?: string;
}

export interface MmaModeData {
  profile: Profile;
  sessions: Session[];
  challenges: Challenge[];
  achievements: Achievement[];
  auditLog: AuditEntry[];
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

export interface UseMmaModeReturn {
  profile: Profile | null;
  sessions: Session[];
  challenges: Challenge[];
  achievements: Achievement[];
  auditLog: AuditEntry[];
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
  editSession: (
    sessionId: string,
    updates: Pick<
      Session,
      "discipline" | "date" | "duration" | "notes" | "techniques" | "energy"
    >
  ) => void;
  deleteSession: (sessionId: string) => void;
  restoreSession: (auditEntryId: string) => void;
  revertSessionEdit: (auditEntryId: string) => void;
  completeChallenge: (challengeId: string) => void;
  dismissLevelUp: () => void;
  dismissAchievement?: () => void;

  getProgress: () => ProgressStats;
  getLevelInfo: () => LevelInfo;
  getCurrentChallenges: () => Array<Challenge & { progress: number }>;
  getDisciplineRanks: () => DisciplineRank[];
  getAchievements: () => Achievement[];
  getMasteries: () => MasteryInfo[];
  checkWeeklyPenalty: () => void;
}
