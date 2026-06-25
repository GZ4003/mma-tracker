"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoatMode } from "@/hooks/useGoatMode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import DisciplinePicker from "@/components/DisciplinePicker";
import type { Discipline } from "@/types";

export default function LogTraining() {
  const router = useRouter();
  const goat = useGoatMode();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [discipline, setDiscipline] = useState<Discipline[]>([]);
  const [duration, setDuration] = useState("");
  const [energy, setEnergy] = useState([5]);
  const [notes, setNotes] = useState("");
  const [techniques, setTechniques] = useState<string[]>([]);
  const [techniqueInput, setTechniqueInput] = useState("");
  const [error, setError] = useState("");

  const handleAddTechnique = () => {
    if (techniqueInput.trim()) {
      setTechniques([...techniques, techniqueInput.trim()]);
      setTechniqueInput("");
    }
  };

  const handleRemoveTechnique = (idx: number) => {
    setTechniques(techniques.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (discipline.length === 0) {
      setError("Selecciona una disciplina");
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      setError("Ingresa una duración válida");
      return;
    }

    goat.logSession({
      date,
      discipline: discipline[0],
      duration: Number(duration),
      energy: energy[0],
      notes: notes || undefined,
      techniques: techniques.length > 0 ? techniques : undefined,
    });

    router.push("/");
  };

  if (!goat.isLoaded || !goat.isSetupComplete) {
    return null;
  }

  return (
    <div className="px-4 py-5 pb-32 max-w-3xl mx-auto overflow-x-hidden md:px-6 md:py-6 md:pb-8">
      <PageHeader
        title="Registrar Entrenamiento"
        subtitle="Registra tu sesión de entrenamiento y gana XP"
      />

      {error && (
        <div className="mb-5 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl">
          <p className="text-red-400 font-bold text-base">{error}</p>
        </div>
      )}

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

        {/* Discipline */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-zinc-200">Disciplina</Label>
          <DisciplinePicker
            selected={discipline}
            onChange={setDiscipline}
            multi={false}
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-zinc-200">Duración (minutos)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
          />
        </div>

        {/* Energy Level */}
        <div className="space-y-4 bg-zinc-900 border border-blue-600/30 rounded-xl p-5">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold text-zinc-200">Nivel de Energía</Label>
            <span className="text-xl font-bold text-blue-400">{energy[0]}/10</span>
          </div>
          <Slider
            value={energy}
            onValueChange={(value) => setEnergy(Array.isArray(value) ? value : [value])}
            min={1}
            max={10}
            step={1}
            className="w-full py-3"
          />
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Cansado</span>
            <span>Normal</span>
            <span>Explosivo</span>
          </div>
        </div>

        {/* Techniques */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-zinc-200">Técnicas (opcional)</Label>
          <div className="flex gap-2">
            <Input
              value={techniqueInput}
              onChange={(e) => setTechniqueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTechnique();
                }
              }}
              placeholder="p.ej., Double Leg, Mount Escape"
            />
            <Button
              type="button"
              onClick={handleAddTechnique}
              className="btn-primary shrink-0 h-12"
            >
              Agregar
            </Button>
          </div>
          {techniques.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techniques.map((tech, idx) => (
                <Badge
                  key={idx}
                  className="bg-blue-600/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-red-600/20 hover:text-red-300 hover:border-red-500/30 text-sm py-1 px-3 transition-colors"
                  onClick={() => handleRemoveTechnique(idx)}
                >
                  {tech} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-zinc-200">Notas (opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Cómo te sentiste en la sesión? ¿Algún avance?"
          />
        </div>

        <Button
          type="submit"
          className="w-full btn-primary font-bold text-lg py-6 tracking-widest"
        >
          REGISTRAR SESIÓN
        </Button>
      </form>
    </div>
  );
}
