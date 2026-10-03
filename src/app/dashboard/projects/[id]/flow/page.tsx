import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNextProjectStep, projectFlowHref } from "@/lib/flow/project-state";
import type { Project } from "@/lib/types";

export default async function ProjectFlowIndex(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const { data: project } = await (await createClient()).from("projects").select("*").eq("id", id).single<Project>();
  if (!project) notFound();
  redirect(projectFlowHref(project.id, getNextProjectStep(project)));
}
