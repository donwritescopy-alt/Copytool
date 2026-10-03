"use client";

import { useActionState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CHANNELS, NARRATIVE_STANCES, WRITERS, type StepId } from "@/lib/flow/steps";
import { updateProjectFlowStep } from "@/app/dashboard/projects/actions";
import type { Project } from "@/lib/types";

const NEXT: Partial<Record<StepId, StepId>> = {
  "brand-guidelines": "frame-context",
  "frame-context": "choose-copywriter",
  "choose-copywriter": "analysis",
};
const PREVIOUS: Partial<Record<StepId, StepId>> = {
  "frame-context": "brand-guidelines",
  "choose-copywriter": "frame-context",
  analysis: "choose-copywriter",
};

export function ProjectFlowForm({ project, step }: { project: Project; step: StepId }) {
  const [state, formAction, pending] = useActionState(updateProjectFlowStep, null);
  const [navigating, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!state?.success) return;
    const next = NEXT[step];
    if (next) startTransition(() => router.push(`/dashboard/projects/${project.id}/flow/${next}`));
    else router.refresh();
  }, [state, step, project.id, router]);

  const backHref = PREVIOUS[step]
    ? `/dashboard/projects/${project.id}/flow/${PREVIOUS[step]}`
    : `/dashboard/projects/${project.id}`;

  if (step === "choose-copywriter") {
    return (
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="projectId" value={project.id} />
        <input type="hidden" name="step" value={step} />
        {WRITERS.map((writer) => (
          <label key={writer.id} className="flex cursor-pointer items-center gap-4 rounded-xl border p-4">
            <input type="radio" name="writer_id" value={writer.id} defaultChecked={project.writer_id === writer.id} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={writer.avatar} alt="" className="size-20 rounded-lg object-cover" />
            <span><strong className="block">{writer.name}</strong><span className="text-sm text-muted-foreground">{writer.tagline}</span><span className="mt-1 block text-sm">{writer.description}</span></span>
            {project.writer_id === writer.id && <Check className="ml-auto size-5" aria-label="Selected" />}
          </label>
        ))}
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex justify-between border-t pt-6">
          <Button variant="outline" render={<Link href={backHref} />}><ArrowLeft data-icon="inline-start" />Back</Button>
          <Button type="submit" disabled={pending || navigating}>{pending ? "Saving…" : "Choose and continue"}<ArrowRight data-icon="inline-end" /></Button>
        </div>
      </form>
    );
  }

  if (step === "analysis") {
    return <p className="text-sm text-muted-foreground">Analysis is ready for this project. Paste copy to review in the analysis tool.</p>;
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="step" value={step} />
      {step === "brand-guidelines" ? (
        <>
          <Field label="Brand name" name="brand_name" required defaultValue={project.brand_name} placeholder="e.g. Acme" />
          <Field label="Target audience" name="target_audience" required defaultValue={project.target_audience} multiline />
          <div className="space-y-2">
            <Label htmlFor="narrative_stance">Narrative stance <span className="text-destructive">*</span></Label>
            <select id="narrative_stance" name="narrative_stance" required defaultValue={project.narrative_stance ?? ""} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="" disabled>Choose a stance</option>
              {NARRATIVE_STANCES.map((stance) => <option key={stance} value={stance}>{stance}</option>)}
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Voice" name="voice" defaultValue={project.voice} multiline />
            <Field label="Tone" name="tone" defaultValue={project.tone} multiline />
            <Field label="Do’s" name="dos" defaultValue={project.dos} multiline />
            <Field label="Don’ts" name="donts" defaultValue={project.donts} multiline />
            <Field label="Terminology" name="terminology" defaultValue={project.terminology} multiline />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="channel">Channel <span className="text-destructive">*</span></Label>
            <select id="channel" name="channel" required defaultValue={project.channel ?? ""} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="" disabled>Choose a channel</option>
              {CHANNELS.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
            </select>
          </div>
          <Field label="Primary goal" name="primary_goal" required defaultValue={project.primary_goal} placeholder="e.g. onboarding, pricing, error recovery" />
          <Field label="Constraints (optional)" name="constraints" defaultValue={project.constraints} multiline placeholder="e.g. Keep under 8 words; no emoji" />
        </>
      )}
      {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <div className="flex justify-between border-t pt-6">
        <Button variant="outline" render={<Link href={backHref} />}><ArrowLeft data-icon="inline-start" />{step === "brand-guidelines" ? "Back to project" : "Back"}</Button>
        <Button type="submit" disabled={pending || navigating}>{pending ? "Saving…" : "Save and continue"}<ArrowRight data-icon="inline-end" /></Button>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, required, multiline, placeholder }: { label: string; name: string; defaultValue: string | null; required?: boolean; multiline?: boolean; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}{required && <> <span className="text-destructive">*</span></>}</Label>
      {multiline ? <Textarea id={name} name={name} rows={3} required={required} defaultValue={defaultValue ?? ""} placeholder={placeholder} /> : <Input id={name} name={name} required={required} defaultValue={defaultValue ?? ""} placeholder={placeholder} />}
    </div>
  );
}
