import { createClient } from "@/lib/supabase/server";
import { getRaidItems } from "@/lib/queries/raid";
import type { RaidItemWithOwner, RaidItemFilters } from "@/lib/types";
import RaidTable from "@/components/raid/raid-table";
import RaidCreateDialog from "@/components/raid/raid-create-dialog";

export default async function RaidLogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;
  }

  // Get workspace
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  // Extract filter params
  const params = searchParams ? await searchParams : {};
  const filters: Record<string, string> = {};
  for (const f of ["type", "status", "rag_status", "owner_id", "priority"]) {
    if (params[f]) filters[f] = String(params[f]);
  }

  let items: RaidItemWithOwner[] = [];
  try {
    items = await getRaidItems(workspaceId, undefined, filters as RaidItemFilters);
  } catch {
    // Error handled by empty state
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">RAID Log</h1>
        <RaidCreateDialog workspaceId={workspaceId} />
      </div>
      <RaidTable initialItems={items} workspaceId={workspaceId} />
    </div>
  );
}
