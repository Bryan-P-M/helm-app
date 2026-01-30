# Helm Design Intelligence Specification (NDED)

> Strategic Design System Specification for Enterprise Portfolio Governance SaaS

---

## Part 1: Philosophical Foundation

### The Emotional Contract

**PMO Leads must feel:** *Commanding clarity*—the cognitive state of a pilot with full instrument visibility. Every signal meaningful, every control predictable, every decision traceable. The system is an extension of their expertise, not a barrier to it.

**Governance Board Members must feel:** *Earned assurance*—confidence that emerges from evidence, not decoration. Portfolio health is legible at a glance. Risk exposure is surfaced, not buried. They trust the system because it shows its working.

**The core emotional transaction:** Helm converts organisational anxiety (fragmented data, unclear accountability, invisible decisions) into operational confidence (single source of truth, traceable actions, auditable governance).

### The Single Most Critical Decision Moment

**The escalation judgment.**

When a user sees a red indicator—a slipped milestone, a risk threshold breach, an overdue action—they must decide: *Is this noise or signal? Do I escalate or investigate? Who owns this, and can I trust that assignment?*

This moment determines whether Helm enables decisive action or creates governance theatre. Every design decision must optimise for this 3-5 second judgment:

- Can I trust this data? (Freshness, source attribution)
- Is this my problem? (Ownership clarity, RACI visibility)
- What's the impact? (Cascading dependencies, strategic alignment)
- What do I do next? (Clear action path, escalation route)

### What Makes Enterprise Governance Interfaces Trustworthy

1. **Provenance visibility** — Every number, status, and decision links to its source. Audit trails are first-class citizens, not afterthoughts.

2. **Temporal honesty** — The system shows when data was last updated, distinguishes stale from fresh, and never presents assumptions as facts.

3. **Failure transparency** — When data is missing, incomplete, or conflicting, the interface says so explicitly. It never papers over uncertainty.

4. **Predictable behaviour** — Same action, same result, every time. No magic, no surprises, no hidden state.

5. **Hierarchical integrity** — The system respects organisational structure. Escalations flow correctly. Inheritance logic is visible. Nothing is orphaned.

---

## Part 2: First Principles Analysis

### Cognitive Task Model

Users don't think in features—they think in questions. Helm must answer these:

| Cognitive Task | User Question | Success Metric |
|----------------|---------------|----------------|
| **Triage risk** | "What needs my attention right now?" | <5 seconds to identify top 3 items requiring action |
| **Trace accountability** | "Who owns this, and are they on it?" | 2 clicks from any item to owner + status history |
| **Escalate delivery issues** | "Should this go higher? To whom?" | Clear escalation path visible from any RAID item |
| **Validate decisions** | "What did we agree? When? What evidence?" | Source-linked audit trail with timestamp + recording reference |
| **Assess portfolio health** | "Are we on track strategically?" | Single view connecting delivery status to OKR progress |
| **Model scenarios** | "What happens if X slips?" | Interactive what-if with cascading impact preview |
| **Prepare for governance** | "What do I need to present? What's changed?" | Auto-generated delta report since last meeting |

### Data Type Taxonomy

| Data Type | Characteristics | Display Requirements |
|-----------|-----------------|---------------------|
| **Temporal** | Deadlines, milestones, durations, trends | Timeline visualisation, relative time display, overdue prominence |
| **Hierarchical** | Portfolio > Programme > Project > Workstream | Collapsible trees, breadcrumb navigation, inheritance indicators |
| **Comparative** | Baseline vs. actual, plan vs. forecast | Side-by-side layouts, variance highlighting, sparklines |
| **Relational** | Dependencies, RACI assignments, cross-project links | Connection lines, hover reveals, link counts |
| **Real-time** | Live status, meeting transcripts, recent actions | Freshness indicators, streaming updates, "last updated" stamps |
| **Historical** | Decision logs, audit trails, trend data | Filterable timelines, version comparison, snapshot retrieval |

### Decision Context Modes

#### Glanceable triage (5-15 seconds)
- Dashboard entry points
- Exception-based alerts
- Status summaries
- Notification centre
- Mobile views

**Design requirement:** Maximum information density with zero cognitive debt. Traffic light logic. Count badges. Sparklines. No interaction required to understand state.

#### Focused investigation (2-10 minutes)
- Individual RAID item deep-dive
- Action chain analysis
- Meeting decision review
- Owner workload assessment

**Design requirement:** Progressive disclosure. Context preserved during drill-down. Easy return to origin. Related items surfaced without overwhelming.

#### Immersive analysis (15+ minutes)
- What-if scenario modelling
- Critical path replanning
- Portfolio rebalancing
- Retrospective preparation

**Design requirement:** Full-screen canvas. Undo/redo. Session persistence. Export capability. Collaboration hooks.

### Measurable Success Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Time to first actionable insight | <5 seconds from login | Task completion timing |
| Clicks from alert to owner | ≤2 | Interaction logging |
| Clicks from board decision to assigned action | ≤3 | Path analysis |
| Report assembly time | -70% vs. manual (current ~40% of PMO time) | Comparative time study |
| Escalation chain visibility | 100% traceable | Audit completeness check |
| Data freshness awareness | 100% of items show last-updated | Coverage audit |

