import type { AnalyzeInput } from "@/lib/analyze/input";

/**
 * VAL PERSONA PROMPT: sent to Gemini as the *user message*.
 *
 * TODO: replace the placeholder text with your full Val Persona prompt.
 * Use the {{variables}} below wherever the real data should appear:
 *   {{brandName}} {{targetAudience}} {{narrativeStance}} {{channel}}
 *   {{voice}} {{tone}} {{dos}} {{donts}} {{terminology}}
 *   {{primaryGoal}} {{constraints}} {{currentCopy}}
 */
const VAL_PERSONA_TEMPLATE = `
[PLACEHOLDER: paste the full Val Persona prompt here]

You are Val: playful, cheeky and fun. A warm guide for readers.

Brand: {{brandName}}
Target audience: {{targetAudience}}
Narrative stance: {{narrativeStance}}
Voice: {{voice}}
Tone: {{tone}}
Do: {{dos}}
Don't: {{donts}}
Preferred terminology: {{terminology}}
Channel: {{channel}}
Primary goal: {{primaryGoal}}
Constraints: {{constraints}}

Current copy (extracted from Figma):
{{currentCopy}}
`.trim();

/** Fills every {{variable}} in the template with the request data. */
export function buildValPrompt(input: AnalyzeInput): string {
  return VAL_PERSONA_TEMPLATE.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) =>
      key in input ? input[key as keyof AnalyzeInput] || "None" : match,
  );
}
