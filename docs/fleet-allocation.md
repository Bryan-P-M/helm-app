# Helm MVP v1 — Fleet Agent Allocation
**Prepared:** 30 January 2026
**Source:** PERT Estimate + Orchestration Spec v2.0.0
**Principle:** Zero Opus Tax on grunt work. Opus orchestrates. Everything else routes down.

---

## Orchestration Layer

| Role | Agent | Model | Tier | Rationale |
|------|-------|-------|------|-----------|
| **Orchestrator** | Silas (main session) | claude-opus-4-5 | Tier-3 | Per spec: `orchestration: any → claude-opus-4-5`. I coordinate, review, merge, resolve conflicts. |
| **Schema Architect** | Silas (direct) | claude-opus-4-5 | Tier-3 | Per spec: `helm_development: High → claude-opus-4-5`. DB schema, shared types, API contracts — architecture decisions only. Done ONCE in Phase 0, then referenced by all agents. |

**Cost note:** Opus is ONLY used here. Every other agent runs Tier-0 to Tier-2.

---

## Builder Agents (Phase 0–3)

### Phase 0: Foundation

| Agent | Task | Model | Tier | Complexity | PERT | Execution Method |
|-------|------|-------|------|------------|------|-----------------|
| **scaffold-builder** | Repo init, Next.js scaffold, CI/CD, linting, project structure | codestral-latest | Tier-1 | Low | 1.7h | sessions_spawn / Codex CLI |
| **nav-builder** | Sidebar nav, routing, responsive shell, layout components | codestral-latest | Tier-1 | Low | 3.2h | sessions_spawn / Codex CLI |
| **auth-builder** | Supabase auth, login/signup, session mgmt, protected routes | deepseek-chat | Tier-1 | Medium | 2.2h | sessions_spawn |

**Routing justification:**
- Scaffolding = boilerplate → `code_generation: Low → codestral-latest` (FREE)
- Nav = UI components → `code_generation: Low → codestral-latest` (FREE)
- Auth = integration logic with Supabase SDK → Medium complexity → `deepseek-chat` ($0.28/$0.42 per 1M)

**Phase 0 estimated API cost: ~$0.15**

---

### Phase 1: Data Layer

| Agent | Task | Model | Tier | Complexity | PERT | Execution Method |
|-------|------|-------|------|------------|------|-----------------|
| **workspace-builder** | Workspace + Project CRUD, data model, API routes | deepseek-chat | Tier-1 | Medium | 3.3h | sessions_spawn |

**Routing justification:**
- Workspace structure with multi-project relationships → `code_generation: Medium → deepseek-chat`
- References schema from Phase 0 (Opus-authored) — no architecture decisions needed here

**Phase 1 estimated API cost: ~$0.08**

---

### Phase 2: Feature Build (PARALLEL — 4 simultaneous agents)

| Agent | Task | Model | Tier | Complexity | PERT | Execution Method |
|-------|------|-------|------|------------|------|-----------------|
| **raid-builder** | RAID Log — full CRUD, filtering by R/A/I/D, owner, status, RAG. Cross-project linking. | deepseek-chat | Tier-1 | Medium | 6.3h | sessions_spawn |
| **actions-builder** | Actions Tracker — source tracking (meeting/RAID/manual), assignee, due date, status workflow | deepseek-chat | Tier-1 | Medium | 4.3h | sessions_spawn |
| **meeting-builder** | Meeting Hub — list meetings, record notes, link to actions, manual capture | codestral-latest | Tier-1 | Low | 4.2h | sessions_spawn / Codex CLI |
| **decisions-builder** | Decisions Log — decision, rationale, participants, date. Simple CRUD. | codestral-latest | Tier-1 | Low | 2.2h | sessions_spawn / Codex CLI |

**Routing justification:**
- RAID Log = most complex feature (filtering, cross-project, RAG status) → Medium → `deepseek-chat`
- Actions = source tracking + status workflow → Medium → `deepseek-chat`
- Meeting Hub = straightforward CRUD + notes → Low → `codestral-latest` (FREE)
- Decisions Log = simplest feature, basic CRUD → Low → `codestral-latest` (FREE)

**Phase 2 estimated API cost: ~$0.25** (RAID + Actions on DeepSeek, Meeting + Decisions on Codestral FREE)

**Critical path:** RAID Log at 6.3h. Other agents finish earlier and can assist with integration testing.

---

### Phase 3: Dashboard

| Agent | Task | Model | Tier | Complexity | PERT | Execution Method |
|-------|------|-------|------|------------|------|-----------------|
| **dashboard-builder** | Project-level KPIs — open risks, overdue actions, RAG status summary, charts | deepseek-chat | Tier-1 | Medium | 3.3h | sessions_spawn |

**Routing justification:**
- Aggregation queries + data visualisation → `data_analysis: Medium → deepseek-chat`
- Depends on Phase 2 data models being complete

**Phase 3 estimated API cost: ~$0.08**

---

## QA Agents (Phase 4)

