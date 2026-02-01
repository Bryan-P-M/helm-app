# Helm P3O Governance Platform - Demo Scenarios

This document provides narrative demo scripts for Helm, designed to showcase its key features and value propositions to various personas. Each scenario leverages specific use cases outlined in `use-case-test-scripts.md` and emphasizes Helm's unique differentiators.

---

## Demo 1: "The PMO Lead's Monday Morning" (Persona 5: PMO Lead)

**Duration:** 15 minutes

**Goal:** Show how Helm replaces spreadsheet consolidation, automates exception reporting, and enables rapid triage, giving the PMO Lead "commanding clarity."

**Pre-demo Data Setup Requirements:** Refer to `helm-app/docs/testing/demo-data-setup.md` for detailed data requirements. Specifically, ensure:
- Multiple portfolios, programmes, and projects are set up.
- Several RAID items (Risks, Issues) with Red and Amber RAG statuses exist.
- A few Actions are overdue.
- A user is set up with the PMO Lead role.

### Narrative & Talking Points

**1. Login & Dashboard Overview**
- **Action:** Login as the PMO Lead (UC-101).
- **Talking Point:** "As a PMO Lead, my Monday morning used to start with chasing project managers for their status reports, then consolidating countless spreadsheets. With Helm, I log in and immediately have commanding clarity on the entire P3O landscape. No more chasing data, just acting on insight."
- **Wow Moment:** User lands directly on the P3O Dashboard, displaying health cards (UC-501) and a clear hierarchy tree (UC-502) with RAG statuses.

**2. Triage Exceptions: The 'Needs Attention' Table**
- **Action:** Scroll to the "Needs Attention" table (UC-503).
- **Talking Point:** "Helm adheres to the 'Exception First' principle (P4-Exception First). It automatically highlights anything that needs my immediate attention – Red or Amber items, overdue actions, unassigned decisions. I don't have to hunt for problems; Helm brings them to me."
- **Anticipated Question:** "How often is this updated?" **Answer:** "Helm is real-time. As soon as a Project Manager updates a RAG status or marks an action complete, it's reflected here. This isn't stale data from last week's report."

**3. Drill Down and Understand Context**
- **Action:** Click on a "Red" Issue in the "Needs Attention" table (e.g., "Resource Shortage on Core Banking Project") (UC-503, leads to UC-603).
- **Talking Point:** "The single most critical decision moment for a PMO Lead is the escalation judgment – identifying a problem and initiating action within 3-5 seconds. Helm makes this possible. From the dashboard, I can drill directly into the issue. I see it's linked to the 'Core Banking Modernization' project, owned by Sarah. All the context I need is here, traceable (P1-Traceable) back to its origin."
- **Wow Moment:** Seamless navigation from a dashboard aggregate to a specific item's detail page, showing all linked context.

**4. Quick RAG Update & Escalation**
- **Action:** Quickly update the RAG status of another RAID item (e.g., an Amber Risk) directly from the RAID log list (UC-602). Then, select an item and demonstrate the "Escalate" function (UC-603), choosing a Programme Sponsor.
- **Talking Point:** "Imagine I've just had a quick chat with Sarah, and she confirms the resource issue is improving. I can quickly update the RAG to Amber with a single click (P2-One-Click Escalation). If it were escalating, I could raise it directly to the Programme Sponsor right from this screen. This is that 3-5 second triage in action."
- **Transition:** "Now, for compliance and oversight, it's critical to know who did what, when."

**5. Check the Audit Trail**
- **Action:** Navigate to the "Audit Trail" (UC-1201), and show a filter for recent RAG changes (UC-1202).
- **Talking Point:** "Every significant change in Helm – RAG updates, new projects, action assignments – is automatically recorded in an immutable audit trail (P1-Traceable). This provides complete 'earned assurance' to our stakeholders and is invaluable for audits. We can even filter to see all changes made by a specific user or to a particular project."
- **Wow Moment:** The comprehensive list of actions with user, timestamp, and details visible.

