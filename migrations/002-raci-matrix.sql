-- Migration 002: RACI Matrix
-- Run in Supabase SQL Editor

-- RACI assignment types
CREATE TYPE raci_role AS ENUM ('responsible', 'accountable', 'consulted', 'informed');

-- RACI assignments table
CREATE TABLE raci_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- What the RACI is for (polymorphic: action, raid_item, decision, or custom deliverable)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('action', 'raid_item', 'decision', 'deliverable')),
  entity_id UUID,                    -- FK to the specific entity (nullable for custom deliverables)
  deliverable_name TEXT,             -- For custom deliverables not tied to existing entities
  
  -- Who is assigned
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- The RACI role
  role raci_role NOT NULL,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_id UUID REFERENCES profiles(id),
  
  -- Prevent duplicate assignments (same person, same role, same entity)
  UNIQUE (entity_type, entity_id, user_id, role),
  
  -- Either entity_id or deliverable_name must be set
  CHECK (entity_id IS NOT NULL OR deliverable_name IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_raci_workspace ON raci_assignments(workspace_id);
CREATE INDEX idx_raci_project ON raci_assignments(project_id);
CREATE INDEX idx_raci_entity ON raci_assignments(entity_type, entity_id);
CREATE INDEX idx_raci_user ON raci_assignments(user_id);

-- Updated_at trigger
CREATE TRIGGER set_raci_updated_at
  BEFORE UPDATE ON raci_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE raci_assignments ENABLE ROW LEVEL SECURITY;

-- Workspace members can read RACI for their workspace
CREATE POLICY "Members can view RACI" ON raci_assignments
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Workspace members can insert RACI for their workspace
CREATE POLICY "Members can create RACI" ON raci_assignments
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Workspace members can update RACI for their workspace
CREATE POLICY "Members can update RACI" ON raci_assignments
  FOR UPDATE USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Workspace members can delete RACI for their workspace
CREATE POLICY "Members can delete RACI" ON raci_assignments
  FOR DELETE USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );
