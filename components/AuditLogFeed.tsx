"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Pencil,
  Trash2,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { AuditEntry, AuditActionType } from "@/types";

type FilterKey = "all" | "gains" | "penalties" | "edits" | "deletions";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Todo" },
  { key: "gains", label: "Ganancias XP" },
  { key: "penalties", label: "Penalizaciones" },
  { key: "edits", label: "Ediciones" },
  { key: "deletions", label: "Eliminaciones" },
];

const ICON_MAP: Record<AuditActionType, typeof PlusCircle> = {
  session_logged: PlusCircle,
  session_edited: Pencil,
  session_deleted: Trash2,
  session_restored: RotateCcw,
  penalty_applied: ShieldAlert,
  xp_adjusted: TrendingUp,
  level_up: Trophy,
};

function matchesFilter(entry: AuditEntry, filter: FilterKey): boolean {
  switch (filter) {
    case "all":
      return true;
    case "gains":
      return entry.xpDelta > 0;
    case "penalties":
      return entry.actionType === "penalty_applied";
    case "edits":
      return entry.actionType === "session_edited";
    case "deletions":
      return entry.actionType === "session_deleted";
    default:
      return true;
  }
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface AuditLogFeedProps {
  entries: AuditEntry[];
  onRestore: (auditEntryId: string) => void;
  onRevert: (auditEntryId: string) => void;
}

export default function AuditLogFeed({
  entries,
  onRestore,
  onRevert,
}: AuditLogFeedProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const consumedEntryIds = useMemo(() => {
    const ids = new Set<string>();
    entries.forEach((e) => {
      if (e.relatedEntryId) ids.add(e.relatedEntryId);
    });
    return ids;
  }, [entries]);

  const newestFirst = useMemo(() => [...entries].reverse(), [entries]);
  const filtered = newestFirst.filter((e) => matchesFilter(e, filter));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            type="button"
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-blue-300 text-lg font-semibold">
            No hay registros
          </p>
          <p className="text-blue-200/60 text-sm mt-3">
            Aún no hay actividad para este filtro
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const Icon = ICON_MAP[entry.actionType];
            const canRestore =
              entry.actionType === "session_deleted" &&
              !consumedEntryIds.has(entry.id);
            const canRevert =
              entry.actionType === "session_edited" &&
              !entry.relatedEntryId &&
              !consumedEntryIds.has(entry.id);

            return (
              <Card
                key={entry.id}
                className="bg-mma-surface border border-zinc-700 p-4 rounded-lg flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <Icon size={20} className="text-mma-orange mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-mma-white">
                      {entry.description}
                    </p>
                    <p className="text-xs text-mma-muted mt-1">
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {entry.xpDelta !== 0 && (
                    <Badge
                      className={
                        entry.xpDelta > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                          : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                      }
                    >
                      {entry.xpDelta > 0 ? "+" : ""}
                      {entry.xpDelta} XP
                    </Badge>
                  )}
                  {canRestore && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(entry.id)}
                    >
                      Restaurar
                    </Button>
                  )}
                  {canRevert && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onRevert(entry.id)}
                    >
                      Revertir a versión anterior
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
