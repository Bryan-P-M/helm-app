## QA Report for v1-api-contracts.md

### PASS Items

*   **Clear Intent and Status:** The document clearly states its purpose as the "single source of truth" and is marked "APPROVED," which is excellent for guiding implementation.
*   **Comprehensive Base Configuration:** Sections 1.1-1.9 (Base URL, Content Type, Auth Header, Response Envelopes, Error Handling, Pagination, Sorting, Filtering, Common Field Types) are well-defined, consistent, and provide necessary details for API consumers.
*   **Provenance Fields:** The inclusion of `created_by`, `created_at`, `updated_at` on all entities and `source` on RAID/Actions/Decisions is a strong cross-cutting requirement.
*   **Auth Flow and Endpoints:** The Supabase-based authentication flow and the `/auth` endpoints (signup, login, logout, me, patch me) are well-defined and cover essential user management for v1. `GET /auth/me` providing workspace roles is particularly useful.
*   **Workspace Management:** Full CRUD for workspaces and workspace members, including role management and sensible constraints (e.g., cannot assign `owner` role, cannot remove `owner`), is well-covered.
*   **Project Management:** Full CRUD for projects, including filtering and detailed responses with `owner` information and summary `counts` (project-level dashboard data), is robust.
*   **RAID Log (Full CRUD & Advanced Features):** The RAID item endpoints are very comprehensive, covering full CRUD, extensive filtering, auto-generated references, detailed views with linked items/actions, and crucial v1 features like **escalation** (cross-project within workspace) and **linking** (cross-project dependencies). The bulk update endpoint is a good addition for efficiency.
*   **Actions Tracker (Full CRUD & State Management):** Actions endpoints provide full CRUD, detailed views, and a well-designed `transition` endpoint for status changes, ensuring auditability and state machine integrity. The `GET /actions/mine` endpoint is a key user-centric feature for v1.
*   **Meeting Hub (Manual):** Meetings endpoints cover full CRUD, attendee management (with replacement semantics), and linking to actions/decisions. The explicit note about linked items not being deleted on meeting deletion is a good clarification.
*   **Decisions Log (Manual):** Decisions endpoints provide full CRUD and detailed views, consistent with other core entities.
*   **Scope Containment:** The document successfully avoids explicit v2 features like AI extraction, programme/portfolio dashboards (beyond user-specific or project-level counts), hierarchical tasks, or advanced RBAC. Cross-project RAID linking is explicitly defined as a v1 feature.

### FAIL Items

1.  **Missing Core Sections (Scope Compliance & Completeness):**
    *   **Section 11: Dashboard Endpoints:** This section is listed in the Table of Contents but is entirely absent from the document body. "Dashboard (project-level)" is an explicit v1 MVP feature. While `GET /projects/:projectId` provides some counts, a dedicated section for dashboard endpoints (e.g., for specific aggregated metrics or configurable widgets) is expected and missing.
        *   **Recommendation:** Add Section 11 with specific endpoints for project-level dashboard data, or explicitly state that `GET /projects/:projectId` and `GET /actions/mine` fulfill this requirement and remove the TOC entry. Given the MVP feature, a dedicated section is preferred.
    *   **Section 12: Cross-Cutting Concerns:** This section is listed in the Table of Contents but is entirely absent from the document body. While some cross-cutting concerns are covered in Base Configuration, the presence of a dedicated TOC entry implies there might be other intended topics (e.g., auditing, soft-delete strategy, versioning) that are now missing.
        *   **Recommendation:** Either remove this TOC entry if all cross-cutting concerns are covered elsewhere, or populate it with relevant details.
    *   **Section 13: Appendix: Enum Reference:** This section is listed in the Table of Contents but is entirely absent from the document body. Many endpoints refer to `string (enum)` types (e.g., `RAID_TYPE`, `PROJECT_STATUS`, `ROLE`, `LINK_TYPE`, `ACTION_STATUS`). A centralized reference for all enum values is crucial for developers and is a significant omission.
        *   **Recommendation:** Create Section 13 and list all enum types and their allowed values.
    *   **Section 14: Appendix: Endpoint Summary Table:** This section is listed in the Table of Contents but is entirely absent from the document body. A summary table is a valuable quick-reference tool for developers.
        *   **Recommendation:** Create Section 14 with a concise summary table of all endpoints (e.g., Method, Path, Description, Auth).

2.  **Ambiguous Project Assignment for Roles (Internal Consistency & Persona Coverage):**
    *   **Reference:** Section 2.2 Authorisation Model (v1) states: "`member` and `viewer` roles see only projects they are assigned to."
    *   **Gap:** The API contract does not define how a user becomes "assigned" to a project, nor does it provide an API endpoint to manage these assignments. The only explicit project-level role mentioned is `owner_id` on the project itself. If "assigned" only means `owner_id`, then `member` and `viewer` roles are severely limited. If it means involvement (e.g., owning an action, attending a meeting), this needs to be clarified and reflected in authorization logic and potentially filtering options for project lists. This directly impacts how `Programme Manager`, `PMO Lead`, and `Project Manager` personas (who might be `member` or `viewer` in a workspace but need access to specific projects) can interact with the system.
        *   **Recommendation:**
            1.  Clarify the definition of "assigned projects" in Section 2.2.
            2.  If "assignment" is a distinct concept from `owner_id`, define the data model for project assignments (e.g., a `ProjectMember` entity) and provide corresponding CRUD endpoints (e.g., `POST /projects/:projectId/members`, `PATCH /projects/:projectId/members/:userId`).
            3.  Ensure that `GET /workspaces/:workspaceId/projects` and other project-level list endpoints correctly filter based on this "assignment" for `member` and `viewer` roles, potentially adding a `?assigned_to_me=true` filter.

### WARN Items

1.  **HTTP Status Code for Validation Errors (Internal Consistency):**
    *   **Reference:** Section 1.5 Standard Error Response lists `400 VALIDATION_ERROR` for "Request body fails validation" with examples like "Title is required" and "Due date must be in the future."
    *   **Note:** While 400 is acceptable, `422 Unprocessable Entity` is often considered more semantically appropriate for validation errors where the request is syntactically correct but semantically invalid (e.g., business rule violations like "due date in future"). `400 Bad Request` is typically for malformed requests (e.g., invalid JSON). The document *does* list `422 UNPROCESSABLE` but provides `VALIDATION_ERROR` under 400.
    *   **Recommendation:** Consider aligning `VALIDATION_ERROR` with `422 UNPROCESSABLE` for semantic validation issues, reserving `400 BAD_REQUEST` for syntactic issues. This is a minor point but improves RESTful consistency.

### Overall Verdict: FAIL

The document is generally well-structured and detailed, covering most v1 MVP features comprehensively. However, the complete absence of four sections listed in the Table of Contents, including the critical "Dashboard Endpoints" (a v1 MVP feature) and the "Enum Reference" (essential for developer clarity), constitutes a significant failure in both scope compliance and completeness. The ambiguity around "project assignment" for `member` and `viewer` roles also represents a critical missing requirement in the authorization model.

### Confidence Score: 0.8

The document is 80% complete and well-defined where it exists. The identified failures are clear omissions or ambiguities rather than deep structural flaws, making them addressable. The high confidence reflects the quality of the existing content, but the missing sections are too substantial to ignore.
