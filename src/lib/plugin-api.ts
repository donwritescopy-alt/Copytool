import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createCookieClient } from "@/lib/supabase/server";

/**
 * Shared helpers for the API routes the Figma plugin calls
 * (/api/plugin/login, /api/plugin/refresh, /api/projects).
 */

// The plugin UI runs in a sandboxed iframe with an opaque ("null") origin,
// so it needs CORS. Auth is a bearer token, not cookies.
function corsHeaders(methods: string) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/** Builds json()/errorResponse()/OPTIONS() helpers for one route. */
export function createResponders(methods: string) {
  const headers = corsHeaders(methods);
  const json = (body: unknown, status = 200) =>
    NextResponse.json(body, { status, headers });
  return {
    json,
    errorResponse: (error: string, status: number) => json({ error }, status),
    // Answers the browser's preflight check.
    preflight: () => new NextResponse(null, { status: 204, headers }),
  };
}

/**
 * A Supabase client that keeps no session and writes no cookies. Used for
 * the plugin's stateless login/refresh calls.
 */
export function createStatelessClient(accessToken?: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined,
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/**
 * Supabase client acting as the caller, so row-level security applies.
 * Uses `Authorization: Bearer <access_token>` when present, otherwise the
 * web app's cookie session. Returns null when nobody is logged in.
 */
export async function getSupabaseForRequest(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];

  const supabase = token
    ? createStatelessClient(token)
    : await createCookieClient();

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user ? supabase : null;
}
