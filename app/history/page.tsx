"use client";

import { useState } from "react";
import { useGoatMode } from "@/hooks/useGoatMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ActivityFeed from "@/components/ActivityFeed";
import { DISCIPLINES } from "@/lib/constants";
import type { Discipline } from "@/types";

export default function History() {
  const goat = useGoatMode();
  const [displayCount, setDisplayCount] = useState(20);
  const [filter, setFilter] = useState<"all" | "training" | "meal" | Discipline>("all");

  if (!goat.isLoaded || !goat.isSetupComplete) {
    return null;
  }

  const hasMore = goat.sessions.length > displayCount;

  return (
    <div className="p-4 md:p-6 mx-auto space-y-6">
      <PageHeader
        title="Historial"
        subtitle={`${goat.sessions.length} entradas totales`}
      />

      {/* Filters - Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v: string) => {
          setFilter(v as "all" | "training" | "meal" | Discipline);
          setDisplayCount(20);
        }}
        className="w-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 gap-2 mb-8">
          <TabsTrigger value="all">
            Todo
          </TabsTrigger>
          <TabsTrigger value="training">
            Entrenamiento
          </TabsTrigger>
          <TabsTrigger value="meal">
            Comidas
          </TabsTrigger>
          {DISCIPLINES.slice(0, 2).map((d) => (
            <TabsTrigger
              key={d.value}
              value={d.value}
              className="text-xs hidden md:inline-flex"
            >
              {d.label.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Feed - Below Tabs - Scrollable */}
        <TabsContent value={filter} className="space-y-3 w-full min-h-0 flex-1 overflow-y-auto">
          <ActivityFeed
            sessions={goat.sessions}
            limit={displayCount}
            filter={filter}
          />
        </TabsContent>
      </Tabs>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={() => setDisplayCount((prev) => prev + 20)}
            className="btn-primary"
          >
            Cargar Más ({goat.sessions.length - displayCount} restantes)
          </Button>
        </div>
      )}
    </div>
  );
}
