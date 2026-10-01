"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CHANNELS, type Channel, type FrameContext } from "@/lib/flow/steps";
import { saveFrameContext, useFlowState } from "@/lib/flow/store";

type Errors = { channel?: string; primaryGoal?: string };

export function FrameContextForm() {
  const { frameContext } = useFlowState();

  // Saved data only exists on the client (localStorage). Remount the inner
  // form once it has loaded so the fields start prefilled.
  return (
    <Form key={frameContext ? "saved" : "empty"} initial={frameContext} />
  );
}

function Form({ initial }: { initial: FrameContext | null }) {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel | "">(initial?.channel ?? "");
  const [primaryGoal, setPrimaryGoal] = useState(initial?.primaryGoal ?? "");
  const [constraints, setConstraints] = useState(initial?.constraints ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (!channel) next.channel = "Choose a channel.";
    if (!primaryGoal.trim()) next.primaryGoal = "Enter the primary goal.";

    setErrors(next);
    if (Object.keys(next).length > 0 || !channel) return;

    saveFrameContext({
      channel,
      primaryGoal: primaryGoal.trim(),
      constraints: constraints.trim(),
    });
    router.push("/flow/choose-copywriter");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="channel">
          Channel <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <select
            id="channel"
            name="channel"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value as Channel | "");
              setErrors((prev) => ({ ...prev, channel: undefined }));
            }}
            aria-invalid={!!errors.channel}
            aria-describedby={errors.channel ? "channel-error" : undefined}
            className={cn(
              "h-10 w-full appearance-none rounded-lg border border-input bg-transparent pr-9 pl-2.5 text-base transition-colors outline-none md:text-sm dark:bg-input/30",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
              channel === "" && "text-muted-foreground",
            )}
          >
            <option value="" disabled>
              Select a channel
            </option>
            {CHANNELS.map((c) => (
              <option key={c} value={c} className="text-foreground">
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        {errors.channel && (
          <p id="channel-error" className="text-sm text-destructive">
            {errors.channel}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryGoal">
          Primary goal <span className="text-destructive">*</span>
        </Label>
        <Input
          id="primaryGoal"
          name="primaryGoal"
          placeholder="e.g. onboarding / pricing / feature discovery / error recovery"
          value={primaryGoal}
          onChange={(e) => {
            setPrimaryGoal(e.target.value);
            setErrors((prev) => ({ ...prev, primaryGoal: undefined }));
          }}
          aria-invalid={!!errors.primaryGoal}
          aria-describedby={errors.primaryGoal ? "primaryGoal-error" : undefined}
          className="h-10 text-base"
        />
        {errors.primaryGoal && (
          <p id="primaryGoal-error" className="text-sm text-destructive">
            {errors.primaryGoal}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="constraints">
          Constraints{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="constraints"
          name="constraints"
          rows={4}
          placeholder="e.g. don’t use negation words, don’t swear, keep under 8 words, no emoji"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          className="min-h-28 text-base"
        />
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Link
          href="/flow/brand-guidelines"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 px-4 text-sm",
          )}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Link>
        <Button type="submit" size="lg" className="h-10 px-5 text-sm">
          Save and Next
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </form>
  );
}
