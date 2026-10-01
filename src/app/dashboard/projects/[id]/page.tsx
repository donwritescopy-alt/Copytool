import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Persona, Project } from "@/lib/types";
import { BrandGuidelinesForm } from "./brand-guidelines-form";
import { PersonasSection } from "./personas-section";

export default async function ProjectDetailPage(
  props: PageProps<"/dashboard/projects/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: project }, { data: personas }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single<Project>(),
    supabase
      .from("personas")
      .select("*")
      .eq("project_id", id)
      .order("created_at")
      .returns<Persona[]>(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandGuidelinesForm project={project} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Personas</h2>
        <PersonasSection projectId={project.id} personas={personas ?? []} />
      </div>
    </div>
  );
}
