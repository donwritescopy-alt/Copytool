"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLOW_STEPS } from "@/lib/flow/steps";
import { useFlowState } from "@/lib/flow/store";

type StepStatus = "completed" | "active" | "upcoming";

export function FlowSidebar() {
  const pathname = usePathname();
  const { completedSteps } = useFlowState();

  const completedCount = FLOW_STEPS.filter((s) =>
    completedSteps.includes(s.id),
  ).length;

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 px-5 py-8">
      <div className="mb-10 px-2">
        <p className="text-sm font-semibold tracking-tight text-white">UX Copy Tool</p>
        <p className="mt-1 text-xs text-zinc-400">
          {completedCount} of {FLOW_STEPS.length} steps complete
        </p>
      </div>

      <nav aria-label="Progress">
        <ol className="space-y-1">
          {FLOW_STEPS.map((step, index) => {
            const isActive = pathname === step.href;
            const isCompleted = completedSteps.includes(step.id);
            const status: StepStatus = isActive
              ? "active"
              : isCompleted
                ? "completed"
                : "upcoming";
            const isLast = index === FLOW_STEPS.length - 1;

            const content = (
              <>
                <span className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                      status === "active" &&
                        "border-white bg-white text-zinc-950",
                      status === "completed" &&
                        "border-zinc-500 bg-zinc-800 text-white",
                      status === "upcoming" &&
                        "border-zinc-800 bg-transparent text-zinc-600",
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-9 h-6 w-px",
                        isCompleted ? "bg-zinc-500" : "bg-zinc-800",
                      )}
                    />
                  )}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span
                    className={cn(
                      "block text-sm font-medium leading-tight text-zinc-100",
                      status === "upcoming" && "text-zinc-600",
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-xs leading-snug text-zinc-400",
                      status === "upcoming" && "text-zinc-700",
                    )}
                  >
                    {step.description}
                  </span>
                </span>
              </>
            );

            const rowClass = cn(
              "flex gap-3 rounded-lg px-2 py-2.5 pb-7 transition-colors",
              status === "active" && "bg-zinc-800/70 ring-1 ring-zinc-700",
            );

            return (
              <li key={step.id}>
                {status === "upcoming" ? (
                  <div
                    aria-disabled="true"
                    className={cn(rowClass, "cursor-not-allowed")}
                  >
                    {content}
                  </div>
                ) : (
                  <Link
                    href={step.href}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      rowClass,
                      !isActive && "hover:bg-zinc-900",
                    )}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
