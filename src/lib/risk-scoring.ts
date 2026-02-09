// ============================================================
// Helm v1 — Risk Scoring Utilities (HP-56)
// Pure calculation functions for 5×5 P×I risk matrix.
// ============================================================

import type { RagStatus } from "@/lib/types";

// ── Scale Labels ──
// Human-readable labels for each numeric score value.

export const LIKELIHOOD_SCALE = [
  { value: 1, label: "Rare" },
  { value: 2, label: "Unlikely" },
  { value: 3, label: "Possible" },
  { value: 4, label: "Likely" },
  { value: 5, label: "Almost Certain" },
] as const;

export const IMPACT_SCALE = [
  { value: 1, label: "Negligible" },
  { value: 2, label: "Minor" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Major" },
  { value: 5, label: "Severe" },
] as const;

export const MITIGATION_SCALE = [
  { value: 0, label: "None" },
  { value: 1, label: "Weak" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Strong" },
  { value: 4, label: "Very Strong" },
] as const;

// ── Calculation Functions ──

/**
 * Inherent Risk = Likelihood × Impact
 * Range: 1–25 (before any mitigation is applied)
 */
export function calcInherentRisk(likelihood: number, impact: number): number {
  return likelihood * impact;
}

/**
 * Residual Risk = max(1, Inherent - (Mitigation × 2))
 * The mitigation multiplier of 2 means each mitigation level
 * reduces the score by 2 points. Floor is 1 (risk never reaches 0).
 */
export function calcResidualRisk(
  inherentRisk: number,
  mitigation: number
): number {
  return Math.max(1, inherentRisk - mitigation * 2);
}

/**
 * Auto-RAG converts a numeric risk score into Red/Amber/Green:
 *   Red:   16–25 (high risk — needs immediate attention)
 *   Amber:  8–15 (moderate risk — monitor closely)
 *   Green:  1–7  (low risk — acceptable)
 */
export function scoreToRag(score: number): RagStatus {
  if (score >= 16) return "red";
  if (score >= 8) return "amber";
  return "green";
}

// ── Combined Calculation ──

export interface RiskScores {
  likelihood_score: number;
  impact_score: number;
  inherent_risk_score: number;
  mitigation_score: number;
  residual_risk_score: number;
  /** Auto-computed RAG from residual risk */
  auto_rag: RagStatus;
}

/**
 * Calculate all risk scores from the three input values.
 * This is the main function UI components should call.
 */
export function calculateRiskScores(
  likelihood: number,
  impact: number,
  mitigation: number
): RiskScores {
  const inherent = calcInherentRisk(likelihood, impact);
  const residual = calcResidualRisk(inherent, mitigation);
  return {
    likelihood_score: likelihood,
    impact_score: impact,
    inherent_risk_score: inherent,
    mitigation_score: mitigation,
    residual_risk_score: residual,
    auto_rag: scoreToRag(residual),
  };
}

// ── Display Helpers ──

/** Get the label for a likelihood score (e.g. 3 → "Possible") */
export function likelihoodLabel(score: number): string {
  return LIKELIHOOD_SCALE.find((s) => s.value === score)?.label ?? `${score}`;
}

/** Get the label for an impact score (e.g. 4 → "Major") */
export function impactLabel(score: number): string {
  return IMPACT_SCALE.find((s) => s.value === score)?.label ?? `${score}`;
}

/** Get the label for a mitigation score (e.g. 2 → "Moderate") */
export function mitigationLabel(score: number): string {
  return MITIGATION_SCALE.find((s) => s.value === score)?.label ?? `${score}`;
}
