# Helm — Glossary

**Last Updated:** 2026-01-31
**Status:** 📝 Living document

---

## Domain Terms

| Term | Definition |
|------|-----------|
| **P3O** | Portfolio, Programme, and Project Office — the governance framework that Helm implements |
| **RAID** | Risks, Assumptions, Issues, Dependencies — the four categories of governance items tracked in a RAID log |
| **RAG** | Red, Amber, Green — traffic-light status indicator for health/risk assessment |
| **Risk** | An uncertain event that, if it occurs, will have a positive or negative effect on objectives |
| **Assumption** | Something taken to be true without proof, which if wrong could affect the project |
| **Issue** | A current problem that is impacting the project (a realised risk) |
| **Dependency** | A relationship where one deliverable or task relies on another |
| **Action** | A specific task assigned to a person with a due date, often arising from meetings or RAID items |
| **Decision** | A recorded choice made by stakeholders, with rationale and participants |
| **Workspace** | Top-level container in Helm — isolates data for a team or organisation |
| **Project** | A governed initiative within a workspace, containing its own RAID items, actions, meetings |
| **Programme** | A group of related projects managed together (v2 scope) |
| **Portfolio** | A collection of programmes and projects at the strategic level (v2 scope) |
| **Provenance** | The origin and history of a data item — who created it, when, from what source |
| **Escalation** | Moving an item up the governance hierarchy for attention (e.g., risk → programme level) |
| **Steering Committee** | Senior stakeholders who review programme/project health and make strategic decisions |
| **Status Pack** | A periodic report summarising project health, typically for steering committees (v2 scope) |

## Technical Terms

| Term | Definition |
|------|-----------|
| **RLS** | Row-Level Security — PostgreSQL feature used to enforce workspace isolation at the database level |
| **DIS** | Design Intelligence Specification — Helm's foundational design document defining 5 principles |
| **MVP** | Minimum Viable Product — the smallest useful version of Helm (v1) |
| **Supabase** | Open-source Firebase alternative providing PostgreSQL, Auth, and real-time features |
| **MoSCoW** | Must/Should/Could/Won't — prioritisation framework used in Helm's scope definition |

---

*Referenced by: [helm-project-brief-v2.md](./helm-project-brief-v2.md)*
