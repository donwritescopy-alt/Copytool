"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authCallbackUrl, postLoginPath } from "@/lib/figma-bridge";

// Every auth form posts hidden `source` / `state` fields. When the login was
// started from the Figma plugin (source=figma), they route the user to the
// Figma approval page afterwards instead of the dashboard.
function nextPathFrom(formData: FormData) {
  return postLoginPath(formData.get("source"), formData.get("state"));
}

export async function signIn(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(nextPathFrom(formData));
}

export async function signUp(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();

  if (!firstName || !lastName) {
    return { error: "First name and last name are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Saved on the user as auth metadata (raw_user_meta_data).
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: await authCallbackUrl(nextPathFrom(formData)),
    },
  });

  const ALREADY_EXISTS = "There is already an account with this email id.";

  if (error) {
    // Supabase reports this directly when email confirmation is turned off.
    if (error.code === "user_already_exists") return { error: ALREADY_EXISTS };
    return { error: error.message };
  }

  // With email confirmation on, Supabase hides duplicates by returning a
  // user with no identities instead of an error. That means the email is taken.
  if (data.user && data.user.identities?.length === 0) {
    return { error: ALREADY_EXISTS };
  }

  return { message: "Check your email to confirm your account." };
}

/** Sign in or sign up with Google (Supabase creates the account if new). */
export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await authCallbackUrl(nextPathFrom(formData)) },
  });

  if (error || !data.url) {
    redirect("/login?error=google");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
