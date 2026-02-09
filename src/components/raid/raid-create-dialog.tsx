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
import { RAID_TYPE_OPTIONS, RAG_OPTIONS, PRIORITY_OPTIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import RiskScoringForm from "./risk-scoring-form";
import { calculateRiskScores, type RiskScores } from "@/lib/risk-scoring";
import type { RaidType, RagStatus, Priority } from "@/lib/types";

import { useRouter } from "next/navigation";

export default function RaidCreateDialog({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId?: string;
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
    type: "risk" as RaidType,
    title: "",
    description: "",
    priority: "medium" as Priority,
    rag_status: "amber" as RagStatus,
    due_date: "",
    project_id: projectId ?? "",
  });

  // Risk scoring state — only used when type='risk'
  const [riskScores, setRiskScores] = useState<RiskScores>(
    () => calculateRiskScores(3, 3, 0) // sensible defaults: Possible × Moderate, no mitigation
  );

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      // Build the insert payload — include scoring fields only for risks
      const insertData: Record<string, unknown> = {
        workspace_id: workspaceId,
        project_id: form.project_id || null,
        type: form.type,
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        rag_status: form.type === "risk" ? riskScores.auto_rag : form.rag_status,
        due_date: form.due_date || null,
        status: "open",
        source_level: "project",
      };

      if (form.type === "risk") {
        insertData.likelihood_score = riskScores.likelihood_score;
        insertData.impact_score = riskScores.impact_score;
        insertData.inherent_risk_score = riskScores.inherent_risk_score;
        insertData.mitigation_score = riskScores.mitigation_score;
        insertData.residual_risk_score = riskScores.residual_risk_score;
      }

      const { error: insertError } = await supabase
        .from("raid_items")
        .insert([insertData]);

      if (insertError) throw insertError;

      setOpen(false);
      setForm({ type: "risk", title: "", description: "", priority: "medium", rag_status: "amber", due_date: "", project_id: "" });
      // Refresh page to show new item
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create RAID item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New RAID Item</DialogTitle>
        </DialogHeader>
        <form className="space-y-3 py-2" onSubmit={handleSubmit}>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as RaidType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {RAID_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
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
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          </div>
          <div className={`grid gap-3 ${form.type !== "risk" ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Priority }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* RAG Status — hidden for risks (auto-computed from score) */}
            {form.type !== "risk" && (
              <div>
                <Label>RAG Status</Label>
                <Select value={form.rag_status} onValueChange={(v) => setForm((f) => ({ ...f, rag_status: v as RagStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RAG_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {/* Risk scoring panel — only shown when creating a Risk item */}
          {form.type === "risk" && (
            <RiskScoringForm
              likelihood={riskScores.likelihood_score}
              impact={riskScores.impact_score}
              mitigation={riskScores.mitigation_score}
              onChange={setRiskScores}
            />
          )}
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} />
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
