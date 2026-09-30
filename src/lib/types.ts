export type Project = {
  id: string;
  created_by: string;
  name: string;
  description: string | null;
  voice: string | null;
  tone: string | null;
  dos: string | null;
  donts: string | null;
  terminology: string | null;
  created_at: string;
  updated_at: string;
};

export type Persona = {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  goals: string | null;
  pain_points: string | null;
  created_at: string;
  updated_at: string;
};
