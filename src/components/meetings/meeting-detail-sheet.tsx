"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { MEETING_STATUS_LABELS, ATTENDEE_ROLE_LABELS } from "@/lib/constants";
import type { MeetingWithDetails } from "@/lib/types";

export default function MeetingDetailSheet({
  open,
  meeting,
  onOpenChange,
}: {
  open: boolean;
  meeting: MeetingWithDetails | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!meeting) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{meeting.title}</SheetTitle>
          <SheetDescription>
            {format(parseISO(meeting.meeting_date), "dd MMM yyyy, HH:mm")}
            {meeting.project?.name && (
              <> · <span className="font-medium">{meeting.project.name}</span></>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Status & Location */}
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-xs text-muted-foreground block">Status</span>
              <Badge variant="outline">{MEETING_STATUS_LABELS[meeting.status]}</Badge>
            </div>
            {meeting.location && (
              <div>
                <span className="text-xs text-muted-foreground block">Location</span>
                <span className="text-sm">{meeting.location}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Notes</span>
            {meeting.notes ? (
              <div className="whitespace-pre-line bg-muted p-3 rounded text-sm">
                {meeting.notes}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No notes.</span>
            )}
          </div>

          <Separator />

          {/* Attendees */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2">
              Attendees ({meeting.attendees?.length ?? 0})
            </span>
            {(meeting.attendees?.length ?? 0) === 0 ? (
              <span className="text-sm text-muted-foreground">No attendees.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {meeting.attendees.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-muted"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={a.user?.avatar_url ?? undefined}
                        alt={a.user?.full_name ?? "Attendee"}
                      />
                      <AvatarFallback>
                        {(a.user?.full_name ?? "A")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{a.user?.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({ATTENDEE_ROLE_LABELS[a.role] ?? a.role})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Linked Actions & Decisions placeholder */}
          <div className="flex gap-8">
            <div>
              <span className="text-xs text-muted-foreground block">Actions</span>
              <span className="text-sm text-muted-foreground">—</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Decisions</span>
              <span className="text-sm text-muted-foreground">—</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
