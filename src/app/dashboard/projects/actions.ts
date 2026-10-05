"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name) {
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
    .insert({ name, description: description || null, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  // Client does router.replace so Back from the details page lands on the dashboard.
  return { id: data.id as string };
}

const text = (formData: FormData, key: string) =>
  (formData.get(key) as string | null)?.trim() || null;

export async function updateProject(_prevState: unknown, formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const stance = text(formData, "narrative_stance");
  const update: Record<string, string | null> = {
    brand_name: text(formData, "brand_name"),
    target_audience: text(formData, "target_audience"),
    brand_voice_keywords: text(formData, "brand_voice_keywords"),
    key_terminology: text(formData, "key_terminology"),
    words_to_avoid: text(formData, "words_to_avoid"),
    narrative_stance: stance,
    details_saved_at: new Date().toISOString(),
  };

  // Name/description are only on the project page (step 3).
  if (formData.has("name")) {
    const name = text(formData, "name");
    if (!name) return { error: "Project name is required." };
    update.name = name;
    update.description = text(formData, "description");
  }

  const { error } = await (await createClient())
    .from("projects")
    .update(update)
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { message: "Saved." };
}

export async function deleteProject(formData: FormData) {
  const { error } = await (await createClient())
    .from("projects")
    .delete()
    .eq("id", formData.get("projectId") as string);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
