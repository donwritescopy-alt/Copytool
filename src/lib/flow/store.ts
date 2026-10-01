import { useSyncExternalStore } from "react";
import {
  CHANNELS,
  WRITERS,
  NARRATIVE_STANCES,
  type BrandGuidelines,
  type FlowState,
  type FrameContext,
  type StepId,
  type WriterId,
} from "./steps";

// Temporary persistence: localStorage until the database is wired up.
// Swap the read/write helpers below for Supabase calls later; the
// components only talk to `useFlowState` and the `save*` functions.
const STORAGE_KEY = "copytool.flow.v1";

const EMPTY_STATE: FlowState = {
  brandGuidelines: null,
  frameContext: null,
  writerId: null,
  completedSteps: [],
};

const listeners = new Set<() => void>();

// useSyncExternalStore needs a referentially stable snapshot, so the parsed
// value is cached and only rebuilt when the raw string changes.
let cachedRaw: string | null = null;
let cachedState: FlowState = EMPTY_STATE;

function parse(raw: string | null): FlowState {
  if (!raw) return EMPTY_STATE;
  try {
    const data = JSON.parse(raw) as Partial<FlowState>;
    const bg = data.brandGuidelines;
    const validBrandGuidelines =
      bg &&
      typeof bg.brandName === "string" &&
      typeof bg.targetAudience === "string" &&
      NARRATIVE_STANCES.includes(bg.narrativeStance);
    const fc = data.frameContext;
    const validFrameContext =
      fc &&
      typeof fc.primaryGoal === "string" &&
      typeof fc.constraints === "string" &&
      CHANNELS.includes(fc.channel);
    return {
      brandGuidelines: validBrandGuidelines ? bg : null,
      frameContext: validFrameContext ? fc : null,
      writerId: WRITERS.some((w) => w.id === data.writerId)
        ? (data.writerId as WriterId)
        : null,
      completedSteps: Array.isArray(data.completedSteps)
        ? data.completedSteps
        : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): FlowState {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.): behave as empty.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parse(raw);
  }
  return cachedState;
}

function getServerSnapshot(): FlowState {
  return EMPTY_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Fires when another tab changes the stored state.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(next: FlowState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: nothing to persist to.
  }
  listeners.forEach((listener) => listener());
}

export function useFlowState(): FlowState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function markCompleted(state: FlowState, step: StepId): StepId[] {
  return state.completedSteps.includes(step)
    ? state.completedSteps
    : [...state.completedSteps, step];
}

export function saveBrandGuidelines(brandGuidelines: BrandGuidelines) {
  const current = getSnapshot();
  write({
    ...current,
    brandGuidelines,
    completedSteps: markCompleted(current, "brand-guidelines"),
  });
}

export function saveFrameContext(frameContext: FrameContext) {
  const current = getSnapshot();
  write({
    ...current,
    frameContext,
    completedSteps: markCompleted(current, "frame-context"),
  });
}

export function saveWriter(writerId: WriterId) {
  const current = getSnapshot();
  write({
    ...current,
    writerId,
    completedSteps: markCompleted(current, "choose-copywriter"),
  });
}

const noopSubscribe = () => () => {};

/**
 * False during server render and the first client render, true afterwards.
 * Lets a page wait for localStorage data before deciding what to show, so
 * it doesn't flash an "empty" state on load.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
