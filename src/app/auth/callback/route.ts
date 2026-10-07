import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/figma-bridge";

/**
 * Finishes Google sign-in, magic links and email confirmation: Supabase sends
 * the user here with a one-time `code`, which is exchanged for a session.
 * Add `<site>/auth/callback` to Supabase → Authentication → URL Configuration
 * → Redirect URLs.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=callback", origin));
}
