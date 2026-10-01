import { WriterPicker } from "./writer-picker";

export default function ChooseCopywriterPage() {
  return (
    <div>
      <p className="text-sm font-medium text-primary">Step 3 of 4</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Choose copy writer
      </h1>
      <p className="mt-3 text-muted-foreground">
        Pick the writer whose personality fits this moment. You can change your
        mind later.
      </p>

      <div className="mt-10">
        <WriterPicker />
      </div>
    </div>
  );
}
