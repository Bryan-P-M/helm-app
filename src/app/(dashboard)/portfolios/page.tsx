import { createClient } from "@/lib/supabase/server";
import { getPortfolios } from "@/lib/queries/portfolios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import PortfolioCreateDialog from "@/components/portfolios/portfolio-create-dialog";

export default async function PortfoliosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;

  if (!workspaceId) return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;

  const portfolios = await getPortfolios(workspaceId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <PortfolioCreateDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Portfolio
          </Button>
        </PortfolioCreateDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{portfolio.name}</CardTitle>
                <Badge className={
                  portfolio.rag_status === 'red' ? 'bg-red-500 hover:bg-red-600' :
                  portfolio.rag_status === 'amber' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-green-500 hover:bg-green-600'
                }>
                  {portfolio.rag_status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>{portfolio.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Status: {portfolio.status}</p>
              <p className="text-sm text-muted-foreground">
                Director: {portfolio.director?.full_name || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Programmes: {portfolio.programme_count}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/portfolios/${portfolio.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}