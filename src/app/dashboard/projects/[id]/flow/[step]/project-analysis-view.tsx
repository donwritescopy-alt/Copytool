"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/types";
import { WRITERS } from "@/lib/flow/steps";
import { parseAnalysisResult, type ParsedAnalysis } from "@/lib/analyze/parse-result";
import { AnalysisResult } from "@/app/flow/analysis/analysis-result";

export function ProjectAnalysisView({ project }: { project: Project }) {
  const [copy, setCopy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedAnalysis | null>(null);
  const writer = WRITERS.find((candidate) => candidate.id === project.writer_id);

  async function analyze() {
    if (!copy.trim()) { setError("Paste the copy you want analysed."); return; }
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: project.brand_name,
          targetAudience: project.target_audience,
          narrativeStance: project.narrative_stance,
          voice: project.voice,
          tone: project.tone,
          dos: project.dos,
          donts: project.donts,
          terminology: project.terminology,
          channel: project.channel,
          primaryGoal: project.primary_goal,
          constraints: project.constraints,
          currentCopy: copy.trim(),
        }),
      });
      const data = await response.json() as { result?: unknown; error?: unknown };
      if (!response.ok) { setError(typeof data.error === "string" ? data.error : "Analysis failed. Please try again."); return; }
      const parsed = typeof data.result === "string" ? parseAnalysisResult(data.result) : null;
      if (!parsed) { setError("The analysis response was in an unexpected format. Please try again."); return; }
      setResult(parsed);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-muted/50 p-4 text-sm">
        <p><strong>Brand:</strong> {project.brand_name} · <strong>Voice:</strong> {project.voice || "Not specified"} · <strong>Tone:</strong> {project.tone || "Not specified"}</p>
        <p className="mt-1"><strong>Writer:</strong> {writer?.name ?? "Not selected"} · <strong>Channel:</strong> {project.channel}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="copy">Current copy</Label>
        <Textarea id="copy" rows={6} value={copy} onChange={(event) => setCopy(event.target.value)} disabled={loading} placeholder="Paste the text you want to analyse" />
      </div>
      <Button type="button" className="w-full" onClick={analyze} disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" aria-hidden />Analyzing…</> : <><Sparkles aria-hidden />Analyze copy</>}
      </Button>
      {error && <div role="alert" className="flex gap-2 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" aria-hidden />{error}</div>}
      {result && <AnalysisResult result={result} writerName={writer?.name ?? "Your copy writer"} />}
    </div>
  );
}
