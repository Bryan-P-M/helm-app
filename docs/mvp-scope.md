# MVP Scope & Prioritisation

This document defines the Minimum Viable Product (MVP) scope for Helm using MoSCoW prioritisation. The goal is to identify the smallest set of capabilities that delivers real value to target users while validating core assumptions.

---

## The Seven Capabilities

From the project brief, Helm's full vision includes seven core capabilities:

| # | Capability | Description |
|---|------------|-------------|
| 1 | **Centralised RAID Log** | Single repository for Risks, Assumptions, Issues, Dependencies across portfolio/programme/project |
| 2 | **Governance Meeting Integration** | Ingest meeting recordings, transcribe, extract actions automatically |
| 3 | **Action-Driven Management** | Track actions from assignment to completion with ownership and escalation |
| 4 | **P3O Alignment** | Design principles aligned to AXELOS frameworks (not a feature, but a design constraint) |
| 5 | **RACI Matrix & Accountability Dashboard** | Define and visualise responsibility assignments across tiers |
| 6 | **Cascaded OKRs, KPIs & EVM** | Strategic objectives linked to programme KPIs and project-level earned value |
| 7 | **Critical Path Tracking** | Dependency mapping and critical path analysis across portfolio |

---

## Prioritisation Criteria

MVP capabilities were evaluated against:

| Criterion | Question |
|-----------|----------|
| **Pain severity** | How acute is the pain this addresses? (from problem statement) |
| **Persona alignment** | Which personas need this? How many? |
| **Technical risk** | How complex to build? Any risky assumptions? |
| **Dependency** | Does this require other capabilities first? |
| **Value delivery** | Can users get value from this standalone? |
| **Differentiation** | Does this set Helm apart from existing tools? |

---

## MoSCoW Prioritisation

### Must Have (MVP)

These capabilities are essential for a usable first release. Without them, Helm doesn't solve the core problem.

#### 1. Centralised RAID Log

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Information is fragmented" — directly solves the #1 problem |
| **Personas served** | All 6 personas interact with RAID items at their respective tier |
| **Technical risk** | Low — well-understood data model; CRUD operations |
| **Dependencies** | None — foundational capability |
| **Standalone value** | Yes — even without other features, a centralised RAID log delivers value |
| **Differentiation** | Tiered structure (portfolio → programme → project) with inheritance and escalation |

**Rationale:** This is the foundation. Every persona mentioned RAID-related pain. A PMO Lead spending days consolidating spreadsheets gets immediate relief. Programme Managers get a single view. The tiered model aligned to P3O is the differentiator.

---

#### 2. Action-Driven Management

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Actions agreed in meetings are lost" — directly solves accountability gap |
| **Personas served** | All 6 — actions flow up and down the governance hierarchy |
| **Technical risk** | Low — action tracking is well-understood; ownership, status, due dates |
| **Dependencies** | Benefits from RAID (actions can link to issues/risks) but works standalone |
| **Standalone value** | Yes — even without meeting integration, manual action capture delivers value |
| **Differentiation** | Escalation pathways, overdue alerts, completion tracking across tiers |

**Rationale:** Actions are the currency of governance. Every board meeting generates actions; most get lost. Even without AI extraction from meetings (risky assumption T4), manual action capture with proper tracking delivers significant value.

---

#### 3. Basic Dashboards & Reporting

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "PMO Lead spends days preparing board packs" |
| **Personas served** | PMO Lead, Portfolio Director, Programme Manager |
| **Technical risk** | Medium — dashboard design is iterative; need to understand what users actually want |
| **Dependencies** | Requires RAID and Action data to display |
| **Standalone value** | No — dashboards need data, but essential for realising value from RAID/Actions |
| **Differentiation** | Real-time views vs stale consolidated spreadsheets |

**Rationale:** Dashboards are the visible payoff of centralised data. Without them, users have data but no visibility — the core pain point (days preparing board packs) remains unsolved. PMO Leads get instant board pack preparation. Portfolio Directors get real-time visibility.

**MVP Approach:**
- Portfolio-level dashboard: RAID counts, action status, items requiring attention
- Programme-level dashboard: Same metrics scoped to programme
- Project-level view: RAID list, action list
- Defer fancy visualisations to later phases

---

### Should Have (MVP if feasible, otherwise Phase 2)

These capabilities add significant value but are either technically riskier or depend on Must Haves being in place.

#### 4. Governance Meeting Integration

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Actions agreed in meetings are lost" — automates the capture |
| **Personas served** | PMO Lead (captures actions), Programme Manager (actions assigned) |
| **Technical risk** | **High** — depends on assumption T4 (AI action extraction reliability) |
| **Dependencies** | Requires Action-Driven Management to be useful |
| **Standalone value** | No — extracted actions need somewhere to go |
| **Differentiation** | **High** — this is a significant differentiator if it works reliably |