**Anticipated Questions:**
- "Can I customize the RAG statuses?" **Answer:** "Yes, Helm is configurable for your organization's specific RAG definitions and thresholds."
- "What if I need to export this data?" **Answer:** "You can export any list view – RAID, Actions, Decisions, Audit Trail – to CSV for further analysis or integration with other tools (UC-605, UC-704, UC-903, UC-1203)."

---

## Demo 2: "Meeting to Action in 60 Seconds" (Persona 4: Programme Manager)

**Duration:** 10 minutes

**Goal:** Demonstrate Helm's KEY DIFFERENTIATOR: AI Meeting Extraction, showing how unstructured meeting notes are converted into traceable, actionable governance items. Emphasize that *no other vendor* does this.

**Pre-demo Data Setup Requirements:** Refer to `helm-app/docs/testing/demo-data-setup.md`. Specifically:
- At least one Project within a Programme.
- A meeting created, linked to the project, with an empty notes field.
- A realistic meeting transcript/notes text snippet containing clear action items (assignee, due date) and decisions.

### Narrative & Talking Points

**1. The Meeting Context**
- **Action:** Navigate to an existing meeting's detail page (UC-803) (e.g., 'Project Alpha Weekly Standup').
- **Talking Point:** "As a Programme Manager, a huge drain on my time is transcribing meeting notes and manually creating action items and decisions. Typically, these get stuck in emails or separate spreadsheets. This leads to lost actions, lack of accountability, and reporting nightmares. Helm changes this entirely."
- **Transition:** "I've just finished our weekly standup and have the raw transcript. Watch this."

**2. AI Extraction: The White Space Differentiator**
- **Action:** Click the 'AI Extract' button on the meeting page (UC-1101). Paste the prepared meeting transcript into the Helmbot input field. Click 'Extract'.
- **Talking Point:** "This is Helmbot, our AI-powered meeting extraction engine. I simply paste in the raw meeting notes or a transcript, and Helmbot's intelligence immediately gets to work. This feature is our 'white space' – out of 16 PPM vendors we assessed, **zero** offer this level of native, meeting-to-governance-item traceability. Microsoft Copilot comes close, but it's partial and lacks the direct integration into a P3O platform."
- **Wow Moment:** The instant parsing and presentation of proposed Actions and Decisions from unstructured text, pre-filled with details.

**3. Review, Refine, and Approve**
- **Action:** In the Helmbot review interface (UC-1102), show reviewing extracted items. Approve a valid action, edit the due date or assignee of another, and reject an irrelevant decision.
- **Talking Point:** "Helmbot presents the extracted items for my review. I'm in control. I can easily approve, reject, or even refine the details like assignees and due dates. This ensures accuracy and maintains the 'earned assurance' principle – confidence from evidence, not just decoration."

**4. Actions and Decisions Live in Helm**
- **Action:** After approving, navigate to the project's 'Actions' tab (UC-403) or the main 'Actions' list (UC-703), then the 'Decisions' list (UC-902).
- **Talking Point:** "Once approved, these aren't just notes; they are real, traceable Actions and Decisions, live in Helm. They appear in the project's trackers, flow into the dashboard, and become part of our audit trail (UC-1103). This is genuine 'report once, flows everywhere.' No more double-entry, no more lost actions."
- **Wow Moment:** Seeing the newly created action immediately appear in the Actions log, correctly linked.

**Anticipated Questions:**
- "What if the AI makes a mistake?" **Answer:** "That's why the review step is crucial. You're always in control to refine or reject anything extracted. Over time, Helmbot learns and improves."
- "Can it integrate with my video conferencing platform?" **Answer:** "Currently, you can paste any transcript. Integration with platforms like Teams or Zoom for direct transcript import is on our roadmap, further streamlining the process."

