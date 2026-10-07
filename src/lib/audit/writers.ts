import {
  BEX_PROMPT,
  DOT_PROMPT,
  LEO_PROMPT,
  MARCUS_PROMPT,
  SAM_PROMPT,
  VAL_PROMPT,
  ZARA_PROMPT,
} from "./prompts/writers";

/** Full writer prompts available in the Figma plugin. */
export const WRITER_PERSONAS = {
  Zara: ZARA_PROMPT,
  Dot: DOT_PROMPT,
  Sam: SAM_PROMPT,
  Marcus: MARCUS_PROMPT,
  Bex: BEX_PROMPT,
  Leo: LEO_PROMPT,
  Val: VAL_PROMPT,
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
