/**
 * Dock: floating glass pill navigation with icon + label items, the active item in near-black, and at most one glow action.
 * Use for the primary destinations of a small app (≤5). Don't use for in-page filters (SegmentedControl) or long menus.
 */
import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Dock({ className, children, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="dock"
      className={cn("glass inline-flex rounded-pill border border-glass px-4 py-2 shadow-card", className)}
      {...props}
    >
      <ul className="flex items-center gap-1">{children}</ul>
    </nav>
  )
}

function DockItem({
  href,
  icon,
  label,
  active,
  className,
}: {
  href: React.ComponentProps<typeof Link>["href"]
  icon: React.ReactNode
  label: string
  active?: boolean
  className?: string
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-w-16 flex-col items-center gap-1 rounded-panel px-2 py-1.5 text-caption font-medium text-secondary transition-colors duration-fast ease-out outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring aria-[current=page]:text-primary [&_svg]:size-6",
          className
        )}
      >
        <span aria-hidden>{icon}</span>
        {label}
      </Link>
    </li>
  )
}

function DockAction({
  icon,
  label,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "variant"> & { icon: React.ReactNode; label: string }) {
  return (
    <li className="px-2">
      <Button variant="glow" aria-label={label} className={cn("h-14 w-24 px-0 [&_svg]:size-6", className)} {...props}>
        {icon}
      </Button>
    </li>
  )
}

export { Dock, DockItem, DockAction }
