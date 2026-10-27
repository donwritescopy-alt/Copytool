/**
 * Label: visible name for a form field. Always connect via htmlFor (or wrap the control).
 * Don't use as general body text.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-label leading-none font-medium text-primary select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-tertiary peer-disabled:cursor-not-allowed peer-disabled:text-tertiary",
        className
      )}
      {...props}
    />
  )
}

export { Label }
