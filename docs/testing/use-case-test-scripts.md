# Helm P3O Governance Platform - Use Case Test Scripts

This document outlines comprehensive, use-case-based test scripts for the Helm P3O Governance SaaS platform, covering every built feature. These scripts are designed to be executable against the actual UI and serve as a foundation for QA and demo preparation.

---

## 1. Authentication

### UC-101: User Login with Email and Password
- **Persona:** All
- **Preconditions:** A user account exists in the system with a registered email and password.
- **Steps:**
    1. Navigate to the Helm login page (`/login`).
    2. Enter a valid email address in the "Email" field.
    3. Enter the correct password in the "Password" field.
    4. Click the "Login" button.
- **Expected Result:** User is successfully logged in and redirected to the P3O Dashboard. The sidebar displays the user's avatar/initials and name.
- **Demo Value:** Shows secure access and immediate entry to core functionality.

### UC-102: User Signup
- **Persona:** All (especially new PMO Leads setting up governance from scratch)
- **Preconditions:** None.
- **Steps:**
    1. Navigate to the Helm signup page (`/signup`).
    2. Enter a unique valid email address in the "Email" field.
    3. Enter a strong password in the "Password" field.
    4. Confirm the password in the "Confirm Password" field.
    5. Click the "Sign Up" button.
    6. Verify email (if required by configuration).
- **Expected Result:** User account is created. User is prompted to verify email or directly logged in, then redirected to the P3O Dashboard, potentially with guidance for empty state.
- **Demo Value:** Demonstrates ease of onboarding and self-service setup for new teams.

### UC-103: User Signout
- **Persona:** All
- **Preconditions:** User is currently logged in.
- **Steps:**
    1. Click on the user profile icon/name in the sidebar.
    2. In the dropdown menu, click "Sign Out".
- **Expected Result:** User is logged out and redirected to the login page. Session cookies are cleared.
- **Demo Value:** Confirms secure session management and privacy.

### UC-104: Magic Link Login Callback
- **Persona:** All (for passwordless or forgotten password scenarios)
- **Preconditions:** A user account exists. User has requested a magic link.
- **Steps:**
    1. As a user, click the "Forgot Password" or "Login with Magic Link" option on the login page.
    2. Enter registered email address.
    3. Check email inbox for the magic link.
    4. Click the magic link provided in the email.
- **Expected Result:** User is authenticated and securely logged into Helm, redirected to the P3O Dashboard.
- **Demo Value:** Highlights flexible and secure login options, reducing password fatigue and support requests.

---

## 2. Portfolio Management

### UC-201: Create New Portfolio
- **Persona:** Portfolio Director, PMO Lead
- **Preconditions:** User is logged in with appropriate permissions (e.g., admin or portfolio manager role).
- **Steps:**
    1. Navigate to the "Portfolios" section via the sidebar.
    2. Click the "Create New Portfolio" button.
    3. Enter "Digital Transformation" in the "Name" field.
    4. Enter "DT-2024" in the "Code" field.
    5. Enter a meaningful description in the "Description" field.
    6. Select a "Director" from the dropdown.
    7. Select "Green" for initial RAG status.
    8. Select "Active" for initial Status.
    9. Click "Save".
- **Expected Result:** A new portfolio named "Digital Transformation" appears in the portfolio list with the specified details. The UI reflects router.refresh() on mutation.
- **Demo Value:** Shows rapid setup of strategic groupings, supporting P3-Hierarchy as Navigation.

### UC-202: Edit Existing Portfolio Details
- **Persona:** Portfolio Director, PMO Lead
- **Preconditions:** An existing portfolio (e.g., "Digital Transformation") is available.
- **Steps:**
    1. Navigate to the "Portfolios" section.
    2. Click on "Digital Transformation" to view its detail page.
    3. Click the "Edit" button (or appropriate edit icon).
    4. Change the "Name" to "Enterprise Digital Transformation".
    5. Change the "RAG Status" from "Green" to "Amber".
    6. Update the "Director" to a different user.
    7. Click "Save".
- **Expected Result:** The portfolio detail page and list view reflect the updated name, RAG status, and director. The audit trail records the changes.
- **Demo Value:** Demonstrates dynamic governance and easy updates to strategic oversight, aligning with P4-Exception First if RAG changes to Amber/Red.

### UC-203: View Portfolio Detail Page
- **Persona:** Portfolio Steering Board Chair, Portfolio Director, PMO Lead
- **Preconditions:** An existing portfolio exists.
- **Steps:**
    1. Navigate to the "Portfolios" section.
    2. Click on an existing portfolio (e.g., "Enterprise Digital Transformation").
