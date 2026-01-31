-- ============================================================
-- Helm v1 Database Schema — Full Deployment Script
-- Target: Supabase (PostgreSQL 15+)
-- Source: docs/v1-database-schema.md (APPROVED)
--
-- Run this script against a fresh Supabase project.
-- Includes: Extensions, Tables, Indexes, RLS, Triggers, Seed Data
-- ============================================================

-- ============================================================
-- 0. EXTENSIONS & PREREQUISITES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "moddatetime";    -- Auto-update updated_at
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram search for text filtering


-- ============================================================
-- 1. TABLES
-- ============================================================

-- ── PROFILES ──
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  job_title     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ          DEFAULT NULL
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_profiles_email ON profiles (email);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users. One row per authenticated user.';


-- ── WORKSPACES ──
CREATE TABLE workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  logo_url      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ          DEFAULT NULL
);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_workspaces_slug ON workspaces (slug) WHERE deleted_at IS NULL;

COMMENT ON TABLE workspaces IS 'Multi-tenant workspace container. All business entities belong to a workspace.';


-- ── WORKSPACE MEMBERS ──
CREATE TABLE workspace_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_workspace_member_role CHECK (role IN ('admin', 'member')),
  CONSTRAINT uq_workspace_member UNIQUE (workspace_id, user_id)
);

