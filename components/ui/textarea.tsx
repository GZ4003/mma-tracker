import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50 aria-invalid:border-red-500 hover:border-zinc-600 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
