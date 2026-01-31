"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Shield, Activity, Search, Filter } from "lucide-react"; // Ensure these are safe icons
import ExportCSVButton from "@/components/shared/export-csv-button";

interface AuditEntry {
  id: string;
  performed_at: string;
  performed_by: { id: string; full_name: string } | Array<{ id: string; full_name: string }>;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, { old: any; new: any }> | null;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function AuditTable({ entries }: { entries: AuditEntry[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        (entry.entity_type &&
          entry.entity_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.action &&
          entry.action.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEntityType =
        entityTypeFilter === "All" || entry.entity_type === entityTypeFilter;

      const matchesAction =
        actionFilter === "All" || entry.action === actionFilter;

      return matchesSearch && matchesEntityType && matchesAction;
    });
  }, [entries, searchTerm, entityTypeFilter, actionFilter]);

  const entityTypes = [
    "All",
    "project",
    "raid_item",
    "action",
    "decision",
    "meeting",
    "programme",
    "portfolio",
  ];
  const actions = [
    "All",
    "create",
    "update",
    "delete",
    "restore",
    "escalate",
    "link",
    "unlink",
  ];

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No audit trail entries yet. Actions will be recorded as you use the system.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by entity type or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={entityTypeFilter}
          onValueChange={setEntityTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Entity Type" />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "All" ? "All Entity Types" : type.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Action" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action} value={action}>
                {action === "All" ? "All Actions" : action.charAt(0).toUpperCase() + action.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ExportCSVButton
          data={filteredEntries.map((entry: any) => ({
            performed_at: entry.performed_at,
            performed_by: Array.isArray(entry.performed_by) ? entry.performed_by[0]?.full_name : entry.performed_by?.full_name ?? "System",
            action: entry.action,
            entity_type: entry.entity_type,
            entity_id: entry.entity_id,
            changes: entry.changes ? Object.keys(entry.changes).join(", ") : "",
          }))}
          columns={[
            { key: "performed_at", header: "When" },
            { key: "performed_by", header: "Who" },
            { key: "action", header: "Action" },
            { key: "entity_type", header: "Entity Type" },
            { key: "entity_id", header: "Entity ID" },
            { key: "changes", header: "Changes" },
          ]}
          filename="helm-audit-export"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">When</TableHead>
              <TableHead className="w-[150px]">Who</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
              <TableHead className="w-[150px]">Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Changes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => {
              const performedBy = Array.isArray(entry.performed_by)
                ? entry.performed_by[0]?.full_name
                : entry.performed_by?.full_name;

              const actionColor = () => {
                switch (entry.action) {
                  case "create":
                    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
                  case "update":
                    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
                  case "delete":
                    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
                  case "escalate":
                    return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
                  case "restore":
                    return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
                  default:
                    return "";
                }
              };

              const changesSummary = entry.changes
                ? `Updated: ${Object.keys(entry.changes).join(", ")}`
                : "—";

              return (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-muted-foreground text-sm">
                    {timeAgo(entry.performed_at)}
                  </TableCell>
                  <TableCell>{performedBy || "System"}</TableCell>
                  <TableCell>
                    <Badge className={actionColor()}>
                      {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {entry.entity_type.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {entry.entity_id.substring(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {changesSummary}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>
    </div>
  );
}
