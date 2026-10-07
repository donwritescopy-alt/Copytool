import { createResponders, createStatelessClient } from "@/lib/plugin-api";

const { json, errorResponse, preflight } = createResponders("POST, OPTIONS");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 256;

// Simple in-memory rate limit: 10 attempts per minute per IP.
// Note: this resets whenever the server restarts and is per server instance,
// so on a multi-instance host it is only a first line of defence.
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);

  // Drop stale entries so the map can't grow forever.
  if (attempts.size > 1000) {
    for (const [key, times] of attempts) {
      if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
    }
  }

  return recent.length > MAX_ATTEMPTS;
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function OPTIONS() {
  return preflight();
}

/**
 * Email + password login for the Figma plugin. Stateless: returns the
 * session tokens in the body and sets no cookies.
 *
 *   POST { "email": "...", "password": "..." }
 *   200 { access_token, refresh_token, expires_at, user: { email, first_name, last_name } }
 */
export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return errorResponse("Too many attempts. Please wait a minute.", 429);
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (
    !email ||
    !password ||
    email.length > MAX_EMAIL_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH ||
    !EMAIL_PATTERN.test(email)
  ) {
    return errorResponse("Enter a valid email and password.", 400);
  }

  const supabase = createStatelessClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    if (error?.code === "email_not_confirmed") {
      return errorResponse(
        "Please confirm your email first, then try again.",
        403,
      );
    }
    // Same answer for a wrong email and a wrong password.
    if (error?.code === "invalid_credentials") {
      return errorResponse("Incorrect email or password.", 401);
    }
    if (error?.code === "over_request_rate_limit") {
      return errorResponse("Too many attempts. Please wait a minute.", 429);
    }
    // Log the error code only: never the password or tokens.
    console.error("Plugin login failed:", error?.code ?? error?.status);
    return errorResponse("Couldn't log in right now. Please try again.", 500);
  }

  const { session, user } = data;
  const meta = user.user_metadata ?? {};
  return json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: {
      email: user.email ?? email,
      first_name: typeof meta.first_name === "string" ? meta.first_name : "",
      last_name: typeof meta.last_name === "string" ? meta.last_name : "",
    },
  });
}
