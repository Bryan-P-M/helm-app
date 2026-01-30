# Helm v1 — Navigation Tree & Screen Map

> UI specification for coding agents. Every screen, state, and interaction for v1 MVP.
> 
> **Source documents:** Design Intelligence Spec (DIS), MVP Cut-Line, Personas, Product Map
> **Last updated:** 2026-01-30

---

## Table of Contents

1. [v1 Navigation Tree](#1-v1-navigation-tree)
2. [Screen Map](#2-screen-map)
3. [v1 User Journeys](#3-v1-user-journeys)
4. [Decisions Log Screen — Detailed Design](#4-decisions-log-screen--detailed-design)
5. [Design Principle Compliance Notes](#5-design-principle-compliance-notes)

---

## 1. v1 Navigation Tree

### 1.1 Sidebar Structure

The left sidebar is **persistent** across all authenticated views. It collapses to icons on narrow viewports (< 768px).

```
⎈ HELM                          ← Logo/wordmark. Click → Dashboard
─────────────────────────
🏠  Dashboard                    ← Workspace overview (project KPIs)
📁  Projects                     ← Project list. Expands to show project names
     ├── [Project Alpha]         ← Click → Project Overview with tabs
     ├── [Project Beta]
     └── [+ New Project]         ← Inline create shortcut
🎯  My Actions                   ← Personal cross-project action list
🗓️  Meetings                     ← Cross-project meeting list
─────────────────────────
⚙️  Settings                     ← Workspace + Members
─────────────────────────
👤  [User Name]                  ← Profile menu (logout, preferences)
```

**Sidebar behaviour:**
- **Collapsed state (icons only):** Triggered at < 768px or user toggle. Tooltip on hover shows label.
- **Active indicator:** Current section highlighted with left accent border (4px, primary colour).
- **Project sub-items:** Show when Projects section is expanded. Current project bold.
- **Badge counts:** My Actions shows overdue count badge (red). Meetings shows upcoming count (blue).
- **Keyboard shortcut:** `Cmd+\` toggles sidebar collapse.

### 1.2 What Each Nav Item Leads To

| Nav Item | Destination | URL Pattern |
|----------|-------------|-------------|
| Dashboard | Workspace overview with project cards | `/dashboard` |
| Projects | Project list view | `/projects` |
| [Project Name] | Project overview with tabs | `/projects/:projectId` |
| My Actions | Personal action list (all projects) | `/my-actions` |
| Meetings | All meetings across projects | `/meetings` |
| Settings | Workspace settings | `/settings` |
| Settings > Members | Team member management | `/settings/members` |

### 1.3 Breadcrumb Behaviour

Breadcrumbs are **always visible** in the header bar, showing full hierarchical path. Every segment is clickable.

| Current Location | Breadcrumb Display |
|------------------|--------------------|
| Dashboard | `Helm` |
| Projects list | `Helm > Projects` |
| Project overview | `Helm > Projects > Alpha` |
| Project RAID log | `Helm > Projects > Alpha > RAID Log` |
| RAID item detail | `Helm > Projects > Alpha > RAID Log > R-001` |
| Project actions | `Helm > Projects > Alpha > Actions` |
| Project meetings | `Helm > Projects > Alpha > Meetings` |
| Meeting detail | `Helm > Projects > Alpha > Meetings > Steering 27 Jan` |
| Project decisions | `Helm > Projects > Alpha > Decisions` |
| My Actions | `Helm > My Actions` |
| Meetings (global) | `Helm > Meetings` |
| Settings | `Helm > Settings` |
| Members | `Helm > Settings > Members` |

**Breadcrumb rules (from DIS P3):**
- Drill-down preserves context — back button returns to previous scroll position and filter state.
- Filter state is encoded in URL query params so breadcrumb navigation preserves it.
- Current page segment is displayed but not clickable (it's where you are).

### 1.4 In-Project Tab Navigation

When viewing a project, horizontal tabs provide sub-navigation. Tabs appear below the project header.

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Helm > Projects > Alpha                          │
│ Project Alpha              RAG: 🔴  [Edit Project] [⋯]      │
├────────┬────────┬──────────┬───────────┬────────────────────┤
│Overview│RAID Log│ Actions  │ Meetings  │  Decisions         │
├────────┴────────┴──────────┴───────────┴────────────────────┤
│                                                              │
│  [Tab content area]                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Tab rules:**
- Active tab has bottom border accent (3px, primary colour).
- Tab counts shown as badges: `RAID Log (12)`, `Actions (5)`, `Meetings (3)`, `Decisions (8)`.
- Counts update in real-time when items are created/modified.
- Tab state persisted in URL: `/projects/:id/raid`, `/projects/:id/actions`, etc.
- Switching tabs does NOT lose filter state on other tabs (preserved in memory for session).

---

## 2. Screen Map

### Layout Reference

All authenticated screens share this shell:

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌────────┐  Breadcrumb: Helm > ...        🔍  🔔(3)  👤 Name │
│ │ ⎈ HELM │                                                     │
│ ├────────┤ ┌───────────────────────────────────────────────────┐│
│ │        │ │                                                   ││
│ │Sidebar │ │              MAIN CONTENT AREA                    ││
│ │        │ │                                                   ││
│ │ 🏠 Dash│ │  (varies per screen — see individual specs)       ││
│ │ 📁 Proj│ │                                                   ││
│ │ 🎯 Acts│ │                                                   ││
│ │ 🗓️ Meet│ │                                                   ││
│ │        │ │                                                   ││
│ │ ⚙️ Set │ │                                                   ││
│ │        │ │                                                   ││
│ │ 👤 User│ │                                                   ││
│ └────────┘ └───────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
  ~220px                    Flexible (min 600px)
```

**Header bar** (top, full width):
- Left: Logo (sidebar toggle on mobile) + Breadcrumb
- Right: Search (`Cmd+K`), Notifications bell with count badge, User avatar + dropdown

---

### 2.1 Login Screen

**URL:** `/login`
**No sidebar or header** — standalone auth layout.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        ⎈ HELM                               │
│                 P3O Governance Platform                      │
│                                                             │
│              ┌─────────────────────────┐                    │
│              │                         │                    │
│              │  Email                  │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │                   │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  Password               │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │                   │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  [Forgot password?]     │                    │
│              │                         │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │   Sign In         │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  ─── or ───             │                    │
│              │                         │                    │
│              │  [G] Sign in with Google│                    │
│              │                         │                    │
│              │  Don't have an account? │                    │
│              │  [Sign up]              │                    │
│              │                         │                    │
│              └─────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo + tagline
- Email input (validated)
- Password input (show/hide toggle)
- "Forgot password?" link
- Primary CTA: "Sign In" button
- OAuth: "Sign in with Google" (Supabase social auth)
- Link to signup

**States:**

| State | Behaviour |
|-------|-----------|
| **Default** | Empty form, Sign In button enabled |
| **Loading** | Button shows spinner, inputs disabled |
| **Error (invalid credentials)** | Inline error below password: "Invalid email or password. Please try again." |
| **Error (network)** | Banner: "Unable to connect. Check your internet and try again." [Retry] |
| **Error (rate limited)** | "Too many attempts. Please wait 60 seconds." |
| **Success** | Redirect to Dashboard (or workspace setup if first login) |

**User Actions:**
- Submit credentials (Enter key or button click)
- Sign in with Google
- Navigate to Signup
- Navigate to Forgot Password

**Navigation Flow:**
- Success → `/dashboard` (existing workspace) or `/setup` (first time)
- "Sign up" → `/signup`
- "Forgot password" → `/forgot-password`

---

### 2.2 Signup Screen

**URL:** `/signup`
**No sidebar or header** — standalone auth layout.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        ⎈ HELM                               │
│                 P3O Governance Platform                      │
│                                                             │
│              ┌─────────────────────────┐                    │
│              │  Create your account    │                    │
│              │                         │                    │
│              │  Full Name              │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │                   │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  Email                  │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │                   │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  Password               │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │                   │  │                    │
│              │  └───────────────────┘  │                    │
│              │  Min 8 chars, 1 number  │                    │
│              │                         │                    │
│              │  ┌───────────────────┐  │                    │
│              │  │   Create Account  │  │                    │
│              │  └───────────────────┘  │                    │
│              │                         │                    │
│              │  ─── or ───             │                    │
│              │                         │                    │
│              │  [G] Sign up with Google│                    │
│              │                         │                    │
│              │  Already have an        │                    │
│              │  account? [Sign in]     │                    │
│              │                         │                    │
│              └─────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo + tagline
- Full name input
- Email input (validated: format + uniqueness)
- Password input (strength indicator, show/hide toggle)
- Primary CTA: "Create Account"
- OAuth: "Sign up with Google"
- Link to login

**States:**

| State | Behaviour |
|-------|-----------|
| **Default** | Empty form, button enabled |
| **Validating** | Inline validation as user types (email format, password strength) |
| **Loading** | Button shows spinner, inputs disabled |
| **Error (email taken)** | Inline error below email: "An account with this email already exists. [Sign in instead]" |
| **Error (weak password)** | Inline error below password: "Password must be at least 8 characters with 1 number." |
| **Error (network)** | Banner: "Unable to connect. Check your internet and try again." |
| **Success** | Redirect to Workspace Setup |

**User Actions:**
- Fill form and submit
- Sign up with Google
- Navigate to Login

**Navigation Flow:**
- Success → `/setup` (workspace creation wizard)
- "Sign in" → `/login`

---

### 2.3 Workspace Setup (First-Time)

**URL:** `/setup`
**No sidebar** — wizard layout. Only shown on first login when user has no workspace.

```
┌─────────────────────────────────────────────────────────────┐
│                        ⎈ HELM                               │
│                                                             │
│            ┌────────────────────────────────┐               │
│            │  Welcome! Let's set up your    │               │
│            │  workspace.                    │               │
│            │                                │               │
│            │  Step 1 of 2  ●───○            │               │
│            │                                │               │
│            │  Workspace Name                │               │
│            │  ┌──────────────────────────┐  │               │
│            │  │ Acme Corp PMO            │  │               │
│            │  └──────────────────────────┘  │               │
│            │                                │               │
│            │  Your Role                     │               │
│            │  ┌──────────────────────────┐  │               │
│            │  │ Programme Manager      ▼ │  │               │
│            │  └──────────────────────────┘  │               │
│            │  (Helps us tailor your view)   │               │
│            │                                │               │
│            │         [Continue →]           │               │
│            └────────────────────────────────┘               │
│                                                             │
│   ── Step 2 ──                                              │
│                                                             │
│            ┌────────────────────────────────┐               │
│            │  Create your first project     │               │
│            │                                │               │
│            │  Step 2 of 2  ●───●            │               │
│            │                                │               │
│            │  Project Name                  │               │
│            │  ┌──────────────────────────┐  │               │
│            │  │ CRM Migration            │  │               │
│            │  └──────────────────────────┘  │               │
│            │                                │               │
│            │  Project Description (opt.)    │               │
│            │  ┌──────────────────────────┐  │               │
│            │  │                          │  │               │
│            │  └──────────────────────────┘  │               │
│            │                                │               │
│            │  [← Back]   [Launch Helm →]   │               │
│            └────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Progress indicator (Step 1 of 2, Step 2 of 2)
- Step 1: Workspace name, role selector
- Step 2: First project name, optional description
- Navigation buttons (Back, Continue, Launch)

**States:**

| State | Behaviour |
|-------|-----------|
| **Step 1** | Workspace name required. Role is dropdown with options: Portfolio Director, Programme Manager, PMO Lead, Project Manager, Other |
| **Step 2** | Project name required. Description optional. |
| **Loading** | "Launch" button shows spinner: "Setting up your workspace..." |
| **Error** | Inline errors for empty required fields |
| **Success** | Redirect to Dashboard with first project visible |

**User Actions:**
- Fill workspace details → Continue
- Fill project details → Launch
- Back navigation between steps

**Navigation Flow:**
- "Launch Helm" → `/dashboard` with workspace and first project created

---

### 2.4 Dashboard

**URL:** `/dashboard`
**Primary landing screen after login.** Workspace-level overview showing all projects with KPIs.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Dashboard                        🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Dashboard                      [+ New Project]        │
│        │  ─────────────────────────────────────────────────     │
│ 🏠 ●   │                                                        │
│ 📁     │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ 🎯     │  │ 🔴 RED     3│ │ 🟡 AMBER    2│ │ 🟢 GREEN   1│    │
│ 🗓️     │  │ Open Risks  │ │ At Risk Acts │ │ On Track    │    │
│        │  └─────────────┘ └──────────────┘ └──────────────┘    │
│ ⚙️     │                                                        │
│        │  ┌────────────────┐ ┌────────────────┐                │
│ 👤     │  │ 🔴 Alpha       │ │ 🟡 Beta         │                │
│        │  │                │ │                │                │
│        │  │ Risks:    4 🔴 │ │ Risks:    2 🟡 │                │
│        │  │ Actions:  3 ⚠️ │ │ Actions:  1    │                │
│        │  │ Overdue:  2    │ │ Overdue:  0    │                │
│        │  │ Meetings: 1    │ │ Meetings: 2    │                │
│        │  │ Next: Feb 3    │ │ Next: Feb 5    │                │
│        │  │                │ │                │                │
│        │  │ Updated 2h ago │ │ Updated 30m ago│                │
│        │  └────────────────┘ └────────────────┘                │
│        │                                                        │
│        │  ── Recently Updated ──────────────────────────────   │
│        │                                                        │
│        │  🔴 R-001 Data migration risk (Alpha)  · James · 2h  │
│        │  🎯 ACT-003 Review SLA (Alpha)         · Sarah · 4h  │
│        │  🗓️ Sprint Review (Beta)                · Team  · 1d  │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
1. **Summary KPI Cards** (top row) — Aggregate counts across all projects:
   - Open Risks (RED count)
   - At Risk Actions (AMBER count — overdue or due within 7 days)
   - On Track items (GREEN count)
   - Each card is clickable → navigates to filtered view

2. **Project Cards** (main grid) — One card per project:
   - Project name + RAG status indicator
   - Key metrics: Risk count, Action count, Overdue count, Meeting count
   - Next upcoming meeting
   - "Last updated" timestamp (DIS P1: temporal honesty)
   - Click card → Project Overview

3. **Recently Updated Feed** (bottom section):
   - Chronological list of recent changes across all projects
   - Shows item type icon, title, project name, who changed, when
   - Click any item → navigate to its detail view

**States:**

| State | Visual Treatment | Behaviour |
|-------|------------------|-----------|
| **Empty (no projects)** | Illustration + "Welcome to Helm! Create your first project to start tracking governance." [+ Create Project] | Large centered CTA |
| **Loading** | Skeleton cards (3 cards) preserving grid layout. Summary cards show shimmer. | No full-page spinner |
| **Loaded (exceptions)** | RED/AMBER projects sorted first. GREEN projects below divider: "On Track (1)" | DIS P4: Exceptions first |
| **Loaded (all green)** | All cards shown normally. Summary shows "✅ All projects on track" | Positive state celebration |
| **Error** | Banner: "Failed to load dashboard. [Retry]" — preserve last-known data if available | Inline retry |
| **Stale** | Yellow bar: "Data last refreshed [time]. [Refresh now]" | If > 15 min since last load |

**User Actions:**
- Create new project (button or sidebar shortcut)
- Click project card → Project Overview
- Click summary KPI card → filtered view (e.g., all open risks)
- Click recent activity item → item detail
- Pull to refresh (mobile)

**Navigation Flow:**
- Project card → `/projects/:id`
- KPI card (Risks) → `/my-actions?filter=risks` (or appropriate filtered view)
- Recent item → respective detail screen
- [+ New Project] → Create Project drawer

**Auto-refresh:** Every 60 seconds (per DIS 7.2). Manual refresh always available.

---

### 2.5 Projects List

**URL:** `/projects`
**Shows all projects in the workspace.** Alternative entry to project cards on Dashboard.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects                         🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Projects                       [+ New Project]        │
│        │  ─────────────────────────────────────────────────     │
│ 🏠     │                                                        │
│ 📁 ●   │  ┌──────┬────────────────┬─────┬──────┬──────┬──────┐ │
│ 🎯     │  │ RAG  │ Name           │Risks│ Acts │Ovdue │ Updated│
│ 🗓️     │  ├──────┼────────────────┼─────┼──────┼──────┼──────┤ │
│        │  │ 🔴   │ Alpha          │  4  │   7  │  2   │ 2h    │ │
│ ⚙️     │  │ 🟡   │ Beta           │  2  │   3  │  0   │ 30m   │ │
│        │  │ 🟢   │ Gamma          │  0  │   2  │  0   │ 1d    │ │
│ 👤     │  └──────┴────────────────┴─────┴──────┴──────┴──────┘ │
│        │                                                        │
│        │  Showing 3 projects                                    │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
- Projects table with columns: RAG, Name, Risk Count, Action Count, Overdue Count, Last Updated
- Sort by any column (click header)
- [+ New Project] button

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Empty** | "No projects yet. Create your first project to start tracking governance." [+ Create Project] |
| **Loading** | Skeleton rows (5 rows) with shimmer |
| **Loaded** | Table with all projects. RED/AMBER sorted to top by default (DIS P4) |
| **Error** | Inline error with retry |

**User Actions:**
- Click project row → Project Overview
- Click column header → Sort
- [+ New Project] → Create Project drawer
- Click RAG indicator → quick-status detail tooltip

**Navigation Flow:**
- Click row → `/projects/:id`
- [+ New Project] → Opens Create Project drawer (slide from right)

---

### 2.6 Project Overview

**URL:** `/projects/:id`
**The hub for a single project.** Shows project health summary with tab navigation to sub-views.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha                 🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha            RAG: 🔴  [Edit] [Archive]   │
│        │  Created Jan 15 · PM: James Smith                      │
│ 🏠     │                                                        │
│ 📁     │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│  Alpha │  │Overview●│RAID (12) │Acts (7) │Meet (3)  │Dec (5)  ││
│  Beta  │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│ 🎯     │                                                        │
│ 🗓️     │  ┌──────────────┐ ┌───────────────┐ ┌──────────────┐  │
│        │  │ 🔴 Risks    4│ │ ⚠️ Overdue    2│ │ 🗓️ Next Mtg  │  │
│ ⚙️     │  │ 2 High       │ │ ACT-001, -003 │ │ Feb 3, 10am │  │
│        │  │ 2 Medium     │ │ Owners: JS,SK │ │ Steering    │  │
│ 👤     │  └──────────────┘ └───────────────┘ └──────────────┘  │
│        │                                                        │
│        │  ┌──────────────┐ ┌───────────────┐ ┌──────────────┐  │
│        │  │ 🟡 Issues   2│ │ 📋 Actions    7│ │ ⚖️ Decisions 5│  │
│        │  │ 1 Open       │ │ 5 Open        │ │ 2 this week │  │
│        │  │ 1 Mitigating │ │ 2 Completed   │ │              │  │
│        │  └──────────────┘ └───────────────┘ └──────────────┘  │
│        │                                                        │
│        │  ── Recent Activity ───────────────────────────────   │
│        │                                                        │
│        │  🔴 R-001 updated by James · 2h ago                   │
│        │  ⚖️ DEC-005 logged by Sarah · 4h ago                  │
│        │  🎯 ACT-003 marked overdue (auto) · 1d ago            │
│        │                                                        │
│        │  Updated 5 min ago                                     │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
1. **Project Header:**
   - Project name (editable via Edit button)
   - RAG status badge (large, prominent)
   - Created date, project manager name
   - [Edit] → opens project settings drawer
   - [Archive] → confirmation modal (destructive action — DIS 7.3)

2. **Tab Bar:** Overview | RAID Log (count) | Actions (count) | Meetings (count) | Decisions (count)

3. **KPI Summary Cards** (Overview tab — top row):
   - Risks card: count, breakdown by severity
   - Overdue Actions card: count, item IDs, owner names
   - Next Meeting card: date, type
   - Issues card: count, breakdown by status
   - Actions card: total, open vs completed
   - Decisions card: total, recent count

4. **Recent Activity Feed:**
   - Chronological list of changes within this project
   - Shows item type, description, who, when
   - Auto-generated from audit trail (DIS P5: governance rigour)

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Loading** | Skeleton cards (6 cards). Tab bar visible with counts as `–` |
| **Loaded** | Full KPI cards + activity feed. Exceptions highlighted (DIS P4) |
| **Error** | Banner: "Failed to load project data. [Retry]" |
| **Project not found** | "Project not found or you don't have access." [Back to Projects] |

**User Actions:**
- Switch tabs (Overview, RAID, Actions, Meetings, Decisions)
- Click KPI card → navigates to relevant tab with filter applied
- Click activity item → navigates to item detail
- Edit project → drawer with name, description, PM assignment, RAG override
- Archive project → confirmation modal

**Navigation Flow:**
- Tab click → `/projects/:id/raid`, `/projects/:id/actions`, etc.
- KPI card click → Same URL with filter: `/projects/:id/raid?severity=high`
- Activity item → detail drawer on respective tab
- Edit → drawer from right
- Archive → confirmation modal → redirect to `/projects`

---

### 2.7 RAID Log

**URL:** `/projects/:id/raid`
**The core governance register.** Full CRUD for Risks, Assumptions, Issues, Dependencies.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > RAID Log      🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha              RAG: 🔴  [Edit] [⋯]      │
│        │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│        │  │Overview │RAID (12)●│Acts (7) │Meet (3)  │Dec (5)  ││
│        │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│        │                                                        │
│        │  ┌─ Filters ──────────────────────────────────────┐   │
│        │  │ Type: [All▼] Status: [Open▼] RAG: [All▼]      │   │
│        │  │ Owner: [All▼]                    [Clear All]   │   │
│        │  └────────────────────────────────────────────────┘   │
│        │                                     [+ Add Item]      │
│        │  Showing 5 of 12 items (7 on track — hidden)          │
│        │  ──────────────────────────────────── [Show All]      │
│        │                                                        │
│        │  ┌────┬──┬───────────────┬─────────┬───┬───────┬─────┐│
│        │  │ ID │Ty│ Title         │ Status  │RAG│ Owner │ Due ││
│        │  ├────┼──┼───────────────┼─────────┼───┼───────┼─────┤│
│        │  │R001│🔴│Data migration │ Open    │🔴 │James  │Feb 3││
│        │  │    │  │risk — vendor  │         │   │       │⚠ 2d ││
│        │  │    │  │delay possible │         │   │       │overdu││
│        │  ├────┼──┼───────────────┼─────────┼───┼───────┼─────┤│
│        │  │I003│🟠│API downtime   │ Open    │🟡 │Sarah  │Feb 5││
│        │  │    │  │impacting test │         │   │       │     ││
│        │  ├────┼──┼───────────────┼─────────┼───┼───────┼─────┤│
│        │  │R002│🔴│Vendor timeline│Mitigat. │🟡 │James  │Feb 8││
│        │  │    │  │slip risk      │         │   │       │     ││
│        │  ├────┼──┼───────────────┼─────────┼───┼───────┼─────┤│
│        │  │D002│🔗│Dependency on  │ On Track│🟡 │Sarah  │Feb10││
│        │  │    │  │Project Beta   │         │   │       │     ││
│        │  ├────┼──┼───────────────┼─────────┼───┼───────┼─────┤│
│        │  │A001│🔵│Board approval │Confirmed│🟢 │PM     │ –   ││
│        │  │    │  │assumption     │         │   │       │     ││
│        │  └────┴──┴───────────────┴─────────┴───┴───────┴─────┘│
│        │                                                        │
│        │  Page 1 of 1 · Items 1–5 of 5 shown                  │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**When an item row is clicked, detail drawer slides from right:**

```
┌────────────────────────────────────────────────────────┬──────────────────────────────┐
│                                                        │                              │
│  [RAID table — slightly dimmed]                        │  R-001: Data migration risk  │
│                                                        │                              │
│                                                        │  Type: Risk  │  RAG: 🔴      │
│                                                        │  Status: Open                │
│                                                        │  Owner: James Smith          │
│                                                        │  Due: Feb 3 (2 days overdue) │
│                                                        │  Created: Jan 20 by Sarah    │
│                                                        │  ──────────────────────────── │
│                                                        │                              │
│                                                        │  Description:                │
│                                                        │  Vendor data migration may    │
│                                                        │  slip 2 weeks due to API...  │
│                                                        │                              │
│                                                        │  Impact: High (Score: 4/5)   │
│                                                        │  Probability: Medium (3/5)   │
│                                                        │  ──────────────────────────── │
│                                                        │                              │
│                                                        │  Linked Actions:             │
│                                                        │  🎯 ACT-001 Review vendor SLA│
│                                                        │  🎯 ACT-003 Update test plan │
│                                                        │  ──────────────────────────── │
│                                                        │                              │
│                                                        │  Audit Trail:                │
│                                                        │  Jan 28 — RAG changed 🟡→🔴  │
│                                                        │    by James                  │
│                                                        │  Jan 25 — Status: Open       │
│                                                        │    by Sarah                  │
│                                                        │  Jan 20 — Created            │
│                                                        │    by Sarah                  │
│                                                        │  ──────────────────────────── │
│                                                        │                              │
│                                                        │  [Edit] [Create Action] [⋯]  │
│                                                        │  [Close ✕]                   │
│                                                        │                              │
└────────────────────────────────────────────────────────┴──────────────────────────────┘
```

**Components (from DIS 6.1):**

1. **Filter Bar:**
   - Type filter: All / Risk / Assumption / Issue / Dependency
   - Status filter: All / Open / Mitigating / Closed / Escalated
   - RAG filter: All / Red / Amber / Green
   - Owner filter: All / [team members]
   - Active filter chips displayed below bar
   - "Clear All" link to reset filters
   - Filter state persisted in URL query params

2. **RAID Table (columns from DIS 6.1):**

   | Column | Width | Behaviour |
   |--------|-------|-----------|
   | ID | 80px fixed | Auto-generated (R-001, I-003, etc.). Click → detail drawer |
   | Type | 48px fixed | Icon: 🔴 Risk, 🔵 Assumption, 🟠 Issue, 🔗 Dependency. Tooltip shows full word |
   | Title | Flexible (min 200px) | Truncate with ellipsis. Full on hover. Click → detail drawer |
   | Status | 100px fixed | Chip: Open (grey), Mitigating (yellow), Closed (green), Escalated (purple) |
   | RAG | 48px fixed | Traffic light dot: 🔴🟡🟢 |
   | Owner | 120px fixed | Avatar + name. Click → filter by this owner |
   | Due Date | 100px fixed | Red text + "⚠ Xd overdue" if past due. Relative time otherwise |

3. **Exceptions-First Banner:**
   - Default view: RED and AMBER items only
   - Banner: "Showing X of Y items (Z on track — hidden)" [Show All]
   - "Show All" toggles to show GREEN items
   - State persisted per user preference

4. **Item Detail Drawer:**
   - All fields from RAID item
   - Linked Actions (clickable → navigate to action)
   - Linked Meetings (if created from a meeting)
   - Full Audit Trail with timestamps and user attribution (DIS P1, P5)
   - Action buttons: Edit, Create Action (from this item), Close/Reopen, Delete

5. **Pagination:**
   - "Items X–Y of Z shown" (not "Page X of Y" — DIS anti-pattern)
   - 25 items per page default
   - Configurable: 25 / 50 / 100

**States (from DIS 6.1):**

| State | Visual Treatment | Behaviour |
|-------|------------------|-----------|
| **Empty** | Illustration + "No RAID items recorded for this project. Create your first risk, assumption, issue, or dependency." [+ Add Item] | Primary CTA prominent |
| **Loading** | Skeleton rows (5 rows) preserving column layout. Filter bar visible but disabled. | No full-page spinner |
| **Loaded (exceptions)** | RED/AMBER items shown. GREEN items collapsed. Count badge shows hidden items. | DIS P4 default |
| **Loaded (all)** | Full list with alternating row backgrounds. Pagination controls visible. | After "Show All" clicked |
| **Filtered** | Active filter chips above table. "Showing X of Y" count. "Clear All" visible. | Filter state in URL |
| **Error** | Inline error message: "Failed to load RAID items. [Retry]" | Preserve last-known data if available |
| **Stale** | Yellow banner: "Data last updated [time]. [Refresh]" | If > 15 min since last load |

**User Actions:**
- [+ Add Item] → Create RAID item drawer (type selector: R/A/I/D, then full form)
- Click row → Detail drawer opens from right
- Click owner name → Filter by owner
- Sort by column (click header)
- Filter by Type, Status, RAG, Owner
- Clear all filters
- Toggle "Show All" / "Exceptions Only"
- From detail drawer: Edit, Create linked Action, Close, Delete
- Keyboard: Escape closes drawer

**Navigation Flow:**
- Row click → Detail drawer (right panel, ~400px)
- "Create Action" in drawer → Action creation form pre-linked to this RAID item
- Linked Action click → navigates to Actions tab with that action's detail open
- Linked Meeting click → navigates to Meetings tab with that meeting's detail open

---

### 2.8 Actions Tracker (Project-Scoped)

**URL:** `/projects/:id/actions`
**All actions for this project.** Source tracking shows where each action originated.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > Actions       🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha              RAG: 🔴  [Edit] [⋯]      │
│        │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│        │  │Overview │RAID (12) │Acts (7)●│Meet (3)  │Dec (5)  ││
│        │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│        │                                                        │
│        │  ┌─ Filters ────────────────────────────────────┐     │
│        │  │ Status: [All▼] Owner: [All▼] Source: [All▼]  │     │
│        │  │                                [Clear All]   │     │
│        │  └──────────────────────────────────────────────┘     │
│        │                                     [+ Add Action]    │
│        │                                                        │
│        │  ── OVERDUE (2) ──────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🔴 ACT-001: Review vendor SLA                   │  │
│        │  │                                                 │  │
│        │  │ 👤 James Smith      📅 Due: 3 days overdue      │  │
│        │  │ 🔗 Source: Steering Meeting 27 Jan               │  │
│        │  │                                                 │  │
│        │  │ [Complete ✓] [Reassign] [Edit] [⋯]             │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🔴 ACT-003: Update test plan                    │  │
│        │  │                                                 │  │
│        │  │ 👤 Sarah Kim        📅 Due: 1 day overdue       │  │
│        │  │ 🔗 Source: RAID R-001                            │  │
│        │  │                                                 │  │
│        │  │ [Complete ✓] [Reassign] [Edit] [⋯]             │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── DUE SOON (2) ─────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🟡 ACT-004: Prepare staging environment         │  │
│        │  │ 👤 James Smith      📅 Due: Feb 5 (3 days)      │  │
│        │  │ 🔗 Source: Manual                                │  │
│        │  │ [Complete ✓] [Reassign] [Edit] [⋯]             │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── ON TRACK (1) ─────────────────────────────────    │
│        │  ── COMPLETED (2) ────────────────────── [Show ▼] ── │
│        │                                                        │
│        │  Items 1–5 of 7                                       │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components (from DIS 6.2):**

1. **Filter Bar:**
   - Status: All / Open / In Progress / Completed / Overdue / Blocked
   - Owner: All / [team members]
   - Source: All / Meeting / RAID / Decision / Manual
   - "Clear All" link

2. **Action Cards** (card layout, not table — per DIS 6.2):
   - Grouped by urgency: Overdue → Due Soon (7 days) → On Track → Completed
   - Each card shows:

   ```
   ┌─────────────────────────────────────────────────────────┐
   │ [Status indicator] ACT-001: Title text                  │
   │                                                         │
   │ 👤 Owner: J. Smith      📅 Due: 3 days overdue          │
   │ 🔗 Source: Meeting/RAID/Manual  📍 Project: Alpha       │
   │                                                         │
   │ [Complete ✓] [Reassign] [Edit] [⋯]                     │
   └─────────────────────────────────────────────────────────┘
   ```

   - Left border colour: Red (overdue), Amber (due within 7d), Green (on track), Grey (completed)
   - Source is a clickable link → navigates to origin meeting/RAID item
   - Quick actions visible on card: Complete, Reassign, Edit

3. **Section Groups:**
   - OVERDUE (count) — Red header, expanded by default
   - DUE SOON (count) — Amber header, expanded by default
   - ON TRACK (count) — Green header, collapsed by default (DIS P4)
   - COMPLETED (count) — Grey header, collapsed by default

4. **Action Detail** (click card to expand or open drawer):
   - Full description
   - Status history with timestamps
   - Source link with context
   - Owner + reassignment history
   - Audit trail (all changes)
   - Comments/notes

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Empty** | "No actions for this project yet. Create an action or they'll appear here when created from meetings and RAID items." [+ Add Action] |
| **Loading** | Skeleton cards (3 cards) in stacked layout |
| **Loaded** | Grouped cards. Overdue section expanded with red accent. Completed collapsed. |
| **Filtered** | Filter chips shown. "Showing X of Y actions." |
| **Error** | Inline: "Failed to load actions. [Retry]" |

**User Actions:**
- [+ Add Action] → Create action drawer (title, description, owner, due date, source)
- Click card → Expand inline or open detail drawer
- Complete action → Optimistic update (strikethrough + move to Completed)
- Reassign → Owner picker dropdown
- Edit → Edit drawer
- Click source link → Navigate to origin (meeting or RAID item)

**Navigation Flow:**
- Source: "Meeting 27 Jan" → `/projects/:id/meetings/:meetingId`
- Source: "RAID R-001" → `/projects/:id/raid` with R-001 detail drawer open
- Owner name click → Filter by owner

---

### 2.9 My Actions (Global)

**URL:** `/my-actions`
**Personal action list across ALL projects.** Shows only actions assigned to the current user.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > My Actions                       🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  My Actions                                            │
│        │  ─────────────────────────────────────────────────     │
│ 🏠     │                                                        │
│ 📁     │  ── OVERDUE (2) ──────────────────────────────────    │
│ 🎯 ●   │                                                        │
│ 🗓️     │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🔴 ACT-001: Review vendor SLA                   │  │
│ ⚙️     │  │ 📅 Due: 3 days overdue  📍 Project: Alpha       │  │
│        │  │ 🔗 Source: Steering Meeting 27 Jan               │  │
│ 👤     │  │ [Complete ✓] [Edit] [Go to Project →]           │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🔴 ACT-003: Update test plan                    │  │
│        │  │ 📅 Due: 1 day overdue   📍 Project: Alpha       │  │
│        │  │ 🔗 Source: RAID R-001                            │  │
│        │  │ [Complete ✓] [Edit] [Go to Project →]           │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── DUE SOON (1) ─────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🟡 ACT-007: Review beta scope                   │  │
│        │  │ 📅 Due: Feb 5 (3 days)  📍 Project: Beta        │  │
│        │  │ 🔗 Source: Manual                                │  │
│        │  │ [Complete ✓] [Edit] [Go to Project →]           │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── COMPLETED THIS WEEK (3) ──────────── [Show ▼] ── │
│        │                                                        │
│        │  3 actions completed · 2 overdue · 1 due soon         │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
- Same card layout as project-scoped Actions (2.8)
- Additional: **Project badge** on each card (since items come from multiple projects)
- [Go to Project →] link on each card → navigates to action's project context
- No "Add Action" button (actions are project-scoped; create them within projects)
- Summary bar at bottom: "X completed · Y overdue · Z due soon"

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Empty (no actions)** | "You have no actions assigned. Actions will appear here when assigned to you from any project." |
| **Empty (all done)** | "🎉 All caught up! No pending actions." + link to completed |
| **Loading** | Skeleton cards |
| **Loaded** | Grouped by urgency. Overdue first. |
| **Error** | Inline error with retry |

**Key difference from project-scoped:** Each card shows which project it belongs to. "Go to Project" link provides cross-project navigation.

---

### 2.10 Meetings Hub (Project-Scoped)

**URL:** `/projects/:id/meetings`
**Manual meeting capture.** No AI extraction, no transcript upload in v1.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > Meetings      🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha              RAG: 🔴  [Edit] [⋯]      │
│        │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│        │  │Overview │RAID (12) │Acts (7) │Meet (3)● │Dec (5)  ││
│        │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│        │                                                        │
│        │                                    [+ New Meeting]     │
│        │                                                        │
│        │  ── UPCOMING ─────────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🗓️ Steering Committee                            │  │
│        │  │ Feb 3, 2026 · 10:00 AM · 60 min                │  │
│        │  │ Attendees: James, Sarah, Mike, Lisa              │  │
│        │  │ Status: Scheduled                                │  │
│        │  │                                                 │  │
│        │  │ [View/Edit] [Add Notes] [Cancel]                │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── COMPLETED ────────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 📝 Steering Committee                            │  │
│        │  │ Jan 27, 2026 · Completed                        │  │
│        │  │ 🎯 3 actions · ⚖️ 2 decisions · 📝 Notes ✓     │  │
│        │  │                                                 │  │
│        │  │ [View Details]                                  │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 📝 Sprint Review                                 │  │
│        │  │ Jan 24, 2026 · Completed                        │  │
│        │  │ 🎯 2 actions · ⚖️ 1 decision · 📝 Notes ✓      │  │
│        │  │                                                 │  │
│        │  │ [View Details]                                  │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  Showing 3 meetings                                   │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**

1. **Meeting Cards** — grouped by status:
   - **Upcoming:** Scheduled meetings. Shows date, time, duration, attendees, status.
   - **Completed:** Past meetings. Shows date, linked action count, decision count, notes indicator.

2. **Meeting Card Fields:**
   - Title (e.g., "Steering Committee", "Sprint Review")
   - Date and time
   - Duration (optional)
   - Attendees (list of names)
   - Status: Scheduled / Completed / Cancelled
   - Linked counts: Actions created, Decisions logged, Notes present

3. **Quick Actions per card:**
   - Upcoming: [View/Edit] [Add Notes] [Cancel]
   - Completed: [View Details]

**v1 Meeting Lifecycle (Manual Only):**

```
SCHEDULED → COMPLETED → ARCHIVED
```

No Processing, Review states (those are v2 AI features).

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Empty** | "No meetings recorded for this project. Capture your first governance meeting to start tracking actions and decisions." [+ New Meeting] |
| **Loading** | Skeleton cards (3 cards) |
| **Loaded** | Upcoming section first, then Completed (reverse chronological) |
| **Error** | Inline: "Failed to load meetings. [Retry]" |

**User Actions:**
- [+ New Meeting] → Create meeting drawer
- Click meeting card → Meeting detail page
- Add Notes → Meeting detail page (notes tab)
- Cancel meeting → Confirmation (soft delete, sets status to Cancelled)

**Navigation Flow:**
- Meeting card click → `/projects/:id/meetings/:meetingId`
- [+ New Meeting] → Create drawer (title, date, time, duration, attendees)

---

### 2.11 Meeting Detail

**URL:** `/projects/:id/meetings/:meetingId`
**Full view of a single meeting.** Central hub for manually capturing meeting outcomes.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > Meetings > Steering 27 Jan           │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Steering Committee              Status: Completed     │
│        │  Jan 27, 2026 · 10:00–11:00 AM                        │
│        │  Attendees: James, Sarah, Mike, Lisa                   │
│        │  ───────────────────────────────────── [Edit] [⋯]     │
│        │                                                        │
│        │  ┌──────────┬───────────┬──────────┬─────────────┐    │
│        │  │ Notes  ● │ Actions(3)│ Decs (2) │ Audit Trail │    │
│        │  └──────────┴───────────┴──────────┴─────────────┘    │
│        │                                                        │
│        │  ── Meeting Notes ────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ ## Key Discussion Points                        │  │
│        │  │                                                 │  │
│        │  │ 1. Data migration timeline reviewed. Vendor     │  │
│        │  │    confirmed 2-week delay possible. James to    │  │
│        │  │    review SLA terms.                            │  │
│        │  │                                                 │  │
│        │  │ 2. Test environment readiness discussed. Sarah  │  │
│        │  │    flagged API downtime issues.                 │  │
│        │  │                                                 │  │
│        │  │ 3. Board approved Option B for deployment       │  │
│        │  │    approach. Decision rationale documented.     │  │
│        │  │                                                 │  │
│        │  │ Last edited by James · Jan 28, 3:00 PM         │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  [Edit Notes]                                         │
│        │                                                        │
│        │  ── Quick Create ─────────────────────────────────    │
│        │                                                        │
│        │  [+ Action from this meeting]                         │
│        │  [+ Decision from this meeting]                       │
│        │  [+ RAID item from this meeting]                      │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Sub-tabs within Meeting Detail:**

**Notes Tab:**
- Rich text editor for meeting notes (markdown-compatible)
- "Last edited by [name] · [timestamp]" (DIS P1: temporal honesty)
- [Edit Notes] button toggles edit mode

**Actions Tab:**
- List of actions created from this meeting
- Each shows: ID, Title, Owner, Due Date, Status
- [+ Add Action] button → pre-populates "Source: This meeting"
- Click action → navigates to action detail

**Decisions Tab:**
- List of decisions logged from this meeting
- Each shows: ID, Decision, Date, Status
- [+ Add Decision] button → pre-populates "Source Meeting: This meeting"
- Click decision → navigates to Decisions log

**Audit Trail Tab:**
- Chronological list of all changes:
  - Meeting created
  - Notes edited
  - Action ACT-001 created from this meeting
  - Decision DEC-001 logged from this meeting
  - Status changed to Completed
- Each entry: action description, user, timestamp

**Quick Create Section:**
- [+ Action from this meeting] → Action creation with source pre-linked
- [+ Decision from this meeting] → Decision creation with source meeting pre-linked
- [+ RAID item from this meeting] → RAID creation with source meeting pre-linked
- These are the v1 manual equivalents of v2's AI extraction

**Components:**
1. Meeting header (title, date/time, attendees, status)
2. Sub-tab navigation (Notes, Actions, Decisions, Audit Trail)
3. Rich text notes editor
4. Quick-create buttons (key v1 feature — manual capture from meetings)
5. Linked items lists

**States:**

| State | Visual Treatment |
|-------|------------------|
| **No notes** | "No notes yet. Add meeting notes to keep a record of what was discussed." [Edit Notes] |
| **No actions** | "No actions captured from this meeting yet." [+ Add Action] |
| **No decisions** | "No decisions recorded from this meeting yet." [+ Add Decision] |
| **Loading** | Skeleton content area |
| **Error** | Inline error with retry |

**User Actions:**
- Edit meeting details (title, date, attendees)
- Add/edit notes
- Create action linked to this meeting
- Create decision linked to this meeting
- Create RAID item linked to this meeting
- Mark meeting as Completed
- View audit trail

**Navigation Flow:**
- Action click → `/projects/:id/actions` with action detail drawer
- Decision click → `/projects/:id/decisions` with decision detail drawer
- RAID item click → `/projects/:id/raid` with item detail drawer
- [← Back to Meetings] → `/projects/:id/meetings`

---

### 2.12 Meetings (Global)

**URL:** `/meetings`
**Cross-project meeting list.** Shows all meetings across all projects.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Meetings                         🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Meetings                                              │
│        │  ─────────────────────────────────────────────────     │
│ 🏠     │  Filter: Project [All▼]  Status [All▼]                │
│ 📁     │                                                        │
│ 🎯     │  ── UPCOMING ────────────────────────────────────     │
│ 🗓️ ●   │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│ ⚙️     │  │ 🗓️ Steering Committee   📍 Alpha                │  │
│        │  │ Feb 3 · 10:00 AM                                │  │
│ 👤     │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🗓️ Sprint Planning      📍 Beta                  │  │
│        │  │ Feb 5 · 2:00 PM                                 │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ── LAST 7 DAYS ─────────────────────────────────    │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 📝 Steering Committee   📍 Alpha                 │  │
│        │  │ Jan 27 · 🎯 3 actions · ⚖️ 2 decisions           │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  Showing 3 meetings across 2 projects                 │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
- Same card layout as project-scoped meetings
- Additional: **Project badge** on each card
- Filter by project, status
- Grouped: Upcoming → Last 7 days → Older

**States:** Same as project-scoped meetings (2.10)

**Navigation Flow:**
- Click meeting → `/projects/:projectId/meetings/:meetingId` (navigates to project context)

---

### 2.13 Decisions Log (Project-Scoped)

**URL:** `/projects/:id/decisions`
**Manual decision register.** This is a NEW screen not in the original product map.

> See [Section 4](#4-decisions-log-screen--detailed-design) for full detailed design.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > Decisions     🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha              RAG: 🔴  [Edit] [⋯]      │
│        │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│        │  │Overview │RAID (12) │Acts (7) │Meet (3)  │Dec (5)● ││
│        │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│        │                                                        │
│        │  ┌─ Filters ───────────────────────────────────┐      │
│        │  │ Status: [All▼] Source: [All▼]  [Clear All]  │      │
│        │  └─────────────────────────────────────────────┘      │
│        │                                    [+ Log Decision]   │
│        │                                                        │
│        │  ┌────┬──────────────┬────────┬──────┬────────┬──────┐│
│        │  │ ID │ Decision     │Partici.│ Date │Source  │Status││
│        │  ├────┼──────────────┼────────┼──────┼────────┼──────┤│
│        │  │D005│Go with       │James,  │Jan 27│Steering│Active││
│        │  │    │Option B for  │Sarah,  │      │27 Jan  │      ││
│        │  │    │deployment    │Mike    │      │        │      ││
│        │  ├────┼──────────────┼────────┼──────┼────────┼──────┤│
│        │  │D004│Approve budget│James,  │Jan 27│Steering│Active││
│        │  │    │increase for  │Lisa    │      │27 Jan  │      ││
│        │  │    │testing phase │        │      │        │      ││
│        │  ├────┼──────────────┼────────┼──────┼────────┼──────┤│
│        │  │D003│Defer feature │Sarah,  │Jan 20│Sprint  │Active││
│        │  │    │X to phase 2  │Mike    │      │Review  │      ││
│        │  ├────┼──────────────┼────────┼──────┼────────┼──────┤│
│        │  │D002│Use vendor Y  │James,  │Jan 15│Ad Hoc  │Supers││
│        │  │    │for hosting   │Sarah   │      │        │eded  ││
│        │  ├────┼──────────────┼────────┼──────┼────────┼──────┤│
│        │  │D001│Project start │All     │Jan 10│Kickoff │Active││
│        │  │    │date confirmed│        │      │        │      ││
│        │  └────┴──────────────┴────────┴──────┴────────┴──────┘│
│        │                                                        │
│        │  Items 1–5 of 5                                       │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

Full specification in Section 4.

---

### 2.14 Settings — Workspace

**URL:** `/settings`
**Workspace-level configuration.**

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Settings                         🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Settings                                              │
│        │  ─────────────────────────────────────────────────     │
│ 🏠     │                                                        │
│ 📁     │  ┌───────────────┬────────────────┐                   │
│ 🎯     │  │ Workspace   ● │ Members        │                   │
│ 🗓️     │  └───────────────┴────────────────┘                   │
│        │                                                        │
│ ⚙️ ●   │  Workspace Name                                       │
│        │  ┌──────────────────────────────────────┐              │
│ 👤     │  │ Acme Corp PMO                        │              │
│        │  └──────────────────────────────────────┘              │
│        │                                                        │
│        │  Workspace Description (optional)                      │
│        │  ┌──────────────────────────────────────┐              │
│        │  │ Portfolio management office for Acme │              │
│        │  │ Corporation's change portfolio.      │              │
│        │  └──────────────────────────────────────┘              │
│        │                                                        │
│        │  Created: Jan 15, 2026                                │
│        │  Owner: James Smith (you)                              │
│        │                                                        │
│        │  [Save Changes]                                       │
│        │                                                        │
│        │  ── Danger Zone ──────────────────────────────────    │
│        │                                                        │
│        │  Delete Workspace                                     │
│        │  This will permanently delete the workspace and all   │
│        │  projects, RAID items, actions, meetings, decisions.  │
│        │  This action cannot be undone.                         │
│        │                                                        │
│        │  [Delete Workspace]  (requires confirmation)           │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
- Tab navigation: Workspace | Members
- Workspace name (editable)
- Workspace description (editable)
- Created date and owner (read-only)
- Save Changes button
- Danger Zone: Delete workspace (confirmation modal with type-to-confirm)

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Default** | Form pre-filled with current values |
| **Modified** | "Save Changes" button becomes enabled. "Unsaved changes" indicator |
| **Saving** | Button shows spinner: "Saving..." |
| **Saved** | Success toast: "Workspace settings saved." (1.5s fade) |
| **Error** | Inline error below field or banner |

---

### 2.15 Settings — Members

**URL:** `/settings/members`
**Basic team management.** v1 has two roles: Admin, Member.

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Settings > Members               🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Settings                                              │
│        │  ─────────────────────────────────────────────────     │
│ 🏠     │  ┌───────────────┬────────────────┐                   │
│ 📁     │  │ Workspace     │ Members      ● │                   │
│ 🎯     │  └───────────────┴────────────────┘                   │
│ 🗓️     │                                                        │
│        │  Members (4)                    [+ Invite Member]      │
│ ⚙️ ●   │                                                        │
│        │  ┌──────┬──────────────────┬───────────┬─────────┬───┐│
│ 👤     │  │Avatar│ Name / Email     │ Role      │ Joined  │   ││
│        │  ├──────┼──────────────────┼───────────┼─────────┼───┤│
│        │  │  JS  │ James Smith      │ Admin   ▼ │ Jan 15  │ ⋯ ││
│        │  │      │ james@acme.com   │           │         │   ││
│        │  ├──────┼──────────────────┼───────────┼─────────┼───┤│
│        │  │  SK  │ Sarah Kim        │ Member  ▼ │ Jan 16  │ ⋯ ││
│        │  │      │ sarah@acme.com   │           │         │   ││
│        │  ├──────┼──────────────────┼───────────┼─────────┼───┤│
│        │  │  ML  │ Mike Liu         │ Member  ▼ │ Jan 18  │ ⋯ ││
│        │  │      │ mike@acme.com    │           │         │   ││
│        │  ├──────┼──────────────────┼───────────┼─────────┼───┤│
│        │  │  LD  │ Lisa Davis       │ Member  ▼ │ Jan 20  │ ⋯ ││
│        │  │      │ lisa@acme.com    │           │         │   ││
│        │  └──────┴──────────────────┴───────────┴─────────┴───┘│
│        │                                                        │
│        │  ── Pending Invitations ──────────────────────────    │
│        │                                                        │
│        │  📧 tom@acme.com · Invited Jan 28 · [Resend] [Revoke]│
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

**Components:**
- Members table: Avatar, Name, Email, Role (dropdown: Admin/Member), Joined date, Actions (⋯)
- [+ Invite Member] → email input + role selector
- Pending Invitations section
- Actions menu (⋯): Change role, Remove member

**v1 Roles (basic — no advanced RBAC):**

| Role | Permissions |
|------|-------------|
| **Admin** | Full access. Manage workspace, invite/remove members, delete projects. |
| **Member** | Create/edit projects, RAID items, actions, meetings, decisions. Cannot manage workspace settings or members. |

**States:**

| State | Visual Treatment |
|-------|------------------|
| **Loading** | Skeleton rows |
| **Loaded** | Member table + pending invitations |
| **Inviting** | Modal: Enter email + select role. "Sending invitation..." |
| **Invite sent** | Success toast: "Invitation sent to tom@acme.com" |
| **Error (invite)** | "Failed to send invitation. [Retry]" |

---

### 2.16 Create/Edit Drawers

All create and edit operations use **right-sliding drawers** (~450px width), not modals (per DIS 7.3).

#### 2.16.1 Create RAID Item Drawer

```
┌────────────────────────────────────────────┐
│  Create RAID Item                     [✕]  │
│  ──────────────────────────────────────    │
│                                            │
│  Type                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │Risk│ │Assu│ │Issu│ │Dep.│              │
│  └────┘ └────┘ └────┘ └────┘              │
│  (toggle selection — one required)         │
│                                            │
│  Title *                                   │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Description                               │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  RAG Status *                              │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ Red  │ │Amber │ │Green │               │
│  └──────┘ └──────┘ └──────┘               │
│                                            │
│  Owner *                                   │
│  ┌────────────────────────────────────┐    │
│  │ Select team member            ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Due Date                                  │
│  ┌────────────────────────────────────┐    │
│  │ dd/mm/yyyy                 📅     │    │
│  └────────────────────────────────────┘    │
│                                            │
│  ─── Risk/Issue Specific ───               │
│  (shown when Type = Risk or Issue)         │
│                                            │
│  Impact *          Probability *           │
│  ┌──────────┐      ┌──────────┐            │
│  │ High   ▼ │      │ Medium ▼ │            │
│  └──────────┘      └──────────┘            │
│                                            │
│  ─── Dependency Specific ───               │
│  (shown when Type = Dependency)            │
│                                            │
│  Depends On (Project / Item)               │
│  ┌────────────────────────────────────┐    │
│  │ Search projects / items...        │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Source Meeting (optional)                 │
│  ┌────────────────────────────────────┐    │
│  │ Select meeting...             ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  [Cancel]                    [Create Item] │
│                                            │
└────────────────────────────────────────────┘
```

**Fields:**
- Type * (toggle: Risk/Assumption/Issue/Dependency)
- Title * (text, max 200 chars)
- Description (textarea, markdown)
- RAG Status * (toggle: Red/Amber/Green)
- Owner * (select from workspace members)
- Due Date (date picker — hybrid: calendar + quick select per DIS anti-pattern guidance)
- Impact * (Risk/Issue only: Very High/High/Medium/Low/Very Low)
- Probability * (Risk only: Very High/High/Medium/Low/Very Low)
- Depends On (Dependency only: project + item search)
- Source Meeting (optional: link to meeting)

**Validation:**
- Required fields marked with *
- Inline validation (errors shown below field, not in alert)
- "Create Item" disabled until all required fields filled
- All validation visible — no hidden required fields (DIS anti-pattern)

**Audit trail:** Creation automatically logged with user and timestamp (DIS P5).

#### 2.16.2 Create Action Drawer

```
┌────────────────────────────────────────────┐
│  Create Action                        [✕]  │
│  ──────────────────────────────────────    │
│                                            │
│  Title *                                   │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Description                               │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Assignee *                                │
│  ┌────────────────────────────────────┐    │
│  │ Select team member            ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Due Date *                                │
│  ┌────────────────────────────────────┐    │
│  │ dd/mm/yyyy                 📅     │    │
│  └────────────────────────────────────┘    │
│  Quick: [Today] [Tomorrow] [This week]     │
│         [Next week] [Next month]           │
│                                            │
│  Source                                    │
│  ┌────────────────────────────────────┐    │
│  │ Manual (default)              ▼   │    │
│  └────────────────────────────────────┘    │
│  Options: Manual / Meeting / RAID Item     │
│  (If Meeting/RAID selected, show picker)   │
│                                            │
│  Link to Meeting (if source = Meeting)     │
│  ┌────────────────────────────────────┐    │
│  │ Select meeting...             ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Link to RAID Item (if source = RAID)      │
│  ┌────────────────────────────────────┐    │
│  │ Search RAID items...              │    │
│  └────────────────────────────────────┘    │
│                                            │
│  [Cancel]                  [Create Action] │
│                                            │
└────────────────────────────────────────────┘
```

**Fields:**
- Title * (text)
- Description (textarea)
- Assignee * (select from workspace members)
- Due Date * (date picker with quick-select buttons: Today, Tomorrow, This week, Next week, Next month — DIS anti-pattern: calendar picker alone is clunky)
- Source (select: Manual / Meeting / RAID Item — default: Manual)
- Link to Meeting (conditional, if source = Meeting)
- Link to RAID Item (conditional, if source = RAID)

**Pre-population:** When created from a meeting detail page, source is pre-set to that meeting. When created from a RAID item detail, source is pre-set to that item.

#### 2.16.3 Create Meeting Drawer

```
┌────────────────────────────────────────────┐
│  New Meeting                          [✕]  │
│  ──────────────────────────────────────    │
│                                            │
│  Title *                                   │
│  ┌────────────────────────────────────┐    │
│  │ e.g., Steering Committee          │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Date *                                    │
│  ┌────────────────────────────────────┐    │
│  │ dd/mm/yyyy                 📅     │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Time                                      │
│  ┌─────────────┐  to  ┌─────────────┐     │
│  │ 10:00    ▼  │      │ 11:00    ▼  │     │
│  └─────────────┘      └─────────────┘     │
│                                            │
│  Meeting Type                              │
│  ┌────────────────────────────────────┐    │
│  │ Steering / Sprint / Ad Hoc / Other│    │
│  └────────────────────────────────────┘    │
│                                            │
│  Attendees                                 │
│  ┌────────────────────────────────────┐    │
│  │ + Add attendees...                │    │
│  │ ┌──────┐ ┌──────┐                │    │
│  │ │James ✕│ │Sarah ✕│                │    │
│  │ └──────┘ └──────┘                │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Agenda / Description                      │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  [Cancel]                [Create Meeting]  │
│                                            │
└────────────────────────────────────────────┘
```

**Fields:**
- Title * (text)
- Date * (date picker)
- Time range (start/end time pickers, optional)
- Meeting Type (select: Steering, Sprint Review, Sprint Planning, Ad Hoc, Other)
- Attendees (multi-select from workspace members, with tag UI)
- Agenda/Description (textarea)

#### 2.16.4 Create Decision Drawer

```
┌────────────────────────────────────────────┐
│  Log Decision                         [✕]  │
│  ──────────────────────────────────────    │
│                                            │
│  Decision *                                │
│  ┌────────────────────────────────────┐    │
│  │ What was decided?                 │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Rationale *                               │
│  ┌────────────────────────────────────┐    │
│  │ Why was this decision made?       │    │
│  │ What alternatives were considered?│    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Decision Date *                           │
│  ┌────────────────────────────────────┐    │
│  │ dd/mm/yyyy                 📅     │    │
│  └────────────────────────────────────┘    │
│  Quick: [Today] [Yesterday]                │
│                                            │
│  Participants *                            │
│  ┌────────────────────────────────────┐    │
│  │ + Add participants...             │    │
│  │ ┌──────┐ ┌──────┐ ┌──────┐       │    │
│  │ │James ✕│ │Sarah ✕│ │Mike ✕│       │    │
│  │ └──────┘ └──────┘ └──────┘       │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Source Meeting                            │
│  ┌────────────────────────────────────┐    │
│  │ Select meeting (optional)     ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Status                                    │
│  ┌────────────────────────────────────┐    │
│  │ Active (default)              ▼   │    │
│  └────────────────────────────────────┘    │
│  Options: Active / Superseded / Reversed   │
│                                            │
│  [Cancel]               [Log Decision]     │
│                                            │
└────────────────────────────────────────────┘
```

See Section 4 for full Decisions Log specification.

#### 2.16.5 Create Project Drawer

```
┌────────────────────────────────────────────┐
│  New Project                          [✕]  │
│  ──────────────────────────────────────    │
│                                            │
│  Project Name *                            │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Description                               │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Project Manager                           │
│  ┌────────────────────────────────────┐    │
│  │ Select team member            ▼   │    │
│  └────────────────────────────────────┘    │
│                                            │
│  Initial RAG Status                        │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ Red  │ │Amber │ │Green │  (default)    │
│  └──────┘ └──────┘ └──────┘               │
│                                            │
│  [Cancel]               [Create Project]   │
│                                            │
└────────────────────────────────────────────┘
```

---

### 2.17 Notification Bell & Panel

**Accessible from header bar (all screens).** Clicking the bell opens a dropdown panel.

```
┌──────────────────────────────────────────┐
│  Notifications                [Mark all] │
│  ──────────────────────────────────────  │
│                                          │
│  🔴 NEW                                  │
│                                          │
│  R-001 RAG changed to RED               │
│  Alpha · James · 2 hours ago            │
│                                          │
│  ACT-001 is now overdue                 │
│  Alpha · Due was Jan 30                 │
│                                          │
│  ── EARLIER ──                           │
│                                          │
│  New member Sarah joined workspace      │
│  Yesterday                               │
│                                          │
│  Meeting "Steering" marked complete     │
│  Alpha · Jan 27                          │
│                                          │
│  [View all notifications →]              │
│                                          │
└──────────────────────────────────────────┘
```

**Notification types (v1):**
- RAID item RAG changed
- Action overdue
- Action assigned to you
- Meeting upcoming (24h before)
- New member joined workspace
- Meeting marked complete
- Decision logged

Each notification links to the relevant item (DIS P2: escalation paths, not dead ends).

---

## 3. v1 User Journeys

### 3.1 Programme Manager / PMO Lead — Daily Triage

The primary v1 journey. Manual-only flow (no AI).

```
                    ┌─────────┐
                    │  Login  │
                    └────┬────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Dashboard   │     "What needs attention?"
                  │  See project │     RED/AMBER projects first
                  │  health      │     Overdue counts visible
                  └──────┬───────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌────────┐ ┌──────────┐
        │Project A │ │Proj. B │ │My Actions│  "What's mine?"
        │ (RED)    │ │(AMBER) │ │ (global) │
        └────┬─────┘ └────────┘ └──────────┘
             │
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ RAID │ │ Acts │ │ Meet │ │ Decs │  "Deep dive"
│ Log  │ │Track │ │ Hub  │ │ Log  │
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   │        │        │        │
   ▼        ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Create│ │Create│ │Record│ │ Log  │  "Take action"
│ RAID │ │Action│ │Notes │ │Decis.│  (manual entry)
│ Item │ │      │ │+Items│ │      │
└──────┘ └──────┘ └──────┘ └──────┘
```

**Step-by-step flow:**

| Step | Screen | Action | Time | DIS Principle |
|------|--------|--------|------|---------------|
| 1 | Login | Authenticate | 5s | — |
| 2 | Dashboard | Scan project cards. Identify RED/AMBER projects | 5-10s | P4: Exceptions first |
| 3 | Project Overview | Click into concerning project. Review KPI cards | 10-15s | P3: Hierarchy as nav |
| 4 | RAID Log | Review open risks/issues. Check overdue items | 1-3 min | P1: Traceable, P4: Exceptions |
| 5 | Actions | Check overdue actions. Complete any done | 1-2 min | P2: Escalation paths |
| 6 | Meetings | Check upcoming meeting. Add notes from recent one | 2-5 min | P5: Governance rigour |
| 7 | Meeting Detail | Create actions from meeting. Log decisions | 3-5 min | P1: Traceable, P5: Rigour |
| 8 | Decisions | Review decision log for completeness | 1 min | P1: Traceable |
| 9 | My Actions | Cross-project review of personal actions | 1-2 min | P2: Escalation paths |

**Total daily triage time target: 10-15 minutes**

### 3.2 Project Manager — Post-Meeting Capture

The key "manual governance" workflow that v2 will automate with AI.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ After meeting│     │ Open Meeting │     │  Add Notes   │
│ (real-world) │ ──► │ Hub in Helm  │ ──► │ from meeting │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌────────────────────────────┤
                     │                            │
                     ▼                            ▼
              ┌──────────────┐            ┌──────────────┐
              │ Create each  │            │ Log each     │
              │ action       │            │ decision     │
              │ manually     │            │ manually     │
              │              │            │              │
              │ Set: owner,  │            │ Set: text,   │
              │ due date,    │            │ rationale,   │
              │ source=mtg   │            │ participants │
              └──────────────┘            └──────────────┘
                     │                            │
                     ▼                            ▼
              ┌──────────────┐            ┌──────────────┐
              │ Actions show │            │ Decisions    │
              │ in Actions   │            │ show in      │
              │ Tracker with │            │ Decisions    │
              │ source link  │            │ Log with     │
              │ to meeting   │            │ meeting link │
              └──────────────┘            └──────────────┘
```

**v1 manual steps (v2 will automate these):**

1. Open Meeting Hub → Select/create meeting
2. Add meeting notes (rich text)
3. Click [+ Action from this meeting] for each action item
   - Manually enter: title, owner, due date
   - Source auto-set to this meeting
4. Click [+ Decision from this meeting] for each decision
   - Manually enter: decision text, rationale, participants
   - Source meeting auto-linked
5. Optionally click [+ RAID item from this meeting] for new risks/issues
   - Source meeting auto-linked
6. All items now appear in their respective tabs with meeting provenance

### 3.3 First-Time User — Workspace Setup

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Signup  │ ──► │ Workspace│ ──► │ First Project │ ──► │Dashboard │
│          │     │  Setup   │     │  Creation     │     │ (with    │
│          │     │  Step 1  │     │  Step 2       │     │  project)│
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
                                                              │
                                                              ▼
                                                       ┌──────────┐
                                                       │ Empty    │
                                                       │ Project  │
                                                       │ Overview │
                                                       │          │
                                                       │ Guided:  │
                                                       │ "Add your│
                                                       │ first    │
                                                       │ risk..." │
                                                       └──────────┘
```

**Empty state guidance:**
- Dashboard with one project → "Great start! Click into your project to add risks, actions, and meetings."
- Empty RAID log → "Create your first risk, assumption, issue, or dependency." [+ Add Item]
- Empty Actions → "Actions will appear here when you create them from meetings or RAID items, or add them directly." [+ Add Action]
- Empty Meetings → "Capture your first governance meeting." [+ New Meeting]
- Empty Decisions → "Log your first decision to start building an audit trail." [+ Log Decision]

---

## 4. Decisions Log Screen — Detailed Design

> This screen is **NEW** — not present in the original product map. Designed following DIS patterns to match RAID Log and Actions Tracker consistency.

### 4.1 Purpose

The Decisions Log provides a permanent, auditable register of all governance decisions made within a project. Unlike RAID items (which are living and change status) or Actions (which are tasks to complete), Decisions are **historical records** — once made, they're immutable records of what was agreed, why, and by whom.

### 4.2 Screen Layout

**URL:** `/projects/:id/decisions`

```
┌─────────────────────────────────────────────────────────────────┐
│ Helm > Projects > Alpha > Decisions     🔍  🔔(3)  👤 Name    │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│Sidebar │  Project Alpha              RAG: 🔴  [Edit] [⋯]      │
│        │  ┌─────────┬──────────┬─────────┬──────────┬─────────┐│
│        │  │Overview │RAID (12) │Acts (7) │Meet (3)  │Dec (5)● ││
│        │  └─────────┴──────────┴─────────┴──────────┴─────────┘│
│        │                                                        │
│        │  ┌─ Filters ─────────────────────────────────────┐    │
│        │  │ Status: [All▼]  Source: [All▼]  [Clear All]   │    │
│        │  └───────────────────────────────────────────────┘    │
│        │                                    [+ Log Decision]   │
│        │                                                        │
│        │  ┌────┬──────────────────┬────────┬──────┬─────┬─────┐│
│        │  │ ID │ Decision         │Particip│ Date │Sourc│Stat ││
│        │  ├────┼──────────────────┼────────┼──────┼─────┼─────┤│
│        │  │D005│Go with Option B  │JS, SK, │Jan 27│Steer│Activ││
│        │  │    │for deployment    │ML      │      │27/01│     ││
│        │  │    │approach          │        │      │     │     ││
│        │  ├────┼──────────────────┼────────┼──────┼─────┼─────┤│
│        │  │D004│Approve budget    │JS, LD  │Jan 27│Steer│Activ││
│        │  │    │increase for test │        │      │27/01│     ││
│        │  │    │phase (£15k)      │        │      │     │     ││
│        │  ├────┼──────────────────┼────────┼──────┼─────┼─────┤│
│        │  │D003│Defer Feature X to│SK, ML  │Jan 20│Sprint│Activ││
│        │  │    │Phase 2           │        │      │Rev.  │     ││
│        │  ├────┼──────────────────┼────────┼──────┼─────┼─────┤│
│        │  │D002│Use Vendor Y for  │JS, SK  │Jan 15│Ad Hoc│Super││
│        │  │    │hosting platform  │        │      │      │seded││
│        │  ├────┼──────────────────┼────────┼──────┼─────┼─────┤│
│        │  │D001│Project start date│All     │Jan 10│Kick │Activ││
│        │  │    │confirmed: Feb 1  │        │      │off   │     ││
│        │  └────┴──────────────────┴────────┴──────┴─────┴─────┘│
│        │                                                        │
│        │  Items 1–5 of 5                                       │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

### 4.3 Column Structure

| Column | Width | Behaviour |
|--------|-------|-----------|
| **ID** | 80px fixed | Auto-generated: DEC-001, DEC-002, etc. Click → detail drawer |
| **Decision** | Flexible (min 200px) | Decision text. Truncate with ellipsis; full on hover. Click → detail drawer |
| **Participants** | 120px fixed | Initials or names. Truncate if >3 participants. Full list on hover |
| **Date** | 100px fixed | Decision date. Formatted: "Jan 27" (relative if within 7 days: "3 days ago") |
| **Source** | 100px fixed | Meeting name (clickable link) or "Ad Hoc". Click → meeting detail |
| **Status** | 80px fixed | Chip: Active (blue), Superseded (grey with strikethrough), Reversed (red) |

### 4.4 Detail Drawer

Clicking any row opens the detail drawer from the right (~400px):

```
┌──────────────────────────────────┐
│  DEC-005                    [✕]  │
│  ──────────────────────────────  │
│                                  │
│  Decision                        │
│  Go with Option B for the       │
│  deployment approach.            │
│                                  │
│  Status: Active                  │
│  Date: January 27, 2026         │
│  ────────────────────────────── │
│                                  │
│  Rationale                       │
│  Option A required additional    │
│  vendor negotiation and would    │
│  add 3 weeks. Option B uses     │
│  existing infrastructure with    │
│  minor modifications. Risk is    │
│  lower and timeline maintained.  │
│  ────────────────────────────── │
│                                  │
│  Participants                    │
│  👤 James Smith                  │
│  👤 Sarah Kim                    │
│  👤 Mike Liu                     │
│  ────────────────────────────── │
│                                  │
│  Source Meeting                  │
│  🗓️ Steering Committee · Jan 27 │
│  (click to view meeting)        │
│  ────────────────────────────── │
│                                  │
│  Linked Actions                  │
│  🎯 ACT-005: Implement Option B │
│  🎯 ACT-006: Notify vendor of   │
│              approach change     │
│  ────────────────────────────── │
│                                  │
│  Supersedes                      │
│  ⚖️ DEC-002: Use Vendor Y for   │
│     hosting (now superseded)     │
│  ────────────────────────────── │
│                                  │
│  Audit Trail                     │
│  Jan 27, 3:15 PM — Created      │
│    by James Smith                │
│  Jan 28, 9:00 AM — ACT-005      │
│    linked by James               │
│  Jan 29, 2:00 PM — DEC-002      │
│    marked as superseded          │
│    by James (linked to DEC-005)  │
│  ────────────────────────────── │
│                                  │
│  [Edit] [Link Action] [⋯]      │
│                                  │
│  [⋯] menu:                      │
│  - Mark as Superseded            │
│  - Mark as Reversed              │
│  - Link RAID Item                │
│  - Delete                        │
│                                  │
└──────────────────────────────────┘
```

### 4.5 Decision Fields (Full Specification)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **ID** | Auto-generated | — | Sequential: DEC-001, DEC-002. Unique within project. |
| **Decision** | Text (max 500 chars) | ✅ | What was decided. Clear, concise statement. |
| **Rationale** | Text (markdown, no limit) | ✅ | Why this was decided. What alternatives were considered. This is the audit-critical field. |
| **Participants** | Multi-select (workspace members) | ✅ | Who was involved in making this decision. Minimum 1. |
| **Date** | Date | ✅ | When the decision was made (not when it was logged). |
| **Source Meeting** | Reference (Meeting) | Optional | Link to the meeting where this was decided. Creates bidirectional link. |
| **Status** | Enum | ✅ | Active / Superseded / Reversed. Default: Active. |
| **Superseded By** | Reference (Decision) | Conditional | If Status = Superseded, reference to the replacing decision. |
| **Reversed Reason** | Text | Conditional | If Status = Reversed, explanation of why. |
| **Linked Actions** | References (Actions) | Optional | Actions resulting from this decision. |
| **Linked RAID Items** | References (RAID) | Optional | RAID items related to or resulting from this decision. |
| **Created At** | Timestamp (auto) | — | System-generated. Immutable. |
| **Created By** | User reference (auto) | — | System-generated. Immutable. |
| **Updated At** | Timestamp (auto) | — | System-generated. Updates on any edit. |
| **Updated By** | User reference (auto) | — | System-generated. |

### 4.6 States

| State | Visual Treatment | Behaviour |
|-------|------------------|-----------|
| **Empty** | Illustration + "No decisions logged for this project yet. Recording decisions creates a permanent audit trail of what was agreed, when, and why." [+ Log Decision] | Emphasize audit value |
| **Loading** | Skeleton rows (5 rows) preserving column structure. Filter bar visible but disabled. | No spinner |
| **Loaded** | Full decision table. Most recent first (reverse chronological). Superseded/Reversed items shown with visual distinction (grey text, strikethrough for superseded). | Default sort: newest first |
| **Filtered** | Active filter chips above table. "Showing X of Y decisions." "Clear All" visible. | Filter state in URL |
| **Error** | Inline: "Failed to load decisions. [Retry]" | Preserve last data if possible |

### 4.7 Interactions

| Interaction | Behaviour |
|-------------|-----------|
| **Create** | [+ Log Decision] → Opens create drawer. Fields: Decision, Rationale, Participants, Date, Source Meeting, Status. Created item appears at top of list. Audit: "Created by [user] at [time]". |
| **Edit** | From detail drawer [Edit] button. Opens inline edit mode within drawer. Only Decision text, Rationale, and Participants are editable (Date and Source are locked after creation to preserve integrity). Edit logged in audit trail with diff. |
| **Link to Meeting** | Source Meeting field in create/edit. Dropdown of project meetings. Creates bidirectional link (meeting shows decision count; decision shows meeting link). |
| **Link Action** | From detail drawer [