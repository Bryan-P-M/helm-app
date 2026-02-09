-- Migration 005: Risk Scoring Matrix for RAID items (type='risk')
-- Run in Supabase SQL Editor
-- HP-56: 5×5 Probability × Impact with Mitigation Effectiveness

-- ============================================================
-- 1. ADD SCORING COLUMNS TO raid_items
-- ============================================================
-- These columns are only meaningful when type = 'risk'.
-- CHECK constraints use the pattern: type != 'risk' OR <condition>
-- This means non-risk rows can have NULLs, but risk rows must
-- satisfy the range constraint when values are provided.

ALTER TABLE raid_items
  ADD COLUMN likelihood_score    INTEGER
    CHECK (type != 'risk' OR likelihood_score BETWEEN 1 AND 5),
  ADD COLUMN impact_score        INTEGER
    CHECK (type != 'risk' OR impact_score BETWEEN 1 AND 5),
  ADD COLUMN inherent_risk_score INTEGER
    CHECK (type != 'risk' OR inherent_risk_score BETWEEN 1 AND 25),
  ADD COLUMN mitigation_score    INTEGER
    CHECK (type != 'risk' OR mitigation_score BETWEEN 0 AND 4),
  ADD COLUMN residual_risk_score INTEGER
    CHECK (type != 'risk' OR residual_risk_score BETWEEN 1 AND 25),
  ADD COLUMN urgency_flag        TEXT
    CHECK (urgency_flag IN ('Low', 'Medium', 'High')),
  ADD COLUMN escalation_level    TEXT
    CHECK (escalation_level IN ('Project', 'Programme', 'Portfolio', 'Board')),
  ADD COLUMN trend               TEXT
    CHECK (trend IN ('Improving', 'Stable', 'Deteriorating')),
  ADD COLUMN review_date         DATE;

-- ============================================================
-- 2. INDEXES FOR RISK-SPECIFIC QUERIES
-- ============================================================

-- Fast lookup: all risks by residual score (for dashboards/heatmaps)
CREATE INDEX idx_raid_risk_residual
  ON raid_items (residual_risk_score DESC)
  WHERE type = 'risk' AND deleted_at IS NULL;

-- Fast lookup: risks needing review
CREATE INDEX idx_raid_risk_review
  ON raid_items (review_date)
  WHERE type = 'risk' AND deleted_at IS NULL AND review_date IS NOT NULL;

-- ============================================================
-- 3. COMMENTS (for documentation in Supabase)
-- ============================================================

COMMENT ON COLUMN raid_items.likelihood_score IS '1-5: Rare, Unlikely, Possible, Likely, Almost Certain';
COMMENT ON COLUMN raid_items.impact_score IS '1-5: Negligible, Minor, Moderate, Major, Severe';
COMMENT ON COLUMN raid_items.inherent_risk_score IS 'likelihood × impact (1-25), computed by app';
COMMENT ON COLUMN raid_items.mitigation_score IS '0-4: None, Weak, Moderate, Strong, Very Strong';
COMMENT ON COLUMN raid_items.residual_risk_score IS 'max(1, inherent - mitigation×2), computed by app';
COMMENT ON COLUMN raid_items.urgency_flag IS 'Manual urgency: Low, Medium, High';
COMMENT ON COLUMN raid_items.escalation_level IS 'Governance tier: Project, Programme, Portfolio, Board';
COMMENT ON COLUMN raid_items.trend IS 'Direction: Improving, Stable, Deteriorating';
COMMENT ON COLUMN raid_items.review_date IS 'Next scheduled review date';