CREATE TRIGGER workspace_members_updated_at
  BEFORE UPDATE ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_workspace_members_user ON workspace_members (user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members (workspace_id);

COMMENT ON TABLE workspace_members IS 'Maps users to workspaces with role. A user can belong to multiple workspaces.';


-- ── PROJECTS ──
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  owner_id      UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  code          TEXT NOT NULL,
  description   TEXT,
  rag_status    TEXT NOT NULL DEFAULT 'green',
  status        TEXT NOT NULL DEFAULT 'active',
  start_date    DATE,
  target_end_date DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ          DEFAULT NULL,
  CONSTRAINT chk_project_rag CHECK (rag_status IN ('red', 'amber', 'green')),
  CONSTRAINT chk_project_status CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
  CONSTRAINT uq_project_code_workspace UNIQUE (workspace_id, code)
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_projects_workspace ON projects (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_owner ON projects (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_rag ON projects (workspace_id, rag_status) WHERE deleted_at IS NULL;

COMMENT ON TABLE projects IS 'Project entity. v1: flat under workspace. v2: nested under programmes.';


-- ── RAID ITEMS ──
CREATE TABLE raid_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  status              TEXT NOT NULL DEFAULT 'open',
  rag_status          TEXT NOT NULL DEFAULT 'green',
  owner_id            UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  due_date            DATE,
  priority            TEXT NOT NULL DEFAULT 'medium',
  created_by_id       UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  source_level        TEXT NOT NULL DEFAULT 'project',
  is_escalated        BOOLEAN NOT NULL DEFAULT FALSE,
  escalated_from_id   UUID         REFERENCES raid_items(id) ON DELETE SET NULL,
  escalation_note     TEXT,
  impact              TEXT         CHECK (impact IN ('low', 'medium', 'high', 'critical') OR impact IS NULL),
  likelihood          TEXT         CHECK (likelihood IN ('low', 'medium', 'high', 'very_high') OR likelihood IS NULL),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at          TIMESTAMPTZ          DEFAULT NULL,
  CONSTRAINT chk_raid_type CHECK (type IN ('risk', 'assumption', 'issue', 'dependency')),
  CONSTRAINT chk_raid_status CHECK (status IN ('open', 'mitigating', 'resolved', 'closed', 'escalated')),
  CONSTRAINT chk_raid_rag CHECK (rag_status IN ('red', 'amber', 'green')),
  CONSTRAINT chk_raid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT chk_raid_source_level CHECK (source_level IN ('project', 'programme', 'portfolio'))
);

CREATE TRIGGER raid_items_updated_at
  BEFORE UPDATE ON raid_items
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_raid_workspace ON raid_items (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_project ON raid_items (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_type ON raid_items (workspace_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_status ON raid_items (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_rag ON raid_items (workspace_id, rag_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_owner ON raid_items (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_due_date ON raid_items (due_date) WHERE deleted_at IS NULL AND status NOT IN ('resolved', 'closed');
CREATE INDEX idx_raid_escalated_from ON raid_items (escalated_from_id) WHERE escalated_from_id IS NOT NULL;
CREATE INDEX idx_raid_project_type_status ON raid_items (project_id, type, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_exceptions ON raid_items (workspace_id, rag_status, status)
  WHERE deleted_at IS NULL AND rag_status IN ('red', 'amber') AND status NOT IN ('resolved', 'closed');

COMMENT ON TABLE raid_items IS 'RAID register: Risks, Assumptions, Issues, Dependencies. Core governance entity with escalation support.';


-- ── RAID ITEM LINKS ──
CREATE TABLE raid_item_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  source_item_id  UUID NOT NULL REFERENCES raid_items(id) ON DELETE CASCADE,
  target_item_id  UUID NOT NULL REFERENCES raid_items(id) ON DELETE CASCADE,
  link_type       TEXT NOT NULL DEFAULT 'related',
  description     TEXT,
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_link_type CHECK (link_type IN ('dependency', 'related', 'duplicate', 'blocks', 'blocked_by')),
  CONSTRAINT chk_no_self_link CHECK (source_item_id != target_item_id),
  CONSTRAINT uq_raid_link UNIQUE (source_item_id, target_item_id, link_type)
);

CREATE INDEX idx_raid_links_source ON raid_item_links (source_item_id);
CREATE INDEX idx_raid_links_target ON raid_item_links (target_item_id);
CREATE INDEX idx_raid_links_workspace ON raid_item_links (workspace_id);

COMMENT ON TABLE raid_item_links IS 'Relationships between RAID items. Enables cross-project dependency tracking.';


-- ── MEETINGS ──
CREATE TABLE meetings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  meeting_date    TIMESTAMPTZ NOT NULL,
  location        TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled',
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ          DEFAULT NULL,
  CONSTRAINT chk_meeting_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'archived'))
);

CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_meetings_workspace ON meetings (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_project ON meetings (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_date ON meetings (meeting_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_status ON meetings (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_upcoming ON meetings (meeting_date)
  WHERE deleted_at IS NULL AND status = 'scheduled' AND meeting_date >= now();

COMMENT ON TABLE meetings IS 'Governance meetings. v1: manual capture. v2: AI-assisted extraction.';


-- ── MEETING ATTENDEES ──
CREATE TABLE meeting_attendees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'attendee',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_attendee_role CHECK (role IN ('chair', 'attendee', 'presenter', 'observer')),
  CONSTRAINT uq_meeting_attendee UNIQUE (meeting_id, user_id)
);

CREATE INDEX idx_meeting_attendees_meeting ON meeting_attendees (meeting_id);
CREATE INDEX idx_meeting_attendees_user ON meeting_attendees (user_id);

COMMENT ON TABLE meeting_attendees IS 'Meeting participation. Role indicates chair/attendee/presenter/observer.';


-- ── DECISIONS ──
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  rationale       TEXT,
  status          TEXT NOT NULL DEFAULT 'approved',
  decision_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  meeting_id      UUID         REFERENCES meetings(id) ON DELETE SET NULL,
  made_by_id      UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ          DEFAULT NULL,
  CONSTRAINT chk_decision_status CHECK (status IN ('draft', 'approved', 'superseded', 'withdrawn'))
);

CREATE TRIGGER decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_decisions_workspace ON decisions (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_project ON decisions (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_meeting ON decisions (meeting_id) WHERE meeting_id IS NOT NULL;
CREATE INDEX idx_decisions_date ON decisions (decision_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_status ON decisions (workspace_id, status) WHERE deleted_at IS NULL;

COMMENT ON TABLE decisions IS 'Decision log. Historical records linked to meetings and resulting actions.';


-- ── DECISION PARTICIPANTS ──
CREATE TABLE decision_participants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id   UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'participant',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_participant_role CHECK (role IN ('decider', 'participant', 'consulted', 'informed')),
  CONSTRAINT uq_decision_participant UNIQUE (decision_id, user_id)
);

CREATE INDEX idx_decision_participants_decision ON decision_participants (decision_id);
CREATE INDEX idx_decision_participants_user ON decision_participants (user_id);

COMMENT ON TABLE decision_participants IS 'Who participated in a decision and in what capacity.';


-- ── ACTIONS ──
CREATE TABLE actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  owner_id              UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  due_date              DATE,
  status                TEXT NOT NULL DEFAULT 'open',
  priority              TEXT NOT NULL DEFAULT 'medium',
  source_type           TEXT NOT NULL DEFAULT 'manual',
  source_meeting_id     UUID         REFERENCES meetings(id) ON DELETE SET NULL,
  source_raid_item_id   UUID         REFERENCES raid_items(id) ON DELETE SET NULL,
  source_decision_id    UUID         REFERENCES decisions(id) ON DELETE SET NULL,
  created_by_id         UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at          TIMESTAMPTZ          DEFAULT NULL,
  deleted_at            TIMESTAMPTZ          DEFAULT NULL,
  CONSTRAINT chk_action_status CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled', 'blocked')),
  CONSTRAINT chk_action_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT chk_action_source_type CHECK (source_type IN ('manual', 'meeting', 'raid', 'decision'))
);

CREATE TRIGGER actions_updated_at
  BEFORE UPDATE ON actions
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX idx_actions_workspace ON actions (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_project ON actions (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_owner ON actions (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_status ON actions (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_due_date ON actions (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_actions_source_meeting ON actions (source_meeting_id) WHERE source_meeting_id IS NOT NULL;
CREATE INDEX idx_actions_source_raid ON actions (source_raid_item_id) WHERE source_raid_item_id IS NOT NULL;
CREATE INDEX idx_actions_source_decision ON actions (source_decision_id) WHERE source_decision_id IS NOT NULL;
CREATE INDEX idx_actions_my_overdue ON actions (owner_id, due_date)
  WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_actions_overdue ON actions (workspace_id, due_date, status)
  WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');

COMMENT ON TABLE actions IS 'Action register. Every action tracks its source (meeting, RAID item, decision, or manual).';


-- ── AUDIT LOG ──
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,
  changes         JSONB,
  metadata        JSONB,
  performed_by_id UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_audit_action CHECK (action IN ('create', 'update', 'delete', 'restore', 'escalate', 'link', 'unlink'))
);

CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_workspace ON audit_log (workspace_id);
CREATE INDEX idx_audit_performed_by ON audit_log (performed_by_id);
CREATE INDEX idx_audit_performed_at ON audit_log (performed_at DESC);
CREATE INDEX idx_audit_workspace_type ON audit_log (workspace_id, entity_type, performed_at DESC);

COMMENT ON TABLE audit_log IS 'Immutable audit trail. Every state change across all entities is logged here.';


-- ============================================================
-- 2. RLS HELPER FUNCTIONS
-- ============================================================

-- Check if current user is a member of a workspace
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
  )
$$;

-- Check if current user is an admin of a workspace
CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- Get all workspace IDs the current user belongs to
CREATE OR REPLACE FUNCTION user_workspace_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT workspace_id FROM workspace_members
  WHERE user_id = auth.uid()
$$;


-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_item_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──
CREATE POLICY profiles_select ON profiles
  FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ── Workspaces ──
CREATE POLICY workspaces_select ON workspaces
  FOR SELECT USING (id IN (SELECT user_workspace_ids()));
CREATE POLICY workspaces_update ON workspaces
  FOR UPDATE USING (is_workspace_admin(id)) WITH CHECK (is_workspace_admin(id));

-- ── Workspace Members ──
CREATE POLICY workspace_members_select ON workspace_members
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()));
CREATE POLICY workspace_members_insert ON workspace_members
  FOR INSERT WITH CHECK (is_workspace_admin(workspace_id));
CREATE POLICY workspace_members_update ON workspace_members
  FOR UPDATE USING (is_workspace_admin(workspace_id)) WITH CHECK (is_workspace_admin(workspace_id));
CREATE POLICY workspace_members_delete ON workspace_members
  FOR DELETE USING (is_workspace_admin(workspace_id));

-- ── Projects ──
CREATE POLICY projects_select ON projects
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);
CREATE POLICY projects_insert ON projects
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY projects_update ON projects
  FOR UPDATE
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL)
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY projects_delete ON projects
  FOR UPDATE USING (is_workspace_admin(workspace_id));

-- ── RAID Items ──
CREATE POLICY raid_items_select ON raid_items
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);
CREATE POLICY raid_items_insert ON raid_items
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY raid_items_update ON raid_items
  FOR UPDATE
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL)
  WITH CHECK (is_workspace_member(workspace_id));

-- ── RAID Item Links ──
CREATE POLICY raid_item_links_select ON raid_item_links
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()));
CREATE POLICY raid_item_links_insert ON raid_item_links
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY raid_item_links_delete ON raid_item_links
  FOR DELETE USING (is_workspace_member(workspace_id));

-- ── Actions ──
CREATE POLICY actions_select ON actions
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);
CREATE POLICY actions_insert ON actions
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY actions_update ON actions
  FOR UPDATE
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL)
  WITH CHECK (is_workspace_member(workspace_id));

-- ── Meetings ──
CREATE POLICY meetings_select ON meetings
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);
CREATE POLICY meetings_insert ON meetings
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY meetings_update ON meetings
  FOR UPDATE
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL)
  WITH CHECK (is_workspace_member(workspace_id));

