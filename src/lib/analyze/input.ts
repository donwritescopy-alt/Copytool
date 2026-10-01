import {
  CHANNELS,
  NARRATIVE_STANCES,
  type Channel,
  type NarrativeStance,
} from "@/lib/flow/steps";

export type AnalyzeInput = {
  brandName: string;
  targetAudience: string;
  narrativeStance: NarrativeStance;
  channel: Channel;
  primaryGoal: string;
  /** Optional: may be an empty string. */
  constraints: string;
  /** The text extracted from Figma. */
  currentCopy: string;
};

const MAX_FIELD_LENGTH = 5_000;
const MAX_COPY_LENGTH = 20_000;

type ParseResult =
  | { ok: true; input: AnalyzeInput }
  | { ok: false; error: string };

/**
 * Validates an untrusted request body. Returns the cleaned input, or a
 * message describing the first problem found.
 */
export function parseAnalyzeInput(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const data = body as Record<string, unknown>;

  // Returns the trimmed string, or an error message.
  const readText = (
    key: string,
    { required, max }: { required: boolean; max: number },
  ): string | { error: string } => {
    const raw = data[key];
    if (raw !== undefined && raw !== null && typeof raw !== "string") {
      return { error: `"${key}" must be a string.` };
    }
    const value = (raw ?? "").trim();
    if (required && !value) return { error: `"${key}" is required.` };
    if (value.length > max) {
      return { error: `"${key}" must be at most ${max} characters.` };
    }
    return value;
  };

  const brandName = readText("brandName", { required: true, max: MAX_FIELD_LENGTH });
  const targetAudience = readText("targetAudience", { required: true, max: MAX_FIELD_LENGTH });
  const primaryGoal = readText("primaryGoal", { required: true, max: MAX_FIELD_LENGTH });
  const constraints = readText("constraints", { required: false, max: MAX_FIELD_LENGTH });
  const currentCopy = readText("currentCopy", { required: true, max: MAX_COPY_LENGTH });

  for (const field of [brandName, targetAudience, primaryGoal, constraints, currentCopy]) {
    if (typeof field !== "string") return { ok: false, error: field.error };
  }

  const { narrativeStance, channel } = data;
  if (!NARRATIVE_STANCES.includes(narrativeStance as NarrativeStance)) {
    return {
      ok: false,
      error: `"narrativeStance" must be one of: ${NARRATIVE_STANCES.join(", ")}.`,
    };
  }
  if (!CHANNELS.includes(channel as Channel)) {
    return {
      ok: false,
      error: `"channel" must be one of: ${CHANNELS.join(", ")}.`,
    };
  }

  return {
    ok: true,
    input: {
      brandName: brandName as string,
      targetAudience: targetAudience as string,
      narrativeStance: narrativeStance as NarrativeStance,
      channel: channel as Channel,
      primaryGoal: primaryGoal as string,
      constraints: constraints as string,
      currentCopy: currentCopy as string,
    },
  };
}
