import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Utensils } from "lucide-react";
import { DISCIPLINES } from "@/lib/constants";
import type { Session, Discipline } from "@/types";

interface ActivityFeedProps {
  sessions: Session[];
  limit?: number;
  filter?: "all" | "training" | "meal" | Discipline;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins === 0 ? "justo ahora" : `hace ${diffMins}m`;
    }
    return `hace ${diffHours}h`;
  } else if (diffDays === 1) {
    return "ayer";
  } else {
    return `hace ${diffDays} días`;
  }
}

function getDisciplineEmoji(discipline?: Discipline): string {
  const disc = DISCIPLINES.find((d) => d.value === discipline);
  return disc?.emoji ?? "🏋️";
}

export default function ActivityFeed({
  sessions,
  limit = 5,
  filter = "all",
}: ActivityFeedProps) {
  let filtered = sessions;

  if (filter !== "all") {
    if (filter === "training") {
      filtered = sessions.filter((s) => s.type === "training");
    } else if (filter === "meal") {
      filtered = sessions.filter((s) => s.type === "meal");
    } else {
      filtered = sessions.filter(
        (s) => s.type === "training" && s.discipline === filter
      );
    }
  }

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  if (displayed.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-blue-300 text-lg font-semibold">
          No hay registros
        </p>
        <p className="text-blue-200/60 text-sm mt-3">
          {filter === "training"
            ? "Aún no has registrado entrenamientos"
            : filter === "meal"
            ? "Aún no has registrado comidas"
            : "Aún no has registrado actividades"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {displayed.map((session) => (
        <Card
          key={session.id}
          className="bg-goat-surface border border-zinc-700 p-5 rounded-lg flex flex-col"
        >
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {session.type === "training" ? (
                  <>
                    <span className="text-2xl">
                      {getDisciplineEmoji(session.discipline)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-goat-white capitalize">
                        {session.discipline?.replace("_", " ")}
                      </p>
                      <p className="text-xs text-goat-muted">
                        {getRelativeTime(session.date)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Utensils size={20} className="text-goat-orange" />
                    <div>
                      <p className="text-sm font-medium text-goat-white capitalize">
                        {session.mealType?.replace("_", " ")}
                      </p>
                      <p className="text-xs text-goat-muted">
                        {getRelativeTime(session.date)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {session.xpEarned && (
                <Badge className="bg-goat-yellow/20 text-goat-yellow border-goat-yellow/30 text-xs">
                  +{session.xpEarned} XP
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-2 items-center text-xs text-goat-muted">
              {session.type === "training" && session.duration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {session.duration} min
                </div>
              )}
              {session.type === "training" && session.energy && (
                <div className="flex items-center gap-1">
                  <Zap size={14} />
                  {session.energy}/10
                </div>
              )}
            </div>

            {/* Notes/Description */}
            {(session.notes || session.mealDescription) && (
              <p className="text-sm text-goat-white/70 line-clamp-2">
                {session.notes || session.mealDescription}
              </p>
            )}

            {/* Techniques */}
            {session.techniques && session.techniques.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {session.techniques.slice(0, 3).map((tech, idx) => (
                  <Badge
                    key={idx}
                    variant="default"
                    className="bg-goat-surface border-goat-muted/30 text-goat-muted text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
                {session.techniques.length > 3 && (
                  <Badge
                    variant="default"
                    className="bg-goat-surface border-goat-muted/30 text-goat-muted text-xs"
                  >
                    +{session.techniques.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
