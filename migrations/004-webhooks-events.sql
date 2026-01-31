-- Migration 004: Webhooks & Events Integration Layer
-- Run in Supabase SQL Editor

-- ============================================================
-- 1. API KEYS (for external system authentication)
-- ============================================================

CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  key_hash        TEXT NOT NULL,
  key_prefix      TEXT NOT NULL,
  permissions     TEXT[] NOT NULL DEFAULT '{"read"}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_used_at    TIMESTAMPTZ,
  created_by_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash) WHERE is_active = TRUE;

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage api keys" ON api_keys
  FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- ============================================================
-- 2. WEBHOOK SUBSCRIPTIONS
-- ============================================================

CREATE TABLE webhook_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  secret          TEXT NOT NULL,
  event_types     TEXT[] NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_subs_workspace ON webhook_subscriptions(workspace_id);

ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage webhooks" ON webhook_subscriptions
  FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- ============================================================
-- 3. WEBHOOK EVENTS (delivery log)
-- ============================================================

CREATE TABLE webhook_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES webhook_subscriptions(id) ON DELETE SET NULL,
  event_type      TEXT NOT NULL,
  payload         JSONB NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'delivered', 'failed', 'retrying')),
  response_code   INTEGER,
  response_body   TEXT,
  attempts        INTEGER NOT NULL DEFAULT 0,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_events_workspace ON webhook_events(workspace_id);
CREATE INDEX idx_webhook_events_subscription ON webhook_events(subscription_id);
CREATE INDEX idx_webhook_events_created ON webhook_events(created_at DESC);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view events" ON webhook_events
  FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));