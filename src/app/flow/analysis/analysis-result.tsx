"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParsedAnalysis, Score } from "@/lib/analyze/parse-result";

export function AnalysisResult({
  result,
  writerName,
}: {
  result: ParsedAnalysis;
  writerName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Bring a fresh result into view.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  return (
    <div ref={ref} className="scroll-mt-8 space-y-8">
      <section aria-labelledby="analysis-heading" className="space-y-5">
        <h2 id="analysis-heading" className="text-xl font-semibold tracking-tight">
          Analysis
        </h2>

        <div className="flex items-center justify-between gap-6 rounded-2xl border bg-card p-8 shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Overall score</p>
            <p className="mt-1 text-6xl font-semibold tracking-tight tabular-nums">
              {result.overall}
              <span className="text-3xl text-muted-foreground">%</span>
            </p>
          </div>
          <ScoreBar value={result.overall} className="h-3 w-1/2 max-w-xs" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {result.scores.map((score) => (
            <ScoreCard key={score.label} score={score} />
          ))}
        </div>

        {result.diagnosis && (
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Diagnosis
            </h3>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap">
              {result.diagnosis}
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="suggested-heading" className="space-y-5">
        <h2
          id="suggested-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Suggested copy
        </h2>

        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              Written by {writerName}
            </p>
            <CopyButton text={result.suggestedCopy} />
          </div>
          <p className="mt-4 text-2xl leading-snug font-semibold whitespace-pre-wrap">
            {result.suggestedCopy}
          </p>
          {result.mode && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm">
              <span className="text-muted-foreground">Mode</span>
              <span className="font-medium">{result.mode}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ScoreBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`overflow-hidden rounded-full bg-muted ${className ?? "h-2"}`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ScoreCard({ score }: { score: Score }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium">{score.label}</h3>
        <span className="text-lg font-semibold tabular-nums">
          {score.value}%
        </span>
      </div>
      <ScoreBar value={score.value} className="mt-3 h-2" />
      {score.note && (
        <p className="mt-3 text-sm leading-snug text-muted-foreground">
          {score.note}
        </p>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  }

  return (
    <Button type="button" variant="outline" size="lg" onClick={copy} className="h-9 px-3 text-sm">
      {copied ? (
        <>
          <Check data-icon="inline-start" /> Copied
        </>
      ) : (
        <>
          <Copy data-icon="inline-start" /> {failed ? "Copy failed" : "Copy"}
        </>
      )}
    </Button>
  );
}
