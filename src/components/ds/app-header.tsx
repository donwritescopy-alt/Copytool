/**
 * AppHeader: top bar for signed-in pages. Logo on the left; the user's avatar, name and actions (e.g. a log-out form) on the right.
 * Use once per signed-in layout. Don't use on sign-in or approval pages (they use the auth layout pattern).
 */
import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function AppHeader({
  name,
  avatarSrc,
  homeHref = "/dashboard",
  children,
  className,
}: {
  name: string
  avatarSrc?: string | null
  homeHref?: string
  /** Right-side actions, e.g. a log-out form. */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "glass sticky top-4 z-40 mx-4 mt-4 flex items-center justify-between gap-4 rounded-pill border border-glass py-2 pr-2 pl-6 shadow-card",
        className
      )}
    >
      <Link
        href={homeHref}
        className="rounded-pill text-body font-semibold text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        UX Copy Tool
      </Link>
      <div className="flex items-center gap-3">
        <Avatar name={name} src={avatarSrc} size="sm" />
        <span className="hidden text-body-sm font-medium text-primary sm:inline">{name}</span>
        {children}
      </div>
    </header>
  )
}

export { AppHeader }
