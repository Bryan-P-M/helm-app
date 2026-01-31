import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — list webhook subscriptions
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const { data, error } = await supabase
    .from("webhook_subscriptions")
    .select("id, name, url, event_types, is_active, created_at, updated_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ webhooks: data });
}

// POST — create a new webhook subscription
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id);
  const workspaceId = memberships?.[0]?.workspace_id;
  if (!workspaceId) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = await request.json();
  const { name, url, event_types } = body;

  if (!name || !url || !event_types?.length) {
    return NextResponse.json({ error: "name, url, and event_types are required" }, { status: 400 });
  }

  // Generate a random secret for HMAC signing
  const secretBytes = crypto.getRandomValues(new Uint8Array(32));
  const secret = Array.from(secretBytes).map(b => b.toString(16).padStart(2, "0")).join("");

  const { data, error } = await supabase.from("webhook_subscriptions").insert({
    workspace_id: workspaceId,
    name,
    url,
    secret,
    event_types,
    is_active: true,
    created_by_id: user.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return the secret ONCE (it's stored but never shown again)
  return NextResponse.json({ webhook: data, secret }, { status: 201 });
}
