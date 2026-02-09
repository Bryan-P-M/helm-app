"use client";

import { Badge } from "@/components/ui/badge";
import { RAG_BADGE_CLASSES } from "@/lib/constants";
import { scoreToRag } from "@/lib/risk-scoring";
import type { RagStatus } from "@/lib/types";

/**
 * Compact badge showing the residual risk score with auto-RAG colouring.
 * Used in table rows and detail views.
 *
 * Example output: a badge showing "12" in amber colouring.
 */
export default function RiskScoreBadge({
  score,
  className,
}: {
  score: number | null | undefined;
  className?: string;
}) {
  if (score == null) return <span className="text-muted-foreground text-xs">–</span>;

  const rag: RagStatus = scoreToRag(score);

  return (
    <Badge className={`${RAG_BADGE_CLASSES[rag]} ${className ?? ""}`}>
      {score}
    </Badge>
  );
}
