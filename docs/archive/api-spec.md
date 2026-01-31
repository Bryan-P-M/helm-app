⚠️ **SUPERSEDED** — This early draft has been replaced by `../v1-api-contracts.md` (2568 lines, approved spec).
This file is kept for historical reference only. Do not implement against this document.

---


# API Specification

## Purpose

Define the REST API endpoints for Helm, including authentication, resource management, and AI-powered features.

---

## Base Configuration

- TBD: Base URL structure
- TBD: API versioning strategy (e.g., `/api/v1/`)
- TBD: Response format standards
- TBD: Error handling conventions

---

## Authentication Endpoints

### POST /auth/login
- TBD: Request body
- TBD: Response format
- TBD: Token handling

### POST /auth/logout
- TBD: Token invalidation

### POST /auth/refresh
- TBD: Token refresh flow

→ See: [auth-spec.md](./auth-spec.md)

---

## Workspace Endpoints

### GET /workspaces
- TBD: List user's workspaces

### POST /workspaces
- TBD: Create workspace

### GET /workspaces/:id
- TBD: Get workspace details

### PUT /workspaces/:id
- TBD: Update workspace

### DELETE /workspaces/:id
- TBD: Delete/archive workspace

---

## Project Endpoints

### GET /workspaces/:wid/projects
- TBD: List projects in workspace

### POST /workspaces/:wid/projects
- TBD: Create project

### GET /projects/:id
- TBD: Get project details

### PUT /projects/:id
- TBD: Update project

### DELETE /projects/:id
- TBD: Delete/archive project

---

## Task Endpoints

### GET /projects/:pid/tasks
- TBD: List tasks (with filtering/sorting)

### POST /projects/:pid/tasks
- TBD: Create task

### GET /tasks/:id
- TBD: Get task details

### PUT /tasks/:id
- TBD: Update task

### DELETE /tasks/:id
- TBD: Delete task

### POST /tasks/:id/subtasks
- TBD: Create subtask

---

## Meeting Endpoints

### GET /projects/:pid/meetings
- TBD: List meetings

### POST /projects/:pid/meetings
- TBD: Create meeting

### GET /meetings/:id
- TBD: Get meeting details

### PUT /meetings/:id
- TBD: Update meeting

### POST /meetings/:id/transcript
- TBD: Upload transcript for AI processing
- → See: [poc-meeting-extraction.md](./poc-meeting-extraction.md)

---

## AI Endpoints

### POST /ai/extract-actions
- TBD: Extract action items from text
- TBD: Input format (transcript, notes)
- TBD: Output format (structured actions)

### POST /ai/suggest-tasks
- TBD: AI task suggestions

→ See: [poc-meeting-extraction.md](./poc-meeting-extraction.md)

---

## Pagination & Filtering

- TBD: Pagination strategy (cursor vs offset)
- TBD: Standard filter parameters
- TBD: Sorting conventions

---

## Rate Limiting

- TBD: Rate limit strategy
- TBD: Headers for rate limit info

---

## Related Documents

- [Data Model](./data-model.md) - Underlying data structures
- [Auth Spec](./auth-spec.md) - Authentication & authorization
- [POC Meeting Extraction](./poc-meeting-extraction.md) - AI feature details
