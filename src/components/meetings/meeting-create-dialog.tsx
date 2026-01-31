"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectItem, SelectContent, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { MeetingStatus } from "@/lib/types";

export default function MeetingCreateDialog({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [projects, setProjects] = useState<{ id: string; name: string; code: string }[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("id, name, code")
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null)
        .order("name");
      setProjects(data ?? []);
    }
    loadProjects();
  }, [workspaceId]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    meeting_date: "",
    location: "",
    notes: "",
    project_id: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title || !form.meeting_date) {
      setError("Title and date are required.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("meetings")
        .insert([{
          workspace_id: workspaceId,
          title: form.title,
          meeting_date: form.meeting_date,
          location: form.location || null,
          notes: form.notes || null,
          project_id: form.project_id || null,
          status: "scheduled" as MeetingStatus,
        }]);

      if (insertError) throw insertError;

      setOpen(false);
      setForm({ title: "", meeting_date: "", location: "", notes: "", project_id: "" });
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to create meeting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Meeting</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Meeting</DialogTitle>
        </DialogHeader>
        <form className="space-y-3 py-2" onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={form.meeting_date}
              onChange={(e) => setForm((f) => ({ ...f, meeting_date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Room, Teams link, etc."
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label>Project</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm((f) => ({ ...f, project_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Select project..." /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
