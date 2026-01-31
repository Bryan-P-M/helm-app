import { getWorkspaceDetails, getWorkspaceMembers } from "@/lib/queries/settings";
import { createClient } from "@/lib/supabase/server";
import SettingsPanel from "@/components/settings/settings-panel";
import type { Workspace } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="text-center py-10 text-red-500">Not authenticated</div>;

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  const isAdmin = memberships?.[0]?.role === "admin";

  if (!workspaceId) return <div className="text-center py-10 text-red-500">No accessible workspace.</div>;

  const workspace = await getWorkspaceDetails(workspaceId);
  const members = await getWorkspaceMembers(workspaceId);

  return (
    <main className="mx-auto max-w-2xl py-8 px-4">
      <SettingsPanel
        workspace={workspace}
        members={members}
        isAdmin={isAdmin}
        currentUserId={user.id}
      />
    </main>
  );
}