### Design Tensions to Resolve

| Tension | Resolution Strategy |
|---------|---------------------|
| **Density vs. Clarity** | Progressive disclosure with stable spatial anchors. Dense overview → sparse detail. Never hide structure, but defer content. |
| **Flexibility vs. Consistency** | Constrained flexibility. Users configure *which* data shows, not *how* it displays. Layouts are fixed; content is filterable. |
| **Novice Learnability vs. Expert Speed** | Visible defaults with hidden power. Primary actions always visible; keyboard shortcuts, bulk operations, and advanced filters available but not prominent. |
| **Visual Delight vs. Decision Utility** | Utility first, always. No gratuitous animation. No decoration that doesn't encode information. Visual refinement serves comprehension, not aesthetics. |
| **Governance Rigour vs. Usability** | Make rigour easy. Audit trails captured automatically. Compliance achieved through workflow design, not user burden. |

---

## Part 3: Competitive Interface Analysis

### 1. Linear (Project Management)

**Cognitive problem solved:** Status visibility across complex workflows without visual noise.

**Pain addressed:** Traditional tools bury status in detail views; Linear surfaces it immediately.

**Trade-off visible:** Sacrifices configurability for speed. Limited customisation, but fast.

**Extract:** Issue status chips with colour + icon + label. Keyboard-first navigation. Command palette (Cmd+K) for power users.

**Reject:** Gaming/tech aesthetic inappropriate for enterprise governance. Lacks hierarchical depth.

**State handling:** Empty states are action-oriented ("Create your first issue"). Loading uses skeleton screens preserving layout.

### 2. Superhuman (Email)

**Cognitive problem solved:** Triage speed in high-volume information environments.

**Pain addressed:** Email overwhelm paralysis.

**Trade-off visible:** Opinionated workflow over flexibility. Users adapt to the tool, not vice versa.

**Extract:** Split-screen with instant preview. Keyboard shortcuts for every action. "Done" as primary action—moves forward, not back.

**Reject:** Aggressively minimal—would lose necessary governance density.

**State handling:** Zero-inbox celebration. Clear distinction between "nothing to do" and "loading."

### 3. Figma (Design)

**Cognitive problem solved:** Navigating complex hierarchical structures with real-time collaboration.

**Pain addressed:** Version control chaos, collaboration fragmentation.

**Trade-off visible:** Steep learning curve accepted for power and flexibility.

**Extract:** Layers panel as hierarchical navigator. Hover-to-reveal contextual actions. Real-time presence indicators. Component-instance relationships.

**Reject:** Canvas metaphor doesn't suit data-heavy governance views.

**State handling:** Excellent—shows exactly what's loaded, what's syncing, who's viewing. Never ambiguous.

### 4. Notion (Workspace)

**Cognitive problem solved:** Unifying disparate information types in navigable structure.

**Pain addressed:** Tool sprawl, context switching.

**Trade-off visible:** Flexibility creates inconsistency. Every team's Notion looks different.

**Extract:** Block-based composition. Linked databases. Breadcrumb navigation with @-mention linking.

**Reject:** Too unstructured for governance rigour. Flexibility becomes liability when audit trails matter.

**State handling:** Graceful degradation. Offline capability. Syncing indicators.

### 5. Bloomberg Terminal

**Cognitive problem solved:** Maximum information density for expert users making time-critical decisions.

**Pain addressed:** Latency in financial decisions.

**Trade-off visible:** Accessibility and learnability sacrificed entirely for density and speed.

**Extract:** Spatial memory reliance—fixed layouts users memorise. Keyboard command language. Data update timestamps on every element.

**Reject:** Learning curve unacceptable for occasional governance users. Aesthetic inappropriate.

**State handling:** Aggressive freshness indication. Stale data visually distinct. Connection status always visible.

### 6. GitHub (Repository Management)

**Cognitive problem solved:** Tracing changes through complex dependency chains with full audit.

**Pain addressed:** "Who changed what, when, and why?"

**Trade-off visible:** Developer-centric mental model. Non-technical users struggle.

**Extract:** Commit/audit trail presentation. Blame view (who last touched what). Branch/merge visualisation for parallel workstreams. PR review workflow for approval chains.

**Reject:** Technical vocabulary. Assumes code familiarity.

**State handling:** Excellent provenance. Every state change attributed, timestamped, reversible.

### 7. Airtable (Database)

**Cognitive problem solved:** Spreadsheet familiarity with relational database power.

**Pain addressed:** Excel limitations without Access complexity.

**Trade-off visible:** Relational integrity often broken by user error.

**Extract:** View switching (grid, kanban, calendar, gallery) over same data. Linked records with expand-in-place. Filter builder UI.

**Reject:** Too flexible—governance needs more constraints.

**State handling:** Loading indicators per-cell. Clear empty vs. null distinction.

### 8. Palantir Foundry (Analytics)

