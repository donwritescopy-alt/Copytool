/**
 * SetupChecklist: short ordered list of onboarding steps (done / current / upcoming). Only the current step shows its action.
 * Use on Home until setup is complete, then stop rendering it. Don't use for long task lists or optional tips.
 */
import * as React from "react"
import { Check } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SetupStep = {
  title: string
  description?: string
  status: "done" | "current" | "upcoming"
  /** Rendered only on the current step, e.g. <Button variant="glow">. */
  action?: React.ReactNode
}

function SetupChecklist({
  title = "Get set up",
  steps,
  className,
}: {
  title?: string
  steps: SetupStep[]
  className?: string
}) {
  const done = steps.filter((s) => s.status === "done").length
  return (
    <Card data-slot="setup-checklist" className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {done} of {steps.length} done
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <li
              key={step.title}
              aria-current={step.status === "current" ? "step" : undefined}
              className={cn(
                "flex items-start gap-4 rounded-panel p-3",
                step.status === "current" && "bg-surface-solid shadow-raised"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-pill text-label font-medium",
                  step.status === "done" && "bg-success text-on-accent",
                  step.status === "current" && "bg-accent text-on-accent",
                  step.status === "upcoming" && "bg-surface-muted text-secondary"
                )}
              >
                {step.status === "done" ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
                <span
                  className={cn(
                    "text-body-sm font-medium",
                    step.status === "upcoming" ? "text-secondary" : "text-primary",
                    step.status === "done" && "line-through decoration-(--text-tertiary)"
                  )}
                >
                  {step.title}
                  {step.status === "done" && <span className="sr-only"> (done)</span>}
                </span>
                {step.description && step.status !== "done" && (
                  <span className="text-body-sm text-secondary">{step.description}</span>
                )}
                {step.status === "current" && step.action && <div className="pt-2">{step.action}</div>}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

export { SetupChecklist, type SetupStep }