**Rationale:** This is potentially Helm's "wow" feature — meetings automatically generate tracked actions. However, assumption T4 (AI can reliably extract actions) is unvalidated. Recommend building a proof-of-concept before committing to MVP scope. If POC succeeds, include in MVP. If not, defer to Phase 2 with human-assisted extraction.

**MVP Approach (if included):**
- Start with manual action capture from meetings (low risk)
- Add AI-assisted extraction as enhancement (validate assumption first)
- Don't promise fully automated extraction until proven

---

### Could Have (Phase 2-3)

These capabilities are valuable but add complexity. Better to build on a solid MVP foundation.

#### 5. RACI Matrix & Accountability Dashboard (Phase 2)

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Accountability is unclear" |
| **Personas served** | Portfolio Director, Programme Manager, PMO Lead |
| **Technical risk** | Medium — RACI model is well-defined; UI/UX for matrix editing is complex |
| **Dependencies** | More valuable when RAID and Actions exist to assign accountability against |
| **Standalone value** | Partial — RACI has value but shines when connected to actions/deliverables |
| **Differentiation** | Cascade logic (portfolio → programme → project) with conflict detection |

**Rationale:** RACI is important but not urgent for MVP. Users can manage accountability through action ownership initially. RACI adds a layer of sophistication that's better introduced once core workflows are established.

**Phase 2 Approach:**
- Define RACI at programme level
- Link to actions and RAID items
- "My accountabilities" view per user
- Conflict detection (missing/multiple Accountables)

---

#### 6. Cascaded OKRs, KPIs & EVM

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Earned value is invisible" — enables timely intervention |
| **Personas served** | Portfolio Steering Board Chair, Programme Sponsor, Portfolio Director |
| **Technical risk** | **High** — EVM requires accurate cost/schedule data; integration with finance systems |
| **Dependencies** | Requires project-level data capture; potentially integration with MS Project/Planner |
| **Standalone value** | Partial — OKRs work standalone; EVM needs project data |
| **Differentiation** | **High** — strategic traceability from portfolio OKRs to project EVM |

**Rationale:** This is strategically important but technically complex. EVM requires reliable cost and schedule data that may not exist or may live in other systems. Defer to Phase 3 when Helm has established data capture patterns and integration foundation.

**Phase 3 Approach:**
- Start with OKR definition (portfolio → programme)
- Add KPI tracking (manual entry initially)
- EVM metrics when project-level data integration exists
- Roll-up to portfolio health scores

---

#### 7. Critical Path Tracking

| Aspect | Assessment |
|--------|------------|
| **Pain addressed** | "Dependencies managed informally; ripple effects not visible" |
| **Personas served** | Portfolio Director, Programme Manager |
| **Technical risk** | **High** — critical path requires detailed task-level data; algorithmic complexity |
| **Dependencies** | Requires dependency mapping in RAID; integration with project scheduling tools |
| **Standalone value** | No — needs task-level data that Helm won't capture in MVP |
| **Differentiation** | Cross-programme critical path is rare in current tools |

**Rationale:** Critical path tracking is powerful but requires deep integration with project scheduling tools (MS Project, Planner) and detailed task-level data. This is Phase 4 territory — after Helm has proven value at the governance layer.

**Phase 4 Approach:**
- Integration with MS Project / Planner for task data
- Dependency mapping at programme level
- Cross-programme critical path visualisation
- "What-if" scenario modelling

---

### Won't Have (This Phase)

Explicitly out of scope for MVP to maintain focus.

| Item | Rationale |
|------|-----------|
| **Mobile native app** | Web responsive is sufficient for MVP; native apps add complexity |
| **Offline capability** | Assumes stable connectivity (assumption T5); defer if proves wrong |
| **Multi-language support** | English-only for MVP; localisation is significant scope |
| **On-premises deployment** | SaaS-only for MVP; validate assumption T8 first |
| **Advanced AI features** | Beyond basic action extraction; defer ML-powered insights |
| **Custom workflow builder** | Prescriptive workflows first; customisation adds complexity |
| **Third-party integrations beyond MS365** | Focus on core platform first; Jira/ADO etc. in later phases |

---

## Capability Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                         MVP FOUNDATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────┐    ┌─────────────────────┐           │
│   │  Centralised RAID   │    │  Action-Driven      │           │
│   │       Log           │───▶│    Management       │           │
│   │                     │    │                     │           │
│   │  (MUST HAVE)        │    │  (MUST HAVE)        │           │
│   └─────────────────────┘    └──────────┬──────────┘           │
│              │                          │                       │
│              │                          │                       │
│              ▼                          ▼                       │
│   ┌─────────────────────────────────────────────────┐          │
│   │           Basic Dashboards & Reporting          │          │
│   │                   (MUST HAVE)                   │          │
│   └─────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Meeting      │ │      RACI       │ │   OKRs/KPIs     │
│  Integration    │ │    Matrix       │ │      EVM        │
│                 │ │                 │ │                 │
│ (SHOULD/PHASE 2)│ │   (PHASE 2)     │ │   (PHASE 3)     │
└─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────┐
                                      │  Critical Path  │
                                      │    Tracking     │
                                      │                 │
                                      │   (PHASE 4)     │
                                      └─────────────────┘
