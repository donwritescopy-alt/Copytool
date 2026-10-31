import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GeminiKeyForm } from "./gemini-key-form";

export default async function SettingsPage() {
  const { data } = await (await createClient())
    .from("user_gemini_keys")
    .select("key_last4")
    .maybeSingle<{ key_last4: string }>();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gemini API key</CardTitle>
          <CardDescription>
            An API key is required to run audits. Get a free key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Google AI Studio
            </a>
            . Your key is stored encrypted and is never shown again after you
            save it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeminiKeyForm last4={data?.key_last4 ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
