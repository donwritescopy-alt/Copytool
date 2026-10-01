export type Score = {
  label: string;
  /** 0–100 */
  value: number;
  /** The one-sentence explanation after the percentage. */
  note: string;
};

export type ParsedAnalysis = {
  scores: Score[];
  /** 0–100 */
  overall: number;
  diagnosis: string;
  suggestedCopy: string;
  /** Guide / Coach / Silent, when present. */
  mode: string | null;
};

const clampPercent = (n: number) => Math.min(100, Math.max(0, n));

/** Removes surrounding blank lines and "---" separators. */
const tidy = (text: string) =>
  text
    .replace(/^\s*(?:-{3,}\s*)+/, "")
    .replace(/(?:\s*-{3,})+\s*$/, "")
    .trim();

/**
 * Parses the model's markdown (the Root prompt's OUTPUT RULES format) into
 * structured data. Returns null when the response does not contain both
 * required sections, so the UI can show a friendly error.
 */
export function parseAnalysisResult(markdown: string): ParsedAnalysis | null {
  const analysisHeading = /^###\s*Analysis\s*$/im.exec(markdown);
  const suggestedHeading = /^###\s*Suggested Copy\s*$/im.exec(markdown);
  if (
    !analysisHeading ||
    !suggestedHeading ||
    suggestedHeading.index < analysisHeading.index
  ) {
    return null;
  }

  const analysis = markdown.slice(
    analysisHeading.index + analysisHeading[0].length,
    suggestedHeading.index,
  );
  const suggested = markdown.slice(
    suggestedHeading.index + suggestedHeading[0].length,
  );

  // "Clarity:   80% — one sentence". The Overall line is handled separately.
  const scores: Score[] = [];
  const scoreLine = /^\s*([A-Za-z][A-Za-z \-]*?)\s*:\s*(\d{1,3})\s*%\s*[—–-]*\s*(.*)$/gm;
  for (const match of analysis.matchAll(scoreLine)) {
    const label = match[1].trim();
    if (label.toLowerCase() === "overall") continue;
    scores.push({
      label,
      value: clampPercent(Number(match[2])),
      note: match[3].trim(),
    });
  }

  const overallMatch = /^\s*Overall\s*:\s*(\d{1,3})\s*%/im.exec(analysis);
  if (!overallMatch || scores.length === 0) return null;

  const diagnosisMatch = /^\s*Diagnosis\s*:\s*([\s\S]*)$/im.exec(analysis);
  const diagnosis = diagnosisMatch ? tidy(diagnosisMatch[1]) : "";

  const modeMatch = /^\s*Mode\s*:\s*(.+?)\s*$/im.exec(suggested);
  const suggestedCopy = tidy(
    modeMatch ? suggested.slice(0, modeMatch.index) : suggested,
  );
  if (!suggestedCopy) return null;

  return {
    scores,
    overall: clampPercent(Number(overallMatch[1])),
    diagnosis,
    suggestedCopy,
    mode: modeMatch ? modeMatch[1].replace(/[*_`]/g, "").trim() : null,
  };
}