- **Expected Result:** The portfolio detail page displays: name, code, description, director, current RAG status, overall status, and a list of linked programmes with their RAG statuses.
- **Demo Value:** Provides a "single source of truth" for strategic oversight, showcasing P3-Hierarchy as Navigation.

### UC-204: Delete Portfolio
- **Persona:** PMO Lead (with caution)
- **Preconditions:** An existing portfolio with no linked programmes or projects (or confirmation of cascading delete).
- **Steps:**
    1. Navigate to the "Portfolios" section.
    2. Select the portfolio to delete (e.g., a test portfolio).
    3. Click the "Delete" button/icon.
    4. Confirm deletion in the prompt.
- **Expected Result:** The portfolio is removed from the list. An audit log entry is created.
- **Demo Value:** Demonstrates administrative control, though typically used with caution.

---

## 3. Programme Management

### UC-301: Create New Programme (Linked to Portfolio)
- **Persona:** Programme Manager, Portfolio Director, PMO Lead
- **Preconditions:** An existing portfolio (e.g., "Digital Transformation") exists.
- **Steps:**
    1. Navigate to the "Programmes" section via the sidebar.
    2. Click the "Create New Programme" button.
    3. Enter "Customer Experience Uplift" in the "Name" field.
    4. Enter "CXP-2024" in the "Code" field.
    5. Enter a description.
    6. Select "Digital Transformation" as the Parent Portfolio.
    7. Select an SRO and PM from dropdowns.
    8. Set initial RAG to "Green" and Status to "Active".
    9. Click "Save".
- **Expected Result:** The new programme appears in the programme list, linked to "Digital Transformation" portfolio. The portfolio detail page now shows the new programme.
- **Demo Value:** Illustrates how strategic portfolios are broken down into manageable programmes, adhering to P3-Hierarchy as Navigation.

### UC-302: Edit Existing Programme Details
- **Persona:** Programme Manager, PMO Lead
- **Preconditions:** An existing programme (e.g., "Customer Experience Uplift") is available.
- **Steps:**
    1. Navigate to the "Programmes" section.
    2. Click on "Customer Experience Uplift" to view its detail page.
    3. Click the "Edit" button.
    4. Change the "Name" to "Customer Journey & Experience Uplift".
    5. Change the "RAG Status" from "Green" to "Red".
    6. Update the "SRO" to a different user.
    7. Click "Save".
- **Expected Result:** The programme detail page and list view reflect the updated name, RAG, and SRO. The audit trail records the changes. The parent portfolio RAG status should automatically reflect the programme's new Red status (if configured for roll-up).
- **Demo Value:** Shows dynamic programme governance and real-time status updates, activating P4-Exception First principles.

### UC-303: View Programme Detail Page
- **Persona:** Portfolio Steering Board Chair, Portfolio Director, Programme Sponsor (SRO), Programme Manager
- **Preconditions:** An existing programme exists.
- **Steps:**
    1. Navigate to the "Programmes" section.
    2. Click on an existing programme (e.g., "Customer Journey & Experience Uplift").
- **Expected Result:** The programme detail page displays: name, code, description, SRO, PM, current RAG status, overall status, its parent portfolio link, and a list of linked projects with their RAG statuses.
- **Demo Value:** Provides a clear, detailed view of programme health and progress, supporting both strategic oversight and operational management.

### UC-304: Link Projects to Programme
- **Persona:** Programme Manager, PMO Lead
- **Preconditions:** An existing programme and several existing projects that are not yet linked to a programme.
- **Steps:**
    1. Navigate to the detail page of a programme (e.g., "Customer Journey & Experience Uplift").
    2. Locate the "Projects" section (or tab).
    3. Click "Add Project" (or similar action).
    4. Select multiple unassigned projects from the available list.
    5. Click "Link".
- **Expected Result:** The selected projects are now listed under the programme. Their detail pages should show the programme link.
- **Demo Value:** Demonstrates how projects are organised under programmes, reinforcing the hierarchical structure (P3-Hierarchy as Navigation).

---

## 4. Project Management

### UC-401: Create New Project (Linked to Programme)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing programme (e.g., "Customer Journey & Experience Uplift") exists.
- **Steps:**
    1. Navigate to the "Projects" section via the sidebar.
    2. Click the "Create New Project" button.
    3. Enter "Online Portal Redesign" in the "Name" field.
    4. Enter "OPR-UX" in the "Code" field.
    5. Enter a description.
    6. Select "Customer Journey & Experience Uplift" as the Parent Programme.
    7. Select a Project Manager.
    8. Set initial RAG to "Green" and Status to "Active".
    9. Click "Save".
- **Expected Result:** The new project appears in the project list, linked to "Customer Journey & Experience Uplift" programme. The programme detail page now shows the new project.
- **Demo Value:** Shows how delivery work is structured under programmes, maintaining full traceability (P1-Traceable) and hierarchy (P3-Hierarchy as Navigation).

