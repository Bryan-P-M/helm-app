## QA Report: v1-database-schema.md

### PASS Items

*   **Scope Compliance**: All v1 MVP features (Auth+Users, Workspace+Projects, RAID Log, Actions Tracker, Dashboard (project-level), Meeting Hub (manual), Decisions Log (manual)) are adequately represented in the schema with appropriate tables, relationships, and supporting structures (e.g., indexes for dashboard views).
*   **Internal Consistency (General)**:
    *   Foreign key relationships are correctly defined and align with the Relationship Summary.
    *   `ON DELETE` actions are appropriate (e.g., `CASCADE` for strong ownership, `SET NULL` for optional owners/creators).
    *   `created_at`, `updated_at`, `deleted_at` columns are consistently applied where specified.
    *   UUID v4 is consistently used for primary keys.
    *   `moddatetime` triggers are correctly defined and attached to tables with `updated_at`.
    *   Indexes are well-defined and target common query patterns and filtering requirements.
    *   TypeScript types generally align well with the SQL DDL, including enum-like union types and nullability.
*   **Persona Coverage**:
    *   The schema supports all 6 personas by providing the necessary data structures and relationships for their respective responsibilities (e.g., `raid_items`, `actions`, `meetings`, `decisions` for Project/Programme Managers; `projects` with RAG/status for Portfolio/Programme leadership; `audit_log` for PMO Lead).
    *   RLS policies enforce workspace-level isolation, which is a foundational requirement for secure multi-persona access.
    *   Specific indexes like `idx_actions_my_overdue` and `idx_raid_exceptions` directly support dashboard and personal views for various personas.
*   **Completeness**:
    *   The document is comprehensive, covering DDL, RLS, Audit Trail, Seed Data, Migration Notes, and TypeScript types.
    *   Known placeholders (e.g., seed data UUIDs) are explicitly noted.
    *   V2 preparation comments are clear and distinguish future features from v1 implementation.

### FAIL Items

1.  **Scope Containment - v2 Feature Leak (Multi-tenancy interpretation)**
    *   **Reference**: "v2 features that must NOT appear: ... Multi-tenancy" (QA Criteria) vs. "v1 is single-tenant but the schema is multi-tenancy ready (NFR: "Design with organisation_id from day one")" (Section 2.2 Workspaces comment) and `workspace_id` on almost all business entities.
    *   **Issue**: The QA criteria explicitly lists "Multi-tenancy" as a v2 feature that must NOT appear. However, the schema is explicitly designed to be "multi-tenancy ready" from v1, with a `workspaces` table and `workspace_id` foreign keys on all core business entities. This is a direct contradiction. While "designing with `organisation_id` from day one" is a valid NFR, the strict interpretation of the QA criteria means the *presence* of multi-tenancy *readiness* (which is a form of multi-tenancy) is a leak. If the intent was "advanced multi-tenancy features", the criteria should be more specific. As written, this is a FAIL.
    *   **Recommended Fix**:
        *   **Option A (Strict Compliance)**: Remove `workspaces` table and `workspace_id` from all tables. This would be a significant re-architecture and likely violate the "design with organisation_id from day one" NFR.
        *   **Option B (Clarify Criteria)**: Rephrase the QA criteria for v2 features to "Advanced Multi-tenancy features (e.g., cross-workspace user management, billing, complex cross-workspace dependencies)" to allow for foundational multi-tenancy *readiness* in v1. Given the NFR, this is the more pragmatic approach. Assuming Option B is the intended interpretation, this would become a WARN for ambiguity in the criteria, not a FAIL in the artefact.
        *   **Current Verdict (based on strict criteria)**: FAIL.

2.  **Scope Containment - v2 Feature Leak (RAID `source_level` constraint)**
    *   **Reference**: Section 2.5 RAID Items DDL, `CONSTRAINT chk_raid_source_level CHECK (source_level IN ('project', 'programme', 'portfolio'))`.
    *   **Issue**: The `source_level` constraint explicitly includes `'programme'` and `'portfolio'`. These are v2 concepts ("Programme-level view", "Portfolio Dashboard" are v2 features that must NOT appear). While the `raid_items` table comment mentions "Can be raised at any level", the v1 MVP scope is project-level only. Allowing these values in the `CHECK` constraint means the database is ready to accept v2 data, which is a leak.
    *   **Recommended Fix**: For v1, the `chk_raid_source_level` constraint should be `CHECK (source_level IN ('project'))`. This can be altered in v2.

3.  **Internal Consistency - Audit Log RLS Policy vs. Comment**
    *   **Reference**: Section 3.7 Audit Log Policies, `CREATE POLICY audit_log_insert ON audit_log FOR INSERT WITH CHECK (is_workspace_member(workspace_id));` and its preceding comment: "Only the system (service role) inserts audit entries. Application code uses supabase.auth.admin or service_role key. No direct user inserts."
    *   **Issue**: The RLS policy `WITH CHECK (is_workspace_member(workspace_id))` implies that any authenticated user who is a workspace member can insert into `audit_log`. This directly contradicts the comment stating that *only the system* (service role) should insert. If the service role is used, RLS is typically bypassed, but if the application layer is inserting *as the user* (which is common for RLS to apply), then this policy allows regular users to insert audit entries, which is a security flaw and inconsistent with the stated intent.
    *   **Recommended Fix**:
        *   If *only* the service role should insert, then the `audit_log_insert` policy should be removed or set to `WITH CHECK (false)` for non-service-role users, or the application should *always* use the service role key for audit inserts.
        *   If the application *does* insert as the user, but only for specific, controlled actions, then the policy needs to be much more restrictive, e.g., `WITH CHECK (false)` for direct inserts, and only allowing inserts via a `SECURITY DEFINER` function that validates the action.
        *   Given the comment, the policy is too permissive. A simple fix for v1 would be to remove the `audit_log_insert` policy entirely, relying on the service role to bypass RLS for inserts.

