"use client";

import { useActionState, useState } from "react";
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
import { signIn, signInWithMagicLink, signUp } from "./actions";

type Mode = "login" | "signup" | "magic-link";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");

  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    null,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    null,
  );
  const [magicLinkState, magicLinkAction, magicLinkPending] = useActionState(
    signInWithMagicLink,
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {mode === "login" && "Log in"}
            {mode === "signup" && "Create an account"}
            {mode === "magic-link" && "Log in with a magic link"}
          </CardTitle>
          <CardDescription>
            {mode === "magic-link"
              ? "We'll email you a link to log in without a password."
              : "Access your UX Copy Tool projects."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "login" && (
            <form action={signInAction} className="space-y-4">
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

          {mode === "signup" && (
            <form action={signUpAction} className="space-y-4">
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

          {mode === "magic-link" && (
            <form action={magicLinkAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input id="magic-email" name="email" type="email" required />
              </div>
              {magicLinkState?.error && (
                <p className="text-sm text-destructive">
                  {magicLinkState.error}
                </p>
              )}
              {magicLinkState?.message && (
                <p className="text-sm text-muted-foreground">
                  {magicLinkState.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={magicLinkPending}
              >
                {magicLinkPending ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          )}

          <div className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
            {mode !== "login" && (
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => setMode("login")}
              >
                Log in with a password
              </button>
            )}
            {mode !== "signup" && (
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => setMode("signup")}
              >
                Create an account
              </button>
            )}
            {mode !== "magic-link" && (
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => setMode("magic-link")}
              >
                Log in with a magic link instead
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
