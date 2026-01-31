import { createClient } from "@/lib/supabase/server";
import type {
  RaidItem,
  Action,
  Project,
  WorkspaceDashboard,
  RagStatus,
  AuditLogEntry,
  Workspace,
} from "@/lib/types";

// Helper to count RAG status
function ragSummary(items: { rag_status: RagStatus }[]) {
  return {
    red: items.filter((i) => i.rag_status === "red").length,
    amber: items.filter((i) => i.rag_status === "amber").length,
    green: items.filter((i) => i.rag_status === "green").length,
  };
}

// NOTE: Only exports *server* functions for Dashboard server component
export async function getWorkspaceDashboardData(userId: string) {
  const supabase = await createClient();

  // 1. Get workspaces where user is a member (or owned)
  const { data: workspaces, error: wsError } = await supabase
    .from("workspace_members")
    .select("workspace_id,workspaces(*)")
    .eq("user_id", userId);

  if (wsError || !workspaces?.length) {
    return { workspaces: [], dashboard: null };
  }
  // Pick first workspace for now (could extend to multi-workspace later)
  const joined = workspaces[0].workspaces;
  const workspace = (Array.isArray(joined) ? joined[0] : joined) as unknown as Workspace;

  const workspaceId = workspace.id;

  // 2. RAID items (fetch all for stats & filter for exception list)
  const { data: rawRaid } = await supabase
    .from("raid_items")
    .select("*")
    .eq("workspace_id", workspaceId);
  const raidItems = rawRaid ?? [];

  // 3. Actions (open/of any status, overdue)
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { data: rawOpen } = await supabase
    .from("actions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("completed_at", null);
  const openActions = rawOpen ?? [];

  const { data: rawOverdue } = await supabase
    .from("actions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .lte("due_date", now)
    .is("completed_at", null);
  const overdueActions = rawOverdue ?? [];

  // 4. Projects (active only)
  const { data: rawProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .in("status", ["active", "in_progress"]);
  const projects = rawProjects ?? [];

  // 5. Exception-first (RAID items RED/AMBER, overdue actions)
  const exceptionRaid = raidItems.filter(
    (i) => i.rag_status === "red" || i.rag_status === "amber"
  );

  // 6. Audit log (recent 5 entries)
  const { data: rawAudit } = await supabase
    .from("audit_log")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("performed_at", { ascending: false })
    .limit(5);
  const auditLog = rawAudit ?? [];

  // 7. Tuple: summary + raw for needs attention
  const rag = ragSummary(raidItems);

  return {
    workspace,
    workspaceId,
    raidItems,
    openActions,
    overdueActions,
    projects,
    rag,
    exceptionRaid,
    needsAttention: [
      ...exceptionRaid.map((i) => ({ ...i, kind: "RAID" as const })),
      ...overdueActions.map((a) => ({ ...a, kind: "Action" as const })),
    ],
    auditLog,
  };
}
