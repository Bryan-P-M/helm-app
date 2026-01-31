import { createClient } from "@/lib/supabase/server";
import { AuditTable } from "@/components/audit/audit-table";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;
  }

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;

  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  const { data: auditEntries } = await supabase
    .from("audit_log")
    .select("*, performed_by:performed_by_id(id, full_name)")
    .eq("workspace_id", workspaceId)
    .order("performed_at", { ascending: false })
    .limit(200);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
      <p className="text-muted-foreground">Review system activities and changes.</p>
      <AuditTable entries={auditEntries || []} />
    </div>
  );
}