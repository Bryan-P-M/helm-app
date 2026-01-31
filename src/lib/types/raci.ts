export type RaciRole = 'responsible' | 'accountable' | 'consulted' | 'informed';
export type RaciEntityType = 'action' | 'raid_item' | 'decision' | 'deliverable';

export interface RaciAssignment {
  id: string;
  workspace_id: string;
  project_id: string;
  entity_type: RaciEntityType;
  entity_id: string | null;
  deliverable_name: string | null;
  user_id: string;
  role: RaciRole;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by_id: string | null;
}

export interface RaciAssignmentWithProfile extends RaciAssignment {
  user: { id: string; full_name: string | null; avatar_url: string | null };
}

export interface RaciMatrixRow {
  entity_type: RaciEntityType;
  entity_id: string | null;
  entity_name: string;
  assignments: Record<string, RaciRole[]>; // keyed by user_id
}
