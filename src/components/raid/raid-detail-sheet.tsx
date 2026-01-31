"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  RAG_BADGE_CLASSES, RAID_TYPE_LABELS, RAID_STATUS_LABELS, PRIORITY_BADGE_CLASSES,
} from "@/lib/constants";
import type { RaidItemWithOwner } from "@/lib/types";
import Link from "next/link";

export default function RaidDetailSheet({
  open,
  item,
  onOpenChange,
}: {
  open: boolean;
  item: RaidItemWithOwner | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open || !item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-[420px] max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{item.title}</SheetTitle>
          <SheetDescription className="flex gap-2 flex-wrap">
            <Badge className={RAG_BADGE_CLASSES[item.rag_status]}>{item.rag_status}</Badge>
            <Badge className={RAID_TYPE_LABELS[item.type] ? undefined : undefined} variant="outline">
              {RAID_TYPE_LABELS[item.type]}
            </Badge>
            <Badge variant="outline">{RAID_STATUS_LABELS[item.status]}</Badge>
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-3" />
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground uppercase">Description</div>
                <div className="text-sm">{item.description || <span className="text-muted-foreground">No description</span>}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                  <div className="text-sm">{(item as any).owner?.full_name ?? "Unassigned"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Due Date</div>
                  <div className="text-sm">{item.due_date ? new Date(item.due_date).toISOString().slice(0, 10) : "–"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Priority</div>
                  <Badge className={PRIORITY_BADGE_CLASSES[item.priority]}>{item.priority}</Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Source Level</div>
                  <div className="text-sm">{item.source_level}</div>
                </div>
                {item.impact && (
                  <div>
                    <div className="text-xs text-muted-foreground">Impact</div>
                    <div className="text-sm capitalize">{item.impact}</div>
                  </div>
                )}
                {item.likelihood && (
                  <div>
                    <div className="text-xs text-muted-foreground">Likelihood</div>
                    <div className="text-sm capitalize">{item.likelihood}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-muted-foreground">Escalated</div>
                  <div className="text-sm">{item.is_escalated ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm">{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              {item.escalation_note && (
                <div>
                  <div className="text-xs text-muted-foreground">Escalation Note</div>
                  <div className="text-sm">{item.escalation_note}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/actions?source_raid_item_id=${item.id}`}>Create Action</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
