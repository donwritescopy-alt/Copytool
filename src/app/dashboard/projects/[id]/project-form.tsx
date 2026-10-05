"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/types";
import { updateProject } from "../actions";

// Shared by step 2 (details page) and step 3 (project page, also edits name/description).
export function ProjectForm({
  project,
  editBasics = false,
  showFigmaButton = false,
}: {
  project: Project;
  editBasics?: boolean;
  showFigmaButton?: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateProject, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={project.id} />

      {editBasics && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" name="name" required defaultValue={project.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={project.description ?? ""}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="brand_name">Brand name</Label>
        <Input
          id="brand_name"
          name="brand_name"
          defaultValue={project.brand_name ?? ""}
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
        <Label htmlFor="brand_voice_keywords">Brand voice keywords</Label>
        <Textarea
          id="brand_voice_keywords"
          name="brand_voice_keywords"
          rows={2}
          placeholder="e.g. friendly, confident, concise"
          defaultValue={project.brand_voice_keywords ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="key_terminology">Key terminology</Label>
        <Textarea
          id="key_terminology"
          name="key_terminology"
          rows={3}
          defaultValue={project.key_terminology ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="words_to_avoid">Words to avoid</Label>
        <Textarea
          id="words_to_avoid"
          name="words_to_avoid"
          rows={3}
          defaultValue={project.words_to_avoid ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="narrative_stance">Narrative stance</Label>
        <select
          id="narrative_stance"
          name="narrative_stance"
          defaultValue={project.narrative_stance ?? ""}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Select…</option>
          <option value="we">We</option>
          <option value="i">I</option>
          <option value="none">No person</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.message && (
        <p role="status" className="text-sm text-muted-foreground">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save project"}
        </Button>
        {showFigmaButton && (
          // ponytail: inert until the Figma frames step exists; wire onClick/link then.
          <Button type="button" variant="outline" disabled={!project.details_saved_at}>
            Select Figma Frames
          </Button>
        )}
      </div>
    </form>
  );
}
