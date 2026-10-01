import { NextResponse } from "next/server";
import { ApiError, GoogleGenAI } from "@google/genai";
import { parseAnalyzeInput } from "@/lib/analyze/input";
import { ROOT_PROMPT } from "@/lib/prompts/root-prompt";
import { buildValPrompt } from "@/lib/prompts/val-persona-prompt";

// Free-tier Gemini Flash models, tried in order. The newest models are
// often overloaded (503), so the route falls back to the next one.
// Set GEMINI_MODEL in .env.local to put a specific model first.
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
].filter((m): m is string => !!m);

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Translates a Gemini SDK failure into a clean, user-safe response. */
function handleGeminiError(err: unknown) {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase();

    // Gemini reports a bad key as 400 "API key not valid", sometimes 401/403.
    if (
      err.status === 401 ||
      err.status === 403 ||
      message.includes("api key not valid") ||
      message.includes("api_key_invalid")
    ) {
      return errorResponse(
        "The Gemini API key is invalid or not allowed. Check GEMINI_API_KEY in .env.local.",
        502,
      );
    }
    if (err.status === 429) {
      return errorResponse(
        "Gemini rate limit reached (free tier). Wait a minute and try again.",
        429,
      );
    }
    if (err.status === 404) {
      return errorResponse(
        "The configured Gemini model was not found. Set GEMINI_MODEL to a current model.",
        502,
      );
    }
    if (err.status >= 500) {
      return errorResponse(
        "Gemini is temporarily unavailable. Try again shortly.",
        503,
      );
    }
    return errorResponse(`Gemini rejected the request (${err.status}).`, 502);
  }

  console.error("Unexpected /api/analyze error:", err);
  return errorResponse("Something went wrong while analysing the copy.", 500);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse(
      "GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server.",
      500,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsed = parseAnalyzeInput(body);
  if (!parsed.ok) return errorResponse(parsed.error, 400);

  try {
    const ai = new GoogleGenAI({ apiKey });
    // User message: the Val persona prompt with the real data filled in.
    const contents = buildValPrompt(parsed.input);

    let response: Awaited<ReturnType<typeof ai.models.generateContent>> | null =
      null;
    for (const [index, model] of MODELS.entries()) {
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          // System instruction: the Root prompt.
          config: { systemInstruction: ROOT_PROMPT },
        });
        break;
      } catch (err) {
        // Only an overloaded model is worth retrying on the next one.
        const overloaded = err instanceof ApiError && err.status === 503;
        if (!overloaded || index === MODELS.length - 1) throw err;
      }
    }

    const result = response?.text?.trim();
    if (!result) {
      // Empty text usually means the response was blocked by safety filters.
      return errorResponse(
        "Gemini returned no text. Try rephrasing the copy or constraints.",
        502,
      );
    }

    // The Root prompt asks for "### Analysis" + "### Suggested Copy".
    if (!/^###\s*Analysis/m.test(result) || !/^###\s*Suggested Copy/m.test(result)) {
      return errorResponse(
        "Gemini did not follow the expected Analysis / Suggested Copy format. Try again.",
        502,
      );
    }

    return NextResponse.json({ result });
  } catch (err) {
    return handleGeminiError(err);
  }
}