-- ── Meeting Attendees ──
CREATE POLICY meeting_attendees_select ON meeting_attendees
  FOR SELECT USING (meeting_id IN (SELECT id FROM meetings WHERE workspace_id IN (SELECT user_workspace_ids())));
CREATE POLICY meeting_attendees_insert ON meeting_attendees
  FOR INSERT WITH CHECK (meeting_id IN (SELECT id FROM meetings WHERE workspace_id IN (SELECT user_workspace_ids())));
CREATE POLICY meeting_attendees_delete ON meeting_attendees
  FOR DELETE USING (meeting_id IN (SELECT id FROM meetings WHERE workspace_id IN (SELECT user_workspace_ids())));

-- ── Decisions ──
CREATE POLICY decisions_select ON decisions
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);
CREATE POLICY decisions_insert ON decisions
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY decisions_update ON decisions
  FOR UPDATE
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL)
  WITH CHECK (is_workspace_member(workspace_id));

-- ── Decision Participants ──
CREATE POLICY decision_participants_select ON decision_participants
  FOR SELECT USING (decision_id IN (SELECT id FROM decisions WHERE workspace_id IN (SELECT user_workspace_ids())));
CREATE POLICY decision_participants_insert ON decision_participants
  FOR INSERT WITH CHECK (decision_id IN (SELECT id FROM decisions WHERE workspace_id IN (SELECT user_workspace_ids())));
