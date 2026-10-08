import { NextResponse } from "next/server";
import { ApiError, GoogleGenAI } from "@google/genai";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createCookieClient } from "@/lib/supabase/server";
import { parseAuditInput, type AuditInput } from "@/lib/audit/input";
import {
  AUDIT_RESPONSE_SCHEMA,
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/audit/prompt";
import type { Project } from "@/lib/types";

// The local probe found 3.5 fastest, then 3.6. Set GEMINI_MODEL to put a
// specific model first.
const MODELS = [
  ...new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
    ].filter((m): m is string => !!m),
  ),
];
const MODEL_TIMEOUT_MS = positiveInteger(process.env.AUDIT_MODEL_TIMEOUT_MS, 30_000);
const GEMINI_DEADLINE_MS = 90_000;

function positiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// Leaves room for authentication, project lookup, and response delivery
// around the bounded 90-second Gemini phase on platforms that support it.
export const maxDuration = 120;

// The plugin UI runs in a sandboxed iframe with an opaque ("null") origin,
// so it needs CORS. Auth is a bearer token, not cookies.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

function errorResponse(error: string, status: number) {
  return json({ error }, status);
}

function geminiTimeoutResponse() {
  return errorResponse("The AI took too long to answer. Please try again.", 504);
}

function logModelAttempt(model: string, result: string, startedAt: number) {
  console.info(
    `[api/audit] model=${model} result=${result} seconds=${(
      (Date.now() - startedAt) /
      1000
    ).toFixed(2)}`,
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Supabase client acting as the caller, so row-level security applies.
 * The Figma plugin sends `Authorization: Bearer <access_token>` (issued by
 * the web-bridge login); the web app can call this with its cookie session.
 */
async function getSupabaseForRequest(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];

  const supabase = token
    ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        },
      )
    : await createCookieClient();

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user ? supabase : null;
}

/** Translates a Gemini SDK failure into a clean, user-safe response. */
function handleGeminiError(err: unknown) {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase();
    if (
      err.status === 401 ||
      err.status === 403 ||
      message.includes("api key not valid") ||
      message.includes("api_key_invalid")
    ) {
      return errorResponse("The Gemini API key is invalid or not allowed.", 502);
    }
    if (err.status === 429) {
      return errorResponse(
        "Gemini rate limit reached (free tier). Wait a minute and try again.",
        429,
      );
    }
    if (err.status === 404) {
      return errorResponse("The configured Gemini model was not found.", 502);
    }
    if (err.status >= 500) {
      return errorResponse(
        "Gemini is temporarily unavailable. Try again shortly.",
        503,
      );
    }
    return errorResponse(`Gemini rejected the request (${err.status}).`, 502);
  }

  console.error("Unexpected /api/audit error:", err);
  return errorResponse("Something went wrong while auditing the copy.", 500);
}

type AuditResult = {
  summary: string;
  findings: string[];
  suggestions: {
    nodeId: string;
    original: string;
    suggested: string;
    reason: string;
  }[];
};

/**
 * Checks Gemini's JSON against the contract and keeps only suggestions that
 * point at a real layer from the request. `original` is taken from the
 * request, so the plugin always gets the text that is actually on the layer.
 */