| Agent | Task | Model | Tier | PERT | Execution Method |
|-------|------|-------|------|------|-----------------|
| **ba-qa** | Functional QA — test each feature against v1 requirements. Persona-based: "As a PM, can I..." | gemini-2.5-flash | Tier-1 | 2.5h | sessions_spawn |
| **integration-tester** | Cross-feature testing — RAID→Actions linking, Meeting→Actions, nav flows, auth gates | deepseek-chat | Tier-1 | 2.0h | sessions_spawn |
| **ui-tester** | Playwright E2E tests — happy paths, error states, responsive breakpoints | codestral-latest | Tier-1 | 2.0h | sessions_spawn / Codex CLI |
| **design-qa** | Design spec compliance — 5 principles check (Traceable, One-Click Escalation, Hierarchy as Nav, Exception First, Risk-aware Defaults) | gemini-2.0-flash-lite | Tier-0 | 1.5h | orchestration pipeline |

**Routing justification:**
- BA-QA = requirements analysis → `research: Medium → gemini-2.5-flash` (1M context, can ingest full spec)
- Integration = cross-feature code testing → `code_generation: Medium → deepseek-chat`
- UI testing = Playwright code generation → `code_generation: Low → codestral-latest` (FREE)
- Design QA = checklist evaluation → `summarization: Low → gemini-2.0-flash-lite` ($0.075/$0.30 — near-free)

**Phase 4 estimated API cost: ~$0.20**

---

## Bug Fix & Polish Agents

| Agent | Task | Model | Tier | Notes |
|-------|------|-------|------|-------|
| **bug-fixer** | Address issues from QA agents | deepseek-chat | Tier-1 | Spawned as-needed. Routes to deepseek-reasoner (Tier-2) if fix is complex. |
| **demo-prep** | Sample data seeding, walkthrough script, polish | gemini-2.5-flash | Tier-1 | Content generation + light code |

**Estimated cost: ~$0.12**

---

## Fleet Summary

### By Phase

| Phase | Agents | Parallel? | Duration | Est. Cost |
|-------|--------|-----------|----------|-----------|
| 0: Foundation | 3 (scaffold, nav, auth) | Partial | 4.5h | $0.15 |
| 1: Data Layer | 1 (workspace) | No | 3.3h | $0.08 |
| 2: Features | 4 (raid, actions, meeting, decisions) | **Full parallel** | 6.3h | $0.25 |
| 3: Dashboard | 1 (dashboard) | No | 3.3h | $0.08 |
| 4: QA + Polish | 4 QA + 2 fix/polish | **Parallel QA** | 8.0h | $0.32 |
| **TOTAL** | **15 agent-sessions** | | **25.4h** | **~$0.88** |

### By Model (cost allocation)

| Model | Agent Count | Tasks | Est. Cost | % of Total |
|-------|-------------|-------|-----------|------------|
| claude-opus-4-5 | 1 (Silas) | Orchestration, schema architecture | ~$2.50* | — |
| deepseek-chat | 5 | RAID, Actions, Workspace, Dashboard, Integration | ~$0.45 | 51% |
| codestral-latest | 4 | Scaffold, Nav, Meeting, Decisions, UI tests | ~$0.00 | 0% (FREE) |
| gemini-2.5-flash | 2 | BA-QA, Demo prep | ~$0.15 | 17% |
| gemini-2.0-flash-lite | 1 | Design QA | ~$0.03 | 3% |
| deepseek-reasoner | On-call | Complex bug escalation | ~$0.10 | 11% |
| grok-fast | On-call | Evaluation passes | ~$0.05 | 6% |

*Opus cost is Silas's main session — exists regardless. Not counted in fleet cost.

### Compliance Check (vs Orchestration Spec)

| Guardrail | Status |
|-----------|--------|
| `helm_development: Low → codestral-latest` | ✅ Scaffold, Nav, Meeting, Decisions |
| `helm_development: Medium → deepseek/codex` | ✅ RAID, Actions, Workspace, Dashboard |
| `helm_development: High → claude-opus-4-5` | ✅ Schema architecture only |
| `code_generation → prefer codestral-latest` | ✅ 4 of 8 builders on Codestral |
| No Opus on grunt work | ✅ Zero Opus agent-sessions |
| Circuit breaker daily soft cap ($2) | ✅ Fleet total ~$0.88 |
| Dead letter queue for failures | ✅ Via orchestration pipeline |

---

## Shared Resources (All Agents Reference)

Created by Opus (Silas) in Phase 0, consumed by all builders:

1. **`schema.prisma`** (or Supabase migrations) — single source of truth for data model
2. **`types/index.ts`** — shared TypeScript types
3. **`lib/supabase.ts`** — client configuration
4. **`components/ui/`** — shared UI component library (shadcn/ui)
5. **`docs/design-principles.md`** — the 5 principles for design-qa to check against
6. **`docs/api-contracts.md`** — endpoint specifications for integration

**This eliminates the #1 parallelisation risk:** agents building incompatible interfaces.

---

## Escalation Protocol

Per orchestration spec execution_protocol:

1. Agent output scored < 0.80 → **refine** (same model, with feedback)
2. Second attempt < 0.80 → **escalate tier** (e.g., Codestral → DeepSeek → DeepSeek-Reasoner)
3. Third attempt < 0.80 → **dead letter** + alert Silas
4. Silas reviews, either fixes directly (Opus) or re-assigns with better context
5. **Max 3 iterations per agent per task** — after that, human review

No agent auto-escalates to Opus. Ever. Only Silas can invoke Opus-tier work.
