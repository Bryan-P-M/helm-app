import { createClient } from "@/lib/supabase/server";
import type {
  Decision,
  DecisionWithDetails,
  DecisionFilters,
  CreateDecision,
  UpdateDecision,
} from "@/lib/types";

const DECISION_SELECT = `
  *,
  made_by:made_by_id(id, full_name, avatar_url),
  created_by:created_by_id(id, full_name),
  project:project_id(id, name, code),
  meeting:meeting_id(id, title, meeting_date)
`;

export async function getDecisions(
  workspaceId: string,
  filters?: DecisionFilters
): Promise<DecisionWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("decisions")
    .select(DECISION_SELECT)
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
    if (filters.meeting_id) {
      query = query.eq("meeting_id", filters.meeting_id);
    }
    if (filters.date_from) {
      query = query.gte("decision_date", filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte("decision_date", filters.date_to);
    }
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
  }

  query = query.order("decision_date", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as DecisionWithDetails[];
}

export async function getDecisionDetail(decisionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("decisions")
    .select(`
      ${DECISION_SELECT},
      participants:decision_participants(
        id, role,
        user:user_id(id, full_name, avatar_url)
      )
    `)
    .eq("id", decisionId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as unknown as DecisionWithDetails | null;
}

export async function createDecision(
  workspaceId: string,
  userId: string,
  data: CreateDecision
) {
  const supabase = await createClient();

  const { participant_ids, ...decisionData } = data;

  const { data: inserted, error } = await supabase
    .from("decisions")
    .insert([{
      ...decisionData,
      workspace_id: workspaceId,
      created_by_id: userId,
      status: decisionData.status ?? "draft",
      decision_date: decisionData.decision_date ?? new Date().toISOString().slice(0, 10),
    }])
    .select()
    .single();

  if (error) throw error;

  if (participant_ids?.length && inserted) {
    const rows = participant_ids.map((uid) => ({
      decision_id: inserted.id,
      user_id: uid,
      role: "participant" as const,
    }));
    await supabase.from("decision_participants").insert(rows);
  }

  return inserted;
}

export async function updateDecision(decisionId: string, data: UpdateDecision) {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("decisions")
    .update(data)
    .eq("id", decisionId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
