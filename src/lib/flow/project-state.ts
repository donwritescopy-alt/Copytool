import { FLOW_STEPS, type StepId } from "./steps";
import type { Project } from "@/lib/types";

export function getCompletedProjectSteps(project: Project): StepId[] {
  const completed: StepId[] = [];
  if (
    project.brand_name?.trim() &&
    project.target_audience?.trim() &&
    ["We", "I", "No person"].includes(project.narrative_stance ?? "")
  ) completed.push("brand-guidelines");
  if (
    completed.includes("brand-guidelines") &&
    project.channel && project.primary_goal?.trim()
  ) completed.push("frame-context");
  if (completed.includes("frame-context") && project.writer_id === "val") {
    completed.push("choose-copywriter");
  }
  return completed;
}

export function getNextProjectStep(project: Project): StepId {
  const completed = getCompletedProjectSteps(project);
  return FLOW_STEPS.find((step) => !completed.includes(step.id))?.id ?? "analysis";
}

export function projectFlowHref(projectId: string, step: StepId) {
  return `/dashboard/projects/${projectId}/flow/${step}`;
}
