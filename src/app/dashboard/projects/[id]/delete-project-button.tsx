"use client";

import { Button } from "@/components/ui/button";
import { deleteProject } from "../actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(e) => {
        if (!confirm("Delete this project permanently? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <Button type="submit" variant="destructive">
        Delete project
      </Button>
    </form>
  );
}
