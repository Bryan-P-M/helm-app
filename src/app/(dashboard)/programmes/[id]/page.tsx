import { createClient } from '@/lib/supabase/server';
import { getProgrammeDetail } from '@/lib/queries/programmes';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import RagBadge from "@/components/shared/rag-badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil } from "lucide-react";
import ProgrammeEditDialog from "@/components/programmes/programme-edit-dialog";

export default async function ProgrammeDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const programmeData = await getProgrammeDetail(id);

  if (!programmeData || !programmeData.programme) {
    notFound();
  }

  const { programme, projects, raidSummary, actionSummary } = programmeData;

  return (
    <div className="space-y-6 p-8">
      {/* Programme Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{programme.name} ({programme.code})</h2>
          <p className="text-muted-foreground">{programme.description}</p>
        </div>
        <div className="flex items-center space-x-2">
<RagBadge status={programme.rag_status as "red" | "amber" | "green"} editable entityId={programme.id} entityTable="programmes" />
          <Badge variant="outline">{programme.status}</Badge>
          <ProgrammeEditDialog programme={programme}>
            <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
          </ProgrammeEditDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">SRO: {programme.sro?.full_name || 'N/A'}</p>
            <p className="text-sm">Programme Manager: {programme.programme_manager?.full_name || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Created: {new Date(programme.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        {/* Aggregated RAID Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Aggregated RAID Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><span className="font-semibold text-red-500">Red:</span> {raidSummary.red}</p>
            <p className="text-sm"><span className="font-semibold text-amber-500">Amber:</span> {raidSummary.amber}</p>
            <p className="text-sm">Total RAID Items: {raidSummary.total}</p>
          </CardContent>
        </Card>

        {/* Aggregated Action Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Aggregated Action Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><span className="font-semibold">Open:</span> {actionSummary.open}</p>
            <p className="text-sm"><span className="font-semibold text-red-500">Overdue:</span> {actionSummary.overdue}</p>
            <p className="text-sm">Total Actions: {actionSummary.total}</p>
          </CardContent>
        </Card>
      </div>

      {/* Child Projects Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Child Projects</h3>
          <Link href={`/projects/create?programmeId=${programme.id}`}>
            <Button>New Project</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RAG</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No projects under this programme.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project: any) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Link href={`/projects/${project.id}`} className="hover:underline">
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>{project.code}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>
                        <Badge className={`bg-${project.rag_status}-500 hover:bg-${project.rag_status}-500/80 capitalize`}>
                          {project.rag_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.owner?.full_name || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
