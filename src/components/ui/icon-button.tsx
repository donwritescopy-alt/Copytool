/**
 * IconButton: circular icon-only action, e.g. close "X".
 * Use when the icon alone is universally understood. Always pass aria-label.
 * Don't use when a text label would be clearer (use Button).
 */
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-pill border border-transparent transition-[background-color,color,transform] duration-fast ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:scale-95 data-disabled:pointer-events-none data-disabled:bg-surface-muted data-disabled:text-tertiary data-disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        secondary: "bg-surface-solid text-primary shadow-raised hover:bg-surface-canvas",
        ghost: "bg-transparent text-secondary hover:bg-surface-muted hover:text-primary",
        primary: "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed",
        inverse:
          "bg-surface-inverse-raised text-inverse shadow-raised hover:bg-surface-inverse-raised-hover focus-visible:outline-focus-ring-inverse",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-10 [&_svg:not([class*='size-'])]:size-5",
        lg: "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

type IconButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof iconButtonVariants> & { "aria-label": string }

function IconButton({ className, variant, size, ...props }: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { IconButton, iconButtonVariants }
