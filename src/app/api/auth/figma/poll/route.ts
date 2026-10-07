import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { hashFigmaState, isValidFigmaState } from "@/lib/figma-bridge";

// The plugin UI runs in a sandboxed iframe with an opaque ("null") origin, so
// it needs CORS. No cookies are involved; the secret is the `state` itself.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * The Figma plugin polls this with its `state` until the user has logged in
 * and approved in the browser.
 *
 *   POST { "state": "<state>" }
 *   202 { status: "pending" }                    → keep polling
 *   200 { status: "ok", access_token, refresh_token, expires_at }
 *
 * The session is returned once and then deleted (single use, 5 minute TTL).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    state?: unknown;
  } | null;

  if (!isValidFigmaState(body?.state)) {
    return json({ error: "Invalid state." }, 400);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("claim_figma_handoff", {
    p_state_hash: hashFigmaState(body.state),
  });

  if (error) {
    console.error("claim_figma_handoff failed:", error.message);
    return json({ error: "Couldn't check login status." }, 500);
  }

  if (!data) return json({ status: "pending" }, 202);

  try {
    return json({ status: "ok", ...JSON.parse(decrypt(data as string)) });
  } catch {
    return json({ error: "Couldn't read the login session." }, 500);
  }
}
