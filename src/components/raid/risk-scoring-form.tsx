"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RAG_BADGE_CLASSES } from "@/lib/constants";
import {
  LIKELIHOOD_SCALE,
  IMPACT_SCALE,
  MITIGATION_SCALE,
  calculateRiskScores,
  type RiskScores,
} from "@/lib/risk-scoring";

/**
 * Risk scoring input panel with live-calculated scores.
 *
 * Shows three select dropdowns (Likelihood, Impact, Mitigation) and
 * displays the computed Inherent Risk, Residual Risk, and auto-RAG badge
 * in real time as the user adjusts values.
 *
 * The parent component controls the values via onChange callback.
 */
export default function RiskScoringForm({
  likelihood,
  impact,
  mitigation,
  onChange,
}: {
  likelihood: number;
  impact: number;
  mitigation: number;
  onChange: (scores: RiskScores) => void;
}) {
  // Recalculate whenever any input changes
  const scores = useMemo(
    () => calculateRiskScores(likelihood, impact, mitigation),
    [likelihood, impact, mitigation]
  );

  function handleChange(field: "likelihood" | "impact" | "mitigation", value: number) {
    const l = field === "likelihood" ? value : likelihood;
    const i = field === "impact" ? value : impact;
    const m = field === "mitigation" ? value : mitigation;
    onChange(calculateRiskScores(l, i, m));
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Risk Scoring
      </div>

      {/* Input selects — laid out in a 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Likelihood</Label>
          <Select
            value={String(likelihood)}
            onValueChange={(v) => handleChange("likelihood", Number(v))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LIKELIHOOD_SCALE.map((s) => (
                <SelectItem key={s.value} value={String(s.value)}>
                  {s.value} – {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Impact</Label>
          <Select
            value={String(impact)}
            onValueChange={(v) => handleChange("impact", Number(v))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {IMPACT_SCALE.map((s) => (
                <SelectItem key={s.value} value={String(s.value)}>
                  {s.value} – {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Mitigation</Label>
          <Select
            value={String(mitigation)}
            onValueChange={(v) => handleChange("mitigation", Number(v))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MITIGATION_SCALE.map((s) => (
                <SelectItem key={s.value} value={String(s.value)}>
                  {s.value} – {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Computed scores display */}
      <div className="flex items-center gap-4 rounded-md border bg-muted/50 px-3 py-2 text-sm">
        <div>
          <span className="text-muted-foreground">Inherent: </span>
          <span className="font-semibold">{scores.inherent_risk_score}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Residual: </span>
          <span className="font-semibold">{scores.residual_risk_score}</span>
        </div>
        <Badge className={RAG_BADGE_CLASSES[scores.auto_rag]}>
          {scores.auto_rag.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}