---

## Demo 3: "The Portfolio View" (Personas 1+3: Board Chair + Portfolio Director)

**Duration:** 10 minutes

**Goal:** Provide a strategic, top-down view of the P3O landscape, demonstrating 'earned assurance' through data-driven insights and traceability for the Board Chair and Portfolio Director.

**Pre-demo Data Setup Requirements:** Refer to `helm-app/docs/testing/demo-data-setup.md`. Specifically:
- Two portfolios ('Digital Transformation', 'Regulatory Compliance').
- Programmes and Projects nested under them, with varying RAG statuses (some Green, some Amber, at least one Red). Ensure a Red project rolls up to an Amber or Red programme and potentially a Red portfolio.
- Key personnel assigned as Directors, SROs, PMs.

### Narrative & Talking Points

**1. High-Level Strategic Overview**
- **Action:** Login as a Portfolio Director (UC-101) and navigate to the P3O Dashboard.
- **Talking Point:** "As a Board Chair or Portfolio Director, I need an immediate, trustworthy pulse on our entire change portfolio. Helm provides 'earned assurance' – confidence derived from real-time, evidence-based data, not just decorative reporting. I can see the health of our 'Digital Transformation' and 'Regulatory Compliance' portfolios at a glance."
- **Wow Moment:** The Portfolio Health Card (UC-501) showing overall RAG breakdown, giving an instant strategic summary.

**2. Navigating the Hierarchy & Identifying Trouble**
- **Action:** Use the Hierarchy Tree (UC-502) to expand 'Digital Transformation', then 'Customer Experience Uplift'. Identify a 'Red' project (e.g., 'Online Portal Redesign').
- **Talking Point:** "The hierarchy tree (P3-Hierarchy as Navigation) allows me to intuitively navigate from the strategic (Portfolio) down to the operational (Project). I can immediately see the 'Red' badge on the 'Online Portal Redesign' project. This adheres to our 'Exception First' principle (P4-Exception First) – bringing critical issues to my attention without me having to dig."
- **Anticipated Question:** "How accurate is this RAG?" **Answer:** "The RAG statuses are updated by the Project and Programme Managers, then automatically roll up through the hierarchy. Helm ensures consistency and provides an audit trail for every change, ensuring the data you see is the single source of truth (P1-Traceable)."

**3. Project Drill-Down & Escalation Trail**
- **Action:** Click on the 'Red' project ('Online Portal Redesign') to go to its detail page (UC-403). Go to the 'RAID' tab and identify the root cause issue that caused the Red status. Show the escalation history for this RAID item (UC-603).
- **Talking Point:** "Clicking on the project brings me directly to its detailed view. Here, I can see the underlying RAID items, actions, and decisions that contribute to its status. I can quickly ascertain the root cause – perhaps a critical risk has materialized. If this issue has been escalated up the chain (P2-One-Click Escalation), I can view its full escalation history, understanding who was notified and when. This traceability provides genuine peace of mind."

**4. Exporting a Strategic Report**
- **Action:** Navigate to the 'Portfolios' list and use the export feature (UC-201, imagine an export for the list). Or show a filtered view of the Audit Trail for a specific portfolio and export that (UC-1203).
- **Talking Point:** "For board packs or executive briefings, I can easily export summary data for specific portfolios, programmes, or even the full audit trail. This means I'm not recreating reports; I'm simply extracting the current state of truth from Helm. This empowers quick, data-driven decision-making."
- **Transition:** "That's the strategic view. Now, let's see how Helm supports the day-to-day delivery."

**Anticipated Questions:**
- "Can we customize the dashboard views?" **Answer:** "Helm offers a flexible dashboard, and we're continuously enhancing customization options to meet specific leadership reporting needs."
- "How do we get our existing projects into Helm?" **Answer:** "Helm supports bulk import features and API integrations (UC-1303) to seamlessly bring in your current project data."

---

