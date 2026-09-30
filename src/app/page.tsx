import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Better UX copy, grounded in your brand
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Set your brand voice, tone, and personas once. Our Figma plugin uses
        them to suggest copy that actually sounds like you.
      </p>
      <div className="flex gap-4">
        <Button render={<Link href="/login" />} size="lg">
          Get started
        </Button>
        <Button render={<Link href="/login" />} variant="outline" size="lg">
          Log in
        </Button>
      </div>
    </div>
  );
}
