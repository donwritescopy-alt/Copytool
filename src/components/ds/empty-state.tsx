/**
 * EmptyState: what to show when a list has nothing in it yet. Says what will appear here and offers the one next step.
 * Don't use for errors (InlineMessage) or loading (skeletons).
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center gap-3 px-6 py-10 text-center", className)}
    >
      {icon && (
        <span
          aria-hidden
          className="mb-1 flex size-12 items-center justify-center rounded-pill bg-surface-solid text-secondary shadow-raised [&_svg]:size-5"
        >
          {icon}
        </span>
      )}
      <p className="text-body font-medium text-primary">{title}</p>
      {description && <p className="max-w-sm text-body-sm text-secondary">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export { EmptyState }