## Demo 4: "Project Delivery Day-to-Day" (Persona 6: Project Manager)

**Duration:** 10 minutes

**Goal:** Show how Helm provides simple tools for Project Managers, reduces administrative overhead, ensures clear escalation paths, and adheres to 'report once, flows everywhere' principle.

**Pre-demo Data Setup Requirements:** Refer to `helm-app/docs/testing/demo-data-setup.md`. Specifically:
- A Project Manager user role.
- At least one project with some existing RAID items, actions, decisions, and meetings.

### Narrative & Talking Points

**1. Project Overview and Daily Check-in**
- **Action:** Login as a Project Manager (UC-101) and navigate directly to their assigned project's detail page (UC-403).
- **Talking Point:** "As a Project Manager, my focus is delivery, not endless administration. Helm simplifies my day-to-day. When I log in, I see my projects, and I can quickly get to my 'New Online Banking Portal' project overview. I can immediately see its health, and crucial information like its linked programme and outstanding items."
- **Wow Moment:** The tabbed view (Overview, RAID, Actions, Decisions, Meetings) providing a single, comprehensive workspace for the project.

**2. Logging a New Risk & Quick RAG Update**
- **Action:** Go to the 'RAID' tab. Create a new Risk (UC-601), setting its RAG to Amber initially. Then, click the RAG badge to quickly change it to Red (UC-602).
- **Talking Point:** "A new dependency has emerged. I can quickly log it in the RAID tab, linking it directly to my project. If I need to raise the urgency, Helm's 'One-Click Escalation' (P2-One-Click Escalation) allows me to change the RAG status from Amber to Red in just 3 seconds, ensuring the programme lead is immediately aware. This adheres to 'Risk-aware defaults' (P5-Risk-aware defaults) – making it easy to highlight issues."

**3. Creating and Tracking Actions**
- **Action:** Go to the 'Actions' tab. Create a new action (UC-701) with an assignee (a team member) and a due date. Show an existing overdue action highlighted (UC-702).
- **Talking Point:** "I can assign actions directly to team members with clear due dates, linking them to specific projects. Helm automatically flags overdue actions (P4-Exception First), ensuring nothing slips through the cracks. No more tracking actions in personal to-do lists; everything is centralized and visible."

**4. Capturing Meeting Insights & Decisions**
- **Action:** Go to the 'Meetings' tab. Open an existing meeting. Use the inline notes editor (UC-803) to add a small note. Then, manually extract a decision from the notes (UC-805).
- **Talking Point:** "After a meeting, I can capture minutes directly within Helm. And if a key decision is made, I can highlight it in the notes and quickly extract it into a formal 'Decision' record. This ensures our key choices are formally documented and traceable (P1-Traceable), not just informal agreements."

**5. Checking Roles and Responsibilities with RACI**
- **Action:** Navigate to the 'RACI Matrix' for the project (UC-1003). Demonstrate clicking a cell to cycle R→A→C→I (UC-1001).
- **Talking Point:** "For clarity on complex deliverables, I can quickly reference the RACI matrix for my project. It visually shows who is Responsible, Accountable, Consulted, and Informed. This prevents confusion and ensures smooth collaboration, embodying the clarity our teams need."
- **Transition:** "This entire workflow demonstrates 'report once, flows everywhere.' I input data here, and it instantly updates dashboards and reports for my Programme and Portfolio leads."

**Anticipated Questions:**
- "Can I link documents to projects?" **Answer:** "Yes, Helm allows for linking relevant documents and external resources to projects, RAID items, and meetings, providing comprehensive context."
- "What kind of notifications does Helm provide?" **Answer:** "Helm offers configurable notifications for assignments, escalations, and overdue items, ensuring relevant stakeholders are always informed."

---

## Demo 5: "Setting Up Governance from Scratch" (All Personas)

**Duration:** Flexible (approx. 15-20 minutes for core steps, can be expanded)

