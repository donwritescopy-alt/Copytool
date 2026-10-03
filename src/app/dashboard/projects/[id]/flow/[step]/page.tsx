import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FLOW_STEPS, type StepId } from "@/lib/flow/steps";
import { getCompletedProjectSteps, getNextProjectStep, projectFlowHref } from "@/lib/flow/project-state";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectFlowForm } from "./project-flow-form";
import { ProjectAnalysisView } from "./project-analysis-view";

export default async function ProjectFlowPage(props: { params: Promise<{ id: string; step: string }> }) {
  const { id, step: rawStep } = await props.params;
  const step = FLOW_STEPS.find((item) => item.id === rawStep)?.id as StepId | undefined;
  if (!step) notFound();

  const { data: project } = await (await createClient()).from("projects").select("*").eq("id", id).single<Project>();
  if (!project) notFound();

  const completedSteps = getCompletedProjectSteps(project);
  const index = FLOW_STEPS.findIndex((item) => item.id === step);
  const earliestIncomplete = FLOW_STEPS.findIndex((item) => !completedSteps.includes(item.id));
  if (earliestIncomplete >= 0 && index > earliestIncomplete) {
    redirect(projectFlowHref(project.id, getNextProjectStep(project)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border p-4 lg:sticky lg:top-6">
        <p className="text-sm font-semibold">{project.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{completedSteps.length} of 4 steps complete</p>
        <nav aria-label="Project setup progress" className="mt-5">
          <ol className="space-y-1">
            {FLOW_STEPS.map((item, i) => {
              const active = item.id === step;
              const done = completedSteps.includes(item.id);
              return <li key={item.id}><Link aria-current={active ? "step" : undefined} href={projectFlowHref(project.id, item.id)} className={cn("block rounded-lg px-3 py-2 text-sm", active && "bg-muted font-medium", done && !active && "text-foreground", !done && !active && "text-muted-foreground hover:bg-muted/60")}>{i + 1}. {item.label}{done ? " ✓" : ""}</Link></li>;
            })}
          </ol>
        </nav>
        <Link href={`/dashboard/projects/${project.id}`} className="mt-5 inline-block text-sm text-muted-foreground underline underline-offset-4">Back to project</Link>
      </aside>
      <main className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground"><Link className="underline underline-offset-4" href="/dashboard">Projects</Link><span> / </span><Link className="underline underline-offset-4" href={`/dashboard/projects/${project.id}`}>{project.name}</Link></nav>
        <p className="text-sm font-medium text-primary">Step {index + 1} of 4</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{FLOW_STEPS[index].label}</h1>
        <p className="mt-3 text-muted-foreground">{step === "brand-guidelines" ? "Set the brand voice and the audience for this project." : step === "frame-context" ? "Set where the copy will appear and what it needs to achieve." : step === "choose-copywriter" ? "Pick the writer whose personality fits this moment." : "Your project setup is ready for copy analysis."}</p>
        <section className="mt-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">{step === "analysis" ? <ProjectAnalysisView project={project} /> : <ProjectFlowForm project={project} step={step} />}</section>
        {step === "analysis" && <p className="mt-5 text-sm text-muted-foreground"><Link href={`/dashboard/projects/${project.id}`} className="underline underline-offset-4">Review project details</Link>.</p>}
      </main>
    </div>
  );
}
