import { format } from "date-fns";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMeetingDetail } from "@/lib/queries/meetings";
import { MeetingNotesEditor } from "@/components/meetings/meeting-notes-editor";
import { ExtractActionDialog } from "@/components/meetings/extract-action-dialog";
import { ExtractDecisionDialog } from "@/components/meetings/extract-decision-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: meetingId } = await params;
  const supabase = await createClient();

  let meeting;
  try {
    meeting = await getMeetingDetail(meetingId);
  } catch {
    notFound();
  }
  if (!meeting) notFound();

  const { data: actions, error: actionsError } = await supabase
    .from("actions")
    .select(
      "id, title, status, priority, due_date, owner_id, owner:owner_id(id, full_name)"
    )
    .eq("source_meeting_id", meetingId)
    .is("deleted_at", null);

  if (actionsError) {
    console.error("Error fetching linked actions:", actionsError);
    // Decide how to handle this error - maybe show empty state or error message
  }

  const { data: decisions, error: decisionsError } = await supabase
    .from("decisions")
    .select(
      "id, title, status, made_by:made_by_id(id, full_name), decided_at"
    )
    .eq("meeting_id", meetingId)
    .is("deleted_at", null);

  if (decisionsError) {
    console.error("Error fetching linked decisions:", decisionsError);
    // Decide how to handle this error
  }

  const meetingDateObj = new Date(meeting.meeting_date);
  const formattedMeetingDate = format(meetingDateObj, "PPP");
  const formattedMeetingTime = format(meetingDateObj, "h:mm a");
  const meetingDateForDialog = format(meetingDateObj, "yyyy-MM-dd");

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{meeting.title}</h1>
        <div className="flex gap-2">
          <ExtractActionDialog
            meetingId={meeting.id}
            projectId={meeting.project_id}
            workspaceId={meeting.workspace_id}
          />
          <ExtractDecisionDialog
            meetingId={meeting.id}
            projectId={meeting.project_id}
            workspaceId={meeting.workspace_id}
            meetingDate={meetingDateForDialog}
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-lg font-medium">{formattedMeetingDate} at {formattedMeetingTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="outline">{meeting.status}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="text-lg font-medium">{meeting.project?.name ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-lg font-medium">{meeting.location ?? "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {meeting.attendees.length > 0 ? (
              meeting.attendees.map((attendee: any) => (
                <div key={attendee.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={attendee.user?.avatar_url ?? ""} />
                    <AvatarFallback>
                      {(attendee.user?.full_name ?? "A")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{attendee.user?.full_name ?? "Unknown"}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No attendees listed.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingNotesEditor
            meetingId={meeting.id}
            initialNotes={meeting.notes}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Actions ({actions?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actions && actions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action: any) => (
                  <TableRow key={action.id}>
                    <TableCell className="font-medium">
                      <Link href={`/actions/${action.id}`} className="hover:underline">
                        {action.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{action.status}</Badge>
                    </TableCell>
                    <TableCell>{action.priority}</TableCell>
                    <TableCell>{action.due_date ? format(new Date(action.due_date), "PPP") : "N/A"}</TableCell>
                    <TableCell>{(Array.isArray(action.owner) ? action.owner[0]?.full_name : action.owner?.full_name) ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No actions linked to this meeting.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Decisions ({decisions?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {decisions && decisions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Decided At</TableHead>
                  <TableHead>Made By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisions.map((decision: any) => (
                  <TableRow key={decision.id}>
                    <TableCell className="font-medium">
                      <Link href={`/decisions/${decision.id}`} className="hover:underline">
                        {decision.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{decision.status}</Badge>
                    </TableCell>
                    <TableCell>{decision.decided_at ? format(new Date(decision.decided_at), "PPP") : "N/A"}</TableCell>
                    <TableCell>{(Array.isArray(decision.made_by) ? decision.made_by[0]?.full_name : decision.made_by?.full_name) ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No decisions linked to this meeting.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}