import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus, RagStatus } from "@/lib/types";

interface ProjectWithOwner extends Project {
  owner: { id: string; email: string; full_name: string; avatar_url: string | null } | null;
}

interface ProjectFilters {
  status?: ProjectStatus;
  rag_status?: RagStatus;
  owner_id?: string;
}

export async function getProjects(workspaceId: string, filters?: ProjectFilters): Promise<ProjectWithOwner[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*, owner:owner_id(id, email, full_name, avatar_url)")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.rag_status) query = query.eq("rag_status", filters.rag_status);
  if (filters?.owner_id) query = query.eq("owner_id", filters.owner_id);

  query = query.order("rag_status", { ascending: true }).order("name", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ProjectWithOwner[];
}

export async function getProjectDetail(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, owner:owner_id(id, email, full_name, avatar_url)")
    .eq("id", projectId)
    .single();
  if (error) throw error;

  // Get RAID counts by type
  const { data: raidCounts } = await supabase
    .from("raid_items")
    .select("type, rag_status")
    .eq("project_id", projectId)
    .is("deleted_at", null);

  // Get action counts by status
  const { data: actionCounts } = await supabase
    .from("actions")
    .select("status")
    .eq("project_id", projectId)
    .is("deleted_at", null);

  return {
    ...(data as unknown as ProjectWithOwner),
    raidItems: raidCounts ?? [],
    actions: actionCounts ?? [],
  };
}

export async function createProject(data: {
  workspace_id: string;
  name: string;
  code: string;
  description?: string;
  status?: ProjectStatus;
  rag_status?: RagStatus;
  owner_id?: string;
  start_date?: string;
  target_end_date?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(data);
  if (error) throw error;
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(data).eq("id", projectId);
  if (error) throw error;
}