CREATE POLICY decision_participants_delete ON decision_participants
  FOR DELETE USING (decision_id IN (SELECT id FROM decisions WHERE workspace_id IN (SELECT user_workspace_ids())));

-- ── Audit Log ──
CREATE POLICY audit_log_select ON audit_log
  FOR SELECT USING (workspace_id IN (SELECT user_workspace_ids()));
CREATE POLICY audit_log_insert ON audit_log
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));


-- ============================================================
-- 4. AUDIT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _action TEXT;
  _changes JSONB;
  _workspace_id UUID;
  _entity_id UUID;
  _user_id UUID;
  _old_row JSONB;
  _new_row JSONB;
  _key TEXT;
BEGIN
  -- Determine action
  IF TG_OP = 'INSERT' THEN
    _action := 'create';
    _new_row := to_jsonb(NEW);
    _entity_id := NEW.id;
    _workspace_id := NEW.workspace_id;
    _changes := jsonb_build_object('new', _new_row);
  ELSIF TG_OP = 'UPDATE' THEN
    _old_row := to_jsonb(OLD);
    _new_row := to_jsonb(NEW);
    _entity_id := NEW.id;
    _workspace_id := NEW.workspace_id;

    -- Detect soft delete
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      _action := 'delete';
    -- Detect restore
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      _action := 'restore';
    -- Detect escalation (RAID items)
    ELSIF TG_TABLE_NAME = 'raid_items' AND OLD.is_escalated = FALSE AND NEW.is_escalated = TRUE THEN
      _action := 'escalate';
    ELSE
      _action := 'update';
    END IF;

    -- Build changes diff (only changed fields)
    _changes := jsonb_build_object();
    FOR _key IN SELECT key FROM jsonb_each(_new_row) LOOP
      IF _new_row->_key IS DISTINCT FROM _old_row->_key THEN
        _changes := _changes || jsonb_build_object(
          _key, jsonb_build_object('old', _old_row->_key, 'new', _new_row->_key)
        );
      END IF;
    END LOOP;
  ELSIF TG_OP = 'DELETE' THEN
    _action := 'delete';
    _entity_id := OLD.id;
    _workspace_id := OLD.workspace_id;
    _changes := jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  -- Get current user (may be NULL for service-role operations)
  _user_id := auth.uid();

  -- Insert audit record
  INSERT INTO audit_log (workspace_id, entity_type, entity_id, action, changes, performed_by_id, performed_at)
  VALUES (_workspace_id, TG_TABLE_NAME, _entity_id, _action, _changes, _user_id, now());

  -- Return appropriate row
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach audit triggers to all business entity tables
CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER audit_raid_items
  AFTER INSERT OR UPDATE OR DELETE ON raid_items
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER audit_actions
  AFTER INSERT OR UPDATE OR DELETE ON actions
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER audit_meetings
  AFTER INSERT OR UPDATE OR DELETE ON meetings
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER audit_decisions
  AFTER INSERT OR UPDATE OR DELETE ON decisions
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();


