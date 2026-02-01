"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProjectDetailSheet from "./project-detail-sheet";
import { RAG_BADGE_CLASSES } from "@/lib/constants";
import type { ProjectStatus, RagStatus, Project } from "@/lib/types";

interface ProjectWithOwner extends Project {
  owner: { id: string; email: string; full_name: string; avatar_url: string | null } | null;
}

const STATUS_OPTIONS: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const RAG_OPTIONS: RagStatus[] = ["red", "amber", "green"];

export default function ProjectsGrid({ initialProjects, workspaceId }: {
  initialProjects: ProjectWithOwner[];
  workspaceId: string;
}) {
  const [status, setStatus] = useState("all");
  const [rag, setRag] = useState("all");
  const [ownerId, setOwnerId] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectWithOwner|null>(null);
  const [search, setSearch] = useState("");

  // Exception-first sort: RED > AMBER > GREEN, then name
  const sortedProjects = useMemo(() => {
    const ragRank = { red: 1, amber: 2, green: 3 };
    return initialProjects
      .filter(p =>
        (status === "all" || p.status === status) &&
        (rag === "all" || p.rag_status === rag) &&
        (ownerId === "all" || p.owner?.id === ownerId) &&
        (!search || p.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        const rA = ragRank[a.rag_status as RagStatus] || 9;
        const rB = ragRank[b.rag_status as RagStatus] || 9;
        if (rA !== rB) return rA - rB;
        return a.name.localeCompare(b.name);
      });
  }, [initialProjects, status, rag, ownerId, search]);

  // Extract unique owners for filter dropdown
  const owners = useMemo(() => {
    const ownerMap: Record<string, { id: string; full_name: string }> = {};
    initialProjects.forEach(p => {
      if (p.owner && !ownerMap[p.owner.id]) {
        ownerMap[p.owner.id] = { id: p.owner.id, full_name: p.owner.full_name };
      }
    });
    return Object.values(ownerMap);
  }, [initialProjects]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>RAG</Label>
          <Select value={rag} onValueChange={setRag}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {RAG_OPTIONS.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Owner</Label>
          <Select value={ownerId} onValueChange={setOwnerId}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {owners.map(o => (
                <SelectItem key={o.id} value={o.id}>{o.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Search</Label>
          <Input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Project name" className="w-52" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProjects.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">No projects found.</div>
        )}
        {sortedProjects.map(project => (
          <Link key={project.id} href={"/projects/" + project.id}>
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <Badge>{project.code}</Badge>
              </div>
              <Badge className={RAG_BADGE_CLASSES[project.rag_status as RagStatus]}>{project.rag_status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Status: {project.status.replace(/_/g, " ")}</div>
              <div className="text-xs text-muted-foreground">Owner: {project.owner?.full_name ?? "Unassigned"}</div>
              <div className="text-xs">{project.start_date} — {project.target_end_date}</div>
              <div className="text-xs text-right">Updated: {new Date(project.updated_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>
      <ProjectDetailSheet project={selectedProject} open={!!selectedProject} onOpenChange={open => !open && setSelectedProject(null)} workspaceId={workspaceId} />
    </div>
  );
}
