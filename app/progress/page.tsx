"use client";

import dynamic from "next/dynamic";
import { useGoatMode } from "@/hooks/useGoatMode";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";

const XPBarChart = dynamic(
  () => import("@/components/charts/XPBarChart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-goat-surface animate-pulse rounded-lg" />
    ),
  }
);

const DisciplineDonutChart = dynamic(
  () => import("@/components/charts/DisciplineDonutChart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-goat-surface animate-pulse rounded-lg" />
    ),
  }
);

export default function Progress() {
  const goat = useGoatMode();

  if (!goat.isLoaded || !goat.isSetupComplete) {
    return null;
  }

  const stats = goat.getProgress();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Progreso"
        subtitle="Mantén un seguimiento de tu viaje de entrenamiento"
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-goat-surface border-goat-muted/30 p-4 text-center">
          <p className="text-goat-muted text-xs uppercase">Sesiones Totales</p>
          <p className="text-3xl font-display text-goat-yellow mt-2">
            {stats.totalSessions}
          </p>
        </Card>
        <Card className="bg-goat-surface border-goat-muted/30 p-4 text-center">
          <p className="text-goat-muted text-xs uppercase">Horas Totales</p>
          <p className="text-3xl font-display text-goat-yellow mt-2">
            {(stats.totalDuration / 60).toFixed(1)}
          </p>
        </Card>
        <Card className="bg-goat-surface border-goat-muted/30 p-4 text-center">
          <p className="text-goat-muted text-xs uppercase">Sesión más Larga</p>
          <p className="text-3xl font-display text-goat-yellow mt-2">
            {stats.personalBests.longestSession}m
          </p>
        </Card>
        <Card className="bg-goat-surface border-goat-muted/30 p-4 text-center">
          <p className="text-goat-muted text-xs uppercase">Mejor XP del Día</p>
          <p className="text-3xl font-display text-goat-yellow mt-2">
            {stats.personalBests.mostXPInDay}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP History */}
        <Card className="bg-goat-surface border-goat-muted/30 p-4">
          <h2 className="text-lg font-display text-goat-white mb-4 tracking-wide">
            Historial de XP (30 Días)
          </h2>
          <XPBarChart data={stats.xpByDay} />
        </Card>

        {/* Discipline Breakdown */}
        <Card className="bg-goat-surface border-goat-muted/30 p-4">
          <h2 className="text-lg font-display text-goat-white mb-4 tracking-wide">
            Entrenamientos por Disciplina
          </h2>
          <DisciplineDonutChart data={stats.sessionsByDiscipline} />
        </Card>
      </div>

      {/* Discipline Details */}
      <Card className="bg-goat-surface border-goat-muted/30 p-6">
        <h2 className="text-lg font-display text-goat-white mb-4 tracking-wide">
          Desglose de Disciplinas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats.sessionsByDiscipline).map(([discipline, count]) => (
            <div
              key={discipline}
              className="bg-goat-bg rounded-lg p-3 border border-goat-muted/20"
            >
              <p className="text-goat-muted text-xs uppercase">
                {discipline.replace("_", " ")}
              </p>
              <p className="text-2xl font-display text-goat-yellow mt-1">
                {count}
              </p>
              <p className="text-xs text-goat-muted mt-1">sesiones</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