function normalizeResult(raw: unknown, input: AuditInput): AuditResult | null {
  if (typeof raw !== "object" || raw === null) return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.summary !== "string") return null;
  if (!Array.isArray(data.findings) || !Array.isArray(data.suggestions)) {
    return null;
  }

  const textByNode = new Map(input.selectedText.map((l) => [l.nodeId, l.text]));

  const suggestions: AuditResult["suggestions"] = [];
  for (const item of data.suggestions) {
    if (typeof item !== "object" || item === null) continue;
    const s = item as Record<string, unknown>;
    if (typeof s.nodeId !== "string" || !textByNode.has(s.nodeId)) continue;
    if (typeof s.suggested !== "string" || !s.suggested.trim()) continue;
    suggestions.push({
      nodeId: s.nodeId,
      original: textByNode.get(s.nodeId)!,
      suggested: s.suggested.trim(),
      reason: typeof s.reason === "string" ? s.reason.trim() : "",
    });
  }

  return {
    summary: data.summary.trim(),
    findings: data.findings.filter((f): f is string => typeof f === "string"),
    suggestions,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "GEMINI_API_KEY is missing. Add it to .env.local and restart npm run dev.",
    );
    return errorResponse("Something went wrong while auditing the copy.", 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsed = parseAuditInput(body);
  if (!parsed.ok) return errorResponse(parsed.error, 400);
  const { input } = parsed;

  const supabase = await getSupabaseForRequest(request);
  if (!supabase) {
    return errorResponse("You need to be logged in to run an audit.", 401);
  }

  // Row-level security limits this to the caller's own projects.
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", input.projectId)
    .maybeSingle<Project>();

  if (projectError) {
    // 22P02 = projectId isn't a valid uuid.
    if (projectError.code === "22P02") {
      return errorResponse('"projectId" is not a valid project id.', 400);
    }
    console.error("Project lookup failed:", projectError.message);
    return errorResponse("Couldn't load the project.", 500);
  }
  if (!project) return errorResponse("Project not found.", 404);
  if (!project.details_saved_at) {
    return errorResponse(
      "This project has no brand details yet. Fill them in on the web app first.",
      422,
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = buildUserPrompt(input);
    const config = {
      systemInstruction: buildSystemPrompt(project, input),
      responseMimeType: "application/json",
      responseJsonSchema: AUDIT_RESPONSE_SCHEMA,
    };

    let text: string | undefined;
    let timedOutAttempts = 0;
    let rateLimitedAttempts = 0;
    let lastRetryableError: unknown;
    let lastServerError: unknown;
    const phaseStartedAt = Date.now();
    for (const [index, model] of MODELS.entries()) {
      const remainingMs = GEMINI_DEADLINE_MS - (Date.now() - phaseStartedAt);
      if (remainingMs <= 0) return geminiTimeoutResponse();

      const attemptTimeoutMs = Math.min(MODEL_TIMEOUT_MS, remainingMs);
      const controller = new AbortController();
      const attemptStartedAt = Date.now();
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, attemptTimeoutMs);

      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: { ...config, abortSignal: controller.signal },
        });
        clearTimeout(timeout);
        logModelAttempt(model, "ok", attemptStartedAt);
        text = response.text?.trim();
        break;
      } catch (err) {
        clearTimeout(timeout);
        const status = err instanceof ApiError ? err.status : undefined;
        const result = timedOut
          ? "timeout"
          : status === 429 || status === 503
            ? String(status)
            : "other";
        logModelAttempt(model, result, attemptStartedAt);

        if (timedOut) {
          timedOutAttempts += 1;
          lastRetryableError = err;
        } else if (status === 429 || status === 500 || status === 503) {
          if (status === 429) rateLimitedAttempts += 1;
          if (status === 500 || status === 503) lastServerError = err;
          lastRetryableError = err;
        } else {
          throw err;
        }

        if (index === MODELS.length - 1) {
          if (rateLimitedAttempts === MODELS.length) {
            return errorResponse(
              "Gemini rate limit reached (free tier). Wait a minute and try again.",
              429,
            );
          }
          if (timedOutAttempts === MODELS.length) return geminiTimeoutResponse();
          if (lastServerError) throw lastServerError;
          if (rateLimitedAttempts > 0) {
            return errorResponse(
              "Gemini is temporarily unavailable. Try again shortly.",
              503,
            );
          }
          throw lastRetryableError;
        }
      }
    }

    if (!text) {
      // Empty text usually means the response was blocked by safety filters.
      return errorResponse("Gemini returned no text. Try different copy.", 502);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return errorResponse("Gemini returned an unreadable response.", 502);
    }

    const result = normalizeResult(raw, input);
    if (!result) {
      return errorResponse(
        "Gemini's response didn't match the expected format. Try again.",
        502,
      );
    }

    return json(result);
  } catch (err) {
    return handleGeminiError(err);
  }
}