```

### Dependency Notes

| From | To | Dependency Type |
|------|-----|-----------------|
| RAID Log | Action Management | Actions can link to RAID items (enhances, not blocks) |
| RAID Log | Dashboards | Data source for dashboard content |
| Action Management | Dashboards | Data source for dashboard content |
| Action Management | Meeting Integration | Meeting integration creates actions |
| RAID Log | RACI Matrix | RACI assignments link to RAID items |
| Action Management | RACI Matrix | RACI assignments link to actions |
| OKRs/KPIs | EVM | EVM is a type of KPI measurement |
| EVM | Critical Path | Critical path analysis uses schedule data from EVM |

---

## Smallest Viable Version

### MVP Feature Set

| Capability | MVP Scope | What's Deferred |
|------------|-----------|-----------------|
| **Centralised RAID** | Create, read, update RAID items; tier assignment (portfolio/programme/project); ownership; status; basic search/filter | Advanced search, bulk operations, templates, auto-escalation rules |
| **Action Management** | Create actions (manual); assign owner; set due date; track status; link to RAID items; overdue highlighting | AI extraction, automated reminders, workflow automation |
| **Dashboards** | Portfolio summary; programme summary; RAID counts by status; action counts by status; overdue items list | Custom dashboards, advanced visualisations, trend analysis |
| **User Management** | Basic roles (Admin, Portfolio, Programme, Project); authentication via Azure AD | Fine-grained permissions, custom roles, delegation |
| **P3O Alignment** | Tiered data model; terminology aligned to frameworks | Framework templates, methodology guidance, maturity assessment |

### MVP User Stories

**As a PMO Lead, I can...**
- Log a risk, assumption, issue, or dependency against a programme or project
- See all RAID items across the portfolio in one view
- Create an action and assign it to an owner with a due date
- See which actions are overdue across all programmes
- Generate a summary view for the portfolio board

**As a Programme Manager, I can...**
- See all RAID items for my programme and its projects
- Create and track actions for my programme
- Escalate a risk or issue to portfolio level
- See a dashboard of my programme's health

**As a Project Manager, I can...**
- Log RAID items against my project
- See actions assigned to me or my team
- Update action status as work progresses
- Escalate items to programme level

**As a Portfolio Director, I can...**
- See portfolio-level RAID summary
- Review escalated items requiring attention
- See action completion rates across programmes

**As a Programme Sponsor (SRO), I can...**
- See programme dashboard without drilling into detail
- Identify items flagged for escalation or decision
- Have confidence the programme is being tracked properly

**As a Portfolio Steering Board Chair, I can...**
- See portfolio health at a glance
- Trust the data is current (not stale spreadsheets)
- Identify programmes requiring intervention

---

## MVP Success Criteria

The MVP is successful if:

| Criterion | Measure |
|-----------|---------|
| **Core pain addressed** | PMO Lead can produce portfolio summary in <30 mins (vs days) |
| **Data quality** | >80% of RAID items have owner and status within 1 week of creation |
| **Adoption** | At least one pilot organisation uses Helm for 3+ months |
| **User feedback** | Net Promoter Score positive; users would recommend to peers |
| **Commercial validation** | At least one organisation expresses willingness to pay |

---

## Phased Capability Roadmap

| Phase | Capabilities | User Outcome |
|-------|--------------|--------------|
| **MVP** | Centralised RAID, Action Management, Basic Dashboards | "I can see everything in one place and track actions properly" |
| **Phase 2** | Meeting Integration, RACI Matrix | "Actions are captured from meetings; accountability is clear" |
| **Phase 3** | OKRs/KPIs, Basic EVM | "I can see how projects contribute to strategy and track performance" |
| **Phase 4** | Critical Path, Advanced EVM, Integrations | "I can see dependencies and forecast outcomes across the portfolio" |

---

## Risks to MVP Scope

| Risk | Mitigation |
|------|------------|
| **Scope creep** — adding features beyond MVP | Strict MoSCoW adherence; park requests for Phase 2+ |
| **Over-engineering** — building for scale too early | Build for single tenant first; scale later |
| **Perfectionism** — delaying launch for polish | Launch when MVP criteria met; iterate based on feedback |
| **Assumption T4 failure** — AI extraction doesn't work | MVP works without it; manual action capture is fallback |

---

## Document History

| Date | Changes |
|------|---------|
| 2026-01-26 | Initial version created |

---

*This document should be reviewed after customer validation conversations and updated based on feedback.*
