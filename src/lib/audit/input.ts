import { WRITER_NAMES, findWriter, type WriterName } from "./writers";

export const CHANNELS = ["Website", "Web App", "Mobile App"] as const;
export type Channel = (typeof CHANNELS)[number];

export type TextLayer = {
  nodeId: string;
  layerName: string;
  text: string;
};

export type AuditInput = {
  projectId: string;
  writerPersona: WriterName;
  frameContext: {
    channel: Channel;
    primaryGoal: string;
    constraints: string;
  };
  flowDescription: string;
  selectedText: TextLayer[];
};

const MAX_TEXT_LAYERS = 200;
const MAX_FIELD_LENGTH = 5_000;

type ParseResult =
  | { ok: true; input: AuditInput }
  | { ok: false; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** First non-empty string among the given keys (the plugin's key names vary). */
function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/** Validates the untrusted request body from the Figma plugin. */
export function parseAuditInput(body: unknown): ParseResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const projectId =
    typeof body.projectId === "string" ? body.projectId.trim() : "";
  if (!projectId) return { ok: false, error: '"projectId" is required.' };

  const writerPersona = findWriter(body.writerPersona);
  if (!writerPersona) {
    return {
      ok: false,
      error: `"writerPersona" must be one of: ${WRITER_NAMES.join(", ")}.`,
    };
  }

  const fc = body.frameContext;
  if (!isRecord(fc)) {
    return { ok: false, error: '"frameContext" is required.' };
  }
  if (!CHANNELS.includes(fc.channel as Channel)) {
    return {
      ok: false,
      error: `"frameContext.channel" must be one of: ${CHANNELS.join(", ")}.`,
    };
  }
  const primaryGoal =
    typeof fc.primaryGoal === "string" ? fc.primaryGoal.trim() : "";
  if (!primaryGoal) {
    return { ok: false, error: '"frameContext.primaryGoal" is required.' };
  }
  const constraints =
    typeof fc.constraints === "string" ? fc.constraints.trim() : "";

  const flowDescription =
    typeof body.flowDescription === "string" ? body.flowDescription.trim() : "";
  if (
    primaryGoal.length > MAX_FIELD_LENGTH ||
    constraints.length > MAX_FIELD_LENGTH ||
    flowDescription.length > MAX_FIELD_LENGTH
  ) {
    return {
      ok: false,
      error: `Text fields must be at most ${MAX_FIELD_LENGTH} characters.`,
    };
  }

  if (!Array.isArray(body.selectedText) || body.selectedText.length === 0) {
    return {
      ok: false,
      error: '"selectedText" must be a non-empty array.',
    };
  }
  if (body.selectedText.length > MAX_TEXT_LAYERS) {
    return {
      ok: false,
      error: `"selectedText" can contain at most ${MAX_TEXT_LAYERS} layers.`,
    };
  }

  const selectedText: TextLayer[] = [];
  for (const [i, item] of body.selectedText.entries()) {
    if (!isRecord(item)) {
      return { ok: false, error: `"selectedText[${i}]" must be an object.` };
    }
    const nodeId = pickString(item, ["nodeId", "id"]);
    const text = pickString(item, ["text", "characters", "content"]);
    if (!nodeId || !text) {
      return {
        ok: false,
        error: `"selectedText[${i}]" needs a nodeId and text.`,
      };
    }
    if (text.length > MAX_FIELD_LENGTH) {
      return {
        ok: false,
        error: `"selectedText[${i}]" text is longer than ${MAX_FIELD_LENGTH} characters.`,
      };
    }
    selectedText.push({
      nodeId,
      layerName: pickString(item, ["layerName", "name"]),
      text,
    });
  }

  return {
    ok: true,
    input: {
      projectId,
      writerPersona,
      frameContext: { channel: fc.channel as Channel, primaryGoal, constraints },
      flowDescription,
      selectedText,
    },
  };
}
