# Helm Project Brief

## Project Overview

| Item | Detail |
|------|--------|
| **Project name** | Helm |
| **Tagline** | Governance control for organisational change |
| **Vision** | Portfolio/programme governance tool that connects to an organisation's operational stack to provide oversight, assurance, and action-driven management of change delivery |
| **Phase 1 goal** | Live landing page explaining the product |
| **Target completion** | 5–7 days (with AI coding agents) |
| **Tools** | VS Code, Git, GitHub, Claude Code |

---

## Timeline Philosophy

With AI coding agents (Claude Code), development time compresses significantly. The constraint shifts:

| Activity | Bottleneck | Implication |
|----------|------------|-------------|
| Writing code | Machine | Hours, not days |
| Design decisions | Human | Can't be rushed |
| Requirements refinement | Human | Needs thinking time |
| Review & iteration | Hybrid | Faster, but not instant |
| Learning new concepts | Human | Budget time to absorb |

**Rule of thumb:** Estimate based on human decision points, not lines of code.

---

## Core Capabilities (Full Solution)

### 1. Centralised RAID Log

| Element | Function |
|---------|----------|
| **Risks** | Identify, assess, mitigate, escalate across portfolio/programme/project |
| **Assumptions** | Track and validate; flag when invalidated |
| **Issues** | Log, assign, track to resolution |
| **Dependencies** | Map internal/external dependencies; flag blockers |

**Key features:**

- Single indexed repository across all tiers (portfolio → programme → project)
- Inheritance and escalation pathways between levels
- Ownership assignment and accountability tracking
- Status dashboards and ageing reports
- Search and filtering by programme, owner, status, category

---

### 2. Governance Meeting Integration

| Capability | Detail |
|------------|--------|
| **Meeting recording ingestion** | Connect to Teams/Zoom recordings |
| **Transcription & indexing** | Searchable transcripts linked to governance tier |
| **Action extraction** | AI-assisted identification of decisions and actions from recordings |
| **Action tracking** | Assigned actions flow into central tracker with owners and due dates |
| **Audit trail** | Link actions/decisions back to source recording and timestamp |

**Governance tiers supported:**

- Portfolio board / investment committee
- Programme board
- Project board
- Working groups / workstream leads

---

### 3. Action-Driven Management

| Feature | Purpose |
|---------|---------|
| **Action register** | Central log of all actions across governance levels |
| **Owner accountability** | Clear assignment, notifications, escalation |
| **Progress tracking** | Status updates, completion evidence |
| **Overdue alerts** | Automated nudges and escalation triggers |
| **Reporting** | Action completion rates, ageing, bottlenecks |

---

### 4. P3O Alignment

Helm's design will conform to **P3O (Portfolio, Programme and Project Offices)** guidance from AXELOS. Key principles embedded:

| P3O Principle | Helm Implementation |
|---------------|---------------------|
| **Tiered governance** | Supports portfolio, programme, project levels with appropriate separation |
| **Scalability** | Configurable for single programme or enterprise-wide deployment |
| **Assurance** | Built-in health checks, stage gate support, exception reporting |
| **Information hub** | Single source of truth for RAID, actions, decisions |
| **Tailoring** | Governance structures configurable to organisation context |
| **Enablement** | Supports P3O functions: delivery support, COE, embedded PMO |

**Reference frameworks:**

- P3O (Portfolio, Programme and Project Offices)
- MSP (Managing Successful Programmes)
- MoP (Management of Portfolios)
- PRINCE2
- PRINCE2 Agile
- MoR (Management of Risk)

---

### 5. RACI Matrix & Accountability Dashboard

| Element | Function |
|---------|----------|
| **RACI definitions** | Responsible, Accountable, Consulted, Informed assignments per deliverable/decision |
| **Cascade logic** | Portfolio-level RACIs inherited and refined at programme/project level |
| **Action log integration** | Actions auto-tagged with RACI roles; accountability visible in action register |
| **Dashboard views** | Filter by role, person, tier; identify gaps and overloads |
| **Conflict detection** | Flag missing Accountables, multiple Accountables, orphaned responsibilities |

