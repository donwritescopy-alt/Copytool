import { createResponders, createStatelessClient } from "@/lib/plugin-api";

const { json, errorResponse, preflight } = createResponders("POST, OPTIONS");

const MAX_TOKEN_LENGTH = 2048;

export function OPTIONS() {
  return preflight();
}

/**
 * Swaps a refresh token for a fresh session so the plugin stays logged in.
 *
 *   POST { "refresh_token": "..." }
 *   200 { access_token, refresh_token, expires_at }
 *
 * The returned refresh_token replaces the old one (it is single use).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    refresh_token?: unknown;
  } | null;

  const refreshToken =
    typeof body?.refresh_token === "string" ? body.refresh_token.trim() : "";
  if (!refreshToken || refreshToken.length > MAX_TOKEN_LENGTH) {
    return errorResponse("refresh_token is required.", 400);
  }

  const supabase = createStatelessClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    // A 5xx from Supabase is our problem, anything else means the token is
    // invalid, expired or already used.
    if (error && error.status !== undefined && error.status >= 500) {
      console.error("Plugin refresh failed:", error.code ?? error.status);
      return errorResponse("Couldn't refresh the session. Try again.", 500);
    }
    return errorResponse("Session expired. Please log in again.", 401);
  }

  const { session } = data;
  return json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  });
}