**Cognitive problem solved:** Cross-domain data integration with lineage tracking.

**Pain addressed:** Data silos, untraceable insights.

**Trade-off visible:** Extreme power, extreme complexity. Requires dedicated analysts.

**Extract:** Data lineage visualisation—seeing where numbers come from. Ontology-based entity relationships. Pipeline transparency.

**Reject:** Implementation complexity inappropriate for SMB-adjacent market.

**State handling:** Pipeline status visibility. Clear indication of data freshness and transformation stages.

### 9. Slack (Messaging)

**Cognitive problem solved:** Contextual conversation threading without email overhead.

**Pain addressed:** Reply-all chaos, lost context.

**Trade-off visible:** Conversation fragmentation across channels. Searchability degrades.

**Extract:** Thread model for preserving discussion context. @-mention for accountability. Notification controls. Integration patterns.

**Reject:** Ephemerality inappropriate for governance audit.

**State handling:** Excellent presence indicators. Clear distinction between synced and pending.

### 10. Jira (Issue Tracking)

**Cognitive problem solved:** Workflow state management with customisation depth.

**Pain addressed:** Every team works differently; tool must adapt.

**Trade-off visible:** Configuration complexity. Jira instances become unmaintainable.

**Extract:** Board visualisation of workflow states. Issue linking patterns. JQL query power for advanced users.

**Reject:** Configuration debt. UX has degraded over time. Notification overwhelm.

**State handling:** Adequate but not excellent. Transition states sometimes unclear.

### 11. Stripe Dashboard (Financial Operations)

**Cognitive problem solved:** Complex financial data made legible for non-accountants.

**Pain addressed:** Financial reporting inaccessibility.

**Trade-off visible:** Simplifies at cost of advanced reporting depth.

**Extract:** Metric card design. Trend sparklines with context. Clear hierarchy of summary → detail. Export patterns.

**Reject:** Consumer-SaaS visual tone inappropriate for enterprise governance.

**State handling:** Excellent. Real-time updates clearly indicated. Time range selectors preserve context.

### 12. Asana (Work Management)

**Cognitive problem solved:** Task ownership clarity across projects.

**Pain addressed:** "Who's doing what?"

**Trade-off visible:** Simplicity limits portfolio-level governance.

**Extract:** My Tasks as personal command centre. Project status updates with structured format. Timeline/Gantt integration.

**Reject:** Lacks RAID, governance meeting integration, audit depth.

**State handling:** Good progressive loading. Clear distinction between project and personal views.

---

## Part 4: Design Principles (Max 5)

### Principle 1: Traceable, Not Trusted

**This:** Every number links to its source. Every status shows its timestamp. Every decision connects to its evidence.

**Not that:** Clean numbers without provenance. Status colours without explanation. Summaries without drill-down.

**Rationale:** Enterprise governance operates under audit scrutiny. Users need to defend their reports. A number without a source is a liability, not an asset. Trust is earned through transparency, not design polish.

**Implementation:** Hover reveals source + timestamp on all data points. Audit trail accessible from any item. "Last updated" as standard metadata. Source recording links on AI-extracted content.

---

### Principle 2: Escalation Paths, Not Dead Ends

**This:** Every problem state shows who owns it, what happens next, and how to escalate if stuck.

**Not that:** Red indicators without resolution routes. Alerts without owners. Problems without paths.

**Rationale:** Governance value comes from resolution, not identification. Showing a risk without showing who owns it and what they're doing creates anxiety without enabling action. The interface must always answer: "So what do I do about this?"

**Implementation:** Every RAID item shows owner, escalation route, and next action. Overdue items show both accountable party and their manager. Escalation is one click, with template message pre-populated.

---

### Principle 3: Hierarchy as Navigation, Not Decoration

**This:** Portfolio → Programme → Project structure is the primary navigation paradigm. Drilling down preserves context. Drilling up restores state.

**Not that:** Flat list views losing structural context. Modals breaking navigation flow. Filters that orphan items from their parent.

**Rationale:** Governance operates through organisational hierarchy. A risk at project level may matter at portfolio level—or may not. The structure determines meaning. Losing hierarchical context loses decision-relevant information.

**Implementation:** Persistent breadcrumb showing full path. Tree navigator always accessible. Drill-down opens in-context, not in modal. Filter state shows "viewing subset of [parent]."

---

### Principle 4: Exceptions First, Completeness on Demand

**This:** Default views surface anomalies, overdue items, and threshold breaches. Full data accessible but not default.

**Not that:** Complete lists requiring user scanning. All items equal visual weight. Problems hidden in volume.

**Rationale:** PMO cognitive load is dominated by volume. Showing everything means seeing nothing. Exception-based design respects user attention as finite resource. The interface does the scanning; users do the deciding.

**Implementation:** Dashboard shows RED/AMBER only by default. "Show all" expands to green. Counts indicate hidden items. Filters remember exception-first preference.

---

### Principle 5: Governance Rigour Through Workflow, Not Burden

**This:** Audit trails captured automatically. Compliance achieved through system design. Users work naturally; governance happens.