**Key features:**

- Define RACI at portfolio level; programmes/projects inherit and extend
- Link RACI to governance decisions, deliverables, and RAID items
- "My accountabilities" view per user across all tiers
- Workload heatmaps to spot over-assignment

---

### 6. Cascaded OKRs, KPIs & Earned Value Management

| Element | Function |
|---------|----------|
| **Strategic OKRs** | Portfolio-level objectives and key results |
| **KPI cascade** | OKRs decompose into programme KPIs → project KPIs |
| **Traceability** | Every project KPI traces back to strategic objective |
| **EVM integration** | Earned Value metrics (PV, EV, AC, SPI, CPI) at project level, aggregated upward |
| **Variance reporting** | Automatic flag when KPIs/EVM thresholds breached |

**Key features:**

- Define strategic OKRs at portfolio level
- Map programme objectives to portfolio OKRs
- Map project deliverables/milestones to programme KPIs
- EVM calculated per project; rolled up to programme/portfolio health scores
- Traffic light dashboards with drill-down to root cause

**EVM metrics supported:**

| Metric | Description |
|--------|-------------|
| **PV** | Planned Value |
| **EV** | Earned Value |
| **AC** | Actual Cost |
| **SV / SPI** | Schedule Variance / Schedule Performance Index |
| **CV / CPI** | Cost Variance / Cost Performance Index |
| **EAC / ETC** | Estimate at Completion / Estimate to Complete |
| **TCPI** | To-Complete Performance Index |

---

### 7. Critical Path Tracking

| Element | Function |
|---------|----------|
| **Project critical path** | Identify longest dependency chain per project |
| **Programme aggregation** | Roll up project critical paths to programme-level view |
| **Portfolio view** | Cross-programme dependencies and portfolio-level critical path |
| **Dependency mapping** | Internal and external dependencies visualised |
| **Impact analysis** | Model "what if" scenarios for slippage |

**Key features:**

- Auto-calculate critical path from task dependencies
- Highlight tasks with zero float
- Programme dashboard shows which projects are on critical path
- Portfolio dashboard shows cross-programme dependencies
- Alerts when critical path tasks slip or are at risk
- Integration with Planner/Project for task-level data

---

## Future Integration Landscape

| System | Integration purpose |
|--------|---------------------|
| **MS Teams** | Meeting recordings, notifications, approvals |
| **Planner / Project** | Task sync, workstream visibility, critical path data |
| **SharePoint** | Document governance, artefact storage |
| **Outlook** | Calendar integration, email alerts |
| **Power BI / Data warehouse** | Reporting, status aggregation, EVM dashboards |
| **Azure AD / Entra** | SSO, user provisioning, org structure, RACI population |
| **Jira / ADO** | Delivery team integration |
| **Zoom** | Alternative meeting recording source |
| **Azure Cognitive Services / OpenAI** | Transcription, action extraction |

---

## Phase 1 File Structure

```
helm/
├── .git/
├── .gitignore
├── README.md
├── index.html
├── css/
│   └── styles.css
├── images/
└── docs/
    ├── project-brief.md
    ├── objectives.md
    ├── personas.md
    ├── assumptions.md
    ├── mvp-scope.md
    ├── success-criteria.md
    ├── nfrs.md
    ├── roadmap.md
    ├── glossary.md
    └── planning-log.md
```

---

## Phase 1 Task Breakdown

### Stage 1: Environment Setup

**Estimated time:** 1–2 hours
**Bottleneck:** Machine (trivial with Claude Code)

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 1.1 | Create project folder `helm` | Folder exists locally |
| 1.2 | Initialise Git | `.git/` folder present |
| 1.3 | Create `.gitignore` | Ignores OS files, editor files |
| 1.4 | Create `README.md` with project name and one-line description | File committed |
| 1.5 | Create folder structure (`css/`, `images/`, `docs/`) | Folders exist |
| 1.6 | First commit | `git log` shows initial commit |

**Claude Code prompt:**

> "Help me set up a new project folder called helm with Git initialised, a sensible .gitignore for a static website, a basic README, and folders for css, images, and docs."

---

