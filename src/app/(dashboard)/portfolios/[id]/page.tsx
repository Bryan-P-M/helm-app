import { createClient } from "@/lib/supabase/server";
import { getPortfolioDetail } from "@/lib/queries/portfolios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import PortfolioEditDialog from "@/components/portfolios/portfolio-edit-dialog";

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;

  const portfolioDetail = await getPortfolioDetail(id);

  if (!portfolioDetail) {
    return <div className="p-8 text-center text-muted-foreground">Portfolio not found.</div>;
  }

  const { programmes, totalProgrammes, totalProjects, redAmberRaidItems, ...portfolio } = portfolioDetail;

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{portfolio.name} ({portfolio.code})</CardTitle>
            <Badge className={
              portfolio.rag_status === 'red' ? 'bg-red-500 hover:bg-red-600' :
              portfolio.rag_status === 'amber' ? 'bg-amber-500 hover:bg-amber-600' :
              'bg-green-500 hover:bg-green-600'
            }>
              {portfolio.rag_status.toUpperCase()}
            </Badge>
            <PortfolioEditDialog portfolio={portfolio}>
              <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
            </PortfolioEditDialog>
          </div>
          <p className="text-sm text-muted-foreground">Status: {portfolio.status}</p>
          <p className="text-sm text-muted-foreground">Director: {portfolio.director?.full_name || 'N/A'}</p>
          {portfolio.description && <p className="text-sm text-muted-foreground mt-2">{portfolio.description}</p>}
        </CardHeader>
      </Card>

      {/* Aggregated Counts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProgrammes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Red/Amber RAID Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{redAmberRaidItems}</p>
          </CardContent>
        </Card>
      </div>

      {/* Child Programmes */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Programmes</CardTitle>
          <Button asChild size="sm">
            <Link href={`/programmes/create?portfolioId=${portfolio.id}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Programme
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {programmes.length === 0 ? (
            <p className="text-muted-foreground">No programmes found for this portfolio.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RAG Status</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programmes.map((programme: any) => (
                  <TableRow key={programme.id}>
                    <TableCell className="font-medium">{programme.name}</TableCell>
                    <TableCell>{programme.code}</TableCell>
                    <TableCell>{programme.status}</TableCell>
                    <TableCell>
                      <Badge className={
                        programme.rag_status === 'red' ? 'bg-red-500 hover:bg-red-600' :
                        programme.rag_status === 'amber' ? 'bg-amber-500 hover:bg-amber-600' :
                        'bg-green-500 hover:bg-green-600'
                      }>
                        {programme.rag_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{programme.programme_manager?.full_name || 'N/A'}</TableCell>
                    <TableCell>{programme.project_count}</TableCell>
                    <TableCell>
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/programmes/${programme.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
