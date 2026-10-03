import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import { Suspense } from "react";

async function UserEmail() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <span className="text-sm text-muted-foreground">{user?.email}</span>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/dashboard" className="font-semibold">
          UX Copy Tool
        </Link>
        <div className="flex items-center gap-4">
          <Suspense fallback={<span className="h-4 w-32 animate-pulse rounded bg-muted" />}><UserEmail /></Suspense>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