**Goal:** Walk through the full lifecycle of setting up a new governance structure in Helm, from workspace creation to initial data entry, showcasing the ease of implementation and the hierarchical design (P3-Hierarchy as Navigation).

**Pre-demo Data Setup Requirements:** Essentially an empty workspace, though a single admin user should exist.

### Narrative & Talking Points

**1. Creating the Workspace & Inviting the Team**
- **Action:** As a new PMO Lead, log in to an empty workspace. Show the empty state guidance on the dashboard (UC-504). Navigate to 'Settings' and change the 'Workspace Name' (UC-1401). Then, 'Invite New Members' (UC-1402).
- **Talking Point:** "Starting a new P3O function or bringing on a new client? Helm makes setup incredibly simple. First, we'll name our workspace – let's call this the 'Isle of Man Government PMO.' Then, I can quickly invite my core team members and assign their roles, giving them immediate access to the platform."
- **Wow Moment:** The intuitive empty state guidance leading directly to setup actions.

**2. Establishing the Portfolio Layer**
- **Action:** Create a new Portfolio: 'Digital Transformation' (UC-201). Highlight the basic details.
- **Talking Point:** "Our strategic change starts with defining our Portfolios – the highest level of investment grouping. For the IoM Government, 'Digital Transformation' is key. This establishes the top layer of our governance hierarchy."

**3. Building the Programme Layer**
- **Action:** Create a new Programme: 'Customer Experience Uplift', linked to 'Digital Transformation' (UC-301).
- **Talking Point:** "Underneath our strategic portfolios sit our Programmes. The 'Customer Experience Uplift' Programme falls directly under Digital Transformation. This ensures clear strategic alignment (P3-Hierarchy as Navigation) from day one."

**4. Defining the Project Layer**
- **Action:** Create two new Projects: 'Online Portal Redesign' and 'Citizen Engagement Platform', linked to 'Customer Experience Uplift' (UC-401). Show the Project Grid View (UC-404).
- **Talking Point:** "Now we define the actual delivery work – our Projects. These are the engines of change. With Helm, I can quickly set up 'Online Portal Redesign' and 'Citizen Engagement Platform,' assigning project managers and setting initial RAG. Notice how easy it is to see all projects in the grid view."

**5. Conduct the First Meeting & Create Initial Governance Items**
- **Action:** Create a new Meeting (UC-801) for 'Online Portal Redesign'. Use the inline notes editor (UC-803) to add some notes. Then, manually extract a simple Action (UC-804) and a Decision (UC-805) from the notes.
- **Talking Point:** "With our structure in place, let's hold our first project meeting. I can quickly create and link the meeting. After discussions, I can easily capture an action for 'John to investigate API integration' and a decision like 'Proceed with Option B for database selection,' directly from my notes. This immediately starts populating our governance trackers."
- **Wow Moment:** The seamless flow from meeting notes to structured actions/decisions, demonstrating P1-Traceable.

**6. Logging Initial Risks/Issues**
- **Action:** Navigate to the 'RAID Log' and create a new 'Risk' for 'Online Portal Redesign' (UC-601), setting its RAG to Green.
- **Talking Point:** "Finally, we can start populating our core risk and issue log. I'll add an initial risk for the 'Online Portal Redesign' – perhaps 'Potential for scope creep.' This ensures we're proactively identifying and managing potential blockers from the outset."
- **Transition:** "And just like that, in minutes, we have a fully functional P3O governance structure, ready to grow with your organization."

**Anticipated Questions:**
- "Can we customize the fields for projects or RAID items?" **Answer:** "Helm provides standard governance fields. Advanced customization options for fields are on the roadmap to support highly specific organizational needs."
- "Is there a way to onboard many existing projects at once?" **Answer:** "Yes, for larger migrations, we offer data import tools to streamline the onboarding of existing projects, RAID logs, and team members."

---
