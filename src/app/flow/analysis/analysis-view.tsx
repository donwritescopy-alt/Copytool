"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { WRITERS } from "@/lib/flow/steps";
import { useFlowState, useHydrated } from "@/lib/flow/store";
import {
  parseAnalysisResult,
  type ParsedAnalysis,
} from "@/lib/analyze/parse-result";
import { AnalysisResult } from "./analysis-result";
import { InputsSummary } from "./inputs-summary";

const FORMAT_ERROR =
  "We got a reply, but it wasn't in the format we expected. Please try again.";

export function AnalysisView() {
  const hydrated = useHydrated();
  const { brandGuidelines, frameContext, writerId } = useFlowState();

  const [currentCopy, setCurrentCopy] = useState("");
  const [copyError, setCopyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedAnalysis | null>(null);

  // Wait for localStorage before deciding whether earlier steps are done.
  if (!hydrated) return null;

  const writer = WRITERS.find((w) => w.id === writerId);

  if (!brandGuidelines || !frameContext || !writer) {
    return (
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <p className="font-medium">Finish the earlier steps first</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We need your brand guidelines, frame context and a writer before we
          can analyse anything.
        </p>
        <Link
          href="/flow/brand-guidelines"
          className={cn(buttonVariants(), "mt-5 h-9 px-4 text-sm")}
        >
          Go to Brand Guidelines
        </Link>
      </div>
    );
  }

  async function analyze() {
    if (!brandGuidelines || !frameContext) return;

    if (!currentCopy.trim()) {
      setCopyError("Paste the copy you want analysed.");
      return;
    }

    setCopyError(null);
    setRequestError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandGuidelines.brandName,
          targetAudience: brandGuidelines.targetAudience,
          narrativeStance: brandGuidelines.narrativeStance,
          channel: frameContext.channel,
          primaryGoal: frameContext.primaryGoal,
          constraints: frameContext.constraints,
          currentCopy: currentCopy.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        result?: unknown;
        error?: unknown;
      } | null;

      if (!response.ok) {
        setRequestError(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        return;
      }

      const parsed =
        typeof data?.result === "string"
          ? parseAnalysisResult(data.result)
          : null;
      if (!parsed) {
        setRequestError(FORMAT_ERROR);
        return;
      }

      // A new analysis replaces the previous one.
      setResult(parsed);
    } catch {
      setRequestError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <InputsSummary
        brandGuidelines={brandGuidelines}
        frameContext={frameContext}
        writer={writer}
      />

      <section className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="currentCopy">
            Current copy <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="currentCopy"
            rows={6}
            placeholder="Paste the text you want to analyse"
            value={currentCopy}
            onChange={(e) => {
              setCurrentCopy(e.target.value);
              setCopyError(null);
            }}
            disabled={loading}
            aria-invalid={!!copyError}
            aria-describedby={copyError ? "currentCopy-error" : undefined}
            className="min-h-40 text-base"
          />
          {copyError && (
            <p id="currentCopy-error" className="text-sm text-destructive">
              {copyError}
            </p>
          )}
        </div>

        <Button
          type="button"
          size="lg"
          onClick={analyze}
          disabled={loading}
          className="mt-6 h-12 w-full text-base"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Analyzing with {writer.name}…
            </>
          ) : (
            <>
              <Sparkles aria-hidden />
              Analyze Copy
            </>
          )}
        </Button>

        {requestError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{requestError}</p>
          </div>
        )}
      </section>

      {result && <AnalysisResult result={result} writerName={writer.name} />}

      <div className="flex items-center border-t pt-6">
        <Link
          href="/flow/choose-copywriter"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 px-4 text-sm",
          )}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Link>
      </div>
    </div>
  );
}
