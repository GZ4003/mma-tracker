import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus-visible:border-zinc-600 focus-visible:ring-3 focus-visible:ring-zinc-600/50 focus-visible:shadow-lg focus-visible:shadow-zinc-700/30 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/30 aria-invalid:shadow-lg aria-invalid:shadow-red-600/50 md:text-sm hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-700/20 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
