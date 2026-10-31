"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testGeminiKey } from "@/lib/audit/gemini";

type State = { error?: string; message?: string } | null;

const MAX_KEY_LENGTH = 200;

export async function saveGeminiKey(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in." };

  const key = String(formData.get("apiKey") ?? "").trim();
  if (!key) return { error: "Paste your Gemini API key." };
  if (key.length > MAX_KEY_LENGTH || /\s/.test(key)) {
    return { error: "That doesn't look like a valid API key." };
  }

  const check = await testGeminiKey(key);
  if (check === "invalid") {
    return {
      error: "Gemini rejected that key. Check it and try again.",
    };
  }
  if (check === "unverified") {
    return {
      error: "We couldn't reach Gemini to check your key. Try again shortly.",
    };
  }

  const { error } = await supabase.rpc("set_user_gemini_key", { p_key: key });
  if (error) {
    console.error("Saving Gemini key failed:", error.message);
    return { error: "Couldn't save your key. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { message: "Key saved." };
}

export async function removeGeminiKey(): Promise<State> {
  const { error } = await (await createClient()).rpc("delete_user_gemini_key");
  if (error) {
    console.error("Removing Gemini key failed:", error.message);
    return { error: "Couldn't remove your key. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { message: "Key removed." };
}