### UC-402: Edit Existing Project Details
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing project (e.g., "Online Portal Redesign") is available.
- **Steps:**
    1. Navigate to the "Projects" section.
    2. Click on "Online Portal Redesign" to view its detail page.
    3. Click the "Edit" button.
    4. Change the "Name" to "New Online Banking Portal".
    5. Change the "RAG Status" from "Green" to "Amber".
    6. Update the "Project Manager" to a different user.
    7. Click "Save".
- **Expected Result:** The project detail page and list view reflect the updated name, RAG, and Project Manager. Audit trail records changes. Parent programme RAG should roll up if configured.
- **Demo Value:** Demonstrates operational agility and real-time status management, highlighting exceptions (P4-Exception First).

### UC-403: View Project Detail Page (Tabs)
- **Persona:** All (especially Project Manager, Programme Manager, PMO Lead)
- **Preconditions:** An existing project with some RAID items, actions, decisions, and meetings associated.
- **Steps:**
    1. Navigate to the "Projects" section.
    2. Click on an existing project (e.g., "New Online Banking Portal").
    3. Verify the "Overview" tab content (summary, RAG, dates).
    4. Click the "RAID" tab and verify associated risks, assumptions, issues, and dependencies.
    5. Click the "Actions" tab and verify associated actions.
    6. Click the "Decisions" tab and verify associated decisions.
    7. Click the "Meetings" tab and verify associated meetings.
- **Expected Result:** Each tab correctly displays the relevant, linked information for the project. The active tab state is clearly indicated.
- **Demo Value:** Provides a comprehensive, single-pane-of-glass view for project managers, showing P1-Traceable data.

### UC-404: Project Grid View
- **Persona:** PMO Lead, Programme Manager
- **Preconditions:** Multiple projects exist across various programmes.
- **Steps:**
    1. Navigate to the "Projects" section.
    2. Observe the default grid/list view.
    3. Verify that key information (Name, Code, RAG, Programme, PM) is visible.
    4. Use sorting and basic filtering options (e.g., by Programme).
- **Expected Result:** The grid view displays projects efficiently, allowing for quick scanning and basic management. Sorting and filtering work as expected.
- **Demo Value:** Enables PMO Leads to quickly assess the landscape of active projects, supporting consolidation and reporting.

---

## 5. P3O Dashboard

### UC-501: View Portfolio/Programme/Project Health Cards
- **Persona:** Portfolio Steering Board Chair, Portfolio Director, Programme Sponsor (SRO), PMO Lead
- **Preconditions:** Multiple portfolios, programmes, and projects with varying RAG statuses exist.
- **Steps:**
    1. Log in and navigate to the "Dashboard".
    2. Observe the "Portfolio Health" card.
    3. Observe the "Programme Health" card.
    4. Observe the "Project Health" card.
    5. Verify that each card displays RAG breakdowns (e.g., "X Green, Y Amber, Z Red").
- **Expected Result:** Health cards accurately reflect the count of items in each RAG status across the respective hierarchies.
- **Demo Value:** Provides immediate, high-level strategic overview ("earned assurance") to Board Chairs and Directors, exemplifying P4-Exception First.

### UC-502: Navigate Hierarchy Tree
- **Persona:** Portfolio Steering Board Chair, Portfolio Director, PMO Lead
- **Preconditions:** A full hierarchy of Portfolio → Programme → Project exists.
- **Steps:**
    1. On the "Dashboard", locate the hierarchy tree widget.
    2. Expand a portfolio node.
    3. Expand a programme node within that portfolio.
    4. Verify that projects linked to the programme are visible.
    5. Click on a Portfolio, Programme, or Project name within the tree.
- **Expected Result:** The hierarchy tree visually represents the P3O structure with RAG badges next to each item. Clicking an item navigates to its respective detail page.
- **Demo Value:** Showcases intuitive navigation and context ("earned assurance"), adhering strictly to P3-Hierarchy as Navigation.

### UC-503: "Needs Attention" Exception Table
- **Persona:** PMO Lead, Programme Manager, Project Manager
- **Preconditions:** Several RAID items or actions are in "Amber" or "Red" status, or are overdue.
- **Steps:**
    1. On the "Dashboard", locate the "Needs Attention" table.
    2. Verify that only items requiring attention (e.g., Red/Amber RAID, overdue Actions) are listed.
    3. Check that key details (item type, RAG/status, owner, linked project/programme) are displayed.
    4. Click on an item in the table.
- **Expected Result:** The table filters for exceptions only (P4-Exception First). Clicking an item navigates to its detail page.
- **Demo Value:** Demonstrates how Helm automates the identification of critical issues, allowing PMO Leads to focus on triage and escalation ("commanding clarity"). Emphasizes the "single most critical decision moment: the escalation judgment (3-5 second triage)".

