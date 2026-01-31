"use client";

import { useMemo, useState } from "react";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectItem, SelectTrigger, SelectContent, SelectValue,
} from "@/components/ui/select";
import RaidDetailSheet from "./raid-detail-sheet";
import {
  RAG_BADGE_CLASSES, RAID_TYPE_LABELS, RAID_TYPE_SHORT, RAID_TYPE_BADGE_CLASSES,
  RAID_STATUS_LABELS, RAID_STATUS_OPTIONS, RAG_OPTIONS, RAID_TYPE_OPTIONS,
  PRIORITY_BADGE_CLASSES,
} from "@/lib/constants";
import type { RaidItemWithOwner, RaidType, RaidStatus, RagStatus } from "@/lib/types";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

function raidIdPrefix(type: string) {
  return RAID_TYPE_SHORT[type as RaidType] ?? type.charAt(0).toUpperCase();
}

interface Filters {
  type?: string;
  status?: string;
  rag_status?: string;
  showAll: boolean;
}

export default function RaidTable({
  initialItems,
  workspaceId,
}: {
  initialItems: RaidItemWithOwner[];
  workspaceId: string;
}) {
  const [items] = useState(initialItems);
  const [filters, setFilters] = useState<Filters>({ showAll: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<RaidItemWithOwner | null>(null);

  const filteredItems = useMemo(() => {
    let arr = [...items];

    // Exception-first: hide green unless showAll
    if (!filters.showAll) {
      arr = arr.filter((item) => item.rag_status === "red" || item.rag_status === "amber");
    }
    if (filters.type) arr = arr.filter((it) => it.type === filters.type);
    if (filters.status) arr = arr.filter((it) => it.status === filters.status);
    if (filters.rag_status) arr = arr.filter((it) => it.rag_status === filters.rag_status);

    arr.sort((a, b) => {
      const va = (a as any)[sortBy] ?? "";
      const vb = (b as any)[sortBy] ?? "";
      if (va === vb) return 0;
      return va > vb ? (sortDir === "asc" ? 1 : -1) : (sortDir === "asc" ? -1 : 1);
    });

    return arr;
  }, [items, filters, sortBy, sortDir]);

  const greenCount = items.filter((i) => i.rag_status === "green").length;

  function handleSort(col: string) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  }

  function isOverdue(dueDate: string | null, status: string) {
    if (!dueDate || status === "closed" || status === "resolved") return false;
    return new Date(dueDate) < new Date();
  }

  return (
    <div>
      {/* Exception Banner */}
      <div className="mb-3 flex items-center gap-2 bg-muted px-3 py-2 rounded border text-sm">
        <span>
          Showing <b>{filteredItems.length}</b> of <b>{items.length}</b> items
          {greenCount > 0 && !filters.showAll && (
            <> (<span className="text-green-500 font-semibold">{greenCount}</span> on track — hidden)</>
          )}
        </span>
        {greenCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setFilters((f) => ({ ...f, showAll: !f.showAll }))} className="h-7">
            {filters.showAll ? "Hide Green" : "Show All"}
          </Button>
        )}
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button variant="outline" size="sm" onClick={() => setFilterOpen((o) => !o)}>
          Filters
        </Button>
      </div>

      {filterOpen && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 items-end bg-card p-3 border rounded-lg">
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={filters.type ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, type: v === "all" ? undefined : v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {RAID_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={filters.status ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "all" ? undefined : v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {RAID_STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">RAG</Label>
            <Select value={filters.rag_status ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, rag_status: v === "all" ? undefined : v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {RAG_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFilters({ showAll: filters.showAll })}>Clear Filters</Button>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer w-[80px]" onClick={() => handleSort("id")}>ID</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>Title</TableHead>
              <TableHead className="cursor-pointer w-[100px]" onClick={() => handleSort("status")}>Status</TableHead>
              <TableHead className="w-[60px]">RAG</TableHead>
              <TableHead className="w-[120px]">Owner</TableHead>
              <TableHead className="cursor-pointer w-[100px]" onClick={() => handleSort("due_date")}>Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No RAID items found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const overdue = isOverdue(item.due_date, item.status);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(item)}>
                    <TableCell className="font-mono text-xs">
                      {raidIdPrefix(item.type)}-{String(item.id).slice(-4)}
                    </TableCell>
                    <TableCell>
                      <Badge className={RAID_TYPE_BADGE_CLASSES[item.type]}>{RAID_TYPE_LABELS[item.type]}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[16rem] truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{RAID_STATUS_LABELS[item.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={RAG_BADGE_CLASSES[item.rag_status]}>{item.rag_status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {(item as any).owner?.full_name ?? <span className="text-muted-foreground">Unassigned</span>}
                    </TableCell>
                    <TableCell>
                      {item.due_date ? (
                        <span className={overdue ? "text-destructive font-semibold flex items-center gap-1" : "text-sm"}>
                          {new Date(item.due_date).toISOString().slice(0, 10)}
                          {overdue && <ExclamationTriangleIcon className="h-3.5 w-3.5" />}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <RaidDetailSheet open={!!selected} item={selected} onOpenChange={(val) => !val && setSelected(null)} />
    </div>
  );
}
