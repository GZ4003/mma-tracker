import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  const current = Array.isArray(value) ? value[0] : min
  const progress = ((current - min) / (max - min)) * 100

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={cn("slider-input w-full", className)}
      style={{
        background: `linear-gradient(to right, #3b82f6 ${progress}%, #3f3f46 ${progress}%)`
      }}
    />
  )
}

export { Slider }
