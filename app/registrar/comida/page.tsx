"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoatMode } from "@/hooks/useGoatMode";
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
  const goat = useGoatMode();

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

    goat.logMeal({
      date,
      mealType,
      mealDescription: description,
      notes: notes || undefined,
    });

    router.push("/");
  };

  if (!goat.isLoaded || !goat.isSetupComplete) {
    return null;
  }

  return (
    <div className="px-4 py-5 pb-32 max-w-4xl mx-auto overflow-x-hidden md:px-6 md:py-6 md:pb-8">
      <PageHeader
        title="Registrar Comida"
        subtitle="Mantén el control de tu nutrición"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-zinc-200">Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Meal Type */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-zinc-200">Tipo de Comida</Label>
          <Tabs value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
            <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {MEAL_TYPES.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="text-sm py-3 px-2"
                >
                  {type.label === "Pre-Entrenamiento" ? "Pre-Entr." : type.label === "Post-Entrenamiento" ? "Post-Entr." : type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-zinc-200">¿Qué comiste?</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="p.ej., 2 pechugas de pollo, arroz, brócoli"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-zinc-200">Notas (opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Cómo supo? ¿Cómo te sientes?"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl">
            <p className="text-red-400 font-bold text-base">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full btn-primary font-bold text-lg py-6 tracking-widest"
        >
          REGISTRAR COMIDA
        </Button>
      </form>
    </div>
  );
}
