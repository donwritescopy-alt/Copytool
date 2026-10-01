import { FlowSidebar } from "@/components/flow/flow-sidebar";

// The sidebar lives in the layout, so it persists (and keeps its position)
// while the step pages in the main area change.
export default function FlowLayout({ children }: LayoutProps<"/flow">) {
  return (
    <div className="flex min-h-screen flex-1">
      <FlowSidebar />
      <main className="flex-1 px-10 py-14">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