### UC-504: Empty State Guidance
- **Persona:** All (especially new users like PMO Lead setting up from scratch)
- **Preconditions:** No portfolios, programmes, or projects have been created yet.
- **Steps:**
    1. Log in to a newly created workspace with no data.
    2. Navigate to the "Dashboard".
- **Expected Result:** The dashboard displays clear, actionable guidance (e.g., "Start by creating your first Portfolio" with a prominent button) instead of empty widgets.
- **Demo Value:** Guides new users through initial setup, reducing friction and demonstrating user-centric design.

---

## 6. RAID Log

### UC-601: Create New RAID Item (Risk, Assumption, Issue, Dependency)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing project to link the RAID item to.
- **Steps:**
    1. Navigate to the "RAID Log" section via the sidebar.
    2. Click "Create New RAID Item".
    3. Select "Risk" as the type.
    4. Enter "Third-party vendor delay" as the "Title".
    5. Enter a detailed description.
    6. Select a linked Project.
    7. Select an owner/assignee.
    8. Set initial RAG to "Amber".
    9. Click "Save".
    10. Repeat for "Assumption", "Issue", and "Dependency" types with appropriate details.
- **Expected Result:** The new RAID item appears in the RAID log list. The linked project's RAID tab also displays it.
- **Demo Value:** Shows comprehensive risk management and full traceability (P1-Traceable) down to the project level.

### UC-602: RAG Quick-Update (Click Badge to Cycle)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing RAID item with a RAG status.
- **Steps:**
    1. Navigate to the "RAID Log" list.
    2. Locate a RAID item.
    3. Click on its RAG badge (e.g., "Green").
    4. Observe the badge change to "Amber", then "Red", then "Green" again on subsequent clicks.
- **Expected Result:** The RAG status updates instantly and cycles through the defined statuses (Green, Amber, Red). This change is saved automatically.
- **Demo Value:** Highlights P2-One-Click Escalation design principle (3-5 seconds to raise something), streamlining issue management.

### UC-603: Escalate RAID Item
- **Persona:** Project Manager, Programme Manager, PMO Lead
- **Preconditions:** An existing RAID item, preferably "Amber" or "Red".
- **Steps:**
    1. Navigate to the "RAID Log" list or detail page.
    2. Select an item (e.g., "Third-party vendor delay" with Amber RAG).
    3. Click the "Escalate" button/option.
    4. Select the target (e.g., Programme Manager, Programme Sponsor, or specific programme/portfolio).
    5. Add a brief escalation note.
    6. Click "Confirm Escalation".
- **Expected Result:** The item is flagged as escalated, and a notification is sent to the target. The audit trail records the escalation event.
- **Demo Value:** Emphasizes P2-One-Click Escalation and the ability to rapidly raise critical concerns, crucial for "the single most critical decision moment: the escalation judgment (3-5 second triage)".

### UC-604: Filter RAID Log by RAG Status
- **Persona:** PMO Lead, Programme Manager
- **Preconditions:** Multiple RAID items with varying RAG statuses.
- **Steps:**
    1. Navigate to the "RAID Log" section.
    2. Locate the RAG status filter options (e.g., checkboxes or dropdown for Green, Amber, Red).
    3. Select "Red".
    4. Select "Amber".
    5. Deselect all, then select "Green".
- **Expected Result:** The list updates dynamically to show only RAID items matching the selected RAG status.
- **Demo Value:** Demonstrates efficient triage and reporting, enabling PMO Leads to quickly focus on critical exceptions (P4-Exception First).

### UC-605: Export RAID Log to CSV
- **Persona:** PMO Lead, Programme Manager
- **Preconditions:** Multiple RAID items exist.
- **Steps:**
    1. Navigate to the "RAID Log" section.
    2. Click the "Export to CSV" button.
- **Expected Result:** A CSV file containing all RAID log data (or currently filtered data) is downloaded to the user's device.
- **Demo Value:** Supports offline analysis and reporting, enabling integration with other tools if needed, and reinforces "report once, flows everywhere."

---

## 7. Actions

### UC-701: Create New Action (with Project, Due Date, Assignee)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing project and team members available for assignment.
- **Steps:**
    1. Navigate to the "Actions" section via the sidebar.
    2. Click "Create New Action".
    3. Enter "Review security architecture" as the "Title".
    4. Enter a description.
    5. Select a linked Project.
    6. Set a "Due Date" in the future.
    7. Select an "Assignee" from the team members.
    8. Set initial status to "Open".
    9. Click "Save".
