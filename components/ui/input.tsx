import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full max-w-full min-w-0 box-border rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white transition-colors outline-none placeholder:text-zinc-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50 aria-invalid:border-red-500 hover:border-zinc-600",
        className
      )}
      {...props}
    />
  )
}

export { Input }
