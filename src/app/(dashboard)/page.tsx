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
import { FileText, CheckCircle, FolderKanban, AlertTriangle, Calendar } from "lucide-react";

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
  const { workspace, raidItems, openActions, overdueActions, projects, rag, needsAttention, auditLog } = data as any;

  if (!workspace) {
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

  return (
    <main className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
        {workspace.description && (
          <p className="text-muted-foreground mt-1">{workspace.description}</p>
        )}
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total RAID Items"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          value={raidItems?.length ?? 0}
          link="/raid"
        >
          <div className="flex gap-2 mt-2">
            <RagStat label="Red" value={rag?.red ?? 0} color="red" link="/raid?rag_status=red" />
            <RagStat label="Amber" value={rag?.amber ?? 0} color="amber" link="/raid?rag_status=amber" />
            <RagStat label="Green" value={rag?.green ?? 0} color="green" link="/raid?rag_status=green" />
          </div>
        </SummaryCard>
        <SummaryCard
          title="Open Actions"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          value={openActions?.length ?? 0}
          link="/actions"
        />
        <SummaryCard
          title="Overdue Actions"
          icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
          value={overdueActions?.length ?? 0}
          link="/actions?filter=overdue"
        />
        <SummaryCard
          title="Active Projects"
          icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
          value={projects?.length ?? 0}
          link="/projects"
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
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Card>
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
