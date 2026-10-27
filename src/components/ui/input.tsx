/**
 * Input: single-line pill field, optionally with a leading icon (e.g. search).
 * Pair with Label. Set aria-invalid and show an InlineMessage for errors.
 * Don't use for multi-line text (Textarea) or fixed choices (Select / SegmentedControl).
 */
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const inputClasses =
  "h-11 w-full min-w-0 rounded-field border border-subtle bg-input-bg px-4 text-body-sm text-primary transition-[border-color,background-color] duration-fast ease-out outline-none placeholder:text-secondary hover:bg-surface-solid focus-visible:bg-surface-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-tertiary aria-invalid:border-danger aria-invalid:focus-visible:outline-danger file:border-0 file:bg-transparent file:text-body-sm file:font-medium"

function Input({
  className,
  type,
  leadingIcon,
  ...props
}: React.ComponentProps<"input"> & { leadingIcon?: React.ReactNode }) {
  const input = (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputClasses, leadingIcon && "pl-11", className)}
      {...props}
    />
  )
  if (!leadingIcon) return input
  return (
    <div className="relative w-full">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-secondary [&_svg:not([class*='size-'])]:size-4"
      >
        {leadingIcon}
      </span>
      {input}
    </div>
  )
}

export { Input, inputClasses }
