import type { Challenge, Session } from "@/types";

const CHALLENGE_TEMPLATES = [
  {
    idSuffix: "sessions",
    title: "CONSISTENCIA DE HIERRO",
    description: "Asiste a 12 sesiones de entrenamiento este mes",
    target: 12,
    unit: "sesiones",
  },
  {
    idSuffix: "disciplines",
    title: "GUERRERO VERSÁTIL",
    description: "Entrena 3 disciplinas diferentes en una semana",
    target: 3,
    unit: "disciplinas",
  },
  {
    idSuffix: "streak",
    title: "CINCO DÍAS DE GRIND",
    description: "Registra 5 días de entrenamiento consecutivos",
    target: 5,
    unit: "días",
  },
  {
    idSuffix: "long",
    title: "SESIÓN MARATÓN",
    description: "Completa 2 sesiones más largas de 90 minutos",
    target: 2,
    unit: "sesiones largas",
  },
] as const;

export function generateMonthChallenges(yearMonth: string): Challenge[] {
  return CHALLENGE_TEMPLATES.map((template) => ({
    id: `${yearMonth}-${template.idSuffix}`,
    month: yearMonth,
    title: template.title,
    description: template.description,
    target: template.target,
    unit: template.unit,
    completed: false,
    completedAt: undefined,
  }));
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function computeChallengeProgress(
  challenge: Challenge,
  sessions: Session[]
): number {
  const [year, month] = challenge.month.split("-").map(Number);
  const monthSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return (
      s.type === "training" &&
      d.getFullYear() === year &&
      d.getMonth() + 1 === month
    );
  });

  switch (challenge.id.split("-").pop()) {
    case "sessions":
      return Math.min(monthSessions.length, challenge.target);

    case "disciplines": {
      const uniqueDisciplines = new Set(
        monthSessions.map((s) => s.discipline).filter(Boolean)
      );
      return Math.min(uniqueDisciplines.size, challenge.target);
    }

    case "streak": {
      const dates = Array.from(new Set(monthSessions.map((s) => s.date))).sort();
      let maxStreak = 0;
      let currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      if (dates.length === 1) maxStreak = 1;
      return Math.min(maxStreak, challenge.target);
    }

    case "long":
      return Math.min(
        monthSessions.filter((s) => (s.duration ?? 0) > 90).length,
        challenge.target
      );

    default:
      return 0;
  }
}
