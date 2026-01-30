## Design Compliance Review

Here's a review of the `v1-database-schema.md` artefact against the Helm Design Intelligence Specification's 5 principles:

**P1: Traceable, Not Trusted**
*   **Compliant:** Yes
*   **Evidence:**
    *   "All tables carry: created_at, updated_at, deleted_at (soft delete)" - standard metadata.
    *   The `audit_log` table is explicitly designed to capture all state changes.
    *   The `actions` table has `source_type` and source IDs (`source_meeting_id`, `source_raid_item_id`, `source_decision_id`) to link actions back to their origins.
    *   The `raid_items` table includes `created_by_id` and the `source_level` field.
    *   The `audit_log` table captures the `changes` (JSONB) to show what changed.
    *   The audit log includes `performed_by_id` and `performed_at`
*   **Gaps:** None identified.
*   **Recommendation:** None.

**P2: Escalation Paths, Not Dead Ends**
*   **Compliant:** Partial
*   **Evidence:**
    *   The `raid_items` table includes `is_escalated`, `escalated_from_id`, and `escalation_note` fields.
    *   The audit log captures "escalate" actions.
*   **Gaps:**
    *   The document describes the escalation *mechanism* but doesn't explicitly define the *paths* or *resolution routes*.
    *   There is no mention of "one-click escalation" or pre-populated template messages.
    *   No red indicator/resolution route is mentioned.
*   **Recommendation:**
    *   The UI/UX design should be updated to include one-click escalation from the RAID item detail view.
    *   The UI should pre-populate an escalation message.
    *   The UI should clearly show the escalation path (e.g., who to escalate to).
    *   The UI should show resolution routes.

**P3: Hierarchy as Navigation, Not Decoration**
*   **Compliant:** Partial
*   **Evidence:**
    *   The schema is designed with a Portfolio → Programme → Project structure in mind (though v1 only implements Workspace → Project).
    *   The `projects` table includes `workspace_id` for multi-tenancy.
    *   The migration notes explicitly mention adding `programme_id` and `portfolio_id` in v2.
    *   Breadcrumbs are not mentioned, but the schema is designed to support them.
*   **Gaps:**
    *   The document doesn't explicitly state how the hierarchy will be used for navigation.
    *   No mention of preserving context when drilling down or restoring state when drilling up.
    *   No mention of a persistent breadcrumb or a tree navigator.
*   **Recommendation:**
    *   The UI/UX design should be updated to use the workspace/project hierarchy as the primary navigation paradigm.
    *   Implement persistent breadcrumbs.
    *   Implement a tree navigator that is always accessible.
    *   Ensure that drilling down preserves context and drilling up restores state.

**P4: Exceptions First, Completeness on Demand**
*   **Compliant:** Partial
*   **Evidence:**
    *   The `projects` table includes `rag_status` and `status` fields, which can be used to surface anomalies.
    *   The `raid_items` table includes `rag_status` and `status` fields.
    *   The `idx_raid_exceptions` index is designed to optimize queries for red/amber RAID items.
    *   The TypeScript types include the `RagStatus` enum.
*   **Gaps:**
    *   The document doesn't explicitly state that default views will show RED/AMBER only.
    *   The document doesn't explicitly state that "Show all" expands to green.
*   **Recommendation:**
    *   The UI/UX design should be updated to show RED/AMBER items by default in dashboards and lists.
    *   Implement a "Show all" or similar mechanism to expand to green items.

**P5: Governance Rigour Through Workflow, Not Burden**
*   **Compliant:** Yes
*   **Evidence:**
    *   The `audit_log` table automatically captures all state changes.
    *   The schema design incorporates source tracking for actions (meeting, RAID item, decision).
    *   The RLS policies enforce access control.
    *   The audit triggers are automatically attached to all relevant tables.
*   **Gaps:** None identified.
*   **Recommendation:** None.

**Overall Design Compliance Score:** 0.7

**Overall verdict:** PARTIALLY COMPLIANT

**Priority fixes:**
1.  **P2:** Implement one-click escalation with pre-populated messages and clear escalation paths in the UI.
2.  **P3:** Design the UI/UX to use the workspace/project hierarchy as the primary navigation paradigm, including breadcrumbs and a tree navigator.
3.  **P4:** Ensure that default views in the UI show RED/AMBER items only, with a mechanism to expand to green items.

