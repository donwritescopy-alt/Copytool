export const FLOW_STEPS = [
  {
    id: "brand-guidelines",
    label: "Brand Guidelines",
    description: "Who you are and who you write for",
    href: "/flow/brand-guidelines",
  },
  {
    id: "frame-context",
    label: "Frame Context",
    description: "Where the copy will live",
    href: "/flow/frame-context",
  },
  {
    id: "choose-copywriter",
    label: "Choose Copy Writer",
    description: "Pick the voice for the job",
    href: "/flow/choose-copywriter",
  },
  {
    id: "analysis",
    label: "Analysis",
    description: "Review and refine the result",
    href: "/flow/analysis",
  },
] as const;

export type StepId = (typeof FLOW_STEPS)[number]["id"];

export const NARRATIVE_STANCES = ["We", "I", "No person"] as const;
export type NarrativeStance = (typeof NARRATIVE_STANCES)[number];

export type BrandGuidelines = {
  brandName: string;
  targetAudience: string;
  narrativeStance: NarrativeStance;
};

export const CHANNELS = ["Website", "Web App", "Mobile App"] as const;
export type Channel = (typeof CHANNELS)[number];

export type FrameContext = {
  channel: Channel;
  primaryGoal: string;
  constraints: string;
};

export const WRITERS = [
  {
    id: "val",
    name: "Val",
    avatar: "/writers/val.webp",
    tagline: "Playful, cheeky and fun",
    description:
      "Warm guide for readers. Sassy trainer energy for writers. Goes completely silent with money.",
  },
] as const;

export type WriterId = (typeof WRITERS)[number]["id"];

export type FlowState = {
  brandGuidelines: BrandGuidelines | null;
  frameContext: FrameContext | null;
  writerId: WriterId | null;
  completedSteps: StepId[];
};
