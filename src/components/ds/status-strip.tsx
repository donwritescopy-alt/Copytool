/**
 * StatusStrip: green strip peeking out under a card (usually Card variant="inverse") carrying one short status line.
 * Don't use for errors or anything the user must act on (InlineMessage / Button).
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function StatusStrip({
  status,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { status: React.ReactNode }) {
  return (
    <div data-slot="status-strip" className={cn("flex flex-col", className)} {...props}>
      <div className="relative z-10 *:data-[slot=card]:shadow-card">{children}</div>
      <p className="-mt-(--radius-card) flex items-center justify-center gap-2 rounded-b-card bg-success px-6 pt-[calc(var(--radius-card)+var(--spacing)*2.5)] pb-3 text-body-sm font-medium text-on-accent [&_svg]:size-4">
        {status}
      </p>
    </div>
  )
}

export { StatusStrip }
