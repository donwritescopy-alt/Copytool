/** Voice profiles for the writer personas available in the Figma plugin. */
export const WRITER_PERSONAS = {
  Zara: "Cheeky. Quick. Always has a comeback.",
  Dot: "Deadpan. Minimal. Funny without trying.",
  Sam: "Warm. Unhurried. Makes you feel seen.",
  Marcus: "Serious. Precise. Allergic to vagueness.",
  Bex: "Genuinely excited. Not performative — actually delighted.",
  Leo: "Cool. Effortless. Has taste the way some people just have it.",
  Val: "Dry warmth. Notices things. Trainer instincts.",
} as const;

export type WriterName = keyof typeof WRITER_PERSONAS;

export const WRITER_NAMES = Object.keys(WRITER_PERSONAS) as WriterName[];

/** Case-insensitive lookup; returns null for unknown writers. */
export function findWriter(name: unknown): WriterName | null {
  if (typeof name !== "string") return null;
  return (
    WRITER_NAMES.find((w) => w.toLowerCase() === name.trim().toLowerCase()) ??
    null
  );
}
