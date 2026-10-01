"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WRITERS, type WriterId } from "@/lib/flow/steps";
import { saveWriter, useFlowState } from "@/lib/flow/store";

export function WriterPicker() {
  const router = useRouter();
  const { writerId: selectedId } = useFlowState();

  function select(id: WriterId) {
    saveWriter(id);
    router.push("/flow/analysis");
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {WRITERS.map((writer) => {
          const isSelected = selectedId === writer.id;
          return (
            <article
              key={writer.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all",
                "hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md",
                isSelected && "border-primary ring-1 ring-primary",
              )}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  <Check className="size-3" aria-hidden />
                  Selected
                </span>
              )}

              {/* ~80% of the card: the portrait, centred */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={writer.avatar}
                alt={`${writer.name}, illustrated portrait`}
                className="aspect-square w-full bg-white object-cover object-center"
              />

              {/* ~20% of the card: name, tagline and the action */}
              <div className="flex items-center justify-between gap-3 border-t p-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {writer.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {writer.tagline}
                  </p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="h-9 shrink-0 px-4 text-sm"
                  onClick={() => select(writer.id)}
                >
                  Choose {writer.name}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center border-t pt-6">
        <Link
          href="/flow/frame-context"
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