### Stage 2: Planning Foundations

**Estimated time:** 2–3 days
**Bottleneck:** Human (decisions, thinking, iteration)

This stage requires careful thought—don't rush it. Work through each sub-task in sequence.

---

#### 2.1 Problem Statement

**Time:** 2–3 hours | **Constraint:** Human thinking

**Claude Code prompt:**

> "Help me write a problem statement for Helm. I need to articulate:
>
> 1. What's broken about portfolio/programme governance today?
> 2. What pain do PMO teams and governance leads experience?
> 3. What's the cost of the status quo (wasted time, failed projects, lack of visibility)?
> 4. Why do existing tools (Excel, ServiceNow, Planview, MS Project) fall short?
>
> Challenge my assumptions. Push back if my problem statement is too vague or doesn't reflect real pain. Output a crisp 2–3 paragraph problem statement for docs/objectives.md."

**Output:** Problem statement section in `docs/objectives.md`

**Acceptance criteria:**
- [ ] Specific pain points named (not generic)
- [ ] Cost of status quo quantified or illustrated
- [ ] Existing tool gaps identified

---

#### 2.2 User Personas

**Time:** 3–4 hours | **Constraint:** Human decisions

**Claude Code prompt:**

> "Help me create 6 user personas for Helm. For each persona, define:
>
> - Role title and seniority
> - Primary goals (what does success look like for them?)
> - Key frustrations with current governance tools/processes
> - Typical workflow (daily/weekly activities)
> - What Helm capabilities matter most to them
> - Success metrics (how would they measure Helm's value?)
>
> **Governance / Oversight roles:**
> 1. Portfolio Steering Board Chair (executive sponsor, investment decisions)
> 2. Programme Sponsor (accountable for programme outcomes, not day-to-day delivery)
>
> **Operational / Delivery roles:**
> 3. Portfolio Director / Head of Change
> 4. Programme Manager
> 5. PMO Lead / Governance Lead
> 6. Project Manager / Delivery Lead
>
> Note the distinction: governance roles need visibility and decision support; operational roles need tools to manage and report. Helm must serve both.
>
> Challenge me if these aren't the right personas. Are there other roles we're missing? Output to docs/personas.md."

**Output:** `docs/personas.md`

**Acceptance criteria:**
- [ ] 6 distinct personas covering governance and operational roles
- [ ] Pain points specific to each role
- [ ] Clear distinction between oversight needs vs. delivery needs
- [ ] Clear link between persona needs and Helm capabilities

---

#### 2.3 Assumptions & Constraints

**Time:** 1–2 hours | **Constraint:** Human reflection

**Claude Code prompt:**

> "Help me document the assumptions and constraints for Helm. Challenge each assumption—if it's wrong, what's the impact?
>
> **Technical assumptions:**
> - Target users have Microsoft 365 (Teams, Planner, SharePoint)
> - Meeting recordings are available and accessible via API
> - Users have stable internet connectivity
>
> **User assumptions:**
> - Users are familiar with AXELOS frameworks (P3O, PRINCE2, etc.)
> - Users currently have some governance process (not starting from zero)
> - Organisations have defined portfolio/programme/project hierarchy
>
> **Commercial assumptions:**
> - SaaS delivery model
> - B2B sales (not consumer)
> - Target market: mid-to-large enterprises with active change portfolios
>
> **Constraints:**
> - Solo developer (me), learning as I go
> - Limited budget for infrastructure initially
> - No existing user base to test with
>
> What assumptions am I missing? What constraints haven't I considered? Output to docs/assumptions.md."

**Output:** `docs/assumptions.md`

**Acceptance criteria:**
- [ ] Technical, user, commercial assumptions listed
- [ ] Each assumption has "if wrong, then..." impact noted
- [ ] Constraints acknowledged honestly

---

#### 2.4 MVP Definition & Prioritisation

**Time:** 2–3 hours | **Constraint:** Human judgement

**Claude Code prompt:**

> "Help me define the MVP scope for Helm and prioritise the seven capabilities using MoSCoW.
>
> **The seven capabilities are:**
> 1. Centralised RAID Log
> 2. Governance Meeting Integration (recording → actions)
> 3. Action-Driven Management
> 4. P3O Alignment (design principles)
> 5. RACI Matrix & Accountability Dashboard
> 6. Cascaded OKRs, KPIs & EVM
> 7. Critical Path Tracking
>
> **Questions to answer:**
> - Which 2–3 capabilities are essential for a usable first release?
> - What's the simplest version of each MVP capability?
> - What can wait until later phases?
> - What dependencies exist between capabilities?
>
> **Apply MoSCoW:**
> - **Must have** — MVP won't function without it
> - **Should have** — Important, include if feasible
> - **Could have** — Nice to have, lower priority
> - **Won't have (this phase)** — Explicitly deferred
>
> Challenge my prioritisation. What's the smallest thing that would deliver real value to a PMO Lead? Output to docs/mvp-scope.md."

**Output:** `docs/mvp-scope.md`

**Acceptance criteria:**
- [ ] MVP capabilities identified (recommend 2–3)
- [ ] Each capability has MoSCoW rating with rationale
- [ ] Dependencies mapped
- [ ] "Smallest viable" version of each MVP capability described

---

#### 2.5 Success Criteria

**Time:** 1–2 hours | **Constraint:** Human definition

**Claude Code prompt:**

> "Help me define success criteria for Helm at three levels:
>
> **1. Phase 1 success (landing page):**
> - What makes the landing page 'done'?
> - How do we know the messaging resonates?
>
> **2. MVP success (first functional release):**
> - What user outcomes indicate value?
> - What metrics would we track? (e.g., actions tracked, time saved, adoption rate)
>
> **3. Product-market fit signals:**
> - What would indicate Helm is solving a real problem?
> - What would make someone pay for it?
>
> For each criterion, make it **specific and measurable** where possible. Avoid vague terms like 'user-friendly' or 'intuitive.' Output to docs/success-criteria.md."

**Output:** `docs/success-criteria.md`

**Acceptance criteria:**
- [ ] Phase 1, MVP, and long-term criteria defined
- [ ] Criteria are measurable or at least observable
- [ ] No vague/subjective terms

---

#### 2.6 Non-Functional Requirements

**Time:** 1–2 hours | **Constraint:** Human decisions (architecture impact)

**Claude Code prompt:**

> "Help me define non-functional requirements for Helm. Even rough targets are useful at this stage.
>
> **Categories to address:**
>
> | Category | Questions |
> |----------|-----------|
> | **Performance** | How many concurrent users? Acceptable page load time? |
> | **Scalability** | Single org or multi-tenant? Max portfolios/programmes? |
> | **Availability** | Uptime target? Maintenance windows acceptable? |
> | **Security** | Authentication method? Data encryption? Role-based access? |
> | **Compliance** | GDPR? SOC2? ISO 27001? Any industry-specific? |
> | **Data** | Retention period? Backup frequency? Export capability? |
> | **Accessibility** | WCAG compliance level? |
> | **Browser/device support** | Which browsers? Mobile responsive or native app? |
>
> I don't need enterprise-grade answers yet—just sensible defaults for an early-stage product. Flag anything that would significantly impact architecture decisions. Output to docs/nfrs.md."

**Output:** `docs/nfrs.md`

**Acceptance criteria:**
- [ ] Each category addressed (even if 'TBD' with rationale)
- [ ] Architecture-impacting decisions flagged
- [ ] Realistic for solo developer / early stage

---

#### 2.7 Roadmap (Phases 2–4)

**Time:** 1–2 hours | **Constraint:** Human planning

**Claude Code prompt:**

> "Help me sketch a high-level roadmap for Helm, Phases 2–4. This doesn't need to be detailed—just enough to see the shape of the journey.
>
> **Phase 1 (current):** Landing page — 5–7 days
>
> **Phase 2:** [Define] — ? days
> - What capabilities?
> - What's the user-facing outcome?
>
> **Phase 3:** [Define] — ? days
> - What capabilities?
> - What's the user-facing outcome?
>
> **Phase 4:** [Define] — ? days
> - What capabilities?
> - What's the user-facing outcome?
>
> **Consider:**
> - Logical build sequence (dependencies)
> - Value delivery at each phase (something usable, not just backend)
> - Learning curve (what should I tackle while still a beginner vs. later?)
> - AI-assisted development speeds (days not weeks for coding tasks)
>
> Challenge my sequencing. What would you build first? Output to docs/roadmap.md."

**Output:** `docs/roadmap.md`

**Acceptance criteria:**
- [ ] Phases 2–4 sketched with indicative scope
- [ ] Each phase has a user-facing outcome
- [ ] Capability sequencing logical
- [ ] Timeline estimates realistic for AI-assisted development

---

#### 2.8 Glossary

**Time:** 30–60 minutes | **Constraint:** Machine (Claude can draft quickly)

**Claude Code prompt:**

> "Help me create a glossary for Helm documentation. Define the following terms in plain English (1–2 sentences each):
>
> **Frameworks:**
> - P3O, MSP, MoP, PRINCE2, PRINCE2 Agile, MoR
>
> **Governance terms:**
> - Portfolio, Programme, Project
> - RAID (Risks, Assumptions, Issues, Dependencies)
> - RACI (Responsible, Accountable, Consulted, Informed)
> - Stage gate, Assurance, Exception reporting
>
> **Performance terms:**
> - OKR (Objectives and Key Results)
> - KPI (Key Performance Indicator)
> - EVM (Earned Value Management)
> - PV, EV, AC, SPI, CPI, EAC, ETC, TCPI
> - Critical path, Float
>
> Keep definitions accessible to someone new to project management. Output to docs/glossary.md."

**Output:** `docs/glossary.md`

**Acceptance criteria:**
- [ ] All listed terms defined
- [ ] Plain English, no jargon in definitions
- [ ] Consistent format

---

#### Stage 2 Wrap-Up

**Time:** 30 minutes | **Constraint:** Human review

- [ ] Review all docs for consistency
- [ ] Update `docs/planning-log.md` with key decisions and rationale
- [ ] Commit all Stage 2 outputs
- [ ] Self-assess against quality checklist below

**Stage 2 Quality Checklist:**

```
[ ] Problem statement articulates real pain
[ ] 6 user personas covering governance and operational roles
[ ] Assumptions documented with "if wrong" impacts
[ ] MVP scope defined (2–3 core capabilities)
[ ] MoSCoW prioritisation applied to all capabilities
[ ] Success criteria are specific and measurable
[ ] Non-functional requirements addressed
[ ] Roadmap sketched for Phases 2–4
[ ] Glossary covers all jargon
[ ] All docs committed to Git
```

---

### Stage 3: Landing Page Content

**Estimated time:** 3–4 hours
**Bottleneck:** Hybrid (human approves messaging, machine generates code)

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 3.1 | Draft landing page copy | Markdown file in `docs/` |
| 3.2 | Create `index.html` with semantic structure | Valid HTML |
| 3.3 | Add content to HTML | Page displays in browser |
| 3.4 | Commit progress | Clean commit |

**Suggested page sections:**

1. **Hero** – Headline + value prop
2. **Problem** – Why governance over change portfolios is hard
3. **Solution** – What Helm does
4. **Features** – Centralised RAID, meeting-to-action, RACI accountability, OKR/KPI/EVM tracking, critical path visibility
5. **P3O alignment** – Built on best practice frameworks
6. **Integrations** – Connects to MS Teams, SharePoint, Planner, etc.
7. **CTA** – "Request early access"
8. **Footer**

**Claude Code prompt:**

> "Using the objectives, personas, and capability model from docs/, help me draft landing page copy for Helm. Emphasise: centralised RAID log, governance meeting integration with action extraction, cascading RACI accountability, OKR-to-KPI traceability with EVM, critical path tracking across the portfolio, and P3O alignment. Then create a semantic HTML structure for the single-page site."

---

### Stage 4: Styling

**Estimated time:** 2–3 hours
**Bottleneck:** Machine (CSS generation fast; human iteration on aesthetics)

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 4.1 | Create `css/styles.css` | File exists, linked in HTML |
| 4.2 | Apply base styles | Page is readable and professional |
| 4.3 | Make layout responsive | Works on mobile |
| 4.4 | Commit progress | Clean commit |

**Claude Code prompt:**

> "Help me create a clean, professional CSS stylesheet for my Helm landing page. Use a modern sans-serif font, a colour palette suitable for a B2B governance/enterprise product, and make it responsive."

---

### Stage 5: GitHub & Deployment

**Estimated time:** 1–2 hours
**Bottleneck:** Machine (commands are quick; human follows steps)

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 5.1 | Create GitHub repository `helm` | Repo exists on GitHub |
| 5.2 | Connect local repo to remote | `git remote -v` shows origin |
| 5.3 | Push code | Code visible on GitHub |
| 5.4 | Enable GitHub Pages | Live URL works |
| 5.5 | Update README with live URL | Pushed |

**Claude Code prompt:**

> "Walk me through connecting my local helm repo to a new GitHub repository and pushing the code. Then help me enable GitHub Pages so the site is live."

---

### Stage 6: Review & Iterate

**Estimated time:** 2–4 hours
**Bottleneck:** Human (review, decisions on fixes)

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 6.1 | Review live site on desktop and mobile | No obvious issues |
| 6.2 | Fix any issues | Changes committed |
| 6.3 | Write a short reflection in `docs/` | File exists |
| 6.4 | Final commit and push | Repo up to date |

---

## Phase 1 Timeline Summary

| Stage | Tasks | Estimated Time | Bottleneck |
|-------|-------|----------------|------------|
| 1 | Environment setup | 1–2 hours | Machine |
| 2 | Planning foundations | 2–3 days | Human |
| 3 | Landing page content | 3–4 hours | Hybrid |
| 4 | Styling | 2–3 hours | Machine |
| 5 | GitHub & deployment | 1–2 hours | Machine |
| 6 | Review & iterate | 2–4 hours | Human |
| **Total** | | **5–7 days** | |

**Note:** Stage 2 dominates the timeline because it requires human thinking. Don't compress it—the quality of your planning determines everything downstream.

---

## Indicative Roadmap (Phases 1–4)

| Phase | Focus | Indicative Duration | Outcome |
|-------|-------|---------------------|---------|
| **1** | Landing page | 5–7 days | Live marketing site |
| **2** | Core data model + basic RAID | 7–10 days | Functional RAID log with CRUD |
| **3** | Actions + simple dashboards | 7–10 days | Action tracking, basic reporting |
| **4** | Integrations + RACI | 10–14 days | MS365 connectivity, accountability views |

**Beyond Phase 4:** OKR/KPI cascade, EVM, critical path tracking, advanced reporting. Scope TBD based on learnings.

---

## Checklist Summary

```
[ ] Project folder and Git initialised
[ ] .gitignore, README, folder structure in place
[ ] Planning foundations complete:
    [ ] objectives.md (problem statement)
    [ ] personas.md
    [ ] assumptions.md
    [ ] mvp-scope.md
    [ ] success-criteria.md
    [ ] nfrs.md
    [ ] roadmap.md
    [ ] glossary.md
    [ ] planning-log.md
[ ] Landing page copy drafted
[ ] index.html created with semantic structure
[ ] styles.css applied, page looks professional
[ ] Responsive on mobile
[ ] Pushed to GitHub
[ ] GitHub Pages enabled, site live
[ ] README updated with live URL
```

---

## Next Actions

1. Open Claude Code
2. Run the Stage 1 prompt to scaffold the project
3. Work through Stage 2 sub-tasks methodically (this is where the value is)
4. Proceed through Stages 3–6, committing as you go

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-23 | Initial project brief created |
| 1.1 | 2026-01-23 | Added RACI matrix, OKRs/KPIs/EVM, and critical path tracking capabilities |
| 2.0 | 2026-01-23 | Expanded Stage 2 into 8 sub-tasks based on BA review; revised timelines to days for AI-assisted development |
| 2.1 | 2026-01-23 | Extended user personas to include Programme Sponsor and Portfolio Steering Board Chair (6 personas total) |