**Not that:** Manual logging requirements. Separate compliance workflows. Governance as overhead.

**Rationale:** If governance requires extra effort, users will skip it under pressure—exactly when it matters most. Compliance must be the path of least resistance. When users take the easy route, they should also be taking the compliant route.

**Implementation:** Meeting transcripts auto-processed; users approve, not create. Actions extracted with source links automatically. Status changes logged without user input. Decision attribution derived from system state, not user entry.

---

## Part 5: Information Architecture Schema

### Entity Hierarchy

```
ORGANISATION
└── PORTFOLIO (strategic investment container)
    ├── Metadata: Owner, Sponsor, Budget envelope, Strategic themes
    ├── Governance: Steering board, Meeting cadence, Decision log
    ├── Health: Aggregated RAG, Top risks, Budget variance
    │
    └── PROGRAMME (outcome-focused delivery grouping)
        ├── Metadata: SRO, Programme Manager, Business case
        ├── Governance: Programme board, Change control
        ├── Health: Stage status, Benefits realisation, Dependency health
        │
        └── PROJECT (deliverable-focused execution unit)
            ├── Metadata: PM, Sponsor, Delivery approach
            ├── Governance: Project board, Highlight reports
            ├── Health: Schedule variance, EVM metrics, RAID summary
            │
            └── WORKSTREAM (optional sub-project grouping)
                ├── Tasks/Deliverables
                └── Resources
```

### Cross-Cutting Entities

These entities exist at multiple hierarchy levels with inheritance logic:

| Entity | Inheritance Behaviour | Escalation Path |
|--------|----------------------|-----------------|
| **Risk** | Can be raised at any level. Escalated risks appear at parent level with "escalated from" tag. | Project → Programme → Portfolio → External (regulator, etc.) |
| **Issue** | Same as Risk. Issues blocking multiple children auto-surface to parent. | Same as Risk |
| **Action** | Created at any level. Rolls up to owner's personal action list. Overdue actions visible to owner's manager. | Owner → Owner's manager → Governance body |
| **Dependency** | Cross-entity dependencies tracked. Critical path aggregates to portfolio level. | Dependent item owner ↔ Dependency owner |
| **Decision** | Logged at governance meeting level. Linked to resulting actions and affected items. | N/A (historical record) |
| **KPI/OKR** | Defined at portfolio/programme level. Cascades to contributing projects. Progress aggregates upward. | N/A (measurement, not action) |

### Navigation Structure

**Primary Navigation (Left Sidebar - Persistent)**

```
🏠 Home (Personal dashboard)
📊 Portfolio Overview
   └── [Portfolio 1]
       ├── Programmes
       ├── Governance
       ├── RAID Summary
       └── Performance
   └── [Portfolio 2]
       └── ...
📋 My Actions
🔴 My Risks & Issues
📅 Meetings
⚙️ Settings
```

**Contextual Navigation (Within Entity Views)**
- Breadcrumb: Always visible, always clickable
- Tabs: Entity-specific views (Overview, RAID, Actions, Meetings, Performance)
- Related Panel: Linked items, dependencies, audit trail

### Layout Zoning

