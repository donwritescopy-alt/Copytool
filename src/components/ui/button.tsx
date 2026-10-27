/**
 * Button: pill-shaped action.
 * Use for any click that does something. primary = the main action on a surface; glow = the single hero action per screen.
 * Don't use for navigation lists (use ListRow/Dock) or icon-only actions (use IconButton).
 */
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill border border-transparent font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-fast ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:scale-[0.98] data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-transparent data-disabled:bg-surface-muted data-disabled:bg-none data-disabled:text-tertiary data-disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed",
        secondary:
          "border-subtle bg-surface-solid text-primary shadow-raised hover:bg-surface-canvas active:bg-surface-muted",
        ghost: "bg-transparent text-primary hover:bg-surface-muted active:bg-surface-muted",
        inverse:
          "bg-surface-inverse-raised text-inverse shadow-raised hover:bg-surface-inverse-raised-hover focus-visible:outline-focus-ring-inverse",
        glow: "border-glass bg-accent bg-accent-glow text-on-accent shadow-glow-accent hover:brightness-105 active:brightness-95",
      },
      size: {
        sm: "h-8 px-3.5 text-label",
        md: "h-10 px-5 text-body-sm",
        lg: "h-12 px-6 text-body [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Appends a trailing arrow, as in "Upgrade Plan →". */
    arrow?: boolean
  }

function Button({ className, variant, size, arrow, children, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="transition-transform duration-fast ease-out group-hover/button:translate-x-0.5"
        />
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
