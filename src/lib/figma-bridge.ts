import { createHash } from "crypto";
import { headers } from "next/headers";

/**
 * Helpers for the Figma plugin "web bridge" login.
 *
 * Flow: the plugin makes a random `state`, opens /login?source=figma&state=…
 * in the browser and polls /api/auth/figma/poll with that state. After the
 * user logs in and approves at /auth/figma-success, the session is parked
 * (encrypted, single-use, 5 minutes) under a hash of the state for the
 * plugin to collect.
 */

// 32+ random bytes, base64url encoded (43+ chars). Long enough that it
// cannot be guessed, which is what protects the handoff.
const STATE_PATTERN = /^[A-Za-z0-9_-]{43,128}$/;

export function isValidFigmaState(state: unknown): state is string {
  return typeof state === "string" && STATE_PATTERN.test(state);
}

/** The database only ever sees a hash of the state, never the state itself. */
export function hashFigmaState(state: string): string {
  return createHash("sha256").update(state).digest("hex");
}

/** Where to send the user after login: the Figma approval page, or the dashboard. */
export function postLoginPath(source: unknown, state: unknown): string {
  if (source === "figma" && isValidFigmaState(state)) {
    return `/auth/figma-success?state=${encodeURIComponent(state)}`;
  }
  return "/dashboard";
}

/** Only allow same-site relative paths as redirect targets (no open redirects). */
export function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

/**
 * The site's public origin, used for OAuth / email redirect links.
 * Prefers NEXT_PUBLIC_SITE_URL, falls back to the incoming request's host.
 */
export async function getSiteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** The URL Supabase should send the user back to after email/OAuth login. */
export async function authCallbackUrl(next: string): Promise<string> {
  return `${await getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
