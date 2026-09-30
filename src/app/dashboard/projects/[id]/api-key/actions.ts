"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/encryption";

export async function saveApiKey(_prevState: unknown, formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const apiKey = formData.get("apiKey") as string;

  if (!apiKey?.trim()) {
    return { error: "API key is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error } = await supabase.from("user_api_keys").upsert(
    {
      user_id: user.id,
      provider: "anthropic",
      encrypted_key: encrypt(apiKey),
    },
    { onConflict: "user_id,provider" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { message: "API key saved." };
}
