import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceDashboardData } from "@/lib/queries/dashboard";
import { RAG_BADGE_CLASSES, PRIORITY_BADGE_CLASSES } from "@/lib/constants";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { FileText, CheckCircle, FolderKanban, AlertTriangle, Calendar, Layers, Waypoints } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to Helm</h1>
        <p className="mb-6 text-muted-foreground">Sign in to see your workspace dashboard.</p>
        <Button asChild variant="default" className="px-8">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const data = await getWorkspaceDashboardData(user.id);

  if (!data || !data.workspace) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center">
        <h1 className="text-2xl font-bold">No Workspace Yet</h1>
        <p className="mb-4 text-muted-foreground">
          Welcome! Get started by creating your first workspace.
        </p>
        <Button asChild>
          <Link href="/settings">Create Workspace</Link>
        </Button>
      </main>
    );
  }

  const {
    workspace,
    portfolios,
    programmes,
    projects,
    raidItems,
    openActions,
    overdueActions,
    needsAttention,
    auditLog,
    rag,
    counts,
  } = data;

  const orphanProgrammes = programmes.filter(
    (p: any) => !p.portfolio_id
  );
  const orphanProjects = projects.filter(
    (pr: any) => !pr.programme_id
  );

  return (
    <main className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{workspace.name} Dashboard</h1>
        {workspace.description && (
          <p className="text-muted-foreground mt-1">{workspace.description}</p>
        )}
      </div>

      {/* Top row — P3O Health Overview (3 cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Portfolio Health"
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          value={counts.portfolios}
          link="/portfolios"
        >
          <div className="flex gap-2 mt-2">
            <RagStat label="Red" value={rag.portfolio.red} color="red" link="/portfolios?rag_status=red" />
            <RagStat label="Amber" value={rag.portfolio.amber} color="amber" link="/portfolios?rag_status=amber" />
            <RagStat label="Green" value={rag.portfolio.green} color="green" link="/portfolios?rag_status=green" />
          </div>
        </SummaryCard>
        <SummaryCard
          title="Programme Health"
          icon={<Waypoints className="h-4 w-4 text-muted-foreground" />}
          value={counts.programmes}
          link="/programmes"
        >
          <div className="flex gap-2 mt-2">
            <RagStat label="Red" value={rag.programme.red} color="red" link="/programmes?rag_status=red" />
            <RagStat label="Amber" value={rag.programme.amber} color="amber" link="/programmes?rag_status=amber" />
            <RagStat label="Green" value={rag.programme.green} color="green" link="/programmes?rag_status=green" />
          </div>
        </SummaryCard>
        <SummaryCard
          title="Project Health"
          icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
          value={counts.projects}
          link="/projects"
        >
          <div className="flex gap-2 mt-2">
            <RagStat label="Red" value={rag.project.red} color="red" link="/projects?rag_status=red" />
            <RagStat label="Amber" value={rag.project.amber} color="amber" link="/projects?rag_status=amber" />
            <RagStat label="Green" value={rag.project.green} color="green" link="/projects?rag_status=green" />
          </div>
        </SummaryCard>
      </section>

      {/* Second row — Operational Stats (3 cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total RAID Items"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          value={counts.raidTotal}
          link="/raid"
        >
          <div className="flex gap-2 mt-2">
            <RagStat label="Red" value={rag.raid.red} color="red" link="/raid?rag_status=red" />
            <RagStat label="Amber" value={rag.raid.amber} color="amber" link="/raid?rag_status=amber" />
            <RagStat label="Green" value={rag.raid.green} color="green" link="/raid?rag_status=green" />
          </div>
        </SummaryCard>
        <SummaryCard
          title="Open Actions"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          value={counts.openActions}
          link="/actions"
        />
        <SummaryCard
          title="Overdue Actions"
          icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
          value={counts.overdueActions}
          link="/actions?filter=overdue"
        />
      </section>

      {/* Needs Attention — P4 Exception First */}
      <section>
        <div className="flex items-center mb-3 gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold tracking-tight">Needs Attention</h2>
        </div>
        {!needsAttention?.length ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground text-sm italic">Nothing requires immediate attention 🎉</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needsAttention.map((item: any) =>
                  item.kind === "RAID" ? (
                    <TableRow key={`raid-${item.id}`}>
                      <TableCell>
                        <Badge variant="outline">RAID</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/raid/${item.id}`} className="hover:underline text-emerald-500">
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={RAG_BADGE_CLASSES[item.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                          {item.rag_status.charAt(0).toUpperCase() + item.rag_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.due_date ? <DueDate date={item.due_date} /> : <span className="text-muted-foreground">–</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_BADGE_CLASSES[item.priority as keyof typeof PRIORITY_BADGE_CLASSES]}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.source_level && (
                          <Badge variant="outline">{item.source_level}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={`action-${item.id}`}>
                      <TableCell>
                        <Badge variant="outline">Action</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/actions/${item.id}`} className="hover:underline text-emerald-500">
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10">
                          Overdue
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DueDate date={item.due_date} />
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_BADGE_CLASSES[item.priority as keyof typeof PRIORITY_BADGE_CLASSES]}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Actions don't have source_level directly, could infer from project_id */}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>

      {/* Portfolio → Programme → Project Hierarchy section */}
      <section>
        <div className="flex items-center mb-3 gap-2">
          <Layers className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">P3O Hierarchy</h2>
        </div>
        {!portfolios?.length && !orphanProgrammes?.length && !orphanProjects?.length ? (
          <Card>
            <CardContent className="py-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold mb-2">No Portfolios, Programmes, or Projects yet.</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first portfolio or a standalone programme/project.
              </p>
              <Button asChild>
                <Link href="/portfolios/new">Create Portfolio</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {portfolios.map((portfolio: any) => (
              <Card key={portfolio.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Link href={`/portfolios/${portfolio.id}`} className="hover:underline">
                      {portfolio.name} ({portfolio.code})
                    </Link>
                    <Badge className={RAG_BADGE_CLASSES[portfolio.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                      {portfolio.rag_status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="ml-4 space-y-3">
                  {programmes
                    .filter((p: any) => p.portfolio_id === portfolio.id)
                    .map((programme: any) => (
                      <div key={programme.id} className="flex flex-col gap-1 pl-4 border-l-2">
                        <div className="flex items-center gap-2">
                          <Waypoints className="h-4 w-4 text-muted-foreground" />
                          <Link href={`/programmes/${programme.id}`} className="font-medium hover:underline">
                            {programme.name} ({programme.code})
                          </Link>
                          <Badge className={RAG_BADGE_CLASSES[programme.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                            {programme.rag_status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({projects.filter((p: any) => p.programme_id === programme.id).length} projects)
                          </span>
                        </div>
                        <div className="ml-4 space-y-2">
                          {projects
                            .filter((pr: any) => pr.programme_id === programme.id)
                            .map((project: any) => (
                              <div key={project.id} className="flex items-center gap-2 pl-4 border-l-2">
                                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                <Link href={`/projects/${project.id}`} className="text-sm hover:underline">
                                  {project.name} ({project.code})
                                </Link>
                                <Badge className={RAG_BADGE_CLASSES[project.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                                  {project.rag_status}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}

            {orphanProgrammes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Waypoints className="h-5 w-5 text-muted-foreground" /> Orphan Programmes
                  </CardTitle>
                </CardHeader>
                <CardContent className="ml-4 space-y-3">
                  {orphanProgrammes.map((programme: any) => (
                    <div key={programme.id} className="flex flex-col gap-1 pl-4 border-l-2">
                      <div className="flex items-center gap-2">
                        <Link href={`/programmes/${programme.id}`} className="font-medium hover:underline">
                          {programme.name} ({programme.code})
                        </Link>
                        <Badge className={RAG_BADGE_CLASSES[programme.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                          {programme.rag_status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ({projects.filter((p: any) => p.programme_id === programme.id).length} projects)
                        </span>
                      </div>
                      <div className="ml-4 space-y-2">
                        {projects
                          .filter((pr: any) => pr.programme_id === programme.id)
                          .map((project: any) => (
                            <div key={project.id} className="flex items-center gap-2 pl-4 border-l-2">
                              <FolderKanban className="h-4 w-4 text-muted-foreground" />
                              <Link href={`/projects/${project.id}`} className="text-sm hover:underline">
                                {project.name} ({project.code})
                              </Link>
                              <Badge className={RAG_BADGE_CLASSES[project.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                                {project.rag_status}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {orphanProjects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-muted-foreground" /> Orphan Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="ml-4 space-y-3">
                  {orphanProjects.map((project: any) => (
                    <div key={project.id} className="flex items-center gap-2 pl-4 border-l-2">
                      <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                        {project.name} ({project.code})
                      </Link>
                      <Badge className={RAG_BADGE_CLASSES[project.rag_status as keyof typeof RAG_BADGE_CLASSES]}>
                        {project.rag_status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>


      {/* Recent Activity */}
      <section>
        <div className="flex items-center mb-3 gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
        </div>
        {auditLog && auditLog.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {auditLog.map((entry: any) => (
                  <li key={entry.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground min-w-[160px]">
                      {new Date(entry.performed_at).toLocaleString(undefined, {
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-medium">
                      {entry.action} {entry.entity_type}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground text-sm italic">No recent activity yet.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

// ── Helper Components ──

function SummaryCard({
  title,
  icon,
  value,
  link,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  link: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <Link href={link} className="text-2xl font-bold hover:underline">
          {value}
        </Link>
        {children}
      </CardContent>
    </Card>
  );
}

function RagStat({
  label,
  value,
  color,
  link,
}: {
  label: string;
  value: number;
  color: "red" | "amber" | "green";
  link: string;
}) {
  return (
    <Link href={link}>
      <Badge className={RAG_BADGE_CLASSES[color]} variant="outline">
        {label}: {value}
      </Badge>
    </Link>
  );
}

function DueDate({ date }: { date: string }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {new Date(date).toISOString().slice(0, 10)}
    </span>
  );
}
