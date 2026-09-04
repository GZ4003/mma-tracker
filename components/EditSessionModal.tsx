"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import DisciplinePicker from "@/components/DisciplinePicker";
import type { Discipline, Session } from "@/types";

interface EditSessionModalProps {
  session: Session | null;
  onClose: () => void;
  onSave: (
    sessionId: string,
    updates: Pick<
      Session,
      "discipline" | "date" | "duration" | "notes" | "techniques" | "energy"
    >
  ) => void;
}

export default function EditSessionModal({
  session,
  onClose,
  onSave,
}: EditSessionModalProps) {
  const [date, setDate] = useState("");
  const [discipline, setDiscipline] = useState<Discipline[]>([]);
  const [duration, setDuration] = useState("");
  const [energy, setEnergy] = useState([5]);
  const [notes, setNotes] = useState("");
  const [techniques, setTechniques] = useState<string[]>([]);
  const [techniqueInput, setTechniqueInput] = useState("");

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setDiscipline(session.discipline ? [session.discipline] : []);
      setDuration(session.duration ? String(session.duration) : "");
      setEnergy([session.energy ?? 5]);
      setNotes(session.notes ?? "");
      setTechniques(session.techniques ?? []);
      setTechniqueInput("");
    }
  }, [session]);

  const handleAddTechnique = () => {
    if (techniqueInput.trim()) {
      setTechniques([...techniques, techniqueInput.trim()]);
      setTechniqueInput("");
    }
  };

  const handleRemoveTechnique = (idx: number) => {
    setTechniques(techniques.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!session) return;
    onSave(session.id, {
      discipline: discipline[0],
      date,
      duration: duration ? Number(duration) : undefined,
      notes: notes || undefined,
      techniques: techniques.length > 0 ? techniques : undefined,
      energy: energy[0],
    });
    onClose();
  };

  return (
    <Dialog open={!!session} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Entrenamiento</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-blue-300 font-bold">Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-blue-300 font-bold">Disciplina</Label>
            <DisciplinePicker
              selected={discipline}
              onChange={setDiscipline}
              multi={false}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-blue-300 font-bold">
              Duración (minutos)
            </Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
            />
          </div>

          <div className="space-y-4 bg-slate-800/50 border-2 border-blue-600 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <Label className="text-blue-300 font-bold">
                Nivel de Energía
              </Label>
              <span className="text-blue-400 font-bold text-xl px-3 py-1 bg-blue-600/20 rounded-lg border border-blue-500">
                {energy[0]}/10
              </span>
            </div>
            <Slider
              value={energy}
              onValueChange={(value) =>
                setEnergy(Array.isArray(value) ? value : [value])
              }
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-blue-300 font-bold">
              Técnicas (opcional)
            </Label>
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
              <Button type="button" onClick={handleAddTechnique}>
                Agregar
              </Button>
            </div>
            {techniques.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techniques.map((tech, idx) => (
                  <Badge
                    key={idx}
                    className="bg-mma-yellow/20 text-mma-yellow border-mma-yellow/30 cursor-pointer hover:bg-mma-yellow/30"
                    onClick={() => handleRemoveTechnique(idx)}
                  >
                    {tech} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-blue-300 font-bold">
              Notas (opcional)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Cómo te sentiste en la sesión? ¿Algún avance?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={discipline.length === 0}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