-- ============================================================
-- 5. SEED DATA
-- ============================================================

DO $$
DECLARE
  user_sarah UUID := '00000000-0000-0000-0000-000000000001';
  user_james UUID := '00000000-0000-0000-0000-000000000002';
  user_priya UUID := '00000000-0000-0000-0000-000000000003';
  user_tom   UUID := '00000000-0000-0000-0000-000000000004';
  user_emma  UUID := '00000000-0000-0000-0000-000000000005';
  user_david UUID := '00000000-0000-0000-0000-000000000006';

  ws_id      UUID := '10000000-0000-0000-0000-000000000001';
  proj_alpha UUID := '20000000-0000-0000-0000-000000000001';
  proj_beta  UUID := '20000000-0000-0000-0000-000000000002';

  mtg_psb    UUID := '40000000-0000-0000-0000-000000000001';
  mtg_retro  UUID := '40000000-0000-0000-0000-000000000002';
  mtg_weekly UUID := '40000000-0000-0000-0000-000000000003';

  dec_api    UUID := '50000000-0000-0000-0000-000000000001';
  dec_vendor UUID := '50000000-0000-0000-0000-000000000002';

  raid_r1    UUID := '30000000-0000-0000-0000-000000000001';
  raid_r2    UUID := '30000000-0000-0000-0000-000000000002';
  raid_a1    UUID := '30000000-0000-0000-0000-000000000003';
  raid_i1    UUID := '30000000-0000-0000-0000-000000000004';
  raid_i2    UUID := '30000000-0000-0000-0000-000000000005';
  raid_d1    UUID := '30000000-0000-0000-0000-000000000006';
  raid_d2    UUID := '30000000-0000-0000-0000-000000000007';
  raid_a2    UUID := '30000000-0000-0000-0000-000000000008';

  act_1      UUID := '60000000-0000-0000-0000-000000000001';
  act_2      UUID := '60000000-0000-0000-0000-000000000002';
  act_3      UUID := '60000000-0000-0000-0000-000000000003';
  act_4      UUID := '60000000-0000-0000-0000-000000000004';
  act_5      UUID := '60000000-0000-0000-0000-000000000005';
  act_6      UUID := '60000000-0000-0000-0000-000000000006';

