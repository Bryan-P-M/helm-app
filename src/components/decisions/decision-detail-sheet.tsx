"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { DECISION_STATUS_LABELS } from "@/lib/constants";
import type { DecisionWithDetails } from "@/lib/types";

export default function DecisionDetailSheet({
  open,
  decision,
  onOpenChange,
}: {
  open: boolean;
  decision: DecisionWithDetails | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!decision) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{decision.title}</SheetTitle>
          <SheetDescription>
            {decision.decision_date
              ? format(parseISO(decision.decision_date), "dd MMM yyyy")
              : "No date"}
            {decision.project?.name && (
              <> · <span className="font-medium">{decision.project.name}</span></>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Status */}
          <div>
            <span className="text-xs text-muted-foreground block">Status</span>
            <Badge variant="outline">{DECISION_STATUS_LABELS[decision.status]}</Badge>
            {decision.status === "approved" && (
              <span className="ml-2 text-xs text-green-600 font-medium">✓ Source of Truth</span>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Description</span>
            {decision.description ? (
              <div className="whitespace-pre-line bg-muted p-3 rounded text-sm">
                {decision.description}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No description.</span>
            )}
          </div>

          {/* Rationale */}
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Rationale</span>
            {decision.rationale ? (
              <div className="whitespace-pre-line bg-muted p-3 rounded text-sm">
                {decision.rationale}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No rationale recorded.</span>
            )}
          </div>

          <Separator />

          {/* Made By */}
          {decision.made_by && (
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Made By</span>
              <span className="text-sm">{decision.made_by.full_name}</span>
            </div>
          )}

          {/* Meeting link */}
          {decision.meeting && (
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Meeting</span>
              <span className="text-sm">
                {decision.meeting.title}
                {decision.meeting.meeting_date && (
                  <> ({format(parseISO(decision.meeting.meeting_date), "dd MMM yyyy")})</>
                )}
              </span>
            </div>
          )}

          <Separator />

          {/* Participants */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2">
              Participants ({decision.participants?.length ?? 0})
            </span>
            {(decision.participants?.length ?? 0) === 0 ? (
              <span className="text-sm text-muted-foreground">No participants.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {decision.participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-muted"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={p.user?.avatar_url ?? undefined} />
                      <AvatarFallback>{(p.user?.full_name ?? "?")[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{p.user?.full_name}</span>
                    <Badge variant="secondary" className="text-xs">{p.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Audit */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Created: {format(parseISO(decision.created_at), "dd MMM yyyy, HH:mm")}</div>
            <div>Updated: {format(parseISO(decision.updated_at), "dd MMM yyyy, HH:mm")}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
