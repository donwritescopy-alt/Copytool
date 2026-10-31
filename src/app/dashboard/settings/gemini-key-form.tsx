"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeGeminiKey, saveGeminiKey } from "./actions";

export function GeminiKeyForm({ last4 }: { last4: string | null }) {
  const [saveState, saveAction, saving] = useActionState(saveGeminiKey, null);
  const [removeState, removeAction, removing] = useActionState(
    removeGeminiKey,
    null,
  );
  const error = saveState?.error ?? removeState?.error;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body-sm font-medium text-primary">
        {last4 ? `Saved, ends in ••••${last4}` : "No key saved yet"}
      </p>

      <form action={saveAction} className="flex flex-col gap-3">
        <Label htmlFor="apiKey">{last4 ? "Replace key" : "Your Gemini API key"}</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          autoComplete="off"
          placeholder="Paste your key"
          aria-invalid={!!saveState?.error}
          required
        />
        {error && (
          <p role="alert" className="text-body-sm text-danger-text">
            {error}
          </p>
        )}
        {saveState?.message && !error && (
          <p role="status" className="text-body-sm text-primary">
            {saveState.message}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="submit" variant="inverse" disabled={saving}>
            {saving ? "Checking key..." : last4 ? "Replace key" : "Save key"}
          </Button>
        </div>
      </form>

      {last4 && (
        <form action={removeAction}>
          <Button type="submit" variant="secondary" disabled={removing}>
            {removing ? "Removing..." : "Remove key"}
          </Button>
        </form>
      )}
    </div>
  );
}
