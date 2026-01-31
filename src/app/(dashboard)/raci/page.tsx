import { createClient } from "@/lib/supabase/server";
import { getRaciMatrix } from "@/lib/queries/raci";
import type { RaciMatrixRow, RaciEntityType } from "@/lib/types/raci";
import type { Profile } from "@/lib/types";
import { RaciMatrix } from "@/components/raci/raci-matrix";
import { RaciAddDialog } from "@/components/raci/raci-add-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; // For project filter links

export default async function RaciPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;
  }

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  const params = searchParams ? await searchParams : {};
  const projectId =
    typeof params.projectId === "string" ? params.projectId : undefined;

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, code")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("name");

  const { data: memberRows } = await supabase
    .from("workspace_members")
    .select("user_id, profiles(id, full_name, avatar_url)")
    .eq("workspace_id", workspaceId);

  const workspaceMembers = (memberRows ?? []).flatMap((row: any) => {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return p ? [{ id: p.id as string, full_name: p.full_name as string | null, avatar_url: p.avatar_url as string | null }] : [];
  });

  let raciMatrix: RaciMatrixRow[] = [];
  let existingEntities: { type: RaciEntityType; id: string; name: string }[] = [];

  if (projectId) {
    raciMatrix = await getRaciMatrix(workspaceId, projectId);

    const [{ data: acts }, { data: raids }, { data: decs }] = await Promise.all([
      supabase.from("actions").select("id, title").eq("project_id", projectId).is("deleted_at", null),
      supabase.from("raid_items").select("id, title").eq("project_id", projectId).is("deleted_at", null),
      supabase.from("decisions").select("id, title").eq("project_id", projectId).is("deleted_at", null),
    ]);

    existingEntities = [
      ...(acts ?? []).map((a: any) => ({ type: "action" as RaciEntityType, id: a.id, name: a.title })),
      ...(raids ?? []).map((r: any) => ({ type: "raid_item" as RaciEntityType, id: r.id, name: r.title })),
      ...(decs ?? []).map((d: any) => ({ type: "decision" as RaciEntityType, id: d.id, name: d.title })),
    ];
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">RACI Matrix</h2>
        <div className="flex items-center space-x-2">
          {projectId && <RaciAddDialog workspaceId={workspaceId} projectId={projectId} existingEntities={existingEntities} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {projects?.map((project) => (
              <Link
                key={project.id}
                href={`/raci?projectId=${project.id}`}
                passHref
              >
                <Badge
                  variant={projectId === project.id ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  {project.name}
                </Badge>
              </Link>
            ))}
            {projectId && (
              <Link href="/raci" passHref>
                <Badge variant="outline" className="cursor-pointer">
                  Clear Filter
                </Badge>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {projectId ? (
        <RaciMatrix matrixRows={raciMatrix} members={workspaceMembers} workspaceId={workspaceId} projectId={projectId} allEntities={existingEntities} />
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          Select a project to view its RACI matrix
        </div>
      )}
    </div>
  );
}
