"use server";

import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/encryption";
import { hashFigmaState, isValidFigmaState } from "@/lib/figma-bridge";

/**
 * Parks the signed-in user's session for the Figma plugin to collect.
 * Runs only when the user clicks "Connect Figma", so a crafted link can't
 * hand someone else's session to an attacker's plugin.
 */
export async function approveFigmaLogin(
  _prevState: unknown,
  formData: FormData,
) {
  const state = formData.get("state");
  if (!isValidFigmaState(state)) {
    return { error: "This login link is invalid. Start again from Figma." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user || !session) {
    return { error: "You're signed out. Log in again from Figma." };
  }

  const { error } = await supabase.from("figma_auth_handoffs").insert({
    state_hash: hashFigmaState(state),
    // Tokens are encrypted so a database leak doesn't expose live sessions.
    tokens_encrypted: encrypt(
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      }),
    ),
  });

  if (error) {
    // 23505 = this state was already used.
    return {
      error:
        error.code === "23505"
          ? "This login link was already used. Start again from Figma."
          : "Couldn't connect Figma. Please try again.",
    };
  }

  return { done: true as const };
}
