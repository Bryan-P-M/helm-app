# Helm v1 — Database Schema (Supabase/PostgreSQL)

> Production-ready database schema for Helm MVP v1.
> All builder agents code against this specification.
>
> **Tech Stack:** PostgreSQL via Supabase · Supabase Auth · Next.js · Prisma (likely)
> **Last Updated:** 2026-01-31

---

## Table of Contents

1. [Entity Relationship Diagram](#1-entity-relationship-diagram)
2. [SQL DDL — Full Schema](#2-sql-ddl--full-schema)
3. [Row Level Security (RLS) Policies](#3-row-level-security-rls-policies)
4. [Audit Trail](#4-audit-trail)
5. [Seed Data](#5-seed-data)
6. [Migration Notes (v1 → v2)](#6-migration-notes-v1--v2)
7. [TypeScript Types](#7-typescript-types)

---

## 1. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUPABASE AUTH                                       │
│                      ┌──────────────┐                                       │
│                      │  auth.users  │                                       │
│                      └──────┬───────┘                                       │
│                             │ 1:1                                            │
└─────────────────────────────┼───────────────────────────────────────────────┘
                              │
                      ┌───────▼───────┐
                      │   profiles    │
                      │───────────────│
                      │ id (= auth)   │
                      │ email         │
                      │ full_name     │
                      │ avatar_url    │
                      └───────┬───────┘
                              │
                              │ N:M (via workspace_members)
                              │
┌─────────────────────────────┼───────────────────────────────────────────────┐
│                             │                                               │
│  ┌──────────────────┐  ┌───▼──────────────┐                                │
│  │   workspaces     │──│workspace_members  │                                │
│  │──────────────────│  │──────────────────│                                │
│  │ id               │  │ workspace_id (FK)│                                │
│  │ name             │  │ user_id (FK)     │                                │
│  │ slug             │  │ role (admin/     │                                │
│  │                  │  │       member)    │                                │
│  └────────┬─────────┘  └─────────────────┘                                │
│           │                                                                 │
│           │ 1:N                                                              │
│           │                                                                  │
│  ┌────────▼─────────┐                                                       │
│  │    projects      │                                                       │
│  │──────────────────│                                                       │
│  │ id               │                                                       │
│  │ workspace_id (FK)│                                                       │
│  │ name, code       │                                                       │
│  │ rag_status       │                                                       │
│  │ owner_id (FK)    │                                                       │
│  └──┬────┬────┬───┬─┘                                                       │
│     │    │    │   │                                                          │
│     │    │    │   │  1:N each                                                │
│     │    │    │   │                                                          │
│  ┌──▼──┐│┌───▼──┐│┌──────────┐   ┌──────────────────┐                      │
│  │RAID ││││ act- │││meetings  │   │   decisions      │                      │
│  │items││││ ions │││          │   │                  │                      │
│  │─────││││──────│││──────────│   │──────────────────│                      │
│  │type ││││title ││││title     │   │ title            │                      │
│  │title││││owner │││date      │   │ rationale        │                      │
│  │rag  ││││due   │││notes     │   │ meeting_id (FK)  │                      │
│  │owner││││status│││status    │   │ made_by_id (FK)  │                      │
│  │     ││││source│││          │   │                  │                      │
│  └──┬──┘│└──────┘│└────┬─────┘   └──────────────────┘                      │
│     │   │        │     │                                                     │
│     │   │ ┌──────┘     │                                                     │
│     │   │ │            │                                                     │
│  ┌──▼───▼─▼──┐   ┌────▼──────────┐                                         │
│  │raid_item  │   │meeting_       │                                          │
│  │_links     │   │attendees      │                                          │
│  │───────────│   │───────────────│                                          │
│  │source (FK)│   │meeting_id (FK)│                                          │
│  │target (FK)│   │user_id (FK)   │                                          │
│  │link_type  │   │               │                                          │
│  └───────────┘   └───────────────┘                                          │
│                                                                              │
│  ┌──────────────────┐                                                        │
│  │   audit_log      │  (captures ALL state changes across all entities)      │
│  │──────────────────│                                                        │
│  │ entity_type      │                                                        │
│  │ entity_id        │                                                        │
│  │ action           │                                                        │
│  │ changes (JSONB)  │                                                        │
│  │ performed_by     │                                                        │
│  └──────────────────┘                                                        │
└──────────────────────────────────────────────────────────────────────────────┘

LEGEND:
  FK = Foreign Key    1:N = One-to-Many    N:M = Many-to-Many
  All tables carry: created_at, updated_at, deleted_at (soft delete)
  All PKs are UUID v4
  workspace_id present on all business entities (multi-tenancy prep)
```

### Relationship Summary

| Parent | Child | Cardinality | FK Column | ON DELETE |
|--------|-------|-------------|-----------|-----------|
| auth.users | profiles | 1:1 | profiles.id | CASCADE |
| workspaces | workspace_members | 1:N | workspace_id | CASCADE |
| profiles | workspace_members | 1:N | user_id | CASCADE |
| workspaces | projects | 1:N | workspace_id | CASCADE |
| profiles | projects (owner) | 1:N | owner_id | SET NULL |
| projects | raid_items | 1:N | project_id | CASCADE |
| profiles | raid_items (owner) | 1:N | owner_id | SET NULL |
| raid_items | raid_items (escalation) | 1:N | escalated_from_id | SET NULL |
| raid_items | raid_item_links (source) | 1:N | source_item_id | CASCADE |
| raid_items | raid_item_links (target) | 1:N | target_item_id | CASCADE |
| projects | actions | 1:N | project_id | CASCADE |
| profiles | actions (owner) | 1:N | owner_id | SET NULL |
| raid_items | actions (source) | 1:N | source_raid_item_id | SET NULL |
| meetings | actions (source) | 1:N | source_meeting_id | SET NULL |
| decisions | actions (source) | 1:N | source_decision_id | SET NULL |
| projects | meetings | 1:N | project_id | CASCADE |
| profiles | meetings (created_by) | 1:N | created_by_id | SET NULL |
| meetings | meeting_attendees | 1:N | meeting_id | CASCADE |
| profiles | meeting_attendees | 1:N | user_id | CASCADE |
| projects | decisions | 1:N | project_id | CASCADE |
| meetings | decisions (source) | 1:N | meeting_id | SET NULL |
| profiles | decisions (made_by) | 1:N | made_by_id | SET NULL |

---

## 2. SQL DDL — Full Schema

### 2.0 Extensions & Prerequisites

```sql
-- ============================================================
-- Helm v1 Database Schema
-- Target: Supabase (PostgreSQL 15+)
-- ============================================================

-- Enable required extensions (most are pre-enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "moddatetime";    -- Auto-update updated_at
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram search for text filtering
```

### 2.1 Profiles

```sql
-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with application-specific data.
-- The id column IS the auth.users id — no separate sequence.
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  job_title     TEXT,

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ          DEFAULT NULL
);

-- Auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles (email);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users. One row per authenticated user.';
```

### 2.2 Workspaces

```sql
-- ============================================================
-- WORKSPACES
-- Top-level tenant container. v1 is single-tenant but the
-- schema is multi-tenancy ready (NFR: "Design with
-- organisation_id from day one").
-- ============================================================
CREATE TABLE workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  logo_url      TEXT,

  -- Timestamps
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
```

### 2.3 Workspace Members

```sql
-- ============================================================
-- WORKSPACE MEMBERS
-- Junction table: Users ↔ Workspaces with role assignment.
-- v1 roles: admin, member.
-- v2 will add: portfolio_user, programme_user, project_user
-- per NFR RBAC matrix.
-- ============================================================
CREATE TABLE workspace_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member',

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
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
```

### 2.4 Projects

```sql
-- ============================================================
-- PROJECTS
-- Delivery-focused execution unit. Belongs to a workspace.
-- v1: flat list under workspace.
-- v2: will add programme_id FK for hierarchy
--     (Portfolio → Programme → Project).
-- ============================================================
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  owner_id      UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- Core fields
  name          TEXT NOT NULL,
  code          TEXT NOT NULL,                -- e.g. "PROJ-ALPHA"
  description   TEXT,
  rag_status    TEXT NOT NULL DEFAULT 'green',
  status        TEXT NOT NULL DEFAULT 'active',
  start_date    DATE,
  target_end_date DATE,

  -- v2 prep: programme_id will be added here
  -- programme_id UUID REFERENCES programmes(id)

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ          DEFAULT NULL,

  -- Constraints
  CONSTRAINT chk_project_rag CHECK (rag_status IN ('red', 'amber', 'green')),
  CONSTRAINT chk_project_status CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
  CONSTRAINT uq_project_code_workspace UNIQUE (workspace_id, code)
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes
CREATE INDEX idx_projects_workspace ON projects (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_owner ON projects (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_rag ON projects (workspace_id, rag_status) WHERE deleted_at IS NULL;

COMMENT ON TABLE projects IS 'Project entity. v1: flat under workspace. v2: nested under programmes.';
```

### 2.5 RAID Items

```sql
-- ============================================================
-- RAID ITEMS
-- Risks, Assumptions, Issues, Dependencies.
-- Core governance entity — full CRUD with filtering, escalation,
-- and cross-project linking.
--
-- DIS 6.1 Column Structure:
--   ID, Type (R/A/I/D), Title, Description, Status, RAG,
--   Owner, Due Date, Source Level, Escalated flag
--
-- DIS Cross-Cutting: "Can be raised at any level. Escalated
--   risks appear at parent level with 'escalated from' tag."
-- ============================================================
CREATE TABLE raid_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Core fields (DIS 6.1)
  type                TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  status              TEXT NOT NULL DEFAULT 'open',
  rag_status          TEXT NOT NULL DEFAULT 'green',
  owner_id            UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  due_date            DATE,
  priority            TEXT NOT NULL DEFAULT 'medium',

  -- Provenance (DIS Principle 1: Traceable)
  created_by_id       UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  source_level        TEXT NOT NULL DEFAULT 'project',

  -- Escalation tracking (DIS 6.1 Escalation Behaviour)
  is_escalated        BOOLEAN NOT NULL DEFAULT FALSE,
  escalated_from_id   UUID         REFERENCES raid_items(id) ON DELETE SET NULL,
  escalation_note     TEXT,

  -- Impact/likelihood for risks (v1 supports manual entry)
  impact              TEXT         CHECK (impact IN ('low', 'medium', 'high', 'critical') OR impact IS NULL),
  likelihood          TEXT         CHECK (likelihood IN ('low', 'medium', 'high', 'very_high') OR likelihood IS NULL),

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at          TIMESTAMPTZ          DEFAULT NULL,

  -- Constraints
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

-- Indexes — optimised for DIS 6.1 filtering requirements
CREATE INDEX idx_raid_workspace ON raid_items (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_project ON raid_items (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_type ON raid_items (workspace_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_status ON raid_items (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_rag ON raid_items (workspace_id, rag_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_owner ON raid_items (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_raid_due_date ON raid_items (due_date) WHERE deleted_at IS NULL AND status NOT IN ('resolved', 'closed');
CREATE INDEX idx_raid_escalated_from ON raid_items (escalated_from_id) WHERE escalated_from_id IS NOT NULL;
CREATE INDEX idx_raid_project_type_status ON raid_items (project_id, type, status) WHERE deleted_at IS NULL;

-- Composite index for dashboard queries (exception-first: DIS Principle 4)
CREATE INDEX idx_raid_exceptions ON raid_items (workspace_id, rag_status, status)
  WHERE deleted_at IS NULL AND rag_status IN ('red', 'amber') AND status NOT IN ('resolved', 'closed');

COMMENT ON TABLE raid_items IS 'RAID register: Risks, Assumptions, Issues, Dependencies. Core governance entity with escalation support.';
```

### 2.6 RAID Item Links

```sql
-- ============================================================
-- RAID ITEM LINKS
-- Cross-item relationships: dependencies between RAID items,
-- including cross-project linking (DIS Cross-Cutting Entities).
--
-- Enables: "Dependencies tracked. Critical path aggregates
--          to portfolio level." (DIS Part 5)
-- ============================================================
CREATE TABLE raid_item_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  source_item_id  UUID NOT NULL REFERENCES raid_items(id) ON DELETE CASCADE,
  target_item_id  UUID NOT NULL REFERENCES raid_items(id) ON DELETE CASCADE,
  link_type       TEXT NOT NULL DEFAULT 'related',
  description     TEXT,

  -- Provenance
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_link_type CHECK (link_type IN ('dependency', 'related', 'duplicate', 'blocks', 'blocked_by')),
  CONSTRAINT chk_no_self_link CHECK (source_item_id != target_item_id),
  CONSTRAINT uq_raid_link UNIQUE (source_item_id, target_item_id, link_type)
);

CREATE INDEX idx_raid_links_source ON raid_item_links (source_item_id);
CREATE INDEX idx_raid_links_target ON raid_item_links (target_item_id);
CREATE INDEX idx_raid_links_workspace ON raid_item_links (workspace_id);

COMMENT ON TABLE raid_item_links IS 'Relationships between RAID items. Enables cross-project dependency tracking.';
```

### 2.7 Meetings

```sql
-- ============================================================
-- MEETINGS
-- Governance meeting hub — manual capture only in v1.
-- DIS 6.3 lifecycle (v1 subset): scheduled → completed → archived
-- (v2 adds: in_progress, processing, review, finalised for AI)
--
-- Links to actions and decisions created from meeting.
-- ============================================================
CREATE TABLE meetings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Core fields (DIS 6.3)
  title           TEXT NOT NULL,
  meeting_date    TIMESTAMPTZ NOT NULL,
  location        TEXT,                       -- physical location or video link
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled',

  -- Provenance
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- v2 prep: AI extraction fields (not used in v1)
  -- recording_url   TEXT,
  -- transcript      TEXT,
  -- extraction_status TEXT,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ          DEFAULT NULL,

  -- Constraints
  CONSTRAINT chk_meeting_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'archived'))
);

CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes
CREATE INDEX idx_meetings_workspace ON meetings (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_project ON meetings (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_date ON meetings (meeting_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_status ON meetings (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_upcoming ON meetings (meeting_date)
  WHERE deleted_at IS NULL AND status = 'scheduled' AND meeting_date >= now();

COMMENT ON TABLE meetings IS 'Governance meetings. v1: manual capture. v2: AI-assisted extraction.';
```

### 2.8 Meeting Attendees

```sql
-- ============================================================
-- MEETING ATTENDEES
-- Junction table: Meetings ↔ Profiles.
-- ============================================================
CREATE TABLE meeting_attendees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'attendee',

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_attendee_role CHECK (role IN ('chair', 'attendee', 'presenter', 'observer')),
  CONSTRAINT uq_meeting_attendee UNIQUE (meeting_id, user_id)
);

CREATE INDEX idx_meeting_attendees_meeting ON meeting_attendees (meeting_id);
CREATE INDEX idx_meeting_attendees_user ON meeting_attendees (user_id);

COMMENT ON TABLE meeting_attendees IS 'Meeting participation. Role indicates chair/attendee/presenter/observer.';
```

### 2.9 Decisions

```sql
-- ============================================================
-- DECISIONS
-- Decision log — manual entry in v1.
-- DIS: "Logged at governance meeting level. Linked to resulting
--       actions and affected items."
--
-- Decisions are historical records (DIS Cross-Cutting Entities).
-- ============================================================
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Core fields
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,          -- the actual decision
  rationale       TEXT,                   -- why this decision was made
  status          TEXT NOT NULL DEFAULT 'approved',
  decision_date   DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Source tracking
  meeting_id      UUID         REFERENCES meetings(id) ON DELETE SET NULL,

  -- Provenance
  made_by_id      UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  created_by_id   UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ          DEFAULT NULL,

  -- Constraints
  CONSTRAINT chk_decision_status CHECK (status IN ('draft', 'approved', 'superseded', 'withdrawn'))
);

CREATE TRIGGER decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes
CREATE INDEX idx_decisions_workspace ON decisions (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_project ON decisions (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_meeting ON decisions (meeting_id) WHERE meeting_id IS NOT NULL;
CREATE INDEX idx_decisions_date ON decisions (decision_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_decisions_status ON decisions (workspace_id, status) WHERE deleted_at IS NULL;

COMMENT ON TABLE decisions IS 'Decision log. Historical records linked to meetings and resulting actions.';
```

### 2.10 Decision Participants

```sql
-- ============================================================
-- DECISION PARTICIPANTS
-- Tracks who was involved in a decision (beyond just made_by).
-- DIS requirement: "participants" field on decisions.
-- ============================================================
CREATE TABLE decision_participants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id   UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'participant',

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_participant_role CHECK (role IN ('decider', 'participant', 'consulted', 'informed')),
  CONSTRAINT uq_decision_participant UNIQUE (decision_id, user_id)
);

CREATE INDEX idx_decision_participants_decision ON decision_participants (decision_id);
CREATE INDEX idx_decision_participants_user ON decision_participants (user_id);

COMMENT ON TABLE decision_participants IS 'Who participated in a decision and in what capacity.';
```

### 2.11 Actions

```sql
-- ============================================================
-- ACTIONS
-- Action register with source tracking.
-- DIS 6.2: "Central hub for all actions with personal and
--          governance views."
--
-- Source types:
--   manual   — created directly by user
--   meeting  — arose from a governance meeting
--   raid     — linked to a RAID item
--   decision — arose from a decision
--
-- NOTE: This table is created after meetings and decisions
-- because it holds FK references to both.
-- ============================================================
CREATE TABLE actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Core fields (DIS 6.2)
  title                 TEXT NOT NULL,
  description           TEXT,
  owner_id              UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  due_date              DATE,
  status                TEXT NOT NULL DEFAULT 'open',
  priority              TEXT NOT NULL DEFAULT 'medium',

  -- Source tracking (DIS Principle 1: Traceable)
  source_type           TEXT NOT NULL DEFAULT 'manual',
  source_meeting_id     UUID         REFERENCES meetings(id) ON DELETE SET NULL,
  source_raid_item_id   UUID         REFERENCES raid_items(id) ON DELETE SET NULL,
  source_decision_id    UUID         REFERENCES decisions(id) ON DELETE SET NULL,

  -- Provenance
  created_by_id         UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at          TIMESTAMPTZ          DEFAULT NULL,
  deleted_at            TIMESTAMPTZ          DEFAULT NULL,

  -- Constraints
  CONSTRAINT chk_action_status CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled', 'blocked')),
  CONSTRAINT chk_action_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT chk_action_source_type CHECK (source_type IN ('manual', 'meeting', 'raid', 'decision'))
);

CREATE TRIGGER actions_updated_at
  BEFORE UPDATE ON actions
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Indexes — optimised for DIS 6.2 view modes
CREATE INDEX idx_actions_workspace ON actions (workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_project ON actions (project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_owner ON actions (owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_status ON actions (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_due_date ON actions (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_actions_source_meeting ON actions (source_meeting_id) WHERE source_meeting_id IS NOT NULL;
CREATE INDEX idx_actions_source_raid ON actions (source_raid_item_id) WHERE source_raid_item_id IS NOT NULL;
CREATE INDEX idx_actions_source_decision ON actions (source_decision_id) WHERE source_decision_id IS NOT NULL;

-- Composite index for "My Actions" view (DIS 6.2: overdue first)
CREATE INDEX idx_actions_my_overdue ON actions (owner_id, due_date)
  WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');

-- Composite index for dashboard: overdue actions count
CREATE INDEX idx_actions_overdue ON actions (workspace_id, due_date, status)
  WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');

COMMENT ON TABLE actions IS 'Action register. Every action tracks its source (meeting, RAID item, decision, or manual).';
```

### 2.12 Audit Log

```sql
-- ============================================================
-- AUDIT LOG
-- Generic audit trail capturing ALL state changes.
-- DIS: "Audit trails are first-class citizens, not afterthoughts."
-- DIS Principle 5: "Governance rigour through workflow, not burden."
--
-- This table is append-only. No updates, no deletes.
-- ============================================================
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- What changed
  entity_type     TEXT NOT NULL,           -- 'project', 'raid_item', 'action', etc.
  entity_id       UUID NOT NULL,           -- PK of the changed record
  action          TEXT NOT NULL,           -- 'create', 'update', 'delete', 'escalate', 'restore'

  -- Change detail
  changes         JSONB,                   -- { field: { old: ..., new: ... } }
  metadata        JSONB,                   -- Additional context (IP, user-agent, etc.)

  -- Who did it
  performed_by_id UUID         REFERENCES profiles(id) ON DELETE SET NULL,

  -- When
  performed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chk_audit_action CHECK (action IN ('create', 'update', 'delete', 'restore', 'escalate', 'link', 'unlink'))
);

-- Indexes — optimised for audit trail queries
CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_workspace ON audit_log (workspace_id);
CREATE INDEX idx_audit_performed_by ON audit_log (performed_by_id);
CREATE INDEX idx_audit_performed_at ON audit_log (performed_at DESC);
CREATE INDEX idx_audit_workspace_type ON audit_log (workspace_id, entity_type, performed_at DESC);

COMMENT ON TABLE audit_log IS 'Immutable audit trail. Every state change across all entities is logged here.';
```

---

## 3. Row Level Security (RLS) Policies

All RLS policies enforce workspace-level isolation. Users can only access data in workspaces they belong to.

### 3.1 Helper Functions

```sql
-- ============================================================
-- RLS HELPER FUNCTIONS
-- ============================================================

-- Get current authenticated user's ID
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE sql STABLE
AS $$
  SELECT auth.uid()  -- Supabase built-in
$$;

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
```

### 3.2 Enable RLS on All Tables

```sql
-- Enable RLS (Supabase requires this for security)
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
```

### 3.3 Profiles Policies

```sql
-- Users can read any profile (needed for displaying owners/assignees)
CREATE POLICY profiles_select ON profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY profiles_update ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
```

### 3.4 Workspaces Policies

```sql
-- Users can see workspaces they belong to
CREATE POLICY workspaces_select ON workspaces
  FOR SELECT
  USING (id IN (SELECT user_workspace_ids()));

-- Only admins can update workspace settings
CREATE POLICY workspaces_update ON workspaces
  FOR UPDATE
  USING (is_workspace_admin(id))
  WITH CHECK (is_workspace_admin(id));
```

### 3.5 Workspace Members Policies

```sql
-- Members can see other members in their workspaces
CREATE POLICY workspace_members_select ON workspace_members
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()));

-- Only admins can add/remove members
CREATE POLICY workspace_members_insert ON workspace_members
  FOR INSERT
  WITH CHECK (is_workspace_admin(workspace_id));

CREATE POLICY workspace_members_update ON workspace_members
  FOR UPDATE
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

CREATE POLICY workspace_members_delete ON workspace_members
  FOR DELETE
  USING (is_workspace_admin(workspace_id));
```

### 3.6 Business Entity Policies (Projects, RAID, Actions, Meetings, Decisions)

All business entities follow the same pattern: workspace members can read; any member can create; owners and admins can update/delete.

```sql
-- ============================================================
-- PROJECTS
-- ============================================================
CREATE POLICY projects_select ON projects
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);

CREATE POLICY projects_insert ON projects
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY projects_update ON projects
  FOR UPDATE
  USING (
    workspace_id IN (SELECT user_workspace_ids())
    AND deleted_at IS NULL
  )
  WITH CHECK (is_workspace_member(workspace_id));

-- Soft delete only — admin only
CREATE POLICY projects_delete ON projects
  FOR UPDATE  -- soft delete is an UPDATE setting deleted_at
  USING (is_workspace_admin(workspace_id));

-- ============================================================
-- RAID ITEMS
-- ============================================================
CREATE POLICY raid_items_select ON raid_items
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);

CREATE POLICY raid_items_insert ON raid_items
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY raid_items_update ON raid_items
  FOR UPDATE
  USING (
    workspace_id IN (SELECT user_workspace_ids())
    AND deleted_at IS NULL
  )
  WITH CHECK (is_workspace_member(workspace_id));

-- ============================================================
-- RAID ITEM LINKS
-- ============================================================
CREATE POLICY raid_item_links_select ON raid_item_links
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()));

CREATE POLICY raid_item_links_insert ON raid_item_links
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY raid_item_links_delete ON raid_item_links
  FOR DELETE
  USING (is_workspace_member(workspace_id));

-- ============================================================
-- ACTIONS
-- ============================================================
CREATE POLICY actions_select ON actions
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);

CREATE POLICY actions_insert ON actions
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY actions_update ON actions
  FOR UPDATE
  USING (
    workspace_id IN (SELECT user_workspace_ids())
    AND deleted_at IS NULL
  )
  WITH CHECK (is_workspace_member(workspace_id));

-- ============================================================
-- MEETINGS
-- ============================================================
CREATE POLICY meetings_select ON meetings
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);

CREATE POLICY meetings_insert ON meetings
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY meetings_update ON meetings
  FOR UPDATE
  USING (
    workspace_id IN (SELECT user_workspace_ids())
    AND deleted_at IS NULL
  )
  WITH CHECK (is_workspace_member(workspace_id));

-- ============================================================
-- MEETING ATTENDEES
-- ============================================================
CREATE POLICY meeting_attendees_select ON meeting_attendees
  FOR SELECT
  USING (
    meeting_id IN (
      SELECT id FROM meetings
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );

CREATE POLICY meeting_attendees_insert ON meeting_attendees
  FOR INSERT
  WITH CHECK (
    meeting_id IN (
      SELECT id FROM meetings
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );

CREATE POLICY meeting_attendees_delete ON meeting_attendees
  FOR DELETE
  USING (
    meeting_id IN (
      SELECT id FROM meetings
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );

-- ============================================================
-- DECISIONS
-- ============================================================
CREATE POLICY decisions_select ON decisions
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()) AND deleted_at IS NULL);

CREATE POLICY decisions_insert ON decisions
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY decisions_update ON decisions
  FOR UPDATE
  USING (
    workspace_id IN (SELECT user_workspace_ids())
    AND deleted_at IS NULL
  )
  WITH CHECK (is_workspace_member(workspace_id));

-- ============================================================
-- DECISION PARTICIPANTS
-- ============================================================
CREATE POLICY decision_participants_select ON decision_participants
  FOR SELECT
  USING (
    decision_id IN (
      SELECT id FROM decisions
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );

CREATE POLICY decision_participants_insert ON decision_participants
  FOR INSERT
  WITH CHECK (
    decision_id IN (
      SELECT id FROM decisions
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );

CREATE POLICY decision_participants_delete ON decision_participants
  FOR DELETE
  USING (
    decision_id IN (
      SELECT id FROM decisions
      WHERE workspace_id IN (SELECT user_workspace_ids())
    )
  );
```

### 3.7 Audit Log Policies

```sql
-- Members can read audit logs for their workspace
CREATE POLICY audit_log_select ON audit_log
  FOR SELECT
  USING (workspace_id IN (SELECT user_workspace_ids()));

-- Only the system (service role) inserts audit entries.
-- Application code uses supabase.auth.admin or service_role key.
-- No direct user inserts.
CREATE POLICY audit_log_insert ON audit_log
  FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));
```

---

## 4. Audit Trail

### 4.1 Automatic Audit Trigger Function

This generic trigger captures changes on any table and writes to `audit_log`. Attach it to every business table.

```sql
-- ============================================================
-- GENERIC AUDIT TRIGGER
-- Automatically logs INSERT/UPDATE/DELETE to audit_log.
-- Attach to every business entity table.
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
    -- Hard delete (shouldn't happen with soft deletes, but safety net)
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
```

### 4.2 Attach Audit Triggers

```sql
-- Attach to all business entity tables
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
```

### 4.3 Audit Query Examples

```sql
-- All changes to a specific RAID item (timeline view)
SELECT action, changes, performed_by_id, performed_at
FROM audit_log
WHERE entity_type = 'raid_item' AND entity_id = '<uuid>'
ORDER BY performed_at DESC;

-- All changes by a specific user today
SELECT entity_type, entity_id, action, changes, performed_at
FROM audit_log
WHERE performed_by_id = '<uuid>'
  AND performed_at >= CURRENT_DATE
ORDER BY performed_at DESC;

-- All escalations in a workspace
SELECT entity_id, changes, performed_by_id, performed_at
FROM audit_log
WHERE workspace_id = '<uuid>'
  AND entity_type = 'raid_items'
  AND action = 'escalate'
ORDER BY performed_at DESC;
```

---

## 5. Seed Data

Sample data for demo purposes: 1 workspace, 2 projects, RAID items, actions, meetings, and decisions.

```sql
-- ============================================================
-- SEED DATA — Helm v1 Demo
-- Run after schema creation and after creating auth users
-- in Supabase Auth dashboard.
--
-- IMPORTANT: Replace auth user UUIDs with real ones from
-- Supabase Auth after creating demo users.
-- ============================================================

-- Demo user UUIDs (replace after creating users in Supabase Auth)
-- These are placeholders — real UUIDs come from auth.users
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

-- ── RAID ITEMS ──
-- Risks
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level, impact, likelihood) VALUES
  (raid_r1, ws_id, proj_alpha, 'risk', 'CRM vendor contract renewal deadline',
   'Current CRM vendor contract expires 30 April. If renewal is not agreed by 31 March, we risk a gap in service and potential data migration under pressure.',
   'mitigating', 'red', user_james, '2026-03-31', 'critical', user_sarah, 'project', 'critical', 'high'),
  (raid_r2, ws_id, proj_beta, 'risk', 'Key data engineer leaving in March',
   'Lead data engineer has tendered resignation. Knowledge transfer incomplete. Risk of delivery delay on ETL pipeline workstream.',
   'open', 'amber', user_tom, '2026-03-15', 'high', user_tom, 'project', 'high', 'medium');

-- Assumptions
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, priority, created_by_id, source_level) VALUES
  (raid_a1, ws_id, proj_alpha, 'assumption', 'Customer data migration can be done in-place',
   'Assumption that existing customer records can be migrated without a full export/import cycle. Needs validation with vendor.',
   'open', 'amber', user_priya, 'medium', user_priya, 'project'),
  (raid_a2, ws_id, proj_beta, 'assumption', 'Cloud provider SLA meets requirements',
   'Assuming the selected cloud provider (AWS) meets our 99.9% uptime SLA requirement. Needs formal confirmation.',
   'open', 'green', user_tom, 'low', user_tom, 'project');

-- Issues
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level, impact) VALUES
  (raid_i1, ws_id, proj_alpha, 'issue', 'API rate limiting blocking integration testing',
   'CRM API rate limits are causing integration test failures. Vendor support ticket raised but no response in 5 working days.',
   'open', 'red', user_priya, '2026-02-14', 'high', user_priya, 'project', 'high'),
  (raid_i2, ws_id, proj_beta, 'issue', 'Legacy schema documentation incomplete',
   'Discovered that legacy data warehouse schema documentation is 2 years out of date. Reverse engineering required before migration can proceed.',
   'mitigating', 'amber', user_tom, '2026-02-28', 'medium', user_tom, 'project', 'medium');

-- Dependencies
INSERT INTO raid_items (id, workspace_id, project_id, type, title, description, status, rag_status, owner_id, due_date, priority, created_by_id, source_level) VALUES
  (raid_d1, ws_id, proj_alpha, 'dependency', 'Dependent on Data Platform for customer 360 view',
   'CRM Enhancement requires the unified customer data model from the Data Platform Migration project. Blocked until Phase 1 of PROJ-BETA completes.',
   'open', 'amber', user_priya, '2026-04-30', 'high', user_james, 'project'),
  (raid_d2, ws_id, proj_beta, 'dependency', 'Network team firewall changes required',
   'Cloud platform requires specific firewall rules. Network team has 4-week lead time. Change request submitted.',
   'mitigating', 'green', user_tom, '2026-03-01', 'medium', user_tom, 'project');

-- ── RAID ITEM LINKS (cross-project dependency) ──
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
  -- PSB meeting
  (mtg_psb, user_sarah, 'presenter'),
  (mtg_psb, user_james, 'attendee'),
  (mtg_psb, user_emma,  'chair'),
  (mtg_psb, user_david, 'attendee'),
  (mtg_psb, user_priya, 'attendee'),
  -- Sprint Retro
  (mtg_retro, user_tom,   'chair'),
  (mtg_retro, user_david, 'attendee'),
  (mtg_retro, user_priya, 'attendee'),
  -- Weekly standup
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
  -- From PSB meeting
  (act_1, ws_id, proj_alpha, 'Complete CRM vendor procurement review',
   'Fast-tracked procurement review of CRM vendor contract renewal. Must complete before 14 Feb to allow contract signing by end of March.',
   user_sarah, '2026-02-14', 'in_progress', 'critical',
   'meeting', mtg_psb, raid_r1, dec_api, user_sarah),
  (act_2, ws_id, proj_beta, 'Prepare data engineer contingency plan',
   'Document contingency plan for lead data engineer departure. Include knowledge transfer status, backup personnel, and timeline impact assessment.',
   user_tom, '2026-02-15', 'open', 'high',
   'meeting', mtg_psb, raid_r2, NULL, user_emma),

  -- From Sprint Retro
  (act_3, ws_id, proj_beta, 'Submit network firewall change request',
   'Raise formal change request with Network team for cloud platform firewall rules. 4-week lead time — urgent.',
   user_tom, '2026-02-03', 'completed', 'high',
   'meeting', mtg_retro, raid_d2, NULL, user_tom),

  -- From RAID items (manual)
  (act_4, ws_id, proj_alpha, 'Chase CRM vendor on API rate limit support ticket',
   'Follow up on support ticket #4892. No response in 5 working days. Escalate to account manager if no response by EOD.',
   user_priya, '2026-02-07', 'open', 'high',
   'raid', NULL, raid_i1, NULL, user_priya),
  (act_5, ws_id, proj_alpha, 'Validate in-place migration assumption with vendor',
   'Schedule technical call with vendor to validate whether in-place customer data migration is feasible. Get written confirmation.',
   user_priya, '2026-02-21', 'open', 'medium',
   'raid', NULL, raid_a1, NULL, user_priya),

  -- Manual action
  (act_6, ws_id, proj_beta, 'Update project plan with revised ETL timeline',
   'Incorporate 2-week delay for schema documentation into the project plan. Recalculate critical path and flag impacts.',
   user_tom, '2026-02-10', 'open', 'medium',
   'manual', NULL, NULL, NULL, user_tom);

-- Set completed_at for the completed action
UPDATE actions SET completed_at = '2026-02-01 11:30:00+00' WHERE id = act_3;

END $$;
```

---

## 6. Migration Notes (v1 → v2)

### 6.1 v2 Schema Additions

The following changes are anticipated for v2 ("The Platform"). Schema designed to accommodate these without breaking changes.

| v2 Feature | Schema Change | Migration Complexity |
|------------|---------------|---------------------|
| **Programme Level** | Add `programmes` table; add `programme_id` FK to `projects` | Medium — new table + FK |
| **Portfolio Level** | Add `portfolios` table; add `portfolio_id` FK to `programmes` | Medium — new table + FK |
| **AI Extraction** | Add columns to `meetings`: `recording_url`, `transcript`, `extraction_status`; add `ai_extractions` table | Low — additive columns + new table |
| **AI Review Screen** | Add `extraction_items` table with confidence scores, approval status | Low — new table |
| **Advanced RBAC** | Extend `workspace_members.role` CHECK constraint; add `project_members` table | Medium — constraint change + new table |
| **Multi-tenancy** | `workspace_id` already on every table — isolate at infrastructure level | Low — already prepared |
| **Cross-project Dependencies** | `raid_item_links` already supports this | None — already in v1 |
| **Reports** | Add `reports` table; add `report_snapshots` for point-in-time data | Low — new tables |
| **Hierarchical Tasks** | Add `tasks` table with self-referencing parent_id | Medium — new entity |
| **Comments/Discussion** | Add generic `comments` table (polymorphic via entity_type/entity_id) | Low — new table |

### 6.2 Example v2 Migration: Add Programmes

```sql
-- v2 Migration: Add Programme hierarchy
CREATE TABLE programmes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  portfolio_id    UUID,  -- FK added when portfolios table exists
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

-- Add programme_id to projects (nullable for backward compat)
ALTER TABLE projects ADD COLUMN programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL;
CREATE INDEX idx_projects_programme ON projects (programme_id) WHERE programme_id IS NOT NULL;

-- Update RAID source_level constraint to allow 'programme'
-- (already included in v1 CHECK constraint — no change needed)
```

### 6.3 Example v2 Migration: AI Extraction

```sql
-- v2 Migration: AI meeting extraction
ALTER TABLE meetings ADD COLUMN recording_url TEXT;
ALTER TABLE meetings ADD COLUMN transcript TEXT;
ALTER TABLE meetings ADD COLUMN extraction_status TEXT DEFAULT NULL
  CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed') OR extraction_status IS NULL);

-- AI-extracted items for review
CREATE TABLE ai_extractions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  meeting_id      UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  extraction_type TEXT NOT NULL CHECK (extraction_type IN ('action', 'decision', 'risk', 'issue')),
  raw_text        TEXT NOT NULL,
  confidence      NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  suggested_data  JSONB NOT NULL,           -- structured extraction
  review_status   TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'accepted', 'edited', 'rejected')),
  reviewed_by_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  created_entity_type TEXT,                 -- 'action', 'decision', etc.
  created_entity_id   UUID,                 -- FK to the created record
  recording_timestamp TEXT,                 -- e.g., "14:32"
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 6.4 Zero-Downtime Migration Strategy

1. **Additive only**: New columns are always `NULL`able or have defaults. Never remove/rename columns in the same release.
2. **Feature flags**: New features gate on flags, not schema presence.
3. **Backfill after deploy**: Add column → deploy code that writes it → backfill old rows → add NOT NULL constraint if needed.
4. **Prisma migrations**: Use `prisma migrate` for version-controlled, reviewable migrations.

---

## 7. TypeScript Types

Shared type definitions for all builder agents. These match the SQL schema exactly.

```typescript
// ============================================================
// Helm v1 — Shared TypeScript Types
// Generated from v1-database-schema.md
// All builder agents import these types.
// ============================================================

// ── Enum-like Union Types ──

export type RaidType = 'risk' | 'assumption' | 'issue' | 'dependency';
export type RaidStatus = 'open' | 'mitigating' | 'resolved' | 'closed' | 'escalated';
export type RagStatus = 'red' | 'amber' | 'green';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Impact = 'low' | 'medium' | 'high' | 'critical';
export type Likelihood = 'low' | 'medium' | 'high' | 'very_high';
export type SourceLevel = 'project' | 'programme' | 'portfolio';
export type ActionStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'blocked';
export type ActionSourceType = 'manual' | 'meeting' | 'raid' | 'decision';
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'archived';
export type DecisionStatus = 'draft' | 'approved' | 'superseded' | 'withdrawn';
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';
export type WorkspaceRole = 'admin' | 'member';
export type AttendeeRole = 'chair' | 'attendee' | 'presenter' | 'observer';
export type ParticipantRole = 'decider' | 'participant' | 'consulted' | 'informed';
export type RaidLinkType = 'dependency' | 'related' | 'duplicate' | 'blocks' | 'blocked_by';
export type AuditAction = 'create' | 'update' | 'delete' | 'restore' | 'escalate' | 'link' | 'unlink';

// ── Base Types ──

/** Fields present on all soft-deletable entities */
interface SoftDeletable {
  created_at: string;   // ISO 8601 timestamptz
  updated_at: string;   // ISO 8601 timestamptz
  deleted_at: string | null;
}

/** Fields present on all timestamped entities (no soft delete) */
interface Timestamped {
  created_at: string;
}

// ── Entity Types ──

export interface Profile extends SoftDeletable {
  id: string;             // UUID — same as auth.users.id
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
}

export interface Workspace extends SoftDeletable {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
  updated_at: string;
}

export interface Project extends SoftDeletable {
  id: string;
  workspace_id: string;
  owner_id: string | null;
  name: string;
  code: string;            // e.g., "PROJ-ALPHA"
  description: string | null;
  rag_status: RagStatus;
  status: ProjectStatus;
  start_date: string | null;     // ISO 8601 date
  target_end_date: string | null; // ISO 8601 date
}

export interface RaidItem extends SoftDeletable {
  id: string;
  workspace_id: string;
  project_id: string;
  type: RaidType;
  title: string;
  description: string | null;
  status: RaidStatus;
  rag_status: RagStatus;
  owner_id: string | null;
  due_date: string | null;       // ISO 8601 date
  priority: Priority;
  created_by_id: string | null;
  source_level: SourceLevel;
  is_escalated: boolean;
  escalated_from_id: string | null;
  escalation_note: string | null;
  impact: Impact | null;
  likelihood: Likelihood | null;
}

export interface RaidItemLink extends Timestamped {
  id: string;
  workspace_id: string;
  source_item_id: string;
  target_item_id: string;
  link_type: RaidLinkType;
  description: string | null;
  created_by_id: string | null;
}

export interface Action extends SoftDeletable {
  id: string;
  workspace_id: string;
  project_id: string;
  title: string;
  description: string | null;
  owner_id: string | null;
  due_date: string | null;
  status: ActionStatus;
  priority: Priority;
  source_type: ActionSourceType;
  source_meeting_id: string | null;
  source_raid_item_id: string | null;
  source_decision_id: string | null;
  created_by_id: string | null;
  completed_at: string | null;
}

export interface Meeting extends SoftDeletable {
  id: string;
  workspace_id: string;
  project_id: string;
  title: string;
  meeting_date: string;          // ISO 8601 timestamptz
  location: string | null;
  notes: string | null;
  status: MeetingStatus;
  created_by_id: string | null;
}

export interface MeetingAttendee extends Timestamped {
  id: string;
  meeting_id: string;
  user_id: string;
  role: AttendeeRole;
}

export interface Decision extends SoftDeletable {
  id: string;
  workspace_id: string;
  project_id: string;
  title: string;
  description: string;           // the actual decision text
  rationale: string | null;
  status: DecisionStatus;
  decision_date: string;         // ISO 8601 date
  meeting_id: string | null;
  made_by_id: string | null;
  created_by_id: string | null;
}

export interface DecisionParticipant extends Timestamped {
  id: string;
  decision_id: string;
  user_id: string;
  role: ParticipantRole;
}

export interface AuditLogEntry {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  action: AuditAction;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  metadata: Record<string, unknown> | null;
  performed_by_id: string | null;
  performed_at: string;
}

// ── Relationship / Joined Types ──
// For common query results with joined data.

/** RAID item with owner profile data */
export interface RaidItemWithOwner extends RaidItem {
  owner: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'> | null;
  created_by: Pick<Profile, 'id' | 'full_name'> | null;
  project: Pick<Project, 'id' | 'name' | 'code'>;
}

/** Action with owner and source references */
export interface ActionWithRelations extends Action {
  owner: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'> | null;
  created_by: Pick<Profile, 'id' | 'full_name'> | null;
  project: Pick<Project, 'id' | 'name' | 'code'>;
  source_meeting: Pick<Meeting, 'id' | 'title' | 'meeting_date'> | null;
  source_raid_item: Pick<RaidItem, 'id' | 'title' | 'type'> | null;
  source_decision: Pick<Decision, 'id' | 'title'> | null;
}

/** Meeting with attendee list and linked counts */
export interface MeetingWithDetails extends Meeting {
  created_by: Pick<Profile, 'id' | 'full_name'> | null;
  project: Pick<Project, 'id' | 'name' | 'code'>;
  attendees: Array<MeetingAttendee & {
    user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
  }>;
  action_count: number;
  decision_count: number;
}

/** Decision with participants and source meeting */
export interface DecisionWithDetails extends Decision {
  made_by: Pick<Profile, 'id' | 'full_name'> | null;
  created_by: Pick<Profile, 'id' | 'full_name'> | null;
  project: Pick<Project, 'id' | 'name' | 'code'>;
  meeting: Pick<Meeting, 'id' | 'title' | 'meeting_date'> | null;
  participants: Array<DecisionParticipant & {
    user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
  }>;
}

/** Project with computed stats for dashboard */
export interface ProjectWithStats extends Project {
  owner: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null;
  raid_counts: {
    total: number;
    by_type: Record<RaidType, number>;
    by_rag: Record<RagStatus, number>;
    open: number;
  };
  action_counts: {
    total: number;
    open: number;
    overdue: number;
    completed: number;
  };
  upcoming_meetings: number;
}

// ── Form / Input Types ──
// For create and update operations.

export interface CreateRaidItem {
  project_id: string;
  type: RaidType;
  title: string;
  description?: string;
  status?: RaidStatus;
  rag_status?: RagStatus;
  owner_id?: string;
  due_date?: string;
  priority?: Priority;
  source_level?: SourceLevel;
  impact?: Impact;
  likelihood?: Likelihood;
}

export interface UpdateRaidItem {
  title?: string;
  description?: string;
  status?: RaidStatus;
  rag_status?: RagStatus;
  owner_id?: string | null;
  due_date?: string | null;
  priority?: Priority;
  impact?: Impact | null;
  likelihood?: Likelihood | null;
  is_escalated?: boolean;
  escalation_note?: string;
}

export interface CreateAction {
  project_id: string;
  title: string;
  description?: string;
  owner_id?: string;
  due_date?: string;
  priority?: Priority;
  source_type?: ActionSourceType;
  source_meeting_id?: string;
  source_raid_item_id?: string;
  source_decision_id?: string;
}

export interface UpdateAction {
  title?: string;
  description?: string;
  owner_id?: string | null;
  due_date?: string | null;
  status?: ActionStatus;
  priority?: Priority;
}

export interface CreateMeeting {
  project_id: string;
  title: string;
  meeting_date: string;
  location?: string;
  notes?: string;
  attendee_ids?: string[];
}

export interface UpdateMeeting {
  title?: string;
  meeting_date?: string;
  location?: string;
  notes?: string;
  status?: MeetingStatus;
}

export interface CreateDecision {
  project_id: string;
  title: string;
  description: string;
  rationale?: string;
  status?: DecisionStatus;
  decision_date?: string;
  meeting_id?: string;
  made_by_id?: string;
  participant_ids?: string[];
}

export interface UpdateDecision {
  title?: string;
  description?: string;
  rationale?: string;
  status?: DecisionStatus;
  decision_date?: string;
}

export interface CreateProject {
  name: string;
  code: string;
  description?: string;
  owner_id?: string;
  rag_status?: RagStatus;
  start_date?: string;
  target_end_date?: string;
}

export interface UpdateProject {
  name?: string;
  description?: string;
  owner_id?: string | null;
  rag_status?: RagStatus;
  status?: ProjectStatus;
  start_date?: string | null;
  target_end_date?: string | null;
}

// ── Filter Types ──
// For list/search operations.

export interface RaidItemFilters {
  project_id?: string;
  type?: RaidType | RaidType[];
  status?: RaidStatus | RaidStatus[];
  rag_status?: RagStatus | RagStatus[];
  owner_id?: string;
  priority?: Priority | Priority[];
  source_level?: SourceLevel;
  is_escalated?: boolean;
  due_before?: string;
  due_after?: string;
  search?: string;             // full-text search on title/description
}

export interface ActionFilters {
  project_id?: string;
  owner_id?: string;
  status?: ActionStatus | ActionStatus[];
  priority?: Priority | Priority[];
  source_type?: ActionSourceType;
  due_before?: string;
  due_after?: string;
  overdue_only?: boolean;
  search?: string;
}

export interface MeetingFilters {
  project_id?: string;
  status?: MeetingStatus | MeetingStatus[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface DecisionFilters {
  project_id?: string;
  status?: DecisionStatus | DecisionStatus[];
  meeting_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// ── Dashboard Aggregate Types ──

export interface WorkspaceDashboard {
  workspace: Workspace;
  projects: ProjectWithStats[];
  summary: {
    total_projects: number;
    active_projects: number;
    total_raid_items: number;
    open_raid_items: number;
    red_items: number;
    amber_items: number;
    total_actions: number;
    overdue_actions: number;
    upcoming_meetings: number;
    recent_decisions: number;
  };
}
```

---

## Appendix A: Table Count Summary

| Table | Purpose | Rows (Demo) |
|-------|---------|-------------|
| profiles | User data | 6 |
| workspaces | Tenant containers | 1 |
| workspace_members | User ↔ Workspace | 6 |
| projects | Delivery units | 2 |
| raid_items | R/A/I/D register | 8 |
| raid_item_links | Cross-item relationships | 1 |
| actions | Action register | 6 |
| meetings | Governance meetings | 3 |
| meeting_attendees | Meeting ↔ User | 10 |
| decisions | Decision log | 2 |
| decision_participants | Decision ↔ User | 6 |
| audit_log | Change tracking | (auto-generated) |
| **Total** | **12 tables** | |

## Appendix B: Index Summary

| Table | Index | Purpose |
|-------|-------|---------|
| profiles | email | User lookup |
| workspaces | slug (unique, partial) | URL routing |
| workspace_members | user_id, workspace_id | Membership queries |
| projects | workspace, owner, status, rag | Filtering + dashboard |
| raid_items | workspace, project, type, status, rag, owner, due_date, escalated_from, project+type+status (composite), exceptions (partial composite) | DIS 6.1 filtering requirements |
| raid_item_links | source, target, workspace | Dependency traversal |
| actions | workspace, project, owner, status, due_date, source_meeting, source_raid, source_decision, my_overdue (composite), overdue (composite) | DIS 6.2 view modes |
| meetings | workspace, project, date, status, upcoming (partial) | Meeting lists |
| decisions | workspace, project, meeting, date, status | Decision log queries |
| audit_log | entity, workspace, performed_by, performed_at, workspace+type+at (composite) | Audit trail queries |

## Appendix C: Constraint Summary

All CHECK constraints use text column + IN clause (not PostgreSQL enum types) for easier migration/evolution.

| Table | Constraint | Allowed Values |
|-------|-----------|----------------|
| workspace_members | role | admin, member |
| projects | rag_status | red, amber, green |
| projects | status | active, on_hold, completed, cancelled |
| raid_items | type | risk, assumption, issue, dependency |
| raid_items | status | open, mitigating, resolved, closed, escalated |
| raid_items | rag_status | red, amber, green |
| raid_items | priority | low, medium, high, critical |
| raid_items | source_level | project, programme, portfolio |
| raid_items | impact | low, medium, high, critical (nullable) |
| raid_items | likelihood | low, medium, high, very_high (nullable) |
| raid_item_links | link_type | dependency, related, duplicate, blocks, blocked_by |
| actions | status | open, in_progress, completed, cancelled, blocked |
| actions | priority | low, medium, high, critical |
| actions | source_type | manual, meeting, raid, decision |
| meetings | status | scheduled, completed, cancelled, archived |
| meeting_attendees | role | chair, attendee, presenter, observer |
| decisions | status | draft, approved, superseded, withdrawn |
| decision_participants | role | decider, participant, consulted, informed |
| audit_log | action | create, update, delete, restore, escalate, link, unlink |

---

*This schema is the foundation for Helm v1. All builder agents reference this document for entity structure, relationships, and types. Any schema changes must be proposed here first and approved before implementation.*
