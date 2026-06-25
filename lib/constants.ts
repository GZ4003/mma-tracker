import type { Discipline } from "@/types";

export const LEVELS = [
  { name: "Rookie", minXP: 0 },
  { name: "Amateur", minXP: 200 },
  { name: "Competitor", minXP: 500 },
  { name: "Contender", minXP: 1000 },
  { name: "Elite", minXP: 2000 },
  { name: "Warrior", minXP: 3500 },
  { name: "Veteran", minXP: 5500 },
  { name: "Champion", minXP: 8000 },
  { name: "Legend", minXP: 12000 },
  { name: "Khabib", minXP: 18000 },
] as const;

export const XP_BASE = 50;
export const XP_STREAK_BONUS = 10;
export const XP_STREAK_MAX_BONUS = 50;
export const XP_LONG_SESSION_BONUS = 20;

export const DISCIPLINES: Array<{
  value: Discipline;
  label: string;
  color: string;
  emoji: string;
}> = [
  { value: "wrestling", label: "Wrestling", color: "#3B82F6", emoji: "🤼" },
  { value: "bjj", label: "BJJ", color: "#2563EB", emoji: "🥋" },
  { value: "boxing", label: "Boxing", color: "#1D4ED8", emoji: "🥊" },
  { value: "kickboxing", label: "Kickboxing", color: "#1E40AF", emoji: "🦵" },
  { value: "muay_thai", label: "Muay Thai", color: "#60A5FA", emoji: "🏆" },
  { value: "mma", label: "MMA", color: "#93C5FD", emoji: "⚔️" },
];

export const MEAL_TYPES = [
  { value: "desayuno", label: "Desayuno" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "cena", label: "Cena" },
  { value: "snack", label: "Snack" },
  { value: "pre_entrenamiento", label: "Pre-Entrenamiento" },
  { value: "post_entrenamiento", label: "Post-Entrenamiento" },
] as const;

export const STORAGE_KEY = "goatmode_data";
export const SCHEMA_VERSION = 1;

export const NAVBAR_LINKS = [
  { href: "/", label: "Panel de Control", icon: "LayoutDashboard" },
  { href: "/registrar/entrenamiento", label: "Registrar Entrenamiento", icon: "Dumbbell" },
  { href: "/registrar/comida", label: "Registrar Comida", icon: "Utensils" },
  { href: "/progress", label: "Progreso", icon: "TrendingUp" },
  { href: "/challenges", label: "Desafíos", icon: "Trophy" },
  { href: "/achievements", label: "Logros", icon: "Zap" },
  { href: "/history", label: "Historial", icon: "History" },
] as const;
