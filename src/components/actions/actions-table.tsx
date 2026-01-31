"use client";

import { useState, useMemo } from "react";
import { format, parseISO, isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectItem, SelectTrigger, SelectContent, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ActionDetailSheet from "./action-detail-sheet";
import {
  ACTION_STATUS_LABELS, ACTION_STATUS_BADGE_CLASSES,
  PRIORITY_BADGE_CLASSES, PRIORITY_LABELS,
  ACTION_SOURCE_TYPE_LABELS,
} from "@/lib/constants";
import type { ActionWithRelations, ActionStatus } from "@/lib/types";

function isOverdue(a: ActionWithRelations) {
  return (
    (a.status === "open" || a.status === "in_progress") &&
    a.due_date &&
    isBefore(parseISO(a.due_date), new Date())
  );
}

interface ActionsTableProps {
  initialActions: ActionWithRelations[];
}

function ActionRows({
  actions,
  highlight,
  onSelect,
}: {
  actions: ActionWithRelations[];
  highlight?: boolean;
  onSelect: (a: ActionWithRelations) => void;
}) {
  if (actions.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">None.</TableCell>
      </TableRow>
    );
  }
  return (
    <>
      {actions.map((a) => (
        <TableRow
          key={a.id}
          className={`cursor-pointer ${highlight ? "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30" : "hover:bg-muted/50"}`}
          onClick={() => onSelect(a)}
        >
          <TableCell>
            <div className="font-medium">{a.title}</div>
            {a.project && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {a.project.name} ({a.project.code})
              </div>
            )}
          </TableCell>
          <TableCell>
            {a.owner ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={a.owner.avatar_url ?? undefined} />
                  <AvatarFallback>{(a.owner.full_name ?? "?")[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{a.owner.full_name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Unassigned</span>
            )}
          </TableCell>
          <TableCell>
            {a.due_date ? (
              <span className={highlight ? "text-red-600 font-semibold" : ""}>
                {format(parseISO(a.due_date), "dd MMM yyyy")}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </TableCell>
          <TableCell>
            <Badge variant="outline" className={ACTION_STATUS_BADGE_CLASSES[a.status]}>
              {ACTION_STATUS_LABELS[a.status]}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className={PRIORITY_BADGE_CLASSES[a.priority]}>
              {PRIORITY_LABELS[a.priority]}
            </Badge>
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">
            {ACTION_SOURCE_TYPE_LABELS[a.source_type] ?? a.source_type}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ActionsTable({ initialActions }: ActionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionWithRelations | null>(null);

  const filtered = useMemo(() => {
    return initialActions.filter((a) => {
      if (statusFilter && statusFilter !== "__all__" && a.status !== statusFilter) return false;
      if (searchFilter && !a.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      return true;
    });
  }, [initialActions, statusFilter, searchFilter]);

  // Exception-first split
  const overdue = useMemo(() => filtered.filter(isOverdue), [filtered]);
  const open = useMemo(
    () => filtered.filter((a) => !isOverdue(a) && (a.status === "open" || a.status === "in_progress" || a.status === "blocked")),
    [filtered]
  );
  const completed = useMemo(
    () => filtered.filter((a) => a.status === "completed" || a.status === "cancelled"),
    [filtered]
  );

  const headers = (
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Owner</TableHead>
      <TableHead>Due</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Priority</TableHead>
      <TableHead>Source</TableHead>
    </TableRow>
  );

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="w-40">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              {Object.entries(ACTION_STATUS_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-56">
          <Label className="text-xs text-muted-foreground">Search</Label>
          <Input
            placeholder="Filter by title…"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        {(statusFilter || searchFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setStatusFilter(""); setSearchFilter(""); }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Overdue — exception-first */}
      {overdue.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            ⚠ Overdue ({overdue.length})
          </h2>
          <Table>
            <TableHeader>{headers}</TableHeader>
            <TableBody>
              <ActionRows actions={overdue} highlight onSelect={setSelectedAction} />
            </TableBody>
          </Table>
          <Separator className="my-4" />
        </>
      )}

      {/* Open / Active */}
      <h2 className="text-lg font-semibold mb-2">Open Actions</h2>
      <Table>
        <TableHeader>{headers}</TableHeader>
        <TableBody>
          <ActionRows actions={open} onSelect={setSelectedAction} />
        </TableBody>
      </Table>

      {/* Completed — collapsible */}
      {completed.length > 0 && (
        <>
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <span className="font-semibold">Completed / Cancelled ({completed.length})</span>
            <span>{showCompleted ? "▲" : "▼"}</span>
          </Button>
          {showCompleted && (
            <Table>
              <TableHeader>{headers}</TableHeader>
              <TableBody>
                <ActionRows actions={completed} onSelect={setSelectedAction} />
              </TableBody>
            </Table>
          )}
        </>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No actions found.
        </div>
      )}

      {/* Detail sheet */}
      <ActionDetailSheet
        open={!!selectedAction}
        action={selectedAction}
        onOpenChange={(open) => { if (!open) setSelectedAction(null); }}
      />
    </div>
  );
}
