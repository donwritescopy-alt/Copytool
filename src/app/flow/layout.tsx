import { redirect } from "next/navigation";

// The sidebar lives in the layout, so it persists (and keeps its position)
// while the step pages in the main area change.
export default function FlowLayout({ children }: LayoutProps<"/flow">) {
  void children;
  redirect("/dashboard");
}
