/**
 * InlineMessage: one-line feedback next to the thing it's about. error = form/validation failures (the only place red appears),
 * info = neutral hint, success = confirmation that an action finished.
 * Don't use for page-level announcements or anything that needs a dismiss/action button.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const inlineMessageVariants = cva("flex items-start gap-2 text-body-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      error: "text-danger-text",
      info: "text-secondary",
      success: "text-primary",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

const icons = { error: CircleAlert, info: Info, success: CircleCheck }

function InlineMessage({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof inlineMessageVariants>) {
  const Icon = icons[variant ?? "info"]
  return (
    <p
      data-slot="inline-message"
      role={variant === "error" ? "alert" : "status"}
      className={cn(inlineMessageVariants({ variant, className }))}
      {...props}
    >
      <Icon aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export { InlineMessage }