**Standard Entity View (3-Column)**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: Breadcrumb + Entity Title + RAG Status + Quick Actions  │
├──────────────┬─────────────────────────────┬────────────────────┤
│              │                             │                    │
│  NAVIGATION  │      PRIMARY CONTENT        │   CONTEXT PANEL    │
│              │                             │                    │
│  Tree view   │  Tabs → Table/Cards/Canvas  │  Related items     │
│  Filters     │                             │  Audit trail       │
│  Saved views │                             │  Properties        │
│              │                             │                    │
│  ~200px      │        Flexible             │     ~320px         │
│              │                             │   (collapsible)    │
└──────────────┴─────────────────────────────┴────────────────────┘
```

**Dashboard View (Card Grid)**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: View Title + Time Range + Filters                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Summary Card │ │ Summary Card │ │ Summary Card │            │
│  │ (KPI/Health) │ │ (Actions)    │ │ (Risks)      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Primary Detail Table/List (scrollable)                      ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Progressive Disclosure Pattern

**Level 1 - Glance (Dashboard card)**
- Count + RAG status
- Trend indicator (↑↓→)
- Click to expand

**Level 2 - Summary (Expanded card or list row)**
- Title, owner, status, due date
- Key metric (e.g., impact score for risks)
- One-line context

**Level 3 - Detail (Side panel or page)**
- Full description
- Status history
- Related items
- Audit trail
- Actions available

**Level 4 - Deep Dive (Full page with tabs)**
- All detail fields
- Discussion thread
- Attachments
- Complete history
- Configuration options

### Wayfinding Anchors

**Persistent elements (always visible):**
- Breadcrumb (hierarchical position)
- Entity RAG status (health at a glance)
- User avatar + notifications (personal context)
- Search (Cmd+K)

**Contextual elements (visible when relevant):**
- Unsaved changes indicator
- Filter active indicator
- View mode label (if non-default)
- Offline status

---

## Part 6: Component Specifications

### 6.1 RAID Log Component

**Purpose:** Centralised register of Risks, Assumptions, Issues, Dependencies with hierarchy-aware behaviour.

#### Standard States

| State | Visual Treatment | Behaviour |
|-------|------------------|-----------|
| **Empty** | Illustration + "No [type] recorded" + "Create first [type]" button | Primary action prominent |
| **Loading** | Skeleton rows preserving column structure | No spinner on full view; skeleton only |
| **Loaded (exceptions)** | RED/AMBER items shown; GREEN collapsed | Count badge shows hidden items |
| **Loaded (all)** | Full list with alternating row backgrounds | Pagination or virtualised scroll |
| **Filtered** | Active filter chips above table; "Clear all" visible | "Showing X of Y" count |
| **Error** | Inline error message with retry button | Preserve last-known data if available |
| **Stale** | Yellow banner: "Data last updated [time]. Refresh?" | Auto-refresh on focus if >15 min stale |

#### Column Structure

| Column | Width | Behaviour |
|--------|-------|-----------|
| ID | 80px fixed | Auto-generated, clickable to detail |
| Type | 48px fixed | Icon only (R/A/I/D) with tooltip |
| Title | Flexible (min 200px) | Truncate with ellipsis; full on hover |
| Status | 100px fixed | Colour-coded chip (Open/Mitigating/Closed/Escalated) |
| RAG | 48px fixed | Traffic light indicator |
| Owner | 120px fixed | Avatar + name; click to filter by owner |
| Due Date | 100px fixed | Red if overdue; relative time ("3d overdue") |
| Source Level | 100px fixed | Portfolio/Programme/Project badge |
| Escalated | 48px fixed | ↑ icon if escalated from below |

#### Row Interactions
- Hover: Highlight row; show quick actions (Edit, Escalate, Link)
- Click: Open detail panel (slide from right)
- Checkbox: Bulk selection for multi-actions
- Drag handle: Reorder priority within same status (where applicable)

#### Escalation Behaviour
- Escalate button prompts for target level and message
- Escalated item appears at parent level with "Escalated from [source]" badge
- Original item shows "Escalated to [target]" with link
- Escalation logged in audit trail with user and timestamp

#### Inheritance Display
- Items inherited from child entities show origin badge
- Hover origin badge to see inheritance chain
- Can filter to "originated here" vs "inherited"

---

### 6.2 Action Register Component

**Purpose:** Central hub for all actions with personal and governance views.

#### View Modes

| Mode | Purpose | Default Sort |
|------|---------|--------------|
| **My Actions** | Personal task list | Due date (overdue first) |
| **Entity Actions** | Actions for specific portfolio/programme/project | Created date (newest first) |
| **Governance Actions** | Actions arising from specific meeting/decision | Meeting date, then sequence |
| **Owner Actions** | All actions assigned to specific person | Due date |

#### States

| State | Visual Treatment |
|-------|------------------|
| **Overdue** | Red left border, red due date, sort to top |
| **Due Soon** | Amber left border (due within 7 days) |
| **On Track** | Green left border (or no border if GREEN suppressed) |
| **Completed** | Struck-through title, moved to "Completed" section |
| **Blocked** | Orange left border + 🚫 icon; shows blocking item |
| **Escalated** | Purple left border + ↑ icon; shows escalation target |

#### Action Card Structure

```
┌─────────────────────────────────────────────────────────┐
│ [Status indicator] ACTION-001: Update risk register     │
│                                                         │
│ 👤 Owner: J. Smith      📅 Due: 3 days overdue         │
│ 🔗 Source: PSB Meeting 15/01  📍 Project: Alpha        │
│                                                         │
│ [Complete ✓] [Reassign] [Escalate ↑] [···]            │
└─────────────────────────────────────────────────────────┘
```

#### Source Linking
- Actions from meetings show timestamp link to recording
- Actions from RAID items show item reference
- Actions from decisions show decision log entry
- Click source to navigate to origin with highlight

#### Accountability Escalation
- 7 days overdue: Notification to owner
- 14 days overdue: Notification to owner's manager + badge visible in dashboards
- 21+ days overdue: Appears in governance meeting pack automatically

---

### 6.3 Governance Meeting Component

**Purpose:** Meeting management with AI-extracted actions and decision audit.

#### Meeting Lifecycle

```
SCHEDULED → IN PROGRESS → PROCESSING → REVIEW → FINALISED → ARCHIVED
```

#### States

| State | Display | User Actions |
|-------|---------|--------------|
| **Scheduled** | Agenda visible, attendees confirmed | Edit agenda, send reminders |
| **In Progress** | Recording indicator if integrated | Live notes entry |
| **Processing** | "AI extracting decisions and actions..." | View raw transcript |
| **Review** | Extracted items shown for approval | Accept/Reject/Edit each item |
| **Finalised** | All items confirmed and distributed | View only; audit trail locked |
| **Archived** | Historical record | Read-only access |

#### AI Extraction Review Interface

```
┌─────────────────────────────────────────────────────────┐
│ EXTRACTED ACTION (Confidence: 94%)                      │
├─────────────────────────────────────────────────────────┤
│ "John to update the risk register by end of week"       │
│                                                         │
│ Suggested:                                              │
│   Title: Update risk register                           │
│   Owner: John Smith (matched to directory)              │
│   Due: 24/01/2025                                       │
│                                                         │
│ Source: [▶ 14:32 - Click to play]                      │
│                                                         │
│ [✓ Accept] [✎ Edit & Accept] [✗ Reject] [Flag for review]│
└─────────────────────────────────────────────────────────┘
```

#### Audit Requirements
- Every accepted item links to recording timestamp
- Every rejected item logged with reason
- Every edit shows diff from AI suggestion
- Finalisation creates immutable snapshot

---

### 6.4 RACI Matrix Component

**Purpose:** Accountability visualisation with conflict detection and capacity analysis.

#### Matrix View

```
                    │ A. Smith │ B. Jones │ C. Lee │ D. Park │