BEGIN

-- ── PROFILES ──
INSERT INTO profiles (id, email, full_name, job_title) VALUES
  (user_sarah, 'sarah.chen@example.com',    'Sarah Chen',    'PMO Lead'),
  (user_james, 'james.wilson@example.com',  'James Wilson',  'Programme Manager'),
  (user_priya, 'priya.sharma@example.com',  'Priya Sharma',  'Project Manager'),
  (user_tom,   'tom.baker@example.com',     'Tom Baker',     'Project Manager'),
  (user_emma,  'emma.ross@example.com',     'Emma Ross',     'Portfolio Director'),
  (user_david, 'david.kim@example.com',     'David Kim',     'Programme Sponsor');

-- ── WORKSPACE ──
INSERT INTO workspaces (id, name, slug, description) VALUES
  (ws_id, 'Acme Corp Digital Transformation', 'acme-corp', 'Digital transformation portfolio for Acme Corporation');

-- ── WORKSPACE MEMBERS ──
INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
  (ws_id, user_sarah, 'admin'),
  (ws_id, user_james, 'member'),
  (ws_id, user_priya, 'member'),
  (ws_id, user_tom,   'member'),
  (ws_id, user_emma,  'admin'),
  (ws_id, user_david, 'member');

-- ── PROJECTS ──
INSERT INTO projects (id, workspace_id, owner_id, name, code, description, rag_status, status, start_date, target_end_date) VALUES
  (proj_alpha, ws_id, user_priya, 'CRM Enhancement', 'PROJ-ALPHA',
   'Upgrade CRM platform to support new customer segmentation model and self-service portal.',
   'amber', 'active', '2026-01-15', '2026-06-30'),
  (proj_beta, ws_id, user_tom, 'Data Platform Migration', 'PROJ-BETA',
   'Migrate legacy data warehouse to cloud-native platform with real-time analytics.',
   'green', 'active', '2026-02-01', '2026-08-31');

-- ── RAID ITEMS — Risks ──
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level, impact, likelihood) VALUES
  (raid_r1, ws_id, proj_alpha, 'risk', 'CRM vendor contract renewal deadline',
   'Current CRM vendor contract expires 30 April. If renewal is not agreed by 31 March, we risk a gap in service and potential data migration under pressure.',
   'mitigating', 'red', user_james, '2026-03-31', 'critical', user_sarah, 'project', 'critical', 'high'),
  (raid_r2, ws_id, proj_beta, 'risk', 'Key data engineer leaving in March',
   'Lead data engineer has tendered resignation. Knowledge transfer incomplete. Risk of delivery delay on ETL pipeline workstream.',
   'open', 'amber', user_tom, '2026-03-15', 'high', user_tom, 'project', 'high', 'medium');

-- ── RAID ITEMS — Assumptions ──
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, priority, created_by_id, source_level) VALUES
  (raid_a1, ws_id, proj_alpha, 'assumption', 'Customer data migration can be done in-place',
   'Assumption that existing customer records can be migrated without a full export/import cycle. Needs validation with vendor.',
   'open', 'amber', user_priya, 'medium', user_priya, 'project'),
  (raid_a2, ws_id, proj_beta, 'assumption', 'Cloud provider SLA meets requirements',
   'Assuming the selected cloud provider (AWS) meets our 99.9% uptime SLA requirement. Needs formal confirmation.',
   'open', 'green', user_tom, 'low', user_tom, 'project');