### WARN Items

1.  **Internal Consistency - ERD vs. DDL (Profiles)**
    *   **Reference**: Section 1 ERD for `profiles` shows `id`, `email`, `full_name`, `avatar_url`. Section 2.1 Profiles DDL adds `job_title`.
    *   **Issue**: The ERD is a visual summary and often omits minor fields, but `job_title` is a functional field. It's a minor discrepancy but worth noting for strict consistency.
    *   **Recommended Fix**: Update the ERD to include `job_title` on the `profiles` table.

2.  **Completeness - Missing `deleted_at` in `workspace_members` and `raid_item_links`**
    *   **Reference**: Section 1 LEGEND: "All tables carry: created_at, updated_at, deleted_at (soft delete)". Section 2.3 Workspace Members DDL and Section 2.6 RAID Item Links DDL.
    *   **Issue**: `workspace_members` and `raid_item_links` tables do not have a `deleted_at` column. While `workspace_members` might be hard-deleted (e.g., when a user leaves a workspace), `raid_item_links` are relationships that might benefit from soft-delete for auditability or temporary disabling. This contradicts the general legend.
    *   **Recommended Fix**:
        *   Either add `deleted_at` to `workspace_members` and `raid_item_links` (and corresponding `updated_at` trigger for `raid_item_links` if added).
        *   Or, update the LEGEND to clarify that `deleted_at` applies to *business entities* or *most* tables, not strictly *all* tables.

3.  **Completeness - Missing `updated_at` trigger for `raid_item_links`**
    *   **Reference**: Section 2.6 RAID Item Links DDL.
    *   **Issue**: The `raid_item_links` table has `created_at` but lacks `updated_at` and a corresponding trigger, despite the legend stating "All tables carry: created_at, updated_at, deleted_at". If links can be updated (e.g., changing `link_type` or `description`), `updated_at` would be useful.
    *   **Recommended Fix**: Add `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` to `raid_item_links` and create a `moddatetime` trigger for it.

4.  **Completeness - Missing `created_by_id` on `workspace_members`**
    *   **Reference**: Section 2.3 Workspace Members DDL.
    *   **Issue**: Most entities track `created_by_id` for provenance (e.g., `projects`, `raid_items`, `actions`, `meetings`, `decisions`). `workspace_members` lacks this, which could be useful for auditing who added a user to a workspace.
    *   **Recommended Fix**: Add `created_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL` to `workspace_members`.

5.  **Completeness - Missing `created_by_id` on `decision_participants`**
    *   **Reference**: Section 2.10 Decision Participants DDL.
    *   **Issue**: Similar to `workspace_members`, `decision_participants` lacks `created_by_id`. This could be useful for auditing who added a participant to a decision.
    *   **Recommended Fix**: Add `created_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL` to `decision_participants`.

6.  **Completeness - Missing `updated_at` trigger for `decision_participants` and `meeting_attendees`**
    *   **Reference**: Section 2.8 Meeting Attendees DDL and Section 2.10 Decision Participants DDL.
    *   **Issue**: These tables have `created_at` but lack `updated_at` and corresponding triggers. If the `role` of an attendee or participant can change, `updated_at` would be beneficial for tracking.
    *   **Recommended Fix**: Add `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` to `meeting_attendees` and `decision_participants` and create `moddatetime` triggers for them.

7.  **Completeness - `audit_log` `workspace_id` FK `ON DELETE CASCADE`**
    *   **Reference**: Section 2.12 Audit Log DDL, `workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE`.
    *   **Issue**: If a workspace is deleted, all its audit logs will be deleted. While this might be desired for data hygiene, audit logs are typically immutable and retained even if the source entity is deleted, for compliance and historical purposes. Deleting them on `CASCADE` might violate long-term audit requirements.
    *   **Recommended Fix**: Change `ON DELETE CASCADE` to `ON DELETE RESTRICT` or `ON DELETE SET NULL` (if `workspace_id` can be null, which it currently cannot be). This would force an explicit decision on audit log retention when a workspace is deleted.

### Overall Verdict: FAIL

The document has several critical issues related to scope containment (v2 features leaking into v1) and internal consistency/security (audit log RLS policy). While generally well-structured and comprehensive, these failures warrant a "FAIL" verdict.

### Confidence Score: 0.9

The review was thorough, covering all sections and criteria. The identified issues are specific and actionable. The main ambiguity is the interpretation of "Multi-tenancy" in the v2 feature list, which significantly impacts the "Scope Containment" assessment. My current assessment is based on a strict interpretation of the provided v2 list.
