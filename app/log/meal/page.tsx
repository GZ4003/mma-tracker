"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMmaMode } from "@/hooks/useMmaMode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import { MEAL_TYPES } from "@/lib/constants";
import type { MealType } from "@/types";

export default function LogMeal() {
  const router = useRouter();
  const mma = useMmaMode();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Ingresa una descripción de la comida");
      return;
    }

    mma.logMeal({
      date,
      mealType,
      mealDescription: description,
      notes: notes || undefined,
    });

    router.push("/");
  };

  if (!mma.isLoaded || !mma.isSetupComplete) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <PageHeader
        title="Registrar Comida"
        subtitle="Mantén el control de tu nutrición"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div className="space-y-2">
          <Label className="text-mma-white">Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-mma-surface border-mma-muted/30 text-mma-white"
          />
        </div>

        {/* Meal Type */}
        <div className="space-y-2">
          <Label className="text-mma-white">Tipo de Comida</Label>
          <Tabs value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-mma-surface">
              {MEAL_TYPES.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="data-[state=active]:bg-mma-yellow data-[state=active]:text-mma-bg text-xs"
                >
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-mma-white">¿Qué comiste?</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="p.ej., 2 pechugas de pollo, arroz, brócoli"
            className="bg-mma-surface border-mma-muted/30 text-mma-white placeholder:text-mma-muted min-h-24"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-mma-white">Notas (opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Cómo supo? ¿Cómo te sientes?"
            className="bg-mma-surface border-mma-muted/30 text-mma-white placeholder:text-mma-muted min-h-20"
          />
        </div>

        {/* Error */}
        {error && <p className="text-mma-orange text-sm">{error}</p>}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-mma-orange text-mma-white hover:bg-mma-orange/90 font-display text-lg py-6 tracking-widest"
        >
          Registrar Comida
        </Button>
      </form>
    </div>
  );
}
