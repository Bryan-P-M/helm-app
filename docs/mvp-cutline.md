# Helm MVP Cut-Line — Approved 29 Jan 2026

## v1 MVP — "The Demo" (54-72h est.)

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 1 | Auth + Users | Supabase auth, login/signup | 4-6h |
| 2 | Workspace + Projects | Multi-project container structure | 6-8h |
| 3 | RAID Log | Full CRUD. Filterable by R/A/I/D, owner, status, RAG. Cross-project dependencies | 12-16h |
| 4 | Actions Tracker | Source tracking (meeting/RAID/manual), assignee, due date, status | 8-10h |
| 5 | Dashboard | Project-level KPIs — open risks, overdue actions, RAG status | 6-8h |
| 6 | Navigation + Layout | Sidebar nav, project tabs, responsive shell | 6-8h |
| 7 | Meeting Hub | Manual capture — list meetings, record notes, link action counts | 8-10h |
| 8 | Decisions Log | Manual entry — decision, rationale, participants, date | 4-6h |

**Pitch:** "The governance framework your team actually uses."

## v2 — "The Platform"

| # | Feature | Description |
|---|---------|-------------|
| 9 | AI Extraction | Paste/upload meeting notes → extract Actions, Decisions, Risks with confidence scores |
| 10 | AI Review Screen | Approve/edit/reject extracted items before committing |
| 11 | Programme-level view | Aggregate across projects |
| 12 | Portfolio Dashboard | Cross-programme KPIs, investment overview |
| 13 | Tasks (hierarchical) | Full task management with inheritance |
| 14 | Reports | Status packs, steering papers |
| 15 | AI Insights | Pattern analysis, health scoring, early warnings |
| 16 | Cross-project dependencies | RAID items linking between projects |
| 17 | Advanced RBAC | Role-based permissions, team management |
| 18 | Multi-tenancy | Workspace isolation for different clients |

**Pitch:** "The AI that makes governance effortless."

## Decision Rationale
- v1 gives a demoable, useful product without AI complexity
- Meeting Hub + Decisions Log are manual-capture — programme managers already do this
- AI Extraction (v2) upgrades what users are already doing by hand
- Keeps v1 timeline to ~6-8 weeks part-time, AI-assisted
