import { createClient } from "@/lib/supabase/server";
import { RaciAssignment, RaciAssignmentWithProfile, RaciEntityType, RaciMatrixRow, RaciRole } from "@/lib/types/raci";
import { Profile, WorkspaceMember } from "@/lib/types";

export async function getRaciAssignments(
  workspaceId: string,
  projectId?: string
): Promise<RaciAssignmentWithProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from("raci_assignments")
    .select(
      `
        *,
        user:user_id(id, full_name, avatar_url)
      `
    )
    .eq("workspace_id", workspaceId);

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching RACI assignments:", error);
    return [];
  }

  return data.map((assignment: any) => ({
    ...assignment,
    user: {
      id: assignment.user.id,
      full_name: assignment.user.full_name,
      avatar_url: assignment.user.avatar_url,
    },
  })) as RaciAssignmentWithProfile[];
}

export async function getRaciMatrix(
  workspaceId: string,
  projectId: string
): Promise<RaciMatrixRow[]> {
  const supabase = await createClient();

  const { data: assignmentsData, error: assignmentsError } = await supabase
    .from("raci_assignments")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("project_id", projectId);

  if (assignmentsError) {
    console.error("Error fetching RACI assignments for matrix:", assignmentsError);
    return [];
  }

  // Fetch related entities (Actions, RAID Items, Decisions)
  const [
    { data: actionsData, error: actionsError },
    { data: raidItemsData, error: raidItemsError },
    { data: decisionsData, error: decisionsError },
  ] = await Promise.all([
    supabase.from("actions").select("id, title").eq("workspace_id", workspaceId).eq("project_id", projectId).is("deleted_at", null),
    supabase.from("raid_items").select("id, title").eq("workspace_id", workspaceId).eq("project_id", projectId).is("deleted_at", null),
    supabase.from("decisions").select("id, title").eq("workspace_id", workspaceId).eq("project_id", projectId).is("deleted_at", null),
  ]);

  if (actionsError) console.error("Error fetching actions:", actionsError);
  if (raidItemsError) console.error("Error fetching RAID items:", raidItemsError);
  if (decisionsError) console.error("Error fetching decisions:", decisionsError);

  const entityMap = new Map<string, string>(); // entity_id -> entity_name
  actionsData?.forEach((a) => entityMap.set(a.id, a.title));
  raidItemsData?.forEach((r) => entityMap.set(r.id, r.title));
  decisionsData?.forEach((d) => entityMap.set(d.id, d.title));

  const matrixRows: Record<string, RaciMatrixRow> = {};

  for (const assignment of assignmentsData) {
    const entityKey = assignment.entity_type + (assignment.entity_id || assignment.deliverable_name);

    if (!matrixRows[entityKey]) {
      let entityName = assignment.deliverable_name || "Unknown Entity";
      if (assignment.entity_id) {
        entityName = entityMap.get(assignment.entity_id) || `[Deleted] ${assignment.entity_type}`;
      }
      
      matrixRows[entityKey] = {
        entity_type: assignment.entity_type as RaciEntityType,
        entity_id: assignment.entity_id,
        entity_name: entityName,
        assignments: {},
      };
    }

    if (!matrixRows[entityKey].assignments[assignment.user_id]) {
      matrixRows[entityKey].assignments[assignment.user_id] = [];
    }
    matrixRows[entityKey].assignments[assignment.user_id].push(assignment.role as RaciRole);
  }

  return Object.values(matrixRows);
}
