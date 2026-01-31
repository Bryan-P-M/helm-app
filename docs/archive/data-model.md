⚠️ **SUPERSEDED** — This early draft has been replaced by `../v1-database-schema.md` (1970 lines, approved spec).
This file is kept for historical reference only. Do not implement against this document.

---


# Data Model Specification

## Purpose

Define the core entity relationships, inheritance logic, and data structures for the Helm project management system.

---

## Core Entities

### Workspace
- TBD: Multi-tenancy approach
- TBD: Workspace isolation boundaries
- TBD: Shared resources model

### Project
- TBD: Project metadata fields
- TBD: Project lifecycle states
- TBD: Relationship to workspace

### Task
- TBD: Task schema (title, description, status, priority, dates)
- TBD: Task hierarchy (parent/child relationships)
- TBD: Task inheritance logic from parent tasks
- TBD: Task assignment model

### Meeting
- TBD: Meeting entity fields
- TBD: Relationship to project/tasks
- TBD: Attendee management
- TBD: Meeting outcomes/action items link

### Action Item
- TBD: Action item extraction from meetings
- TBD: Auto-linking to tasks
- TBD: Status tracking

### User
- TBD: User profile fields
- TBD: User-workspace membership
- TBD: Role assignments
- → See: [auth-spec.md](./auth-spec.md)

---

## Inheritance Logic

### Task Inheritance
- TBD: Which fields inherit from parent tasks?
- TBD: Override vs cascade behavior
- TBD: Inheritance depth limits

### Permission Inheritance
- TBD: Workspace → Project → Task permission cascade
- → See: [auth-spec.md](./auth-spec.md)

---

## Relationships Diagram

```
TBD: Entity relationship diagram
- Workspace 1:N Projects
- Project 1:N Tasks
- Project 1:N Meetings
- Task 1:N Subtasks
- Meeting 1:N Action Items
- Action Item N:1 Task (optional)
- User N:M Workspace (via membership)
```

---

## Database Schema

### Tables
- TBD: Table definitions
- TBD: Indexes
- TBD: Constraints
- TBD: Soft delete strategy

### Migrations
- TBD: Migration strategy
- TBD: Version control approach

---

## Related Documents

- [API Spec](./api-spec.md) - Endpoints that expose this data
- [Auth Spec](./auth-spec.md) - Permission model for data access
- [Project Brief](./helm-project-brief-v2.md) - Overall project context
