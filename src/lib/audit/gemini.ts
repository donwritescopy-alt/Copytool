import { ApiError, GoogleGenAI } from "@google/genai";

// The local probe found 3.5 fastest, then 3.6. Set GEMINI_MODEL to put a
// specific model first.
export const MODELS = [
  ...new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
    ].filter((m): m is string => !!m),
  ),
];

/** True when Gemini refused the key itself (not a rate limit or outage). */
export function isKeyRejected(err: unknown) {
  if (!(err instanceof ApiError)) return false;
  const message = err.message.toLowerCase();
  return (
    err.status === 401 ||
    err.status === 403 ||
    message.includes("api key not valid") ||
    message.includes("api_key_invalid")
  );
}

/**
 * One tiny Gemini call to check a key before saving it.
 * A 429 still means the key was accepted. Never logs the key.
 */
export async function testGeminiKey(
  apiKey: string,
): Promise<"ok" | "invalid" | "unverified"> {
  const ai = new GoogleGenAI({ apiKey });
  for (const model of MODELS) {
    try {
      await ai.models.generateContent({
        model,
        contents: "Reply with OK.",
        config: { maxOutputTokens: 8 },
      });
      return "ok";
    } catch (err) {
      if (isKeyRejected(err)) return "invalid";
      if (err instanceof ApiError && err.status === 429) return "ok";
      // Model missing or Gemini hiccup: try the next model.
    }
  }
  return "unverified";
}