-- ── RAID ITEMS — Issues ──
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level, impact) VALUES
  (raid_i1, ws_id, proj_alpha, 'issue', 'API rate limiting blocking integration testing',
   'CRM API rate limits are causing integration test failures. Vendor support ticket raised but no response in 5 working days.',
   'open', 'red', user_priya, '2026-02-14', 'high', user_priya, 'project', 'high'),
  (raid_i2, ws_id, proj_beta, 'issue', 'Legacy schema documentation incomplete',
   'Discovered that legacy data warehouse schema documentation is 2 years out of date. Reverse engineering required before migration can proceed.',
   'mitigating', 'amber', user_tom, '2026-02-28', 'medium', user_tom, 'project', 'medium');

-- ── RAID ITEMS — Dependencies ──
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level) VALUES
  (raid_d1, ws_id, proj_alpha, 'dependency', 'Dependent on Data Platform for customer 360 view',
   'CRM Enhancement requires the unified customer data model from the Data Platform Migration project. Blocked until Phase 1 of PROJ-BETA completes.',
   'open', 'amber', user_priya, '2026-04-30', 'high', user_james, 'project'),
  (raid_d2, ws_id, proj_beta, 'dependency', 'Network team firewall changes required',
   'Cloud platform requires specific firewall rules. Network team has 4-week lead time. Change request submitted.',
   'mitigating', 'green', user_tom, '2026-03-01', 'medium', user_tom, 'project');

-- ── RAID ITEM LINKS ──
INSERT INTO raid_item_links (workspace_id, source_item_id, target_item_id, link_type, description, created_by_id) VALUES
  (ws_id, raid_d1, raid_d2, 'dependency', 'CRM depends on Data Platform completing Phase 1', user_james);

-- ── MEETINGS ──
INSERT INTO meetings (id, workspace_id, project_id, title, meeting_date, location, notes, status, created_by_id) VALUES
  (mtg_psb, ws_id, proj_alpha, 'Programme Steering Board — January',
   '2026-01-28 10:00:00+00', 'Board Room / Teams',
   E'## Agenda\n1. Portfolio health review\n2. CRM vendor contract risk (RED)\n3. Data Platform staffing risk\n4. Q1 priorities\n\n## Key Discussion\n- Sarah presented portfolio health dashboard. Two items RED.\n- James escalated CRM vendor contract risk. Board agreed to fast-track procurement review.\n- Emma requested contingency plan for data engineer departure by next meeting.\n\n## Outcomes\n- Procurement review to complete by 14 Feb\n- Contingency plan due 15 Feb',
   'completed', user_sarah),
  (mtg_retro, ws_id, proj_beta, 'Sprint 3 Retrospective',
   '2026-01-30 14:00:00+00', 'Meeting Room B / Zoom',
   E'## What went well\n- ETL pipeline Phase 1 delivered on schedule\n- Good collaboration with CRM team on data model\n\n## What to improve\n- Legacy documentation slowing us down\n- Need earlier involvement from Network team\n\n## Actions\n- Tom to raise change request with Network team immediately\n- David to approve additional contractor budget for schema documentation',
   'completed', user_tom),
  (mtg_weekly, ws_id, proj_alpha, 'CRM Weekly Stand-up',
   '2026-02-03 09:00:00+00', 'Teams',
   NULL,
   'scheduled', user_priya);

-- ── MEETING ATTENDEES ──
INSERT INTO meeting_attendees (meeting_id, user_id, role) VALUES
  (mtg_psb, user_sarah, 'presenter'),
  (mtg_psb, user_james, 'attendee'),
  (mtg_psb, user_emma,  'chair'),
  (mtg_psb, user_david, 'attendee'),
  (mtg_psb, user_priya, 'attendee'),
  (mtg_retro, user_tom,   'chair'),
  (mtg_retro, user_david, 'attendee'),
  (mtg_retro, user_priya, 'attendee'),
  (mtg_weekly, user_priya, 'chair'),
  (mtg_weekly, user_sarah, 'attendee');