- **Expected Result:** The new action appears in the Actions list. The linked project's Actions tab also displays it.
- **Demo Value:** Shows clear task assignment and accountability, ensuring work from governance meetings is tracked.

### UC-702: Overdue Highlighting (Red)
- **Persona:** Project Manager, Programme Manager, PMO Lead
- **Preconditions:** An existing action with a "Due Date" in the past and status "Open".
- **Steps:**
    1. Create an action with an "Open" status and a due date set to yesterday.
    2. Navigate to the "Actions" list.
- **Expected Result:** The overdue action is visually highlighted (e.g., in red text or with a red badge) to draw immediate attention.
- **Demo Value:** Reinforces P4-Exception First principle, ensuring overdue items are impossible to miss, aiding in proactive management. Dashboard stats should link to this filtered view (Cross-cutting).

### UC-703: Filter Actions by Status/Overdue
- **Persona:** PMO Lead, Project Manager
- **Preconditions:** Multiple actions with varying statuses (Open, In Progress, Complete) and some overdue.
- **Steps:**
    1. Navigate to the "Actions" section.
    2. Locate filter options for status (e.g., "Open", "Complete") and "Overdue".
    3. Select "Open".
    4. Select "Overdue".
    5. Select "Complete".
- **Expected Result:** The list updates dynamically to show only actions matching the selected filters.
- **Demo Value:** Enables managers to quickly review workload, prioritize, and follow up on critical items, supporting "commanding clarity".

### UC-704: Export Actions to CSV
- **Persona:** PMO Lead, Project Manager
- **Preconditions:** Multiple actions exist.
- **Steps:**
    1. Navigate to the "Actions" section.
    2. Click the "Export to CSV" button.
- **Expected Result:** A CSV file containing all action data (or currently filtered data) is downloaded.
- **Demo Value:** Facilitates external reporting and deeper analysis, supporting the "report once, flows everywhere" philosophy.

---

## 8. Meetings

### UC-801: Create New Meeting
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** None.
- **Steps:**
    1. Navigate to the "Meetings" section via the sidebar.
    2. Click "Schedule New Meeting".
    3. Enter "Weekly Project Sync" as the "Title".
    4. Select a date and time.
    5. Select attendees.
    6. Link to a Project/Programme.
    7. Click "Save".
- **Expected Result:** The new meeting appears in the Meetings list.
- **Demo Value:** Provides a central repository for all project and programme meetings.

### UC-802: View Meeting List
- **Persona:** All (especially managers)
- **Preconditions:** Multiple meetings exist.
- **Steps:**
    1. Navigate to the "Meetings" section.
    2. Observe the list of meetings.
    3. Verify meeting title links are clickable.
- **Expected Result:** A clear list of meetings is displayed with key details (Title, Date, Linked Project/Programme). Meeting titles are hyperlinks to detail pages.
- **Demo Value:** Gives an overview of all governance meetings, enhancing transparency and accessibility.

### UC-803: Meeting Detail Page with Inline Notes Editor
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** An existing meeting.
- **Steps:**
    1. Navigate to a meeting's detail page.
    2. Locate the inline notes editor.
    3. Enter meeting minutes/notes into the editor.
    4. Verify auto-save functionality (if present) or explicitly click "Save Notes".
- **Expected Result:** Meeting notes are saved and persist on the meeting detail page.
- **Demo Value:** Streamlines minute-taking and ensures all meeting context is captured directly within Helm.

### UC-804: Extract Action from Meeting Notes (Manual)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** A meeting with notes containing an action item (e.g., "John to investigate API integration by next Tuesday").
- **Steps:**
    1. On the meeting detail page, highlight the text representing an action.
    2. Right-click or use a context menu/button "Extract Action".
    3. Review the pre-populated "Create Action" form with extracted title, assignee, and due date.
    4. Adjust details if necessary and click "Create Action".
- **Expected Result:** A new action is created and linked to the meeting, with extracted details. It appears in the project's Actions tab and the main Actions list. The original meeting notes indicate the action has been extracted.
- **Demo Value:** Demonstrates the direct linkage between discussion and accountable tasks (P1-Traceable), preventing actions from being lost.

### UC-805: Extract Decision from Meeting Notes (Manual)
- **Persona:** Project Manager, Programme Manager
- **Preconditions:** A meeting with notes containing a decision (e.g., "Decision: We will proceed with option B for the new database.").
- **Steps:**
    1. On the meeting detail page, highlight the text representing a decision.
    2. Right-click or use a context menu/button "Extract Decision".
    3. Review the pre-populated "Create Decision" form with extracted title and relevant details.
    4. Adjust details if necessary and click "Create Decision".
- **Expected Result:** A new decision is created and linked to the meeting, with extracted details. It appears in the project's Decisions tab and the main Decisions list. The original meeting notes indicate the decision has been extracted.
- **Demo Value:** Ensures key strategic and operational decisions are formally captured and traceable back to their origin (P1-Traceable).