────────────────────┼──────────┼──────────┼────────┼─────────┤
Project Alpha       │    A     │    R     │   C    │    I    │
├─ Workstream 1     │    A     │    R     │   -    │    I    │
├─ Workstream 2     │    A     │    -     │   R    │    I    │
                    │          │          │        │         │
Project Beta        │    C     │    A     │   R    │    I    │
└─ Workstream 1     │    I     │    A     │   R    │    -    │
```

#### Cell States

| State | Visual | Meaning |
|-------|--------|---------|
| R | Blue chip | Responsible |
| A | Red chip | Accountable |
| C | Yellow chip | Consulted |
| I | Grey chip | Informed |
| - | Empty | No role |
| ⚠️ R | Blue + warning | Responsible but overloaded |
| ⚠️ A (multiple) | Red + conflict | Multiple Accountables (violation) |

#### Conflict Detection
- Multiple A's on same item: Highlighted with error state
- No A assigned: Warning state
- R without A: Warning state
- Person overloaded (>X R assignments): Capacity warning on all their R cells

#### Capacity Heatmap View
Toggle to show person columns as heatmap:
- Green: <70% allocated
- Amber: 70-90% allocated
- Red: >90% allocated

#### Drill-down
Click any cell to see:
- Full role description
- Assignment history
- Related items they're responsible for
- Current workload

---

### 6.5 OKR/KPI Cascade Component

**Purpose:** Connect strategic objectives to delivery progress with traceability.

#### Hierarchy Display

```
PORTFOLIO OKR: Improve customer satisfaction to 85%
│
├── PROGRAMME KPI: Reduce complaint resolution time by 30%
│   ├── PROJECT: CRM Enhancement → 45% complete
│   └── PROJECT: Training Programme → 80% complete
│
└── PROGRAMME KPI: Launch self-service portal
    └── PROJECT: Portal Development → 60% complete
```

#### Progress Calculation
- Project % complete derived from: task completion, milestone achievement, or EVM
- Programme progress: weighted aggregate of project contributions
- OKR progress: weighted aggregate of contributing KPIs
- Weights visible and configurable

#### Variance Display

| Variance | Visual | Threshold (configurable) |
|----------|--------|-------------------------|
| On track | Green progress bar | Within 10% of planned |
| At risk | Amber progress bar | 10-20% behind |
| Off track | Red progress bar | >20% behind |

#### Traceability
Click any metric to see:
- Contributing items with their individual progress
- Historical trend (was it always behind, or recent slip?)
- Owner and last update
- Linked risks/issues affecting progress

---

### 6.6 Critical Path Visualisation Component

**Purpose:** Dependency mapping with scenario modelling capability.

#### Default View (Network Diagram)

```
[Milestone A] ──→ [Task B] ──→ [Task C] ──→ [Milestone D]
                     ↘           ↗
                      [Task E] ─┘
```

#### Visual Encoding
- **Critical path items:** Bold border, coloured red if late
- **Float available:** Green or grey items with float indicator
- **External dependencies:** Dashed border
- **Cross-project dependencies:** Different colour per source project

#### Interaction Modes

| Mode | Purpose | Behaviour |
|------|---------|-----------|
| **View** | Understand current state | Hover for details, click to navigate |
| **What-if** | Model scenarios | Drag task dates, see cascade impact |
| **Compare** | Baseline vs. current | Side-by-side or overlay view |

#### What-If Scenario Panel

```
┌─────────────────────────────────────────────────────────┐
│ SCENARIO: "Task C slips 2 weeks"                        │
├─────────────────────────────────────────────────────────┤
│ Impacted items:                                         │
│   • Milestone D: Now 2 weeks late (was: 15/02, now: 01/03)│
│   • Project Beta: Dependency affected                   │
│   • Programme deadline: At risk (was: On track)         │
│                                                         │
│ Mitigation options:                                     │
│   • Fast-track Task E (reduce float to 0)               │
│   • Add resource to Task C (cost +£5k)                  │
│                                                         │
│ [Save Scenario] [Share for Review] [Discard]           │
└─────────────────────────────────────────────────────────┘
```

#### Aggregation Levels
- Portfolio: Shows programme-level dependencies only
- Programme: Shows project milestones and cross-project dependencies
- Project: Shows full task-level detail

---

### 6.7 Earned Value Component

**Purpose:** EVM metrics presentation with variance analysis.

#### Summary Card

```
┌─────────────────────────────────────────────────────────┐
│ PROJECT: Alpha                    Status: ON TRACK      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BAC: £500,000    │   SPI: 1.02 ✓   │   CPI: 0.98 ⚠️   │
│  EAC: £510,000    │   EV: £250,000  │   PV: £245,000   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Cumulative S-curve chart: PV vs EV vs AC]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Variance Analysis: Running 2% under schedule,          │
│  2% over budget. Forecast completion within budget.     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Metric Thresholds

