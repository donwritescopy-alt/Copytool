import { createResponders, getSupabaseForRequest } from "@/lib/plugin-api";

const { json, errorResponse, preflight } = createResponders("GET, OPTIONS");

export function OPTIONS() {
  return preflight();
}

type ProjectRow = {
  id: string;
  name: string;
  brand_name: string | null;
  description: string | null;
  details_saved_at: string | null;
  updated_at: string;
};

/**
 * Lists the caller's projects for the plugin's project picker.
 *
 *   GET  Authorization: Bearer <access_token>
 *   200 { projects: [{ id, name, brand_name, description, has_brand_details, updated_at }] }
 *
 * Runs as the caller, so row-level security limits it to their own projects.
 */
export async function GET(request: Request) {
  const supabase = await getSupabaseForRequest(request);
  if (!supabase) {
    return errorResponse("You need to be logged in.", 401);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, brand_name, description, details_saved_at, updated_at")
    .order("updated_at", { ascending: false })
    .returns<ProjectRow[]>();

  if (error) {
    console.error("Project list failed:", error.message);
    return errorResponse("Couldn't load your projects.", 500);
  }

  return json({
    projects: data.map(
      ({ details_saved_at, ...project }) => ({
        ...project,
        has_brand_details: details_saved_at !== null,
      }),
    ),
  });
}
