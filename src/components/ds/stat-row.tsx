/**
 * StatRow: label on the left, value on the right, as in "Call Duration · 21.02.2025".
 * size="lg" for the headline pair (e.g. name + duration). Uses a <dl>-friendly structure: wrap rows in <dl>.
 * Don't use for actionable rows (ListRow).
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function StatRow({
  label,
  value,
  size = "sm",
  className,
  ...props
}: React.ComponentProps<"div"> & { label: React.ReactNode; value: React.ReactNode; size?: "sm" | "lg" }) {
  return (
    <div
      data-slot="stat-row"
      className={cn(
        "flex items-baseline justify-between gap-4",
        size === "lg" ? "text-title-sm font-medium text-primary" : "text-body-sm text-secondary",
        className
      )}
      {...props}
    >
      <dt className="min-w-0">{label}</dt>
      <dd className={cn("shrink-0 tabular-nums", size === "lg" && "text-title")}>{value}</dd>
    </div>
  )
}

export { StatRow }
