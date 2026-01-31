import { createClient } from "@/lib/supabase/server";
import { getProjectDetail } from "@/lib/queries/projects";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, FolderKanban, AlertTriangle, Calendar, Layers, Waypoints, Briefcase, PlusCircle, User, CircleDot, Pencil } from "lucide-react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import ProjectEditDialog from "@/components/projects/project-edit-dialog";

// Constants
import { RAG_BADGE_CLASSES, PRIORITY_BADGE_CLASSES } from "@/lib/constants";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const project = await getProjectDetail(id) as any;

  if (!project) return <div className="p-8 text-center text-muted-foreground">Project not found.</div>;

  let programmeName: string | null = null;
  const programmeId: string | null = project.programme_id ?? null;
  if (programmeId) {
    const { data: prog } = await supabase.from("programmes").select("id, name").eq("id", programmeId).single();
    programmeName = prog?.name ?? null;
  }

  // Fetch data for tabs
  const { data: raidItemsData, error: raidItemsError } = await supabase
    .from("raid_items")
    .select("id, title, type, rag_status, priority, owner_id, owner:owner_id(id, full_name), created_at")
    .eq("project_id", id)
    .is("deleted_at", null)
    .order("rag_status")
    .order("created_at", { ascending: false });

  const { data: actionsData, error: actionsError } = await supabase
    .from("actions")
    .select("id, title, status, priority, due_date, completed_at, owner_id, owner:owner_id(id, full_name)")
    .eq("project_id", id)
    .is("deleted_at", null)
    .order("due_date", { ascending: true, nullsFirst: false });

  const { data: decisionsData, error: decisionsError } = await supabase
    .from("decisions")
    .select("id, title, status, decided_date, rationale, made_by")
    .eq("project_id", id)
    .is("deleted_at", null)
    .order("decided_date", { ascending: false, nullsFirst: false });

  const { data: meetingsData, error: meetingsError } = await supabase
    .from("meetings")
    .select("id, title, meeting_date")
    .eq("project_id", id)
    .is("deleted_at", null)
    .order("meeting_date", { ascending: false });

  // Calculate overview counts
  const risks = project.raidItems.filter((item: any) => item.type === "risk").length;
  const assumptions = project.raidItems.filter((item: any) => item.type === "assumption").length;
  const issues = project.raidItems.filter((item: any) => item.type === "issue").length;
  const dependencies = project.raidItems.filter((item: any) => item.type === "dependency").length;
  const openActions = project.actions.filter((action: any) => action.status !== "completed" && action.status !== "cancelled").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

  const overdueActions = project.actions.filter((action: any) => {
    if ((action.status !== "completed" && action.status !== "cancelled") && action.due_date && !action.completed_at) {
      const dueDate = new Date(action.due_date);
      dueDate.setHours(0, 0, 0, 0); // Normalize due_date to start of day
      return dueDate < today;
    }
    return false;
  }).length;
  const decisionsCount = decisionsData?.length || 0;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <Link href="/projects">
          <Button variant="outline" size="icon" className="mb-4 md:mb-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">
          {project.name} <span className="text-muted-foreground">({project.code})</span>
        </h2>
        <div className="flex items-center space-x-2">
          <Badge className={RAG_BADGE_CLASSES[project.rag_status as keyof typeof RAG_BADGE_CLASSES]}>{project.rag_status}</Badge>
          <Badge variant="secondary">{project.status}</Badge>
          <ProjectEditDialog project={project}>
            <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
          </ProjectEditDialog>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
        {project.owner && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" /> <span>{project.owner.full_name}</span>
          </div>
        )}
        {(project.start_date || project.target_end_date) && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"} &rarr;{" "}
              {project.target_end_date ? new Date(project.target_end_date).toLocaleDateString() : "N/A"}
            </span>
          </div>
        )}
        {programmeName && (
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" /> Part of:{" "}
            <Link href={`/programmes/${project.programme_id}`} className="text-primary hover:underline">
              {programmeName}
            </Link>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raid">RAID Log</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-center justify-center p-4">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{risks}</h3>
              <p className="text-sm text-muted-foreground">Risks</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{assumptions}</h3>
              <p className="text-sm text-muted-foreground">Assumptions</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{issues}</h3>
              <p className="text-sm text-muted-foreground">Issues</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Waypoints className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{dependencies}</h3>
              <p className="text-sm text-muted-foreground">Dependencies</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Briefcase className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{openActions}</h3>
              <p className="text-sm text-muted-foreground">Open Actions</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
              <h3 className="text-2xl font-bold text-destructive">{overdueActions}</h3>
              <p className="text-sm text-muted-foreground">Overdue Actions</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <CircleDot className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-2xl font-bold">{decisionsCount}</h3>
              <p className="text-sm text-muted-foreground">Decisions</p>
            </Card>
          </div>
        </TabsContent>

        {/* RAID Log Tab Content */}
        <TabsContent value="raid" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/projects/${id}/raid/new`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add RAID Item
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>RAG</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raidItemsData && raidItemsData.length > 0 ? (
                raidItemsData.map((item: any) => {
                  const ownerName = Array.isArray(item.owner) ? item.owner[0]?.full_name : item.owner?.full_name;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="secondary">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Badge className={RAG_BADGE_CLASSES[item.rag_status as keyof typeof RAG_BADGE_CLASSES]}>{item.rag_status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_BADGE_CLASSES[item.priority as keyof typeof PRIORITY_BADGE_CLASSES]}>{item.priority}</Badge>
                      </TableCell>
                      <TableCell>{ownerName || "N/A"}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No RAID items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Actions Tab Content */}
        <TabsContent value="actions" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/projects/${id}/actions/new`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionsData && actionsData.length > 0 ? (
                actionsData.map((action: any) => {
                  const isOverdue = action.status !== "completed" && action.status !== "cancelled" && action.due_date && new Date(action.due_date) < today && !action.completed_at;
                  const ownerName = Array.isArray(action.owner) ? action.owner[0]?.full_name : action.owner?.full_name;
                  return (
                    <TableRow key={action.id}>
                      <TableCell className={isOverdue ? "text-red-500" : ""}>{action.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{action.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_BADGE_CLASSES[action.priority as keyof typeof PRIORITY_BADGE_CLASSES]}>{action.priority}</Badge>
                      </TableCell>
                      <TableCell className={isOverdue ? "text-red-500" : ""}>
                        {action.due_date ? new Date(action.due_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>{ownerName || "N/A"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No actions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Decisions Tab Content */}
        <TabsContent value="decisions" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Decided Date</TableHead>
                <TableHead>Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisionsData && decisionsData.length > 0 ? (
                decisionsData.map((decision: any) => (
                  <TableRow key={decision.id}>
                    <TableCell>{decision.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{decision.status}</Badge>
                    </TableCell>
                    <TableCell>{decision.decided_date ? new Date(decision.decided_date).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>{decision.rationale ? `${decision.rationale.substring(0, 100)}${decision.rationale.length > 100 ? '...' : ''}` : "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No decisions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Meetings Tab Content */}
        <TabsContent value="meetings" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Meeting Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetingsData && meetingsData.length > 0 ? (
                meetingsData.map((meeting: any) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <Link href={`/meetings/${meeting.id}`} className="text-primary hover:underline">
                        {meeting.title}
                      </Link>
                    </TableCell>
                    <TableCell>{meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString() : "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No meetings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}