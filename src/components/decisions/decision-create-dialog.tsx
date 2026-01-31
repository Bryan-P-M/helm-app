"use client";

import { useState } from "react";
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
import { DECISION_STATUS_LABELS } from "@/lib/constants";
import type { DecisionStatus } from "@/lib/types";

export default function DecisionCreateDialog({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    rationale: "",
    status: "draft" as DecisionStatus,
    decision_date: "",
    project_id: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title || !form.description) {
      setError("Title and description are required.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("decisions")
        .insert([{
          workspace_id: workspaceId,
          title: form.title,
          description: form.description,
          rationale: form.rationale || null,
          status: form.status,
          decision_date: form.decision_date || new Date().toISOString().slice(0, 10),
          project_id: form.project_id || null,
        }]);

      if (insertError) throw insertError;

      setOpen(false);
      setForm({
        title: "", description: "", rationale: "",
        status: "draft", decision_date: "", project_id: "",
      });
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to create decision.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Decision</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Decision</DialogTitle>
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
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              required
              placeholder="What was decided?"
            />
          </div>
          <div>
            <Label>Rationale</Label>
            <Textarea
              value={form.rationale}
              onChange={(e) => setForm((f) => ({ ...f, rationale: e.target.value }))}
              rows={2}
              placeholder="Why was this decided?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as DecisionStatus }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DECISION_STATUS_LABELS).map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Decision Date</Label>
              <Input
                type="date"
                value={form.decision_date}
                onChange={(e) => setForm((f) => ({ ...f, decision_date: e.target.value }))}
              />
            </div>
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
