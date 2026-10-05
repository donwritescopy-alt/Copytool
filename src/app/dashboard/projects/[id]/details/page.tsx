import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";
import { ProjectForm } from "../project-form";

export default async function ProjectDetailsPage(
  props: PageProps<"/dashboard/projects/[id]/details">,
) {
  const { id } = await props.params;
  const { created } = await props.searchParams;
  const { data: project } = await (await createClient())
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) notFound();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      {created && (
        <p
          role="status"
          className="rounded-lg border bg-muted px-4 py-3 text-sm"
        >
          Project “{project.name}” created. Add some brand details next.
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Additional details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} showFigmaButton />
        </CardContent>
      </Card>
    </div>
  );
}
