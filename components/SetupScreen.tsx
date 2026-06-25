"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DisciplinePicker from "./DisciplinePicker";
import type { Discipline } from "@/types";

interface SetupScreenProps {
  onComplete: (name: string, disciplines: Discipline[]) => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [name, setName] = useState("");
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && disciplines.length > 0) {
      onComplete(name, disciplines);
    }
  };

  const isValid = name.trim().length > 0 && disciplines.length > 0;

  return (
    <div className="fixed inset-0 bg-goat-bg z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-display text-goat-yellow tracking-wider">
            KHABIB
          </h1>
          <h2 className="text-xl font-display text-goat-white tracking-wide">
            MODE
          </h2>
          <p className="text-goat-muted text-sm mt-4">
            Tu Rastreador Personal de Entrenamientos MMA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-goat-white">
              Nombre del Luchador
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre de luchador"
              className="bg-goat-surface border-goat-muted/30 text-goat-white placeholder:text-goat-muted"
              autoFocus
            />
          </div>

          {/* Discipline Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-goat-white">
              ¿Qué entrenas?
            </label>
            <DisciplinePicker
              selected={disciplines}
              onChange={setDisciplines}
              multi={true}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid}
            className={`w-full py-6 font-display text-2xl tracking-widest ${
              isValid
                ? "bg-goat-yellow text-goat-bg hover:bg-goat-yellow/90"
                : "bg-goat-muted/20 text-goat-muted cursor-not-allowed"
            }`}
          >
            ¡VAMOS!
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-goat-muted text-center">
          Todos los datos se almacenan localmente en tu dispositivo
        </p>
      </div>
    </div>
  );
}
