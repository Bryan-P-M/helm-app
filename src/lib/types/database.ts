// ============================================================
// Helm v1 — Shared TypeScript Types
// Generated from v1-database-schema.md (Section 7)
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

// ── Risk Scoring Types (HP-56) ──

export type UrgencyFlag = 'Low' | 'Medium' | 'High';
export type EscalationLevel = 'Project' | 'Programme' | 'Portfolio' | 'Board';
export type RiskTrend = 'Improving' | 'Stable' | 'Deteriorating';

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
  // Risk scoring fields (HP-56) — only meaningful when type = 'risk'
  likelihood_score: number | null;
  impact_score: number | null;
  inherent_risk_score: number | null;
  mitigation_score: number | null;
  residual_risk_score: number | null;
  urgency_flag: UrgencyFlag | null;
  escalation_level: EscalationLevel | null;
  trend: RiskTrend | null;
  review_date: string | null;
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
  // Risk scoring (HP-56) — only for type='risk'
  likelihood_score?: number;
  impact_score?: number;
  inherent_risk_score?: number;
  mitigation_score?: number;
  residual_risk_score?: number;
  urgency_flag?: UrgencyFlag;
  escalation_level?: EscalationLevel;
  trend?: RiskTrend;
  review_date?: string;
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
  // Risk scoring (HP-56) — only for type='risk'
  likelihood_score?: number | null;
  impact_score?: number | null;
  inherent_risk_score?: number | null;
  mitigation_score?: number | null;
  residual_risk_score?: number | null;
  urgency_flag?: UrgencyFlag | null;
  escalation_level?: EscalationLevel | null;
  trend?: RiskTrend | null;
  review_date?: string | null;
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
