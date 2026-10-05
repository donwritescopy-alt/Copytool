import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";
import { DeleteProjectButton } from "./delete-project-button";
import { ProjectForm } from "./project-form";

export default async function ProjectDetailPage(
  props: PageProps<"/dashboard/projects/[id]">,
) {
  const { id } = await props.params;
  const { data: project } = await (await createClient())
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} editBasics showFigmaButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete project</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Permanently removes this project and its details.
          </p>
          <DeleteProjectButton projectId={project.id} />
        </CardContent>
      </Card>
    </div>
  );
}
