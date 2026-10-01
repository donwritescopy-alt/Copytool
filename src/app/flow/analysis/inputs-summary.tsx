import {
  WRITERS,
  type BrandGuidelines,
  type FrameContext,
} from "@/lib/flow/steps";

type Props = {
  brandGuidelines: BrandGuidelines;
  frameContext: FrameContext;
  writer: (typeof WRITERS)[number];
};

/** Read-only recap of everything entered in steps 1–3. */
export function InputsSummary({ brandGuidelines, frameContext, writer }: Props) {
  const rows: { label: string; value: string; wide?: boolean }[] = [
    { label: "Brand name", value: brandGuidelines.brandName },
    { label: "Narrative stance", value: brandGuidelines.narrativeStance },
    { label: "Channel", value: frameContext.channel },
    { label: "Primary goal", value: frameContext.primaryGoal },
    {
      label: "Target audience",
      value: brandGuidelines.targetAudience,
      wide: true,
    },
    {
      label: "Constraints",
      value: frameContext.constraints || "None",
      wide: true,
    },
  ];

  return (
    <section className="rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-4 border-b pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={writer.avatar}
          alt={`${writer.name}, illustrated portrait`}
          className="size-14 rounded-full border bg-white object-cover"
        />
        <div>
          <p className="text-sm text-muted-foreground">Your writer</p>
          <p className="font-semibold">
            {writer.name}{" "}
            <span className="font-normal text-muted-foreground">
              · {writer.tagline}
            </span>
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className={row.wide ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm whitespace-pre-wrap">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
