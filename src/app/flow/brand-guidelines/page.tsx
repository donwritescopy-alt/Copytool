import { BrandGuidelinesForm } from "./brand-guidelines-form";

export default function BrandGuidelinesPage() {
  return (
    <div>
      <p className="text-sm font-medium text-primary">Step 1 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Brand guidelines
      </h1>
      <p className="mt-3 text-muted-foreground">
        Tell us who you are and who you&apos;re talking to. Every piece of copy
        we help you write starts from here.
      </p>

      <div className="mt-10 rounded-2xl border bg-card p-8 shadow-sm">
        <BrandGuidelinesForm />
      </div>
    </div>
  );
}