---

## 9. Decisions

### UC-901: Create New Decision (with Project, Made By, Decision Date)
- **Persona:** Project Manager, Programme Manager, PMO Lead
- **Preconditions:** An existing project and team members.
- **Steps:**
    1. Navigate to the "Decisions" section via the sidebar.
    2. Click "Record New Decision".
    3. Enter "Migrate to Cloud Provider X" as the "Title".
    4. Enter a detailed rationale/description.
    5. Select a linked Project.
    6. Select "Made By" from the team members.
    7. Set a "Decision Date".
    8. Click "Save".
- **Expected Result:** The new decision appears in the Decisions list. The linked project's Decisions tab also displays it.
- **Demo Value:** Provides a structured way to record and track critical choices, fostering P1-Traceable governance.

### UC-902: View Decision List
- **Persona:** All
- **Preconditions:** Multiple decisions exist.
- **Steps:**
    1. Navigate to the "Decisions" section.
    2. Observe the list of decisions.
    3. Verify that key details (Title, Project, Made By, Date) are visible.
- **Expected Result:** A clear list of decisions is displayed, providing a historical log of key choices.
- **Demo Value:** Enables quick review of past decisions, supporting audit and strategic alignment.

### UC-903: Export Decisions to CSV
- **Persona:** PMO Lead, Portfolio Director
- **Preconditions:** Multiple decisions exist.
- **Steps:**
    1. Navigate to the "Decisions" section.
    2. Click the "Export to CSV" button.
- **Expected Result:** A CSV file containing all decision data is downloaded.
- **Demo Value:** Facilitates external reporting and integration, supporting the "report once, flows everywhere" principle.

---

## 10. RACI Matrix

### UC-1001: Click Cells to Cycle R→A→C→I→Empty
- **Persona:** Project Manager, Programme Manager, PMO Lead
- **Preconditions:** A project with defined entities (roles/individuals) and tasks/deliverables.
- **Steps:**
    1. Navigate to the "RACI Matrix" section.
    2. Select a project using the project filter.
    3. Locate a cell at the intersection of an entity and a task.
    4. Click the cell repeatedly.
- **Expected Result:** The cell badge cycles through 'R' (Responsible), 'A' (Accountable), 'C' (Consulted), 'I' (Informed), and then back to empty. The badge colour changes accordingly. The state is saved automatically.
- **Demo Value:** Visualizes accountability and communication channels, making role clarity intuitive and demonstrating effective governance.

### UC-1002: Add Entities (Roles/Individuals)
- **Persona:** Project Manager, Programme Manager, PMO Lead
- **Preconditions:** A project RACI matrix is open.
- **Steps:**
    1. On the "RACI Matrix" page, locate the "Add Entity" button/field.
    2. Enter the name of a new role or individual (e.g., "Business Analyst").
    3. Click "Add".
- **Expected Result:** The new entity appears as a row/column in the RACI matrix.
- **Demo Value:** Shows flexibility in defining project roles and responsibilities.

### UC-1003: Project Filter for RACI Matrix
- **Persona:** PMO Lead, Programme Manager
- **Preconditions:** RACI matrices have been created for multiple projects.
- **Steps:**
    1. Navigate to the "RACI Matrix" section.
    2. Locate the "Project Filter" dropdown.
    3. Select a specific project from the dropdown.
    4. Select another project.
- **Expected Result:** The RACI matrix updates to display only the RACI assignments for the selected project.
- **Demo Value:** Allows for focused review of accountability per project, vital for multi-project environments.

---

## 11. AI Meeting Extraction (Helmbot) - KEY DIFFERENTIATOR

### UC-1101: Paste Meeting Notes for AI Extraction
- **Persona:** Programme Manager, Project Manager
- **Preconditions:** An existing meeting with an empty notes field. Helmbot AI is enabled.
- **Steps:**
    1. Navigate to a meeting's detail page.
    2. Click on the "AI Extract" button (or similar prompt for Helmbot).
    3. Paste realistic meeting notes/transcript text containing actions and decisions into the provided input area.
    4. Click "Extract".
- **Expected Result:** Helmbot processes the text. A review interface appears, displaying proposed "Actions" and "Decisions" with extracted titles, assignees, and dates, ready for user review.
- **Demo Value:** This is the **KEY DIFFERENTIATOR**. Shows Helmbot's power to instantly convert unstructured meeting data into structured governance items (P1-Traceable), saving immense manual effort. Emphasize "NO other PPM vendor has meeting-to-governance-action traceability."

