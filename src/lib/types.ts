export type NarrativeStance = "we" | "i" | "none";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  brand_name: string | null;
  target_audience: string | null;
  brand_voice_keywords: string | null;
  key_terminology: string | null;
  words_to_avoid: string | null;
  narrative_stance: NarrativeStance | null;
  details_saved_at: string | null;
  created_at: string;
  updated_at: string;
};
