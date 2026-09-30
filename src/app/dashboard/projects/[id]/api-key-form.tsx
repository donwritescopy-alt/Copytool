"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveApiKey } from "./api-key/actions";

export function ApiKeyForm({
  projectId,
  hasKey,
}: {
  projectId: string;
  hasKey: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveApiKey, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="space-y-2">
        <Label htmlFor="apiKey">Anthropic API key</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          placeholder={hasKey ? "Key saved — enter a new one to replace it" : "sk-ant-..."}
        />
        <p className="text-sm text-muted-foreground">
          {hasKey
            ? "A key is already saved for your account. It's encrypted before storage."
            : "Your key is encrypted before it's stored and is only used to run analyses."}
        </p>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save key"}
      </Button>
    </form>
  );
}