-- ── DECISIONS ──
INSERT INTO decisions (id, workspace_id, project_id, title, description, rationale, status, decision_date, meeting_id, made_by_id, created_by_id) VALUES
  (dec_api, ws_id, proj_alpha, 'Fast-track CRM vendor procurement review',
   'Board approved fast-tracking the CRM vendor contract renewal procurement review, bypassing standard 6-week cycle.',
   'Current contract expires 30 April. Standard procurement cycle would not complete in time. Risk of service gap outweighs process deviation.',
   'approved', '2026-01-28', mtg_psb, user_emma, user_sarah),
  (dec_vendor, ws_id, proj_beta, 'Approve contractor budget for schema documentation',
   'Approved £15,000 additional budget to bring in a contractor to document and validate legacy data warehouse schema.',
   'Legacy documentation 2 years out of date. Current team cannot absorb workload without impacting delivery timeline.',
   'approved', '2026-01-30', mtg_retro, user_david, user_tom);

-- ── DECISION PARTICIPANTS ──
INSERT INTO decision_participants (decision_id, user_id, role) VALUES
  (dec_api, user_emma,  'decider'),
  (dec_api, user_sarah, 'participant'),
  (dec_api, user_james, 'participant'),
  (dec_api, user_david, 'consulted'),
  (dec_vendor, user_david, 'decider'),
  (dec_vendor, user_tom,   'participant');

-- ── ACTIONS ──
INSERT INTO actions (id, workspace_id, project_id, title, description, owner_id, due_date, status, priority, source_type, source_meeting_id, source_raid_item_id, source_decision_id, created_by_id) VALUES
  (act_1, ws_id, proj_alpha, 'Complete CRM vendor procurement review',
   'Fast-tracked procurement review of CRM vendor contract renewal. Must complete before 14 Feb to allow contract signing by end of March.',
   user_sarah, '2026-02-14', 'in_progress', 'critical',
   'meeting', mtg_psb, raid_r1, dec_api, user_sarah),
  (act_2, ws_id, proj_beta, 'Prepare data engineer contingency plan',
   'Document contingency plan for lead data engineer departure. Include knowledge transfer status, backup personnel, and timeline impact assessment.',
   user_tom, '2026-02-15', 'open', 'high',
   'meeting', mtg_psb, raid_r2, NULL, user_emma),
  (act_3, ws_id, proj_beta, 'Submit network firewall change request',
   'Raise formal change request with Network team for cloud platform firewall rules. 4-week lead time — urgent.',
   user_tom, '2026-02-03', 'completed', 'high',
   'meeting', mtg_retro, raid_d2, NULL, user_tom),
  (act_4, ws_id, proj_alpha, 'Chase CRM vendor on API rate limit support ticket',
   'Follow up on support ticket #4892. No response in 5 working days. Escalate to account manager if no response by EOD.',
   user_priya, '2026-02-07', 'open', 'high',
   'raid', NULL, raid_i1, NULL, user_priya),
  (act_5, ws_id, proj_alpha, 'Validate in-place migration assumption with vendor',
   'Schedule technical call with vendor to validate whether in-place customer data migration is feasible. Get written confirmation.',
   user_priya, '2026-02-21', 'open', 'medium',
   'raid', NULL, raid_a1, NULL, user_priya),
  (act_6, ws_id, proj_beta, 'Update project plan with revised ETL timeline',
   'Incorporate 2-week delay for schema documentation into the project plan. Recalculate critical path and flag impacts.',
   user_tom, '2026-02-10', 'open', 'medium',
   'manual', NULL, NULL, NULL, user_tom);

-- Set completed_at for the completed action
UPDATE actions SET completed_at = '2026-02-01 11:30:00+00' WHERE id = act_3;

END $$;
