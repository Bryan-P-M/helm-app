import { createClient } from "@/lib/supabase/server";
import { getProjects } from "@/lib/queries/projects";
import ProjectsGrid from "@/components/projects/projects-grid";
import ProjectCreateDialog from "@/components/projects/project-create-dialog";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;

  const params = searchParams ? await searchParams : {};
  const filters: Record<string, string> = {};
  for (const f of ["status", "rag_status", "owner_id"]) {
    if (params[f]) filters[f] = String(params[f]);
  }

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects(workspaceId, filters);
  } catch { /* empty state */ }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <ProjectCreateDialog workspaceId={workspaceId} />
      </div>
      <ProjectsGrid initialProjects={projects} workspaceId={workspaceId} />
    </div>
  );
}
