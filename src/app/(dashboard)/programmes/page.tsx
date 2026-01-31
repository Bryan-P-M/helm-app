import { createClient } from '@/lib/supabase/server';
import { getProgrammes } from '@/lib/queries/programmes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProgrammeCreateDialog from '@/components/programmes/programme-create-dialog';

export default async function ProgrammesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;
  }

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;

  if (!workspaceId) {
    return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;
  }

  const programmes = await getProgrammes(workspaceId);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Programmes</h2>
        <ProgrammeCreateDialog workspaceId={workspaceId} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programmes.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No programmes found. Create a new one to get started.</p>
        ) : (
          programmes.map((programme) => (
            <Link href={`/programmes/${programme.id}`} key={programme.id}>
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-medium">{programme.name}</CardTitle>
                  <Badge className={`bg-${programme.rag_status}-500 hover:bg-${programme.rag_status}-500/80 capitalize`}>
                    {programme.rag_status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{programme.code} - {programme.status}</p>
                  {programme.programme_manager && (
                    <p className="text-sm">Manager: {programme.programme_manager.full_name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{programme.project_count} Projects</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
