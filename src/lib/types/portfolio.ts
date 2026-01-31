export type PortfolioStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Portfolio {
  id: string;
  workspace_id: string;
  name: string;
  code: string;
  description: string | null;
  director_id: string | null;
  rag_status: string;
  status: PortfolioStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PortfolioWithRelations extends Portfolio {
  director: { id: string; full_name: string | null } | null;
  programme_count: number;
}