### UC-1102: Review and Approve/Reject Individual Extracted Items
- **Persona:** Programme Manager, Project Manager
- **Preconditions:** Helmbot has just extracted actions/decisions and the review interface is active.
- **Steps:**
    1. In the review interface, examine a proposed action.
    2. Click "Approve" for a valid action.
    3. Examine a proposed decision.
    4. Click "Reject" for an irrelevant decision.
    5. Edit details (e.g., assignee, due date) for an item before approving.
- **Expected Result:** Approved items are created as real Actions/Decisions linked to the meeting and project. Rejected items are discarded. Edited details are respected.
- **Demo Value:** Demonstrates user control and trust in the AI, ensuring only relevant and accurate governance items are created. Highlights the "review" step as crucial for earned assurance.

### UC-1103: Approved Items Create Real Actions/Decisions
- **Persona:** Programme Manager, Project Manager, PMO Lead
- **Preconditions:** UC-1102 has been completed with approved actions/decisions.
- **Steps:**
    1. After completing the Helmbot extraction and approval process.
    2. Navigate to the main "Actions" list.
    3. Navigate to the main "Decisions" list.
    4. Navigate to the linked project's "Actions" and "Decisions" tabs.
- **Expected Result:** The approved actions and decisions are present in the respective lists, correctly linked to the meeting and project. They have the extracted/edited details.
- **Demo Value:** Provides concrete proof of the AI's utility and the seamless integration into core governance workflows, reinforcing P1-Traceable.

---

## 12. Audit Trail

### UC-1201: View Full Audit Log Page
- **Persona:** PMO Lead, Portfolio Director, Programme Sponsor (SRO)
- **Preconditions:** Various actions (create, edit, delete of portfolios, programmes, projects, RAID, etc.) have occurred.
- **Steps:**
    1. Navigate to the "Audit Trail" section via the sidebar.
    2. Observe the chronological list of events.
    3. Verify that key details (who, what, when, on which item) are visible for each entry.
- **Expected Result:** A comprehensive, immutable record of all significant system activities is displayed.
- **Demo Value:** Provides complete transparency and accountability ("earned assurance"), crucial for compliance and governance, directly addressing P1-Traceable.

### UC-1202: Filter Audit Log
- **Persona:** PMO Lead
- **Preconditions:** A detailed audit log exists.
- **Steps:**
    1. On the "Audit Trail" page, locate filter options (e.g., by user, by item type, by date range, by action type like "Created", "Updated", "Deleted").
    2. Apply a filter (e.g., "Show all changes made by John Smith to Projects").
- **Expected Result:** The audit log updates to show only entries matching the applied filters.
- **Demo Value:** Enables quick investigation of specific changes or user activities, vital for governance and troubleshooting.

### UC-1203: Export Audit Log to CSV
- **Persona:** PMO Lead
- **Preconditions:** A detailed audit log exists.
- **Steps:**
    1. On the "Audit Trail" page, click the "Export to CSV" button.
- **Expected Result:** A CSV file containing the audit log data (or currently filtered data) is downloaded.
- **Demo Value:** Supports external compliance reporting and deep-dive analysis.

---

## 13. Integrations/Webhooks

### UC-1301: Create Webhook Subscription
- **Persona:** PMO Lead, IT Admin
- **Preconditions:** User has permissions to manage integrations.
- **Steps:**
    1. Navigate to "Settings" -> "Integrations" (or "Webhooks").
    2. Click "Create New Webhook".
    3. Enter a target "URL" (e.g., a webhook.site URL).
    4. Select desired "Events" to trigger the webhook (e.g., "Project Created", "RAID Updated").
    5. Optionally, generate/enter a "Secret" for signature verification.
    6. Click "Save".
- **Expected Result:** The new webhook subscription is listed. When selected events occur, a POST request is sent to the configured URL with the relevant payload, signed by the secret.
- **Demo Value:** Highlights Helm's extensibility and ability to integrate with other systems, critical for modern enterprise architectures.

### UC-1302: View Webhook Event Log
- **Persona:** PMO Lead, IT Admin
- **Preconditions:** Webhooks have been configured and events have occurred.
- **Steps:**
    1. Navigate to "Settings" -> "Integrations" (or "Webhooks").
    2. Select a configured webhook.
    3. Observe the "Event Log" for that webhook.
- **Expected Result:** The log displays recent webhook delivery attempts, including status (success/failure), timestamp, and payload (or a summary).
- **Demo Value:** Provides visibility into integration health, aiding in troubleshooting and ensuring data flow.

### UC-1303: API Key Management
- **Persona:** PMO Lead, IT Admin
- **Preconditions:** User has permissions to manage API keys.
- **Steps:**
    1. Navigate to "Settings" -> "API Keys".
    2. Click "Generate New API Key".
    3. Provide a name/description for the key.
    4. Click "Generate".
    5. Copy the generated key.
    6. Attempt to revoke an existing key.
