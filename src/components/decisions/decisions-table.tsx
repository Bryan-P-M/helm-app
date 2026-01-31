"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
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
import DecisionDetailSheet from "./decision-detail-sheet";
import { DECISION_STATUS_LABELS } from "@/lib/constants";
import type { DecisionWithDetails, DecisionStatus } from "@/lib/types";

const STATUS_BADGE_CLASSES: Record<DecisionStatus, string> = {
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-green-600/10 text-green-600 border-green-600/20",
  superseded: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  withdrawn: "bg-red-600/10 text-red-600 border-red-600/20",
};

interface DecisionsTableProps {
  initialDecisions: DecisionWithDetails[];
}

export default function DecisionsTable({ initialDecisions }: DecisionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<DecisionWithDetails | null>(null);

  const filtered = useMemo(() => {
    return initialDecisions.filter((d) => {
      if (statusFilter && statusFilter !== "__all__" && d.status !== statusFilter) return false;
      if (searchFilter && !d.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      return true;
    });
  }, [initialDecisions, statusFilter, searchFilter]);

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
              {Object.entries(DECISION_STATUS_LABELS).map(([v, label]) => (
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No decisions found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Made By</TableHead>
              <TableHead>Meeting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow
                key={d.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedDecision(d)}
              >
                <TableCell className="font-medium">{d.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_BADGE_CLASSES[d.status]}>
                    {DECISION_STATUS_LABELS[d.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {d.decision_date ? format(parseISO(d.decision_date), "dd MMM yyyy") : "—"}
                </TableCell>
                <TableCell>{d.project?.name ?? <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>
                  {d.made_by ? (
                    <span className="text-sm">{d.made_by.full_name}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {d.meeting?.title ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Detail sheet */}
      <DecisionDetailSheet
        open={!!selectedDecision}
        decision={selectedDecision}
        onOpenChange={(open) => { if (!open) setSelectedDecision(null); }}
      />
    </div>
  );
}
