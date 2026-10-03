"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/types";
import { updateBrandGuidelines } from "../actions";

export function BrandGuidelinesForm({ project }: { project: Project }) {
  const [state, formAction, pending] = useActionState(
    updateBrandGuidelines,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={project.id} />

      <div className="space-y-2">
        <Label htmlFor="brand_name">Brand name</Label>
        <Textarea
          id="brand_name"
          name="brand_name"
          rows={1}
          defaultValue={project.brand_name ?? ""}
          placeholder="e.g. Acme"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="target_audience">Target audience</Label>
        <Textarea
          id="target_audience"
          name="target_audience"
          rows={2}
          defaultValue={project.target_audience ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="narrative_stance">Narrative stance</Label>
        <select
          id="narrative_stance"
          name="narrative_stance"
          defaultValue={project.narrative_stance ?? ""}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Choose a stance</option>
          <option value="We">We</option>
          <option value="I">I</option>
          <option value="No person">No person</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="voice">Voice</Label>
        <Textarea
          id="voice"
          name="voice"
          rows={2}
          defaultValue={project.voice ?? ""}
          placeholder="e.g. Friendly, confident, concise"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Textarea
          id="tone"
          name="tone"
          rows={2}
          defaultValue={project.tone ?? ""}
          placeholder="e.g. Warm but professional"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dos">Do&apos;s</Label>
        <Textarea
          id="dos"
          name="dos"
          rows={3}
          defaultValue={project.dos ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="donts">Don&apos;ts</Label>
        <Textarea
          id="donts"
          name="donts"
          rows={3}
          defaultValue={project.donts ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="terminology">Terminology</Label>
        <Textarea
          id="terminology"
          name="terminology"
          rows={3}
          defaultValue={project.terminology ?? ""}
          placeholder="Preferred terms, words to avoid"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save guidelines"}
      </Button>
    </form>
  );
}