- **Expected Result:** A new API key is generated and displayed once (user must copy it). Existing keys can be revoked, making them invalid.
- **Demo Value:** Shows secure programmatic access to Helm data, enabling custom integrations and data extraction.

---

## 14. Settings

### UC-1401: Update Workspace Name
- **Persona:** PMO Lead
- **Preconditions:** User is a workspace administrator.
- **Steps:**
    1. Navigate to "Settings" -> "General".
    2. Locate the "Workspace Name" field.
    3. Change the name (e.g., from "Default Workspace" to "Isle of Man Government PMO").
    4. Click "Save Changes".
- **Expected Result:** The workspace name is updated across the application (e.g., in the sidebar, dashboard headers).
- **Demo Value:** Customization for brand and context, making the platform feel tailored.

### UC-1402: Invite New Members
- **Persona:** PMO Lead
- **Preconditions:** User is a workspace administrator.
- **Steps:**
    1. Navigate to "Settings" -> "Members".
    2. Click "Invite Member".
    3. Enter a valid email address.
    4. Select a role for the new member (e.g., "Project Manager").
    5. Click "Send Invite".
- **Expected Result:** An invitation email is sent to the specified address. The new member appears as "Pending" until they accept.
- **Demo Value:** Demonstrates easy team collaboration and secure access management.

### UC-1403: Role Management
- **Persona:** PMO Lead
- **Preconditions:** Multiple members with different roles.
- **Steps:**
    1. Navigate to "Settings" -> "Members".
    2. Locate an existing member.
    3. Click the "Edit Role" option next to their name.
    4. Change their role (e.g., from "Project Manager" to "Programme Manager").
    5. Click "Save".
- **Expected Result:** The member's role is updated, and their permissions reflect the new role.
- **Demo Value:** Shows granular control over user permissions, essential for maintaining governance and data security.

---

## 15. Cross-cutting Features

### UC-1501: Sidebar Navigation with Active State
- **Persona:** All
- **Preconditions:** User is logged in.
- **Steps:**
    1. Click on "Dashboard" in the sidebar.
    2. Click on "Portfolios".
    3. Click on "RAID Log".
- **Expected Result:** The currently active navigation item in the sidebar is clearly highlighted (e.g., with a different background color or an indicator bar).
- **Demo Value:** Enhances user experience with clear visual feedback, making navigation intuitive.

### UC-1502: Mobile Responsive Sidebar (Sheet)
- **Persona:** All (especially those on the go)
- **Preconditions:** Access to Helm on a mobile device or a resized browser window.
- **Steps:**
    1. Open Helm on a small screen or resize the browser window to mobile width.
    2. Locate the hamburger/menu icon.
    3. Tap/click the icon.
    4. Navigate through some pages.
    5. Close the sidebar.
- **Expected Result:** The sidebar collapses into a mobile-friendly "sheet" that slides in/out, allowing full access to navigation items.
- **Demo Value:** Showcases accessibility and flexibility for users who need to manage governance on various devices.

### UC-1503: Real User Profile in Sidebar (Avatar, Initials, Name)
- **Persona:** All
- **Preconditions:** User is logged in via Supabase Auth.
- **Steps:**
    1. Observe the top of the sidebar.
- **Expected Result:** The user's profile picture (if uploaded), or initials (if no picture), and full name (derived from Supabase authentication) are prominently displayed.
- **Demo Value:** Personalizes the experience and reinforces identity, providing a professional feel.

### UC-1504: router.refresh() on Mutations
- **Persona:** All (observational)
- **Preconditions:** Any mutation (create, update, delete) on a data entity (e.g., creating a project).
- **Steps:**
    1. Create a new Project (UC-401).
    2. After clicking "Save" and observing the success message.
- **Expected Result:** The UI automatically updates to reflect the new data without a full page reload, demonstrating a smooth, reactive user experience.
- **Demo Value:** Highlights modern web application responsiveness and efficiency, improving user flow.

### UC-1505: Dashboard Stats Link to Filtered Views
- **Persona:** PMO Lead, Programme Manager
- **Preconditions:** The Dashboard "Needs Attention" table or other health cards display clickable statistics (e.g., "3 Overdue Actions").
- **Steps:**
    1. On the "Dashboard", locate the "Actions" health card or "Needs Attention" table.
    2. Click on a specific statistic, such as "X Overdue Actions".
- **Expected Result:** The user is navigated directly to the "Actions" page, with the list pre-filtered to show only the "Overdue Actions".
- **Demo Value:** Provides a quick, efficient workflow for triaging exceptions from a high-level overview to granular detail, embodying P4-Exception First and P2-One-Click Escalation.
