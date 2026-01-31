import { createClient } from "@/lib/supabase/server";
import { getMeetings } from "@/lib/queries/meetings";
import type { MeetingWithDetails } from "@/lib/types";
import MeetingsTable from "@/components/meetings/meetings-table";
import MeetingCreateDialog from "@/components/meetings/meeting-create-dialog";

export default async function MeetingsPage() {
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

  let meetings: MeetingWithDetails[] = [];
  try {
    meetings = await getMeetings(workspaceId);
  } catch {
    // Error handled by empty state
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
        <MeetingCreateDialog workspaceId={workspaceId} />
      </div>
      <MeetingsTable initialMeetings={meetings} />
    </div>
  );
}
