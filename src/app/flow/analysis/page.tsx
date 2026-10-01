import { AnalysisView } from "./analysis-view";

export default function AnalysisPage() {
  return (
    <div>
      <p className="text-sm font-medium text-primary">Step 4 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Analysis</h1>
      <p className="mt-3 text-muted-foreground">
        Paste the copy you want reviewed. Your writer will score it against
        your brand and suggest a better version.
      </p>

      <div className="mt-10">
        <AnalysisView />
      </div>
    </div>
  );
}
