import { createClient } from "@/lib/supabase/server";
import { getActions } from "@/lib/queries/actions";
import type { ActionWithRelations } from "@/lib/types";
import ActionsTable from "@/components/actions/actions-table";
import ActionCreateDialog from "@/components/actions/action-create-dialog";

export default async function ActionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;
  }

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const workspaceId = memberships?.[0]?.workspace_id;
  const params = searchParams ? await searchParams : {};
  const filterOverdue = String(params.filter ?? "") === "overdue";
  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  let actions: ActionWithRelations[] = [];
  try {
    actions = await getActions(workspaceId);
    if (filterOverdue) {
      const today = new Date().toISOString().slice(0, 10);
      actions = actions.filter(a => a.due_date && a.due_date <= today && !a.completed_at);
    }
  } catch {
    // Error handled by empty state
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {filterOverdue ? "Overdue Actions" : "Actions Tracker"}
        </h1>
        <ActionCreateDialog workspaceId={workspaceId} />
      </div>
      <ActionsTable initialActions={actions} />
    </div>
  );
}