| Metric | Green | Amber | Red |
|--------|-------|-------|-----|
| SPI | ≥0.95 | 0.85-0.95 | <0.85 |
| CPI | ≥0.95 | 0.85-0.95 | <0.85 |
| VAC | ≥0% | -5% to 0% | <-5% |

#### Drill-down
Click any metric to see:
- Calculation breakdown
- Historical trend
- Contributing work packages
- Variance explanation notes (if entered)

---

## Part 7: Interaction Patterns & Anti-Patterns

### 7.1 Data Visualisation Grammar

#### Chart Type Selection

| User Question | Chart Type | Rationale |
|---------------|------------|-----------|
| "What's the trend?" | Line chart / Sparkline | Shows direction and rate of change |
| "How does X compare to Y?" | Grouped bar chart | Direct comparison, side-by-side |
| "What's the breakdown?" | Donut chart (if <6 segments) or horizontal bar | Part-to-whole relationship |
| "Where are the problems?" | Heatmap / RAG matrix | Pattern recognition across dimensions |
| "What's the current state?" | Single metric card with trend indicator | Immediate comprehension |
| "What happened when?" | Timeline / Gantt | Temporal relationships |
| "What depends on what?" | Network diagram / tree | Structural relationships |
| "How much variance?" | Bullet chart or variance bar | Baseline vs. actual comparison |

#### Visualisation Rules

1. **No 3D charts ever.** Distorts perception.
2. **No pie charts with >5 segments.** Becomes unreadable.
3. **Always include context.** A number without comparison is meaningless.
4. **Colour encodes meaning, not decoration.** Red = problem, Green = good, Blue = information, Grey = neutral/disabled.
5. **Hover reveals detail; click navigates.** Consistent across all visualisations.
6. **Y-axis always starts at zero** for bar charts. Line charts can zoom but must indicate when zoomed.

#### Interaction Layers

| Layer | Trigger | Content |
|-------|---------|---------|
| **Glance** | Default view | Chart + title + single key metric |
| **Hover** | Mouse over data point | Exact value + timestamp + source |
| **Click** | Click data point | Navigate to source item |
| **Expand** | Click "expand" or full-screen | Full data table + export options |

---

### 7.2 Timing & Transition Rules

#### Data Refresh

| Context | Refresh Behaviour |
|---------|-------------------|
| Dashboard | Auto-refresh every 60 seconds (configurable); manual refresh always available |
| Detail view | Refresh on focus if >5 min since last; real-time updates for actions/comments |
| Meeting view | Real-time for in-progress meetings; on-demand for historical |
| What-if mode | No auto-refresh (user is modelling); explicit "refresh base data" option |

#### Transition Timing

| Transition | Duration | Easing |
|------------|----------|--------|
| Panel slide (open/close) | 200ms | ease-out |
| Page navigation | 150ms | ease-in-out (content fade) |
| Skeleton → content | 300ms | fade-in |
| Status change | 400ms | colour transition |
| Error appearance | Immediate | no animation (urgency) |
| Success feedback | 1500ms | fade-in → persist → fade-out |

#### Loading Patterns

| Scenario | Pattern |
|----------|---------|
| Full page load | Skeleton screen preserving layout |
| Panel load | Spinner in panel header only; preserve shell |
| Table load | Skeleton rows (5 rows) with shimmer |
| Action completion | Optimistic update → confirm/rollback |
| Slow operation (>3s) | Progress indicator with % if calculable |

---

### 7.3 Modal, Drawer, and Inline Conventions

**Use modal ONLY for:**
- Confirmation of destructive actions ("Delete this item?")
- Authentication challenges
- Critical errors requiring acknowledgment

**Use drawer (slide-in panel) for:**
- Detail views of list items
- Quick editing of single items
- Related item exploration
- Audit trail viewing

**Use inline expansion for:**
- Additional fields on forms
- Nested list items
- Help text / explanations
- Filter panels

**Navigation Rule:** User should never be more than one click away from returning to their original context. Stacked modals are forbidden. Drawers close on Escape key. Inline expansions collapse on click-outside.

---

### 7.4 Glanceable vs. Immersive Contexts

#### Glanceable Design (Dashboard, Notifications, Mobile)
- Maximum 5-second comprehension target
- Traffic light logic: RED/AMBER/GREEN
- Counts and trends, not lists
- Single tap to investigate
- No scrolling required for key information
- Information hierarchy: Status → Count → Owner → Age

