import { FrameContextForm } from "./frame-context-form";

export default function FrameContextPage() {
  return (
    <div>
      <p className="text-sm font-medium text-primary">Step 2 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Frame context
      </h1>
      <p className="mt-3 text-muted-foreground">
        Tell us where this copy will live and what it needs to achieve, so the
        writing fits the moment.
      </p>

      <div className="mt-10 rounded-2xl border bg-card p-8 shadow-sm">
        <FrameContextForm />
      </div>
    </div>
  );
}
