"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPersona(_prevState: unknown, formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;

  if (!name?.trim()) {
    return { error: "Persona name is required." };
  }

  const { error } = await (await createClient()).from("personas").insert({
    project_id: projectId,
    name,
    description: formData.get("description") as string,
    goals: formData.get("goals") as string,
    pain_points: formData.get("pain_points") as string,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { message: "Persona added." };
}

export async function updatePersona(_prevState: unknown, formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const personaId = formData.get("personaId") as string;
  const name = formData.get("name") as string;

  if (!name?.trim()) {
    return { error: "Persona name is required." };
  }

  const { error } = await (await createClient())
    .from("personas")
    .update({
      name,
      description: formData.get("description") as string,
      goals: formData.get("goals") as string,
      pain_points: formData.get("pain_points") as string,
    })
    .eq("id", personaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { message: "Persona updated." };
}

export async function deletePersona(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const personaId = formData.get("personaId") as string;

  await (await createClient()).from("personas").delete().eq("id", personaId);

  revalidatePath(`/dashboard/projects/${projectId}`);
}