#### Immersive Design (Analysis, Planning, Reporting)
- User is committed to spending time
- Full data access with filtering/sorting
- Export capability
- Session persistence (auto-save draft states)
- Keyboard shortcuts for power users
- Multi-select and bulk operations
- Undo/redo for modelling

---

### 7.5 Anti-Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| **Modals for complex workflows** | Breaks navigation, hides context, traps users | Use drawer or dedicated page |
| **Orphaned filters** | User forgets filters are active, sees confusing results | Persistent filter chips, "Clear all" prominent, filter state in URL |
| **Non-traceable alerts** | Notification without link to source item | Every alert links to relevant item |
| **Confirmation fatigue** | "Are you sure?" for every action | Reserve confirmation for destructive/irreversible actions only |
| **Hidden required fields** | Form fails validation with no visible error | All validation visible, errors inline next to field |
| **Pagination without context** | "Page 3 of 12" meaningless | Show item ranges: "31-45 of 180 items" |
| **Infinite scroll for governance data** | Can't bookmark, can't estimate total, breaks audit | Pagination with clear counts |
| **Tooltip-only information** | Touch users can't hover; critical info invisible | Tooltips enhance, not replace visible information |
| **Auto-save without feedback** | User unsure if changes saved | "Last saved 2 min ago" or "Saving..." indicator |
| **Disabled buttons without explanation** | User doesn't know why they can't proceed | Tooltip explains: "You need [permission/prerequisite] to do this" |
| **Error messages without next steps** | "Something went wrong" is useless | "Failed to save. Check your connection and try again, or contact support." |
| **Calendar date pickers for relative dates** | Clunky for "end of week", "next month" | Hybrid: calendar + quick select buttons |

---

### 7.6 Accessibility Layer

**Not bolted on—built in.**

#### Visual

| Requirement | Implementation |
|-------------|----------------|
| Colour contrast | WCAG 2.1 AA minimum (4.5:1 for text, 3:1 for UI) |
| Colour-blind safety | Never rely on colour alone; always pair with icon, text, or pattern |
| Text sizing | Minimum 14px body text; all text scalable to 200% without layout break |
| Focus indicators | Visible focus ring on all interactive elements; never `outline: none` without replacement |
| Motion | Respect `prefers-reduced-motion`; no essential animation |

#### Keyboard

| Pattern | Implementation |
|---------|----------------|
| Full navigation | All functionality reachable via keyboard |
| Focus order | Logical tab order matching visual hierarchy |
| Shortcuts | Documented, discoverable (Cmd+? shows shortcut list), not conflicting with browser/OS |
| Escape closes | Modals, drawers, dropdowns all close on Escape |
| Enter submits | Forms submit on Enter in text fields |

#### Semantic

| Element | Requirement |
|---------|-------------|
| Headings | Proper hierarchy (h1 → h2 → h3); no skipped levels |
| Lists | Use proper `<ul>`, `<ol>`, `<dl>` semantics |
| Forms | Labels associated with inputs; error messages linked to fields |
| Tables | Headers use `<th>` with `scope`; captions present |
| ARIA | Use native HTML elements first; ARIA only when necessary |
| Live regions | Status updates announced; not just visual |

#### Cognitive Load Reduction

| Strategy | Implementation |
|----------|----------------|
| Consistent patterns | Same action, same location, same appearance throughout |
| Clear language | No jargon in UI; technical terms in tooltips |
| Error prevention | Constraints over warnings; disable impossible actions |
| Undo over confirmation | Where reversible, allow undo; don't ask "Are you sure?" |
| Progressive disclosure | Don't overwhelm; reveal complexity as needed |
| Memory support | Recent items, search history, saved views |

---

## Implementation Checklist

For each component built, verify:

- [ ] All states designed (empty, loading, error, stale, success, partial)
- [ ] Accessibility tested (keyboard, screen reader, colour contrast)
- [ ] Mobile responsive (or explicitly desktop-only with rationale)
- [ ] Source traceability implemented (where data comes from)
- [ ] Temporal honesty present (when data was updated)
- [ ] Escalation path clear (what happens next)
- [ ] Audit trail captured (who did what when)
- [ ] Offline behaviour defined (or error handling for offline)
- [ ] Export capability present (where relevant)
- [ ] Keyboard shortcuts documented (for power user features)

---

## Next Actions

1. **Prioritise component build order** based on user journey criticality (suggest: RAID → Actions → Meeting integration → Dashboard)

2. **Define design token system** (colours, spacing, typography) aligned to principles before component work begins

3. **Create state specification templates** ensuring all components document all states consistently

4. **Build accessibility testing protocol** into CI/CD pipeline from day one

5. **Establish "source and timestamp" pattern library** ensuring consistency in provenance display

---

*This specification provides the decision-making framework. Visual design, interaction prototyping, and component implementation follow from these structural constraints. The framework is execution-ready—every principle is testable, every pattern is implementable, every anti-pattern is avoidable.*
