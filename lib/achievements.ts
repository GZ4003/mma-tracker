export type Rank = "Hierro" | "Bronce" | "Plata" | "Oro" | "Platino" | "Esmeralda" | "Diamante" | "Maestro" | "Gran Maestro" | "Challenger";
export type EquipmentItem = "pants" | "gloves" | "headgear" | "shin_guards" | "mouthguard" | "gi" | "tape" | "belt";

export interface Achievement {
  id: string;
  discipline: string;
  sessionsRequired: number;
  item: EquipmentItem;
  itemName: string;
  itemIcon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface RankInfo {
  rank: Rank;
  minSessions: number;
  color: string;
  bgGradient: string;
  borderColor: string;
  borderStyle: string;
  icon: string;
  description: string;
  effect: string;
}

export const RANK_PROGRESSION: Record<Rank, RankInfo> = {
  "Hierro": {
    rank: "Hierro",
    minSessions: 0,
    color: "#8B8B8B",
    bgGradient: "from-gray-800 to-gray-900",
    borderColor: "#5A5A5A",
    borderStyle: "3px solid #5A5A5A",
    icon: "I",
    description: "Apenas comenzando — borde gris metálico opaco",
    effect: "none",
  },
  "Bronce": {
    rank: "Bronce",
    minSessions: 3,
    color: "#CD7F32",
    bgGradient: "from-amber-900 to-amber-950",
    borderColor: "#B8621B",
    borderStyle: "3px solid #CD7F32",
    icon: "B",
    description: "Aprendiendo los fundamentos — borde bronce oxidado",
    effect: "glow",
  },
  "Plata": {
    rank: "Plata",
    minSessions: 7,
    color: "#E8E8E8",
    bgGradient: "from-slate-700 to-slate-800",
    borderColor: "#D0D0D0",
    borderStyle: "3px solid #E8E8E8",
    icon: "P",
    description: "Construyendo consistencia — borde plateado pulido",
    effect: "glow",
  },
  "Oro": {
    rank: "Oro",
    minSessions: 14,
    color: "#FFD700",
    bgGradient: "from-yellow-900 to-amber-950",
    borderColor: "#FFC700",
    borderStyle: "3px solid #FFD700",
    icon: "O",
    description: "Por encima del promedio — borde dorado con brillo",
    effect: "glow",
  },
  "Platino": {
    rank: "Platino",
    minSessions: 24,
    color: "#00D4FF",
    bgGradient: "from-cyan-900 to-teal-950",
    borderColor: "#00BFFF",
    borderStyle: "3px solid #00D4FF",
    icon: "Pt",
    description: "Técnica real — borde teal/platino con aristas",
    effect: "glow",
  },
  "Esmeralda": {
    rank: "Esmeralda",
    minSessions: 40,
    color: "#0DFF6F",
    bgGradient: "from-green-900 to-emerald-950",
    borderColor: "#00FF44",
    borderStyle: "3px solid #0DFF6F",
    icon: "E",
    description: "Escalando en serio — borde verde esmeralda cristalino",
    effect: "glow",
  },
  "Diamante": {
    rank: "Diamante",
    minSessions: 64,
    color: "#00F0FF",
    bgGradient: "from-blue-900 to-cyan-950",
    borderColor: "#00FFFF",
    borderStyle: "3px solid #00F0FF",
    icon: "D",
    description: "Alto nivel real — borde azul hielo con shimmer",
    effect: "glow",
  },
  "Maestro": {
    rank: "Maestro",
    minSessions: 100,
    color: "#D946EF",
    bgGradient: "from-purple-900 to-purple-950",
    borderColor: "#C026D3",
    borderStyle: "3px solid #D946EF",
    icon: "M",
    description: "Élite — borde púrpura dorado con glow pulsante",
    effect: "pulse",
  },
  "Gran Maestro": {
    rank: "Gran Maestro",
    minSessions: 150,
    color: "#FF1744",
    bgGradient: "from-red-900 to-red-950",
    borderColor: "#FF0000",
    borderStyle: "3px solid #FF1744",
    icon: "GM",
    description: "Top 1% — borde rojo carmesí, efecto fuego",
    effect: "pulse",
  },
  "Challenger": {
    rank: "Challenger",
    minSessions: 220,
    color: "#FFD700",
    bgGradient: "from-yellow-900 via-orange-900 to-red-950",
    borderColor: "#00FF00",
    borderStyle: "3px solid #00FF00",
    icon: "C",
    description: "Ineludible — Destino fijado, invencible",
    effect: "pulse",
  },
};

export const EQUIPMENT_ITEMS: Record<EquipmentItem, {name: string; icon: string}> = {
  "pants": { name: "Pantalones Oficiales", icon: "👖" },
  "gloves": { name: "Guantes UFC Oficiales", icon: "🥊" },
  "headgear": { name: "Casco Protector", icon: "🧠" },
  "shin_guards": { name: "Espinilleras", icon: "🦵" },
  "mouthguard": { name: "Protector Bucal", icon: "😁" },
  "gi": { name: "Gi Oficial", icon: "👔" },
  "tape": { name: "Vendaje Profesional", icon: "📦" },
  "belt": { name: "Cinturón", icon: "⏸️" },
};

export function generateAchievements(disciplines: string[]): Achievement[] {
  const achievements: Achievement[] = [];
  const achievementThresholds = [3, 8, 15, 25];
  const equipmentSequence: EquipmentItem[] = ["pants", "gloves", "headgear", "shin_guards", "mouthguard", "gi", "tape", "belt"];

  disciplines.forEach((discipline) => {
    achievementThresholds.forEach((threshold, index) => {
      const equipment = equipmentSequence[index % equipmentSequence.length];
      const item = EQUIPMENT_ITEMS[equipment];
      achievements.push({
        id: `${discipline}-${threshold}`,
        discipline,
        sessionsRequired: threshold,
        item: equipment,
        itemName: `${item.name} de ${discipline}`,
        itemIcon: item.icon,
        unlocked: false,
      });
    });
  });

  return achievements;
}

export function getRankForSessions(sessions: number): Rank {
  const ranks: Rank[] = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Challenger"];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (sessions >= RANK_PROGRESSION[ranks[i]].minSessions) {
      return ranks[i];
    }
  }

  return "Hierro";
}

export function getNextRankInfo(currentRank: Rank): {rank: Rank; sessionsNeeded: number} | null {
  const ranks: Rank[] = ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Challenger"];
  const currentIndex = ranks.indexOf(currentRank);

  if (currentIndex === ranks.length - 1) {
    return null;
  }

  const nextRank = ranks[currentIndex + 1];
  const sessionsNeeded = RANK_PROGRESSION[nextRank].minSessions;

  return { rank: nextRank, sessionsNeeded };
}
