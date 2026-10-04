"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(_prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) {
    return { error: "Project name is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, created_by: user.id })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${data.id}`);
}

export async function updateBrandGuidelines(
  _prevState: unknown,
  formData: FormData,
) {
  const projectId = formData.get("projectId") as string;

  const { error } = await (await createClient())
    .from("projects")
    .update({
      voice: formData.get("voice") as string,
      tone: formData.get("tone") as string,
      dos: formData.get("dos") as string,
      donts: formData.get("donts") as string,
      terminology: formData.get("terminology") as string,
    })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { message: "Saved." };
}
