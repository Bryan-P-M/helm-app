import { createClient } from "@/lib/supabase/server";
import { getDecisions } from "@/lib/queries/decisions";
import type { DecisionWithDetails } from "@/lib/types";
import DecisionsTable from "@/components/decisions/decisions-table";
import DecisionCreateDialog from "@/components/decisions/decision-create-dialog";

export default async function DecisionsPage() {
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
  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  let decisions: DecisionWithDetails[] = [];
  try {
    decisions = await getDecisions(workspaceId);
  } catch {
    // Error handled by empty state
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Decisions Log</h1>
        <DecisionCreateDialog workspaceId={workspaceId} />
      </div>
      <DecisionsTable initialDecisions={decisions} />
    </div>
  );
}
