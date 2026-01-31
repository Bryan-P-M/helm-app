"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import {
  ACTION_STATUS_LABELS, ACTION_STATUS_BADGE_CLASSES,
  PRIORITY_BADGE_CLASSES, PRIORITY_LABELS,
  ACTION_SOURCE_TYPE_LABELS,
} from "@/lib/constants";
import type { ActionWithRelations } from "@/lib/types";

export default function ActionDetailSheet({
  open,
  action,
  onOpenChange,
}: {
  open: boolean;
  action: ActionWithRelations | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!action) return null;

  const isOverdue =
    (action.status === "open" || action.status === "in_progress") &&
    action.due_date &&
    new Date(action.due_date) < new Date();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{action.title}</SheetTitle>
          <SheetDescription>
            {action.project
              ? `${action.project.name} (${action.project.code})`
              : "No project"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={ACTION_STATUS_BADGE_CLASSES[action.status]}>
              {ACTION_STATUS_LABELS[action.status]}
            </Badge>
            <Badge variant="outline" className={PRIORITY_BADGE_CLASSES[action.priority]}>
              {PRIORITY_LABELS[action.priority]}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive">Overdue</Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Description</span>
            {action.description ? (
              <div className="whitespace-pre-line bg-muted p-3 rounded text-sm">
                {action.description}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No description.</span>
            )}
          </div>

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block">Owner</span>
              {action.owner ? (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={action.owner.avatar_url ?? undefined} />
                    <AvatarFallback>{(action.owner.full_name ?? "?")[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{action.owner.full_name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Due Date</span>
              <span className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : ""}`}>
                {action.due_date ? format(parseISO(action.due_date), "dd MMM yyyy") : "—"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Source</span>
              <span className="text-sm">
                {ACTION_SOURCE_TYPE_LABELS[action.source_type] ?? action.source_type}
              </span>
              {action.source_meeting && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Meeting: {action.source_meeting.title}
                </div>
              )}
              {action.source_raid_item && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  RAID: {action.source_raid_item.title} ({action.source_raid_item.type})
                </div>
              )}
              {action.source_decision && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Decision: {action.source_decision.title}
                </div>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Completed</span>
              <span className="text-sm">
                {action.completed_at
                  ? format(parseISO(action.completed_at), "dd MMM yyyy, HH:mm")
                  : "—"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Audit */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Created: {format(parseISO(action.created_at), "dd MMM yyyy, HH:mm")}</div>
            <div>Updated: {format(parseISO(action.updated_at), "dd MMM yyyy, HH:mm")}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
