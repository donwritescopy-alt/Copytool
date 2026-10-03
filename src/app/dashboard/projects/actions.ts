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
  redirect(`/dashboard/projects/${data.id}/flow/brand-guidelines`);
}

export async function updateProjectFlowStep(
  _prevState: unknown,
  formData: FormData,
) {
  const projectId = formData.get("projectId") as string;
  const step = formData.get("step") as string;
  const fieldsByStep: Record<string, string[]> = {
    "brand-guidelines": [
      "brand_name", "target_audience", "narrative_stance", "voice", "tone",
      "dos", "donts", "terminology",
    ],
    "frame-context": ["channel", "primary_goal", "constraints"],
    "choose-copywriter": ["writer_id"],
  };
  const fields = fieldsByStep[step];
  if (!projectId || !fields) return { error: "Invalid project flow step." };

  const values = Object.fromEntries(
    fields.map((field) => [field, (formData.get(field) as string | null) ?? ""]),
  );
  if (step === "brand-guidelines") {
    for (const field of ["brand_name", "target_audience", "narrative_stance"]) {
      if (!String(values[field]).trim()) return { error: "Complete the required brand fields." };
    }
  }
  if (step === "frame-context") {
    if (!String(values.channel).trim() || !String(values.primary_goal).trim()) {
      return { error: "Choose a channel and enter a primary goal." };
    }
  }
  if (step === "choose-copywriter" && values.writer_id !== "val") {
    return { error: "Choose a copy writer." };
  }

  const { error } = await (await createClient())
    .from("projects")
    .update(values)
    .eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
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
