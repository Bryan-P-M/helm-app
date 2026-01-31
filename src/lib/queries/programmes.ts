import { createClient } from '@/lib/supabase/server';
import { Programme, ProgrammeWithRelations } from '@/lib/types/programme';

export async function getProgrammes(workspaceId: string): Promise<ProgrammeWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('programmes')
    .select(
      `
        *,
        sro:sro_id(id, full_name),
        programme_manager:programme_manager_id(id, full_name),
        project_count:projects(count)
      `
    )
    .eq('workspace_id', workspaceId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching programmes:', error);
    return [];
  }

  return data.map(programme => ({
    ...programme,
    project_count: programme.project_count[0]?.count || 0,
  })) as ProgrammeWithRelations[];
}

export async function getProgrammeDetail(programmeId: string) {
  const supabase = await createClient();

  const { data: programme, error: programmeError } = await supabase
    .from('programmes')
    .select(
      `
        *,
        sro:sro_id(id, full_name),
        programme_manager:programme_manager_id(id, full_name)
      `
    )
    .eq('id', programmeId)
    .is('deleted_at', null)
    .single();

  if (programmeError) {
    console.error('Error fetching programme detail:', programmeError);
    return null;
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select(
      `
        id, name, code, status, rag_status, owner_id,
        owner:owner_id(id, full_name)
      `
    )
    .eq('programme_id', programmeId)
    .is('deleted_at', null);

  if (projectsError) {
    console.error('Error fetching child projects:', projectsError);
    return null;
  }

  // Aggregate RAID summary (example - you'll need to fetch actual RAID data for full functionality)
  const { data: raidItems, error: raidError } = await supabase
    .from('raid_items') // Assuming a raid_items table exists and links to projects
    .select('id, type, status, project_id')
    .in('project_id', projects.map(p => p.id))
    .is('deleted_at', null);

  const raidSummary = {
    red: raidItems?.filter(item => item.status === 'red').length || 0,
    amber: raidItems?.filter(item => item.status === 'amber').length || 0,
    total: raidItems?.length || 0,
  };

  // Aggregate action summary (example - you'll need to fetch actual action data for full functionality)
  const { data: actions, error: actionsError } = await supabase
    .from('actions') // Assuming an actions table exists and links to projects
    .select('id, status, due_date, project_id')
    .in('project_id', projects.map(p => p.id))
    .is('deleted_at', null);

  const openActions = actions?.filter(action => action.status === 'open').length || 0;
  const overdueActions = actions?.filter(action => action.status === 'open' && new Date(action.due_date) < new Date()).length || 0;

  const actionSummary = {
    open: openActions,
    overdue: overdueActions,
    total: actions?.length || 0,
  };

  return {
    programme,
    projects,
    raidSummary,
    actionSummary,
  };
}
