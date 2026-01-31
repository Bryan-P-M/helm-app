// ============================================================
// Helm v1 — App Constants
// Drives UI rendering across all features.
// ============================================================

import type {
  RagStatus,
  Priority,
  RaidType,
  RaidStatus,
  ActionStatus,
  MeetingStatus,
  DecisionStatus,
  ProjectStatus,
  Impact,
  Likelihood,
  SourceLevel,
  ActionSourceType,
  AttendeeRole,
  ParticipantRole,
  RaidLinkType,
} from '@/lib/types';

// ── RAG Status ──

export const RAG_COLORS: Record<RagStatus, string> = {
  red: '#DC2626',
  amber: '#F59E0B',
  green: '#16A34A',
} as const;

export const RAG_BG_CLASSES: Record<RagStatus, string> = {
  red: 'bg-red-600',
  amber: 'bg-amber-500',
  green: 'bg-green-600',
} as const;

export const RAG_TEXT_CLASSES: Record<RagStatus, string> = {
  red: 'text-red-600',
  amber: 'text-amber-500',
  green: 'text-green-600',
} as const;

export const RAG_BADGE_CLASSES: Record<RagStatus, string> = {
  red: 'bg-red-600/10 text-red-600 border-red-600/20',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  green: 'bg-green-600/10 text-green-600 border-green-600/20',
} as const;

export const RAG_LABELS: Record<RagStatus, string> = {
  red: 'Red',
  amber: 'Amber',
  green: 'Green',
} as const;

// ── Priority ──

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
} as const;

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#6B7280',     // gray-500
  medium: '#3B82F6',  // blue-500
  high: '#F59E0B',    // amber-500
  critical: '#DC2626', // red-600
} as const;

export const PRIORITY_BADGE_CLASSES: Record<Priority, string> = {
  low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  critical: 'bg-red-600/10 text-red-600 border-red-600/20',
} as const;

// ── RAID Type ──

export const RAID_TYPE_LABELS: Record<RaidType, string> = {
  risk: 'Risk',
  assumption: 'Assumption',
  issue: 'Issue',
  dependency: 'Dependency',
} as const;

export const RAID_TYPE_SHORT: Record<RaidType, string> = {
  risk: 'R',
  assumption: 'A',
  issue: 'I',
  dependency: 'D',
} as const;

export const RAID_TYPE_COLORS: Record<RaidType, string> = {
  risk: '#EF4444',      // red-500
  assumption: '#8B5CF6', // violet-500
  issue: '#F97316',      // orange-500
  dependency: '#06B6D4', // cyan-500
} as const;

export const RAID_TYPE_BADGE_CLASSES: Record<RaidType, string> = {
  risk: 'bg-red-500/10 text-red-500 border-red-500/20',
  assumption: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  issue: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  dependency: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
} as const;

// ── RAID Status ──

export const RAID_STATUS_LABELS: Record<RaidStatus, string> = {
  open: 'Open',
  mitigating: 'Mitigating',
  resolved: 'Resolved',
  closed: 'Closed',
  escalated: 'Escalated',
} as const;

// ── Action Status ──

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  blocked: 'Blocked',
} as const;

export const ACTION_STATUS_BADGE_CLASSES: Record<ActionStatus, string> = {
  open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  completed: 'bg-green-600/10 text-green-600 border-green-600/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  blocked: 'bg-red-600/10 text-red-600 border-red-600/20',
} as const;

// ── Meeting Status ──

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  archived: 'Archived',
} as const;

// ── Decision Status ──

export const DECISION_STATUS_LABELS: Record<DecisionStatus, string> = {
  draft: 'Draft',
  approved: 'Approved',
  superseded: 'Superseded',
  withdrawn: 'Withdrawn',
} as const;

// ── Project Status ──

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

// ── Impact & Likelihood ──

export const IMPACT_LABELS: Record<Impact, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
} as const;

export const LIKELIHOOD_LABELS: Record<Likelihood, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  very_high: 'Very High',
} as const;

// ── Source Level ──

export const SOURCE_LEVEL_LABELS: Record<SourceLevel, string> = {
  project: 'Project',
  programme: 'Programme',
  portfolio: 'Portfolio',
} as const;

// ── Action Source Type ──

export const ACTION_SOURCE_TYPE_LABELS: Record<ActionSourceType, string> = {
  manual: 'Manual',
  meeting: 'Meeting',
  raid: 'RAID Item',
  decision: 'Decision',
} as const;

// ── Attendee Role ──

export const ATTENDEE_ROLE_LABELS: Record<AttendeeRole, string> = {
  chair: 'Chair',
  attendee: 'Attendee',
  presenter: 'Presenter',
  observer: 'Observer',
} as const;

// ── Participant Role ──

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  decider: 'Decider',
  participant: 'Participant',
  consulted: 'Consulted',
  informed: 'Informed',
} as const;

// ── Link Type ──

export const LINK_TYPE_LABELS: Record<RaidLinkType, string> = {
  dependency: 'Depends On',
  related: 'Related To',
  duplicate: 'Duplicate Of',
  blocks: 'Blocks',
  blocked_by: 'Blocked By',
} as const;

// ── Option Arrays (for dropdowns/selects) ──

export const RAG_OPTIONS: { value: RagStatus; label: string }[] = [
  { value: 'red', label: 'Red' },
  { value: 'amber', label: 'Amber' },
  { value: 'green', label: 'Green' },
];

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const RAID_TYPE_OPTIONS: { value: RaidType; label: string }[] = [
  { value: 'risk', label: 'Risk' },
  { value: 'assumption', label: 'Assumption' },
  { value: 'issue', label: 'Issue' },
  { value: 'dependency', label: 'Dependency' },
];

export const RAID_STATUS_OPTIONS: { value: RaidStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'mitigating', label: 'Mitigating' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
];

export const ACTION_STATUS_OPTIONS: { value: ActionStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'blocked', label: 'Blocked' },
];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];
