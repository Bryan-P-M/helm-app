import { createClient } from "@/lib/supabase/server";

export async function getWorkspaceDashboardData(userId: string) {
  const supabase = await createClient();

  // Get workspace
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(*)")
    .eq("user_id", userId);

  if (!memberships?.length) return null;
  const workspace = Array.isArray(memberships[0].workspaces)
    ? memberships[0].workspaces[0]
    : memberships[0].workspaces;
  if (!workspace) return null;
  const workspaceId = (workspace as any).id;

  // Portfolios with RAG
  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("id, name, code, rag_status, status, director_id")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  // Programmes with RAG
  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name, code, rag_status, status, portfolio_id")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  // Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, code, rag_status, status, programme_id")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  // RAID items (all, for RAG counts)
  const { data: raidItems } = await supabase
    .from("raid_items")
    .select("id, rag_status, source_level, project_id, programme_id, portfolio_id")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  // Actions (open + overdue)
  const now = new Date().toISOString().slice(0, 10);
  const { data: openActions } = await supabase
    .from("actions")
    .select("id, title, status, due_date, priority, completed_at, project_id")
    .eq("workspace_id", workspaceId)
    .is("completed_at", null)
    .is("deleted_at", null);

  const overdueActions = (openActions ?? []).filter(a => a.due_date && a.due_date <= now);

  // Needs attention: RED/AMBER RAID + overdue actions
  const exceptionRaid = (raidItems ?? []).filter(r => r.rag_status === "red" || r.rag_status === "amber");
  const needsAttention = [
    ...exceptionRaid.map(i => ({ ...i, kind: "RAID" as const })),
    ...overdueActions.map(a => ({ ...a, kind: "Action" as const })),
  ];

  // Audit log
  const { data: auditLog } = await supabase
    .from("audit_log")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("performed_at", { ascending: false })
    .limit(5);

  // RAG summary across all entities
  const ragCount = (items: { rag_status: string }[]) => ({
    red: items.filter(i => i.rag_status === "red").length,
    amber: items.filter(i => i.rag_status === "amber").length,
    green: items.filter(i => i.rag_status === "green").length,
  });

  return {
    workspace,
    portfolios: portfolios ?? [],
    programmes: programmes ?? [],
    projects: projects ?? [],
    raidItems: raidItems ?? [],
    openActions: openActions ?? [],
    overdueActions,
    needsAttention,
    auditLog: auditLog ?? [],
    rag: {
      portfolio: ragCount(portfolios ?? []),
      programme: ragCount(programmes ?? []),
      project: ragCount(projects ?? []),
      raid: ragCount(raidItems ?? []),
    },
    counts: {
      portfolios: (portfolios ?? []).length,
      programmes: (programmes ?? []).length,
      projects: (projects ?? []).length,
      raidTotal: (raidItems ?? []).length,
      openActions: (openActions ?? []).length,
      overdueActions: overdueActions.length,
    },
  };
}