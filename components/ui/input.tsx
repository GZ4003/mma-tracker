import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white transition-all duration-300 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-500 focus-visible:border-zinc-600 focus-visible:ring-3 focus-visible:ring-zinc-600/50 focus-visible:shadow-lg focus-visible:shadow-zinc-700/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/30 aria-invalid:shadow-lg aria-invalid:shadow-red-600/50 md:text-sm hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-700/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
