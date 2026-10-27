/**
 * ListRow: title + secondary line + optional trailing action, as in the invite list. Stack inside a Card with gap.
 * Don't use for key/value data (StatRow) or as a whole-row link with nested buttons.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function ListRow({
  title,
  description,
  trailing,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <div data-slot="list-row" className={cn("flex items-center justify-between gap-4", className)} {...props}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-body-sm text-primary">{title}</span>
        {description && <span className="truncate text-body-sm text-secondary">{description}</span>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}

export { ListRow }
