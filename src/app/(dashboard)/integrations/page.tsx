import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow, format } from "date-fns";
import WebhookCreateDialog from "@/components/integrations/webhook-create-dialog";
import { ExternalLink } from "lucide-react"; // Assuming ExternalLink is available and suitable

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Please sign in.</div>;

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) return <div className="p-8 text-center text-muted-foreground">No workspace found.</div>;

  const { data: webhooks, error: webhooksError } = await supabase
    .from("webhook_subscriptions")
    .select("*, webhook_events(id)") // Select webhook events to count them
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const { data: events, error: eventsError } = await supabase
    .from("webhook_events")
    .select("id, event_type, delivery_status, response_code, created_at, subscription_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (webhooksError) console.error("Error fetching webhooks:", webhooksError.message);
  if (eventsError) console.error("Error fetching events:", eventsError.message);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-500">Delivered</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
      case "retrying":
        return <Badge variant="outline" className="bg-amber-500 hover:bg-amber-500 text-black">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getWebhookStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500 hover:bg-green-500">Active</Badge>
    ) : (
      <Badge variant="destructive">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations & Webhooks</h1>
          <p className="text-muted-foreground">
            Connect Helm to external systems. Webhooks notify your services when governance events occur.
          </p>
        </div>
        <WebhookCreateDialog>
          <Button variant="default">
            + Create Webhook
          </Button>
        </WebhookCreateDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Subscriptions</CardTitle>
          <CardDescription>Manage your active webhook subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks && webhooks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook: any) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell>{webhook.url.length > 50 ? webhook.url.substring(0, 47) + "..." : webhook.url}</TableCell>
                    <TableCell>{webhook.webhook_events.length}</TableCell>
                    <TableCell>{getWebhookStatusBadge(webhook.is_active)}</TableCell>
                    <TableCell>{format(new Date(webhook.created_at), "PPP")}</TableCell>
                    <TableCell><ExternalLink className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">No webhook subscriptions found.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Last 20 webhook delivery attempts.</CardDescription>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Code</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.event_type}</TableCell>
                    <TableCell>{getStatusBadge(event.delivery_status)}</TableCell>
                    <TableCell>{event.response_code || "N/A"}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">No recent webhook deliveries.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
