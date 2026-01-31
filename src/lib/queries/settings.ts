import { createClient } from "@/lib/supabase/server";
import type { Workspace, WorkspaceMember, WorkspaceRole, Profile } from "@/lib/types";

export async function getWorkspaceDetails(workspaceId: string): Promise<Workspace & { member_count: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*, workspace_members(count)")
    .eq("id", workspaceId)
    .single();
  if (error) throw error;
  return {
    ...(data as Workspace),
    member_count: data.workspace_members[0]?.count ?? 0,
  };
}

export type MemberWithProfile = WorkspaceMember & { profile: Profile };

export async function getWorkspaceMembers(workspaceId: string): Promise<MemberWithProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("id, workspace_id, user_id, role, profile:profiles(id, email, full_name, avatar_url)")
    .eq("workspace_id", workspaceId);
  if (error) throw error;
  return (data ?? []) as unknown as MemberWithProfile[];
}

export async function updateWorkspace(workspaceId: string, data: Partial<Pick<Workspace, "name" | "description" | "logo_url">>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspaces")
    .update(data)
    .eq("id", workspaceId);
  if (error) throw error;
}

export async function inviteMember(
  workspaceId: string,
  email: string,
  role: WorkspaceRole = "member",
) {
  const supabase = await createClient();
  // Lookup user id from profiles
  const { data: userProfiles, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  if (userError) throw userError;
  const { error } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: userProfiles.id, role });
  if (error) throw error;
}

export async function updateMemberRole(memberId: string, role: WorkspaceRole) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId);
  if (error) throw error;
}

export async function removeMember(memberId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}
