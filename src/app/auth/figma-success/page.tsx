import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isValidFigmaState } from "@/lib/figma-bridge";
import { ConnectFigmaForm } from "./connect-figma-form";

export default async function FigmaSuccessPage(
  props: PageProps<"/auth/figma-success">,
) {
  const { state } = await props.searchParams;

  if (!isValidFigmaState(state)) {
    return (
      <Shell title="Invalid link">
        This Figma login link isn&apos;t valid. Close this tab and click Log in
        again in the plugin.
      </Shell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?source=figma&state=${encodeURIComponent(state)}`);
  }

  return (
    <Shell title="Connect Figma plugin">
      <p>
        Allow the UX Copy Tool Figma plugin to use your account{" "}
        <span className="font-medium text-foreground">{user.email}</span>?
      </p>
      <p className="mt-2">Only continue if you just clicked Log in in Figma.</p>
      <div className="mt-6">
        <ConnectFigmaForm state={state} />
      </div>
    </Shell>
  );
}

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>UX Copy Tool</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
