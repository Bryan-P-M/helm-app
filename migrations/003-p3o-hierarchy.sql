-- Migration 003: P3O Hierarchy — Portfolios & Programmes
-- Run in Supabase SQL Editor
-- Implements the v2 hierarchy: Portfolio → Programme → Project

-- ============================================================
-- 1. PORTFOLIOS TABLE
-- ============================================================

CREATE TABLE portfolios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,
  description     TEXT,
  director_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rag_status      TEXT NOT NULL DEFAULT 'green',
  status          TEXT NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ DEFAULT NULL,
  CONSTRAINT chk_portfolio_rag CHECK (rag_status IN ('red', 'amber', 'green')),
  CONSTRAINT chk_portfolio_status CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
  CONSTRAINT uq_portfolio_code_workspace UNIQUE (workspace_id, code)
);

CREATE INDEX idx_portfolios_workspace ON portfolios(workspace_id);

-- Updated_at trigger
CREATE TRIGGER set_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view portfolios" ON portfolios
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can create portfolios" ON portfolios
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can update portfolios" ON portfolios
  FOR UPDATE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can delete portfolios" ON portfolios
  FOR DELETE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 2. PROGRAMMES TABLE (from DIS spec §6.2)
-- ============================================================

CREATE TABLE programmes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  portfolio_id    UUID REFERENCES portfolios(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,
  description     TEXT,
  sro_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  programme_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rag_status      TEXT NOT NULL DEFAULT 'green',
  status          TEXT NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ DEFAULT NULL,
  CONSTRAINT chk_programme_rag CHECK (rag_status IN ('red', 'amber', 'green')),
  CONSTRAINT chk_programme_status CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
  CONSTRAINT uq_programme_code_workspace UNIQUE (workspace_id, code)
);

CREATE INDEX idx_programmes_workspace ON programmes(workspace_id);
CREATE INDEX idx_programmes_portfolio ON programmes(portfolio_id) WHERE portfolio_id IS NOT NULL;

-- Updated_at trigger
CREATE TRIGGER set_programmes_updated_at
  BEFORE UPDATE ON programmes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view programmes" ON programmes
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can create programmes" ON programmes
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can update programmes" ON programmes
  FOR UPDATE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can delete programmes" ON programmes
  FOR DELETE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 3. ADD HIERARCHY FKs TO EXISTING TABLES
-- ============================================================

-- Projects belong to programmes (nullable for backward compat)
ALTER TABLE projects ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
CREATE INDEX idx_projects_programme ON projects(programme_id) WHERE programme_id IS NOT NULL;

-- RAID items can belong to programmes or portfolios directly
ALTER TABLE raid_items ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
ALTER TABLE raid_items ADD COLUMN portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL;
CREATE INDEX idx_raid_programme ON raid_items(programme_id) WHERE programme_id IS NOT NULL;
CREATE INDEX idx_raid_portfolio ON raid_items(portfolio_id) WHERE portfolio_id IS NOT NULL;

-- Actions can belong to programmes or portfolios
ALTER TABLE actions ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
ALTER TABLE actions ADD COLUMN portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL;
CREATE INDEX idx_actions_programme ON actions(programme_id) WHERE programme_id IS NOT NULL;
CREATE INDEX idx_actions_portfolio ON actions(portfolio_id) WHERE portfolio_id IS NOT NULL;

-- Decisions can belong to programmes or portfolios
ALTER TABLE decisions ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
ALTER TABLE decisions ADD COLUMN portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL;
CREATE INDEX idx_decisions_programme ON decisions(programme_id) WHERE programme_id IS NOT NULL;
CREATE INDEX idx_decisions_portfolio ON decisions(portfolio_id) WHERE portfolio_id IS NOT NULL;

-- Meetings can be programme-level or portfolio-level
ALTER TABLE meetings ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
ALTER TABLE meetings ADD COLUMN portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL;
CREATE INDEX idx_meetings_programme ON meetings(programme_id) WHERE programme_id IS NOT NULL;
CREATE INDEX idx_meetings_portfolio ON meetings(portfolio_id) WHERE portfolio_id IS NOT NULL;
