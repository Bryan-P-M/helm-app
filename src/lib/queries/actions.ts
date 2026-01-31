import { createClient } from "@/lib/supabase/server";
import type {
  Action,
  ActionWithRelations,
  ActionFilters,
  CreateAction,
  UpdateAction,
} from "@/lib/types";

const ACTION_SELECT = `
  *,
  owner:owner_id(id, full_name, email, avatar_url),
  created_by:created_by_id(id, full_name),
  project:project_id(id, name, code),
  source_meeting:source_meeting_id(id, title, meeting_date),
  source_raid_item:source_raid_item_id(id, title, type),
  source_decision:source_decision_id(id, title)
`;

export async function getActions(
  workspaceId: string,
  filters?: ActionFilters
): Promise<ActionWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("actions")
    .select(ACTION_SELECT)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (filters) {
    if (filters.status) {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [filters.status];
      query = query.in("status", statuses);
    }
    if (filters.project_id) {
      query = query.eq("project_id", filters.project_id);
    }
    if (filters.owner_id) {
      query = query.eq("owner_id", filters.owner_id);
    }
    if (filters.priority) {
      const priorities = Array.isArray(filters.priority)
        ? filters.priority
        : [filters.priority];
      query = query.in("priority", priorities);
    }
    if (filters.source_type) {
      query = query.eq("source_type", filters.source_type);
    }
    if (filters.overdue_only) {
      query = query
        .in("status", ["open", "in_progress"])
        .lt("due_date", new Date().toISOString().slice(0, 10));
    }
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
  }

  query = query.order("due_date", { ascending: true, nullsFirst: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ActionWithRelations[];
}

export async function getActionDetail(actionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("actions")
    .select(ACTION_SELECT)
    .eq("id", actionId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as unknown as ActionWithRelations | null;
}

export async function createAction(
  workspaceId: string,
  userId: string,
  data: CreateAction
) {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("actions")
    .insert([{
      ...data,
      workspace_id: workspaceId,
      created_by_id: userId,
      status: "open",
    }])
    .select()
    .single();

  if (error) throw error;
  return inserted;
}

export async function updateAction(actionId: string, data: UpdateAction) {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("actions")
    .update(data)
    .eq("id", actionId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
