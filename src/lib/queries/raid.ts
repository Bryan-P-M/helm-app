import { createClient } from "@/lib/supabase/server";
import type {
  RaidItemWithOwner,
  RaidItem,
  RaidItemFilters,
  CreateRaidItem,
  UpdateRaidItem,
} from "@/lib/types";

export async function getRaidItems(
  workspaceId: string,
  projectId?: string,
  filters?: RaidItemFilters
): Promise<RaidItemWithOwner[]> {
  const supabase = await createClient();

  let query = supabase
    .from("raid_items")
    .select(
      `*, owner:owner_id(id, email, full_name, avatar_url), created_by:created_by_id(id, full_name), project:project_id(id, name, code)`
    )
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (projectId) query = query.eq("project_id", projectId);

  if (filters) {
    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      query = query.in("type", types);
    }
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      query = query.in("status", statuses);
    }
    if (filters.rag_status) {
      const rags = Array.isArray(filters.rag_status) ? filters.rag_status : [filters.rag_status];
      query = query.in("rag_status", rags);
    }
    if (filters.owner_id) query = query.eq("owner_id", filters.owner_id);
    if (filters.priority) {
      const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
      query = query.in("priority", priorities);
    }
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as RaidItemWithOwner[];
}

export async function getRaidItemDetail(itemId: string) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("raid_items")
    .select(
      `*, owner:owner_id(id, email, full_name, avatar_url), created_by:created_by_id(id, full_name), project:project_id(id, name, code)`
    )
    .eq("id", itemId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  const { data: audit } = await supabase
    .from("audit_log")
    .select("*")
    .eq("entity_type", "raid_item")
    .eq("entity_id", itemId)
    .order("performed_at", { ascending: false });

  return { item: item as unknown as RaidItemWithOwner | null, audit: audit ?? [] };
}

export async function createRaidItem(
  workspaceId: string,
  projectId: string | null,
  data: CreateRaidItem
) {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("raid_items")
    .insert([{ ...data, workspace_id: workspaceId, project_id: projectId }])
    .select()
    .single();

  if (error) throw error;
  return inserted;
}

export async function updateRaidItem(itemId: string, data: UpdateRaidItem) {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("raid_items")
    .update(data)
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
