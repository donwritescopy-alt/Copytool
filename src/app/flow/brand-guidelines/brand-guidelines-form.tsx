"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  NARRATIVE_STANCES,
  type BrandGuidelines,
  type NarrativeStance,
} from "@/lib/flow/steps";
import { saveBrandGuidelines, useFlowState } from "@/lib/flow/store";

const STANCE_HINTS: Record<NarrativeStance, string> = {
  We: "“We built this for you”",
  I: "“I built this for you”",
  "No person": "“Built for you”",
};

type Errors = Partial<Record<keyof BrandGuidelines, string>>;

export function BrandGuidelinesForm() {
  const { brandGuidelines } = useFlowState();

  // Saved data only exists on the client (localStorage). Remount the inner
  // form once it has loaded so the fields start prefilled.
  return (
    <Form
      key={brandGuidelines ? "saved" : "empty"}
      initial={brandGuidelines}
    />
  );
}

function Form({ initial }: { initial: BrandGuidelines | null }) {
  const router = useRouter();
  const [brandName, setBrandName] = useState(initial?.brandName ?? "");
  const [targetAudience, setTargetAudience] = useState(
    initial?.targetAudience ?? "",
  );
  const [narrativeStance, setNarrativeStance] =
    useState<NarrativeStance | null>(initial?.narrativeStance ?? null);
  const [errors, setErrors] = useState<Errors>({});

  function clearError(field: keyof BrandGuidelines) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (!brandName.trim()) next.brandName = "Enter your brand name.";
    if (!targetAudience.trim())
      next.targetAudience = "Describe your target audience.";
    if (!narrativeStance) next.narrativeStance = "Choose a narrative stance.";

    setErrors(next);
    if (Object.keys(next).length > 0 || !narrativeStance) return;

    saveBrandGuidelines({
      brandName: brandName.trim(),
      targetAudience: targetAudience.trim(),
      narrativeStance,
    });
    router.push("/flow/frame-context");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="brandName">
          Brand name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="brandName"
          name="brandName"
          autoComplete="organization"
          placeholder="e.g. Acme"
          value={brandName}
          onChange={(e) => {
            setBrandName(e.target.value);
            clearError("brandName");
          }}
          aria-invalid={!!errors.brandName}
          aria-describedby={errors.brandName ? "brandName-error" : undefined}
          className="h-10 text-base"
        />
        {errors.brandName && (
          <p id="brandName-error" className="text-sm text-destructive">
            {errors.brandName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">
          Target audience <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="targetAudience"
          name="targetAudience"
          rows={4}
          placeholder="e.g. First-time founders who are three months into their first company and quietly terrified"
          value={targetAudience}
          onChange={(e) => {
            setTargetAudience(e.target.value);
            clearError("targetAudience");
          }}
          aria-invalid={!!errors.targetAudience}
          aria-describedby={
            errors.targetAudience ? "targetAudience-error" : undefined
          }
          className="min-h-28 text-base"
        />
        {errors.targetAudience && (
          <p id="targetAudience-error" className="text-sm text-destructive">
            {errors.targetAudience}
          </p>
        )}
      </div>

      <fieldset
        className="space-y-3"
        aria-describedby={
          errors.narrativeStance ? "narrativeStance-error" : undefined
        }
      >
        <legend className="text-sm font-medium">
          Narrative stance <span className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {NARRATIVE_STANCES.map((stance) => (
            <label key={stance} className="cursor-pointer">
              <input
                type="radio"
                name="narrativeStance"
                value={stance}
                checked={narrativeStance === stance}
                onChange={() => {
                  setNarrativeStance(stance);
                  clearError("narrativeStance");
                }}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-full flex-col gap-1 rounded-xl border bg-background p-4 transition-colors hover:bg-muted/50",
                  "peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary",
                  "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
                  errors.narrativeStance && "border-destructive",
                )}
              >
                <span className="text-sm font-medium">{stance}</span>
                <span className="text-xs text-muted-foreground">
                  {STANCE_HINTS[stance]}
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.narrativeStance && (
          <p id="narrativeStance-error" className="text-sm text-destructive">
            {errors.narrativeStance}
          </p>
        )}
      </fieldset>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" size="lg" className="h-10 px-5 text-sm">
          Save and Next
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </form>
  );
}
