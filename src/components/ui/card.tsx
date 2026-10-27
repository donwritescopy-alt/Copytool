/**
 * Card: rounded container for one topic.
 * glass = default over the gradient canvas; gradient/tinted = promotional or hero cards; solid = dense content or no canvas behind;
 * inverse = dark profile/status card (pair with StatusStrip).
 * Don't nest cards inside cards; use ListRow or a muted panel instead.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-card border py-(--card-spacing) text-body-sm [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-card *:[img:last-child]:rounded-b-card",
  {
    variants: {
      variant: {
        glass: "glass border-glass text-primary shadow-card",
        gradient: "border-glass bg-surface-solid bg-gradient-card text-primary shadow-card",
        tinted: "border-glass bg-surface-solid bg-gradient-card-lime text-primary shadow-card",
        solid: "border-subtle bg-surface-solid text-primary shadow-card",
        inverse: "border-transparent bg-surface-inverse text-inverse shadow-card",
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
)

function Card({
  className,
  size = "default",
  variant = "glass",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-2 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-title-sm font-medium group-data-[size=sm]/card:text-body", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-sm text-secondary group-data-[variant=inverse]/card:text-inverse-secondary", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-(--card-spacing)", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 px-(--card-spacing)", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, cardVariants }
