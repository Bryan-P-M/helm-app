export type ProgrammeStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';
export type RagStatus = 'red' | 'amber' | 'green';

export interface Programme {
  id: string;
  workspace_id: string;
  portfolio_id: string | null;
  name: string;
  code: string;
  description: string | null;
  sro_id: string | null;
  programme_manager_id: string | null;
  rag_status: RagStatus;
  status: ProgrammeStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProgrammeWithRelations extends Programme {
  sro: { id: string; full_name: string | null } | null;
  programme_manager: { id: string; full_name: string | null } | null;
  project_count: number;
}