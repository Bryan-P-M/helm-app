"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { ProjectStatus, RagStatus } from "@/lib/types";

const STATUS_OPTIONS: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const RAG_OPTIONS: RagStatus[] = ["red", "amber", "green"];

export default function ProjectCreateDialog({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "active",
    rag_status: "amber",
    owner_id: "",
    start_date: "",
    target_end_date: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("projects").insert({
      ...form,
      workspace_id: workspaceId
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Name" required />
          <Input value={form.code} onChange={e => handleChange("code", e.target.value)} placeholder="Code" required />
          <Input value={form.description} onChange={e => handleChange("description", e.target.value)} placeholder="Description" />
          <label>Status
            <select value={form.status} onChange={e => handleChange("status", e.target.value)} className="block mt-1">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </label>
          <label>RAG
            <select value={form.rag_status} onChange={e => handleChange("rag_status", e.target.value)} className="block mt-1">
              {RAG_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <Input value={form.owner_id} onChange={e => handleChange("owner_id", e.target.value)} placeholder="Owner ID (optional)" />
          <Input value={form.start_date} onChange={e => handleChange("start_date", e.target.value)} type="date" placeholder="Start Date" />
          <Input value={form.target_end_date} onChange={e => handleChange("target_end_date", e.target.value)} type="date" placeholder="Target End Date" />
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Project"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
