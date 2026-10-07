"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signIn,
  signInWithGoogle,
  signUp,
} from "./actions";

type Mode = "login" | "signup";

// useSearchParams needs a Suspense boundary in the App Router.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1a5.9 5.9 0 0 1 0-11.8c1.87 0 3.12.8 3.84 1.48l2.6-2.5A9.4 9.4 0 0 0 12 2.6a9.4 9.4 0 1 0 0 18.8c5.43 0 9.03-3.82 9.03-9.2 0-.62-.07-1.09-.15-1.56Z"
      />
    </svg>
  );
}

/** Hidden fields that carry a Figma plugin login through every auth method. */
function FigmaBridgeFields({
  source,
  state,
}: {
  source: string | null;
  state: string | null;
}) {
  if (!source || !state) return null;
  return (
    <>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="state" value={state} />
    </>
  );
}

function GoogleButton({
  label,
  source,
  state,
}: {
  label: string;
  source: string | null;
  state: string | null;
}) {
  return (
    <form action={signInWithGoogle}>
      <FigmaBridgeFields source={source} state={state} />
      <Button type="submit" variant="outline" className="w-full">
        <GoogleIcon />
        {label}
      </Button>
    </form>
  );
}

function LoginContent() {
  const [mode, setMode] = useState<Mode>("signup");

  // Set when the login was opened from the Figma plugin.
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const state = searchParams.get("state");
  const urlError = searchParams.get("error");

  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    null,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {mode === "login" && "Log in"}
            {mode === "signup" && "Create an account"}
          </CardTitle>
          <CardDescription>
            Access your UX Copy Tool projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {source === "figma" && state && (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Log in to connect the Figma plugin. You&apos;ll be asked to
              approve it next.
            </p>
          )}
          {urlError && (
            <p className="text-sm text-destructive">
              Sign-in didn&apos;t complete. Please try again.
            </p>
          )}
          {mode === "login" && (
            <form action={signInAction} className="space-y-4">
              <FigmaBridgeFields source={source} state={state} />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              {signInState?.error && (
                <p className="text-sm text-destructive">
                  {signInState.error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={signInPending}>
                {signInPending ? "Logging in..." : "Log in"}
              </Button>
            </form>
          )}

          {mode === "login" && (
            <GoogleButton
              label="Sign in with Google"
              source={source}
              state={state}
            />
          )}

          {mode === "signup" && (
            <form action={signUpAction} className="space-y-4">
              <FigmaBridgeFields source={source} state={state} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-first-name">First name</Label>
                  <Input
                    id="signup-first-name"
                    name="firstName"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-last-name">Last name</Label>
                  <Input
                    id="signup-last-name"
                    name="lastName"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                />
              </div>
              {signUpState?.error && (
                <p className="text-sm text-destructive">
                  {signUpState.error}
                </p>
              )}
              {signUpState?.message && (
                <p className="text-sm text-muted-foreground">
                  {signUpState.message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={signUpPending}>
                {signUpPending ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          )}

          {mode === "signup" && (
            <GoogleButton
              label="Sign up with Google"
              source={source}
              state={state}
            />
          )}

          {mode === "signup" ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setMode("login")}
            >
              Sign in with password
            </Button>
          ) : (
            <button
              type="button"
              className="block w-full text-center text-sm text-muted-foreground underline underline-offset-4"
              onClick={() => setMode("signup")}
            >
              Create an account
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
