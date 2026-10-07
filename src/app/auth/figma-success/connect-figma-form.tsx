"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { approveFigmaLogin } from "./actions";

export function ConnectFigmaForm({ state }: { state: string }) {
  const [result, formAction, pending] = useActionState(
    approveFigmaLogin,
    null,
  );

  if (result && "done" in result) {
    return (
      <p className="font-medium text-foreground">
        You&apos;re connected. You can close this tab and return to Figma.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="state" value={state} />
      {result && "error" in result && (
        <p className="text-sm text-destructive">{result.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connecting..." : "Connect Figma"}
      </Button>
    </form>
  );
}
