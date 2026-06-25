import { DISCIPLINES } from "@/lib/constants";
import type { Discipline } from "@/types";

interface DisciplinePickerProps {
  selected: Discipline[];
  onChange: (disciplines: Discipline[]) => void;
  multi?: boolean;
}

export default function DisciplinePicker({
  selected,
  onChange,
  multi = false,
}: DisciplinePickerProps) {
  const handleToggle = (discipline: Discipline) => {
    if (multi) {
      if (selected.includes(discipline)) {
        onChange(selected.filter((d) => d !== discipline));
      } else {
        onChange([...selected, discipline]);
      }
    } else {
      onChange(selected[0] === discipline ? [] : [discipline]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {DISCIPLINES.map((discipline) => {
        const isSelected = selected.includes(discipline.value);
        return (
          <button
            key={discipline.value}
            onClick={() => handleToggle(discipline.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              isSelected
                ? "bg-zinc-800 border-blue-600 text-blue-300"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <span className="text-3xl">{discipline.emoji}</span>
            <span className="text-xs font-medium">{discipline.label}</span>
          </button>
        );
      })}
    </div>
  );
}
