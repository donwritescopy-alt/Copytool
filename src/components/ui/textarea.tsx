/**
 * Textarea: multi-line field; grows with content. Same look as Input.
 * Don't use for one-line answers (use Input).
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-field border border-subtle bg-input-bg px-4 py-3 text-body-sm text-primary transition-[border-color,background-color] duration-fast ease-out outline-none placeholder:text-secondary hover:bg-surface-solid focus-visible:bg-surface-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-tertiary aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
