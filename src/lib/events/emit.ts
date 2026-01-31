import { createClient } from "@/lib/supabase/server";

export type EventType =
  | "portfolio.created" | "portfolio.updated" | "portfolio.rag_changed"
  | "programme.created" | "programme.updated" | "programme.rag_changed"
  | "project.created" | "project.updated" | "project.rag_changed"
  | "raid_item.created" | "raid_item.updated" | "raid_item.escalated" | "raid_item.resolved"
  | "action.created" | "action.updated" | "action.completed" | "action.overdue"
  | "decision.created" | "decision.approved" | "decision.rejected"
  | "meeting.completed" | "meeting.extraction_completed";

export interface EventPayload {
  entity_type: string;
  entity_id: string;
  workspace_id: string;
  data: Record<string, any>;
  triggered_by?: string;
  timestamp: string;
}

/**
 * Emit a governance event — logs to webhook_events and delivers to active subscriptions.
 * Delivery is fire-and-forget (does not block the caller).
 */
export async function emitEvent(eventType: EventType, payload: Omit<EventPayload, "timestamp">): Promise<void> {
  const supabase = await createClient();
  const fullPayload: EventPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  // Find active subscriptions matching this event type
  const { data: subscriptions } = await supabase
    .from("webhook_subscriptions")
    .select("id, url, secret")
    .eq("workspace_id", payload.workspace_id)
    .eq("is_active", true)
    .contains("event_types", [eventType]);

  if (!subscriptions || subscriptions.length === 0) return;

  // Fire webhooks asynchronously (don't await — fire and forget)
  for (const sub of subscriptions) {
    deliverWebhook(sub.id, sub.url, sub.secret, eventType, fullPayload, payload.workspace_id)
      .catch(err => console.error(`Webhook delivery failed for ${sub.id}:`, err));
  }
}

/**
 * Deliver a single webhook — POST to URL with HMAC signature.
 */
async function deliverWebhook(
  subscriptionId: string,
  url: string,
  secret: string,
  eventType: string,
  payload: EventPayload,
  workspaceId: string
): Promise<void> {
  const supabase = await createClient();
  const body = JSON.stringify({ event: eventType, ...payload });

  // Create HMAC signature using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  let deliveryStatus = "failed";
  let responseCode: number | null = null;
  let responseBody: string | null = null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Helm-Event": eventType,
        "X-Helm-Signature": `sha256=${signatureHex}`,
        "X-Helm-Delivery": subscriptionId,
      },
      body,
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    responseCode = response.status;
    responseBody = await response.text().catch(() => null);
    deliveryStatus = response.ok ? "delivered" : "failed";
  } catch (err: any) {
    responseBody = err.message || "Network error";
  }

  // Log the delivery
  await supabase.from("webhook_events").insert({
    workspace_id: workspaceId,
    subscription_id: subscriptionId,
    event_type: eventType,
    payload,
    delivery_status: deliveryStatus,
    response_code: responseCode,
    response_body: responseBody,
    attempts: 1,
    delivered_at: deliveryStatus === "delivered" ? new Date().toISOString() : null,
  });
}
