"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { ProjectStatus, RagStatus, Project } from "@/lib/types";

interface ProjectWithOwner extends Project {
  owner: { id: string; email: string; full_name: string; avatar_url: string | null } | null;
  raidItems?: any[];
  actions?: any[];
}

const STATUS_OPTIONS: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const RAG_OPTIONS: RagStatus[] = ["red", "amber", "green"];

export default function ProjectDetailSheet({ project, open, onOpenChange, workspaceId }: {
  project: ProjectWithOwner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}) {
  const [form, setForm] = useState(project);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!form) return null;

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("projects").update({
      name: form.name,
      code: form.code,
      description: form.description,
      status: form.status,
      rag_status: form.rag_status,
      owner_id: form.owner?.id,
      start_date: form.start_date,
      target_end_date: form.target_end_date
    }).eq("id", form.id);
    setLoading(false);
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Name" required />
          <Input value={form.code} onChange={e => handleChange("code", e.target.value)} placeholder="Code" required />
          <Input value={form.description || ""} onChange={e => handleChange("description", e.target.value)} placeholder="Description" />
          <label>Status
            <select value={form.status} onChange={e => handleChange("status", e.target.value)} className="block mt-1">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </label>
          <label>RAG
            <select value={form.rag_status} onChange={e => handleChange("rag_status", e.target.value)} className="block mt-1">
              {RAG_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <Input value={form.start_date || ""} onChange={e => handleChange("start_date", e.target.value)} type="date" placeholder="Start Date" />
          <Input value={form.target_end_date || ""} onChange={e => handleChange("target_end_date", e.target.value)} type="date" placeholder="Target End Date" />
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
