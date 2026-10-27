/**
 * Badge: small non-interactive label. accent = highlight ("4x Pro"), neutral = inactive state ("Invited"), status = dot + text ("Available for work").
 * Don't use as a button; if it's clickable, use Button size="sm".
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap text-label font-medium", {
  variants: {
    variant: {
      accent: "h-7 rounded-pill bg-accent px-3 text-on-accent",
      neutral: "h-7 rounded-pill bg-surface-muted px-3 text-secondary",
      status:
        "font-normal text-secondary group-data-[variant=inverse]/card:text-inverse-secondary before:size-2 before:rounded-pill before:bg-success before:content-['']",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
})

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
