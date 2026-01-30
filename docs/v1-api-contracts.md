# Helm v1 API Contracts

> Comprehensive REST API specification for Helm MVP v1.
> This document is the **single source of truth** for all builder agents.
> Every endpoint is unambiguous. If it's not here, it's not in v1.

**Version:** 1.0
**Last Updated:** 2026-01-30
**Status:** APPROVED — implement exactly as specified

---

## Table of Contents

1. [Base Configuration](#1-base-configuration)
2. [Authentication & Authorisation](#2-authentication--authorisation)
3. [Auth Endpoints](#3-auth-endpoints)
4. [Workspace Endpoints](#4-workspace-endpoints)
5. [Workspace Member Endpoints](#5-workspace-member-endpoints)
6. [Project Endpoints](#6-project-endpoints)
7. [RAID Item Endpoints](#7-raid-item-endpoints)
8. [Action Endpoints](#8-action-endpoints)
9. [Meeting Endpoints](#9-meeting-endpoints)
10. [Decision Endpoints](#10-decision-endpoints)
11. [Dashboard Endpoints](#11-dashboard-endpoints)
12. [Cross-Cutting Concerns](#12-cross-cutting-concerns)
13. [Appendix: Enum Reference](#13-appendix-enum-reference)
14. [Appendix: Endpoint Summary Table](#14-appendix-endpoint-summary-table)

---

## 1. Base Configuration

### 1.1 Base URL

```
/api/v1
```

All endpoints are prefixed with `/api/v1`. In Next.js, these map to Route Handlers under `app/api/v1/`.

**Production URL:** `https://<domain>/api/v1`
**Local Development:** `http://localhost:3000/api/v1`

### 1.2 Content Type

All requests and responses use JSON:

```
Content-Type: application/json
Accept: application/json
```

### 1.3 Authentication Header

All authenticated endpoints require a Bearer token from Supabase Auth:

```
Authorization: Bearer <supabase_jwt_token>
```

Tokens are obtained via the Supabase client SDK (`supabase.auth.signInWithPassword()` etc.) and validated server-side via Supabase's `createRouteHandlerClient`.

### 1.4 Standard Response Envelope

**Success (single resource):**

```json
{
  "data": { ... },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-01-30T14:30:00.000Z"
  }
}
```

**Success (list/collection):**

```json
{
  "data": [ ... ],
  "pagination": {
    "cursor": "eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCJ9",
    "has_more": true,
    "total_count": 150,
    "limit": 25
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-01-30T14:30:00.000Z",
    "last_updated": "2026-01-30T14:28:00.000Z"
  }
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `data` | object \| array | The response payload |
| `pagination` | object | Present only on list endpoints |
| `pagination.cursor` | string \| null | Opaque cursor for next page. `null` if no more pages |
| `pagination.has_more` | boolean | Whether more results exist beyond this page |
| `pagination.total_count` | integer | Total matching items (regardless of pagination) |
| `pagination.limit` | integer | Page size used for this request |
| `meta.request_id` | string (UUID) | Unique identifier for this request (for debugging/support) |
| `meta.timestamp` | string (ISO 8601) | Server time when response was generated |
| `meta.last_updated` | string (ISO 8601) | Most recent `updated_at` in the dataset (list endpoints only) |

### 1.5 Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields failed validation.",
    "status": 400,
    "details": [
      {
        "field": "title",
        "message": "Title is required.",
        "code": "REQUIRED"
      },
      {
        "field": "due_date",
        "message": "Due date must be in the future.",
        "code": "INVALID_VALUE"
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-01-30T14:30:00.000Z"
  }
}
```

**Error fields:**

| Field | Type | Description |
|-------|------|-------------|
| `error.code` | string | Machine-readable error code (see table below) |
| `error.message` | string | Human-readable error description |
| `error.status` | integer | HTTP status code |
| `error.details` | array \| null | Field-level errors (validation failures only) |
| `error.details[].field` | string | Field path that failed (e.g., `"title"`, `"attendees[0].user_id"`) |
| `error.details[].message` | string | Human-readable field error |
| `error.details[].code` | string | Machine-readable field error code |

**Standard Error Codes:**

| HTTP Status | Error Code | When Used |
|-------------|------------|-----------|
| 400 | `VALIDATION_ERROR` | Request body fails validation |
| 400 | `BAD_REQUEST` | Malformed request (invalid JSON, missing required params) |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 401 | `TOKEN_EXPIRED` | JWT has expired |
| 403 | `FORBIDDEN` | Authenticated but lacks permission |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Resource state conflict (e.g., duplicate slug, invalid transition) |
| 409 | `DUPLICATE` | Attempting to create a resource that already exists |
| 422 | `UNPROCESSABLE` | Request understood but semantically invalid |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

**Field Error Codes:**

| Code | Meaning |
|------|---------|
| `REQUIRED` | Field is required but missing/empty |
| `INVALID_VALUE` | Value doesn't satisfy constraints |
| `INVALID_FORMAT` | Wrong format (e.g., not a valid date) |
| `TOO_SHORT` | Below minimum length |
| `TOO_LONG` | Exceeds maximum length |
| `INVALID_ENUM` | Value not in allowed set |
| `INVALID_REFERENCE` | Referenced entity does not exist |

### 1.6 Pagination

All list endpoints use **cursor-based pagination**.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Opaque cursor from previous response |
| `limit` | integer | 25 | Items per page. Range: 1–100 |

**Behaviour:**
- First request: omit `cursor`. Returns first page.
- Subsequent requests: pass `pagination.cursor` from previous response.
- When `has_more` is `false`, there are no more pages.
- Cursors are opaque, base64-encoded, and encode sort position + item ID.
- Cursors are **not stable across sort changes** — changing sort order requires starting from page 1.
- `total_count` is always returned and reflects the count **after filters are applied**.

### 1.7 Sorting

All list endpoints support sorting via query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | string | endpoint-specific | Field to sort by |
| `order` | `asc` \| `desc` | endpoint-specific | Sort direction |

Valid `sort` values are documented per endpoint. Using an invalid sort field returns `400 BAD_REQUEST`.

### 1.8 Filtering

List endpoints support filters via query parameters. Filters use exact match unless otherwise noted. Multiple values for the same field use comma-separated syntax:

```
GET /api/v1/projects/123/raid-items?type=risk,issue&status=open&rag=red,amber
```

Date range filters use `_from` and `_to` suffixes:

```
GET /api/v1/projects/123/actions?due_date_from=2026-01-01&due_date_to=2026-02-01
```

### 1.9 Common Field Types

| Type | Format | Example |
|------|--------|---------|
| `uuid` | UUID v4 | `"550e8400-e29b-41d4-a716-446655440000"` |
| `timestamp` | ISO 8601 with timezone | `"2026-01-30T14:30:00.000Z"` |
| `date` | ISO 8601 date only | `"2026-01-30"` |
| `time` | ISO 8601 time only | `"14:30:00"` |
| `email` | RFC 5322 | `"user@example.com"` |

### 1.10 Provenance Fields

**All entities** include these fields in responses (per DIS requirements):

| Field | Type | Description |
|-------|------|-------------|
| `created_by` | uuid | User ID who created the entity |
| `created_at` | timestamp | When the entity was created |
| `updated_at` | timestamp | When the entity was last modified |

RAID items, Actions, and Decisions additionally include:

| Field | Type | Description |
|-------|------|-------------|
| `source` | string \| null | How/where this was identified (free text provenance) |

---

## 2. Authentication & Authorisation

### 2.1 Auth Flow

Helm uses **Supabase Auth** for authentication. The flow is:

1. Client calls Supabase SDK (`supabase.auth.signInWithPassword()` or `signUp()`)
2. Supabase returns a JWT access token + refresh token
3. Client includes JWT in `Authorization: Bearer <token>` header for all API calls
4. Server validates JWT via `createRouteHandlerClient` from `@supabase/ssr`
5. On token expiry, client refreshes via Supabase SDK (`supabase.auth.refreshSession()`)

**The `/auth/signup` and `/auth/login` endpoints below are thin wrappers** around Supabase Auth that also handle Helm-specific user profile creation.

### 2.2 Authorisation Model (v1)

v1 uses workspace-level roles. All authorisation checks are performed server-side.

| Role | Description | Workspace | Projects | Items |
|------|-------------|-----------|----------|-------|
| `owner` | Workspace creator | Full CRUD + delete | Full CRUD | Full CRUD |
| `admin` | Workspace admin | Full CRUD (no delete) | Full CRUD | Full CRUD |
| `member` | Standard member | Read | Full CRUD (assigned projects) | Full CRUD (assigned projects) |
| `viewer` | Read-only | Read | Read | Read |

**Rules:**
- A user must be a member of a workspace to access any resource within it.
- `member` and `viewer` roles see only projects they are assigned to.
- `owner` and `admin` roles see all projects in the workspace.
- Creating a workspace automatically assigns the creator as `owner`.

---

## 3. Auth Endpoints

### 3.1 POST /api/v1/auth/signup

Create a new user account and Helm profile.

**Authentication:** None (public endpoint)

**Request Body:**

```json
{
  "email": "jane.smith@example.com",
  "password": "securePassword123!",
  "full_name": "Jane Smith"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Valid email format |
| `password` | string | Yes | Minimum 8 characters |
| `full_name` | string | Yes | 1–200 characters |

**Response: `201 Created`**

```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "jane.smith@example.com",
    "full_name": "Jane Smith",
    "avatar_url": null,
    "created_at": "2026-01-30T14:30:00.000Z",
    "updated_at": "2026-01-30T14:30:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MjA2NjAxMzBUMTQ...",
    "expires_at": 1738339800
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-01-30T14:30:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid email format, password too short, missing fields |
| 409 | `DUPLICATE` | Email already registered |
| 500 | `INTERNAL_ERROR` | Supabase signup failure |

---

### 3.2 POST /api/v1/auth/login

Authenticate an existing user.

**Authentication:** None (public endpoint)

**Request Body:**

```json
{
  "email": "jane.smith@example.com",
  "password": "securePassword123!"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Valid email format |
| `password` | string | Yes | Non-empty |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "jane.smith@example.com",
    "full_name": "Jane Smith",
    "avatar_url": "https://example.com/avatars/jane.jpg",
    "created_at": "2026-01-30T14:30:00.000Z",
    "updated_at": "2026-01-30T15:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MjA2NjAxMzBUMTQ...",
    "expires_at": 1738339800
  },
  "meta": {
    "request_id": "660f9511-f30c-42e5-b827-557766881122",
    "timestamp": "2026-01-30T15:00:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing email or password |
| 401 | `UNAUTHORIZED` | Invalid email/password combination |
| 500 | `INTERNAL_ERROR` | Supabase auth failure |

---

### 3.3 POST /api/v1/auth/logout

Sign out the current user and invalidate the session.

**Authentication:** Required

**Request Body:** None

**Response: `200 OK`**

```json
{
  "data": {
    "message": "Logged out successfully."
  },
  "meta": {
    "request_id": "770a0622-a41d-53f6-c938-668877992233",
    "timestamp": "2026-01-30T16:00:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHORIZED` | No valid session |
| 500 | `INTERNAL_ERROR` | Supabase signout failure |

---

### 3.4 GET /api/v1/auth/me

Get the current authenticated user's profile.

**Authentication:** Required

**Response: `200 OK`**

```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "jane.smith@example.com",
    "full_name": "Jane Smith",
    "avatar_url": "https://example.com/avatars/jane.jpg",
    "created_at": "2026-01-30T14:30:00.000Z",
    "updated_at": "2026-01-30T15:00:00.000Z",
    "workspaces": [
      {
        "id": "ws-001",
        "name": "Acme Corp PMO",
        "role": "owner"
      },
      {
        "id": "ws-002",
        "name": "Beta Programme",
        "role": "member"
      }
    ]
  },
  "meta": {
    "request_id": "880b1733-b52e-64a7-da49-779988003344",
    "timestamp": "2026-01-30T15:05:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHORIZED` | No valid session |

---

### 3.5 PATCH /api/v1/auth/me

Update the current user's profile.

**Authentication:** Required

**Request Body (all fields optional):**

```json
{
  "full_name": "Jane A. Smith",
  "avatar_url": "https://example.com/avatars/jane-new.jpg"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `full_name` | string | No | 1–200 characters |
| `avatar_url` | string \| null | No | Valid URL or null to remove |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "jane.smith@example.com",
    "full_name": "Jane A. Smith",
    "avatar_url": "https://example.com/avatars/jane-new.jpg",
    "created_at": "2026-01-30T14:30:00.000Z",
    "updated_at": "2026-01-30T16:30:00.000Z"
  },
  "meta": {
    "request_id": "990c2844-c63f-75b8-eb5a-880099114455",
    "timestamp": "2026-01-30T16:30:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 401 | `UNAUTHORIZED` | No valid session |

---

## 4. Workspace Endpoints

### 4.1 GET /api/v1/workspaces

List all workspaces the current user is a member of.

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `sort` | `name` \| `created_at` \| `updated_at` | `name` | Sort field |
| `order` | `asc` \| `desc` | `asc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "ws-550e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corp PMO",
      "slug": "acme-corp-pmo",
      "description": "Central PMO governance workspace",
      "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "member_count": 12,
      "project_count": 5,
      "current_user_role": "owner",
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-15T09:00:00.000Z",
      "updated_at": "2026-01-29T17:30:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 1,
    "limit": 25
  },
  "meta": {
    "request_id": "aa0d3955-d74a-86c9-fc6b-991100225566",
    "timestamp": "2026-01-30T15:10:00.000Z",
    "last_updated": "2026-01-29T17:30:00.000Z"
  }
}
```

---

### 4.2 POST /api/v1/workspaces

Create a new workspace. The creating user becomes the `owner`.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "Acme Corp PMO",
  "slug": "acme-corp-pmo",
  "description": "Central PMO governance workspace"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1–200 characters |
| `slug` | string | No | 1–100 chars, lowercase, alphanumeric + hyphens. Auto-generated from name if omitted |
| `description` | string | No | 0–2000 characters |

**Response: `201 Created`**

```json
{
  "data": {
    "id": "ws-550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corp PMO",
    "slug": "acme-corp-pmo",
    "description": "Central PMO governance workspace",
    "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "member_count": 1,
    "project_count": 0,
    "current_user_role": "owner",
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-30T15:15:00.000Z",
    "updated_at": "2026-01-30T15:15:00.000Z"
  },
  "meta": {
    "request_id": "bb1e4a66-e85b-97da-ad7c-aa2211336677",
    "timestamp": "2026-01-30T15:15:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing name, invalid slug format |
| 409 | `DUPLICATE` | Slug already taken |

---

### 4.3 GET /api/v1/workspaces/:workspaceId

Get workspace details.

**Authentication:** Required (must be workspace member)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "ws-550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corp PMO",
    "slug": "acme-corp-pmo",
    "description": "Central PMO governance workspace",
    "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "member_count": 12,
    "project_count": 5,
    "current_user_role": "owner",
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-15T09:00:00.000Z",
    "updated_at": "2026-01-29T17:30:00.000Z"
  },
  "meta": {
    "request_id": "cc2f5b77-f96c-a8eb-be8d-bb3322447788",
    "timestamp": "2026-01-30T15:20:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHORIZED` | No valid session |
| 403 | `FORBIDDEN` | Not a member of this workspace |
| 404 | `NOT_FOUND` | Workspace does not exist |

---

### 4.4 PATCH /api/v1/workspaces/:workspaceId

Update workspace details.

**Authentication:** Required (workspace `owner` or `admin` only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Request Body (all fields optional):**

```json
{
  "name": "Acme Corp PMO (Renamed)",
  "description": "Updated description"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | No | 1–200 characters |
| `slug` | string | No | 1–100 chars, lowercase, alphanumeric + hyphens |
| `description` | string \| null | No | 0–2000 characters. Send `null` to clear |

**Response: `200 OK`** — Returns the full updated workspace object (same shape as GET).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 403 | `FORBIDDEN` | Not owner/admin |
| 404 | `NOT_FOUND` | Workspace does not exist |
| 409 | `DUPLICATE` | Slug already taken |

---

### 4.5 DELETE /api/v1/workspaces/:workspaceId

Soft-delete (archive) a workspace. All projects within become inaccessible.

**Authentication:** Required (workspace `owner` only)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Response: `204 No Content`**

No response body.

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Not workspace owner |
| 404 | `NOT_FOUND` | Workspace does not exist |

---

## 5. Workspace Member Endpoints

### 5.1 GET /api/v1/workspaces/:workspaceId/members

List all members of a workspace.

**Authentication:** Required (workspace member)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `role` | string | — | Filter by role: `owner`, `admin`, `member`, `viewer` |
| `search` | string | — | Search by name or email (partial match) |
| `sort` | `full_name` \| `email` \| `joined_at` | `full_name` | Sort field |
| `order` | `asc` \| `desc` | `asc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "jane.smith@example.com",
      "full_name": "Jane Smith",
      "avatar_url": "https://example.com/avatars/jane.jpg",
      "role": "owner",
      "joined_at": "2026-01-15T09:00:00.000Z"
    },
    {
      "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "email": "john.doe@example.com",
      "full_name": "John Doe",
      "avatar_url": null,
      "role": "member",
      "joined_at": "2026-01-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 2,
    "limit": 25
  },
  "meta": {
    "request_id": "dd3a6c88-a07d-b9fc-cf9e-cc4433558899",
    "timestamp": "2026-01-30T15:25:00.000Z",
    "last_updated": "2026-01-20T10:00:00.000Z"
  }
}
```

---

### 5.2 POST /api/v1/workspaces/:workspaceId/members

Add a member to the workspace.

**Authentication:** Required (workspace `owner` or `admin`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "role": "member"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Must be a registered Helm user |
| `role` | string (enum) | Yes | One of: `admin`, `member`, `viewer` (cannot assign `owner`) |

**Response: `201 Created`**

```json
{
  "data": {
    "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "role": "member",
    "joined_at": "2026-01-30T15:30:00.000Z"
  },
  "meta": {
    "request_id": "ee4b7d99-b18e-caad-daaf-dd5544669900",
    "timestamp": "2026-01-30T15:30:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid role value, missing email |
| 403 | `FORBIDDEN` | Not owner/admin |
| 404 | `NOT_FOUND` | User with that email not found |
| 409 | `DUPLICATE` | User is already a member |

---

### 5.3 PATCH /api/v1/workspaces/:workspaceId/members/:userId

Update a member's role.

**Authentication:** Required (workspace `owner` or `admin`; cannot change own role unless `owner`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |
| `userId` | uuid | User ID of the member to update |

**Request Body:**

```json
{
  "role": "admin"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `role` | string (enum) | Yes | One of: `admin`, `member`, `viewer`. Only `owner` can assign `admin`. Cannot change `owner` role. |

**Response: `200 OK`** — Returns updated member object (same shape as list item).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid role |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Member not found in workspace |
| 409 | `CONFLICT` | Cannot change workspace owner's role |

---

### 5.4 DELETE /api/v1/workspaces/:workspaceId/members/:userId

Remove a member from the workspace.

**Authentication:** Required (workspace `owner` or `admin`; members can remove themselves)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |
| `userId` | uuid | User ID of the member to remove |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Not owner/admin (and not self-removing) |
| 404 | `NOT_FOUND` | Member not found in workspace |
| 409 | `CONFLICT` | Cannot remove workspace owner |

---

## 6. Project Endpoints

### 6.1 GET /api/v1/workspaces/:workspaceId/projects

List projects in a workspace.

**Authentication:** Required (workspace member; `member`/`viewer` see only assigned projects)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `status` | string | — | Filter: `active`, `on_hold`, `completed`, `cancelled` (comma-separated) |
| `rag` | string | — | Filter: `red`, `amber`, `green` (comma-separated) |
| `owner_id` | uuid | — | Filter by project owner |
| `search` | string | — | Search by name or code (partial match, case-insensitive) |
| `sort` | `name` \| `code` \| `status` \| `rag_status` \| `created_at` \| `updated_at` | `name` | Sort field |
| `order` | `asc` \| `desc` | `asc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "workspace_id": "ws-550e8400-e29b-41d4-a716-446655440000",
      "name": "Project Alpha",
      "code": "ALPHA",
      "description": "CRM enhancement programme",
      "status": "active",
      "rag_status": "amber",
      "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "owner": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "full_name": "Jane Smith",
        "avatar_url": "https://example.com/avatars/jane.jpg"
      },
      "start_date": "2026-01-15",
      "target_end_date": "2026-06-30",
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-15T09:00:00.000Z",
      "updated_at": "2026-01-29T17:30:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 1,
    "limit": 25
  },
  "meta": {
    "request_id": "ff5c8eaa-c29f-dbba-ebb0-ee6655770011",
    "timestamp": "2026-01-30T15:35:00.000Z",
    "last_updated": "2026-01-29T17:30:00.000Z"
  }
}
```

---

### 6.2 POST /api/v1/workspaces/:workspaceId/projects

Create a new project within a workspace.

**Authentication:** Required (workspace `owner`, `admin`, or `member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `workspaceId` | uuid | Workspace ID |

**Request Body:**

```json
{
  "name": "Project Alpha",
  "code": "ALPHA",
  "description": "CRM enhancement programme",
  "status": "active",
  "rag_status": "green",
  "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "start_date": "2026-01-15",
  "target_end_date": "2026-06-30"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1–200 characters |
| `code` | string | Yes | 1–20 characters, uppercase alphanumeric + hyphens. Unique within workspace |
| `description` | string | No | 0–5000 characters |
| `status` | string (enum) | No | Default: `active`. One of: `active`, `on_hold`, `completed`, `cancelled` |
| `rag_status` | string (enum) | No | Default: `green`. One of: `red`, `amber`, `green` |
| `owner_id` | uuid | Yes | Must be a workspace member |
| `start_date` | date | No | ISO 8601 date |
| `target_end_date` | date | No | ISO 8601 date. Must be ≥ `start_date` if both provided |

**Response: `201 Created`** — Returns full project object (same shape as list item).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid fields, missing required fields |
| 403 | `FORBIDDEN` | Viewer role cannot create projects |
| 404 | `NOT_FOUND` | Workspace not found, owner_id not a workspace member |
| 409 | `DUPLICATE` | Project code already exists in workspace |

---

### 6.3 GET /api/v1/projects/:projectId

Get project details.

**Authentication:** Required (workspace member with project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "proj-660f9511-f30c-42e5-b827-557766881122",
    "workspace_id": "ws-550e8400-e29b-41d4-a716-446655440000",
    "name": "Project Alpha",
    "code": "ALPHA",
    "description": "CRM enhancement programme",
    "status": "active",
    "rag_status": "amber",
    "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "owner": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "full_name": "Jane Smith",
      "avatar_url": "https://example.com/avatars/jane.jpg"
    },
    "start_date": "2026-01-15",
    "target_end_date": "2026-06-30",
    "counts": {
      "raid_items": 23,
      "open_risks": 5,
      "open_issues": 3,
      "actions": 42,
      "open_actions": 18,
      "overdue_actions": 4,
      "meetings": 8,
      "decisions": 12
    },
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-15T09:00:00.000Z",
    "updated_at": "2026-01-29T17:30:00.000Z"
  },
  "meta": {
    "request_id": "007d9fbb-d3a0-eccb-fcc1-ff7766880022",
    "timestamp": "2026-01-30T15:40:00.000Z"
  }
}
```

**Note:** The `counts` object provides summary statistics for the project. This is computed server-side and is **not** present on list responses (use the Dashboard endpoint for aggregated views).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | No access to this project |
| 404 | `NOT_FOUND` | Project does not exist |

---

### 6.4 PATCH /api/v1/projects/:projectId

Update a project.

**Authentication:** Required (workspace `owner`/`admin`, or project owner)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Request Body (all fields optional):**

```json
{
  "name": "Project Alpha (Phase 2)",
  "status": "on_hold",
  "rag_status": "red",
  "target_end_date": "2026-09-30"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | No | 1–200 characters |
| `code` | string | No | 1–20 chars, unique in workspace |
| `description` | string \| null | No | 0–5000 chars |
| `status` | string (enum) | No | `active`, `on_hold`, `completed`, `cancelled` |
| `rag_status` | string (enum) | No | `red`, `amber`, `green` |
| `owner_id` | uuid | No | Must be a workspace member |
| `start_date` | date \| null | No | ISO 8601 date |
| `target_end_date` | date \| null | No | ISO 8601 date |

**Response: `200 OK`** — Returns full updated project object.

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Project not found |
| 409 | `DUPLICATE` | Code already taken |

---

### 6.5 DELETE /api/v1/projects/:projectId

Soft-delete (archive) a project and all its contents.

**Authentication:** Required (workspace `owner` or `admin`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Not workspace owner/admin |
| 404 | `NOT_FOUND` | Project does not exist |

---

## 7. RAID Item Endpoints

RAID items are the core governance entity. Each represents a **R**isk, **A**ssumption, **I**ssue, or **D**ependency.

### 7.1 GET /api/v1/projects/:projectId/raid-items

List RAID items for a project with filtering.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `type` | string | — | Filter by RAID type: `risk`, `assumption`, `issue`, `dependency` (comma-separated) |
| `status` | string | — | Filter: `open`, `mitigating`, `closed`, `escalated` (comma-separated) |
| `rag` | string | — | Filter: `red`, `amber`, `green` (comma-separated) |
| `impact` | string | — | Filter: `low`, `medium`, `high`, `critical` (comma-separated) |
| `probability` | string | — | Filter: `low`, `medium`, `high`, `very_high` (comma-separated) |
| `owner_id` | uuid | — | Filter by owner |
| `is_escalated` | boolean | — | `true` = only escalated items; `false` = only non-escalated |
| `due_date_from` | date | — | Due date range start (inclusive) |
| `due_date_to` | date | — | Due date range end (inclusive) |
| `search` | string | — | Search in title and description (partial match, case-insensitive) |
| `sort` | `reference` \| `title` \| `type` \| `status` \| `rag_status` \| `impact` \| `owner` \| `due_date` \| `created_at` \| `updated_at` | `created_at` | Sort field |
| `order` | `asc` \| `desc` | `desc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "raid-770a0622-a41d-53f6-c938-668877992233",
      "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "type": "risk",
      "reference": "R-001",
      "title": "Key supplier may not deliver on time",
      "description": "ACME Corp has flagged potential delays in the Q2 hardware delivery...",
      "status": "open",
      "rag_status": "amber",
      "impact": "high",
      "probability": "medium",
      "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "owner": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "full_name": "Jane Smith",
        "avatar_url": "https://example.com/avatars/jane.jpg"
      },
      "due_date": "2026-02-15",
      "source": "Identified during PSB meeting 28 Jan 2026",
      "mitigation": "Engage backup supplier; escalate at next board if no resolution by Feb 5",
      "escalated_from_id": null,
      "escalated_to_id": null,
      "link_count": 2,
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-28T10:00:00.000Z",
      "updated_at": "2026-01-29T14:00:00.000Z"
    }
  ],
  "pagination": {
    "cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNi0wMS0yOFQxMDowMDowMC4wMDBaIiwiaWQiOiJyYWlkLTc3MGEwNjIyIn0=",
    "has_more": true,
    "total_count": 23,
    "limit": 25
  },
  "meta": {
    "request_id": "118e0a33-e52a-a0cb-d1b2-009988776655",
    "timestamp": "2026-01-30T16:00:00.000Z",
    "last_updated": "2026-01-29T14:00:00.000Z"
  }
}
```

---

### 7.2 POST /api/v1/projects/:projectId/raid-items

Create a new RAID item.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Request Body:**

```json
{
  "type": "risk",
  "title": "Key supplier may not deliver on time",
  "description": "ACME Corp has flagged potential delays in the Q2 hardware delivery...",
  "status": "open",
  "rag_status": "amber",
  "impact": "high",
  "probability": "medium",
  "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "due_date": "2026-02-15",
  "source": "Identified during PSB meeting 28 Jan 2026",
  "mitigation": "Engage backup supplier; escalate at next board if no resolution by Feb 5"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `type` | string (enum) | Yes | `risk`, `assumption`, `issue`, `dependency` |
| `title` | string | Yes | 1–500 characters |
| `description` | string | No | 0–10000 characters |
| `status` | string (enum) | No | Default: `open`. One of: `open`, `mitigating`, `closed`, `escalated` |
| `rag_status` | string (enum) | No | Default: `green`. One of: `red`, `amber`, `green` |
| `impact` | string (enum) | No | `low`, `medium`, `high`, `critical` |
| `probability` | string (enum) | No | `low`, `medium`, `high`, `very_high`. Applicable mainly to `risk` type |
| `owner_id` | uuid | Yes | Must be a workspace member |
| `due_date` | date | No | ISO 8601 date |
| `source` | string | No | 0–1000 chars. Free text provenance |
| `mitigation` | string | No | 0–5000 chars. Mitigation/response strategy |

**Response: `201 Created`** — Returns the full RAID item object (same shape as list item, with `reference` auto-generated).

**Reference Generation:** The server auto-generates `reference` based on type and project sequence:
- Risk: `R-001`, `R-002`, ...
- Assumption: `A-001`, `A-002`, ...
- Issue: `I-001`, `I-002`, ...
- Dependency: `D-001`, `D-002`, ...

Sequence is per-project, per-type, monotonically increasing. Never reused.

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing required fields, invalid enum values |
| 403 | `FORBIDDEN` | Viewer role cannot create items |
| 404 | `NOT_FOUND` | Project or owner not found |

---

### 7.3 GET /api/v1/raid-items/:raidItemId

Get full details of a RAID item, including links and escalation chain.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | RAID Item ID |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "raid-770a0622-a41d-53f6-c938-668877992233",
    "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
    "project": {
      "id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "name": "Project Alpha",
      "code": "ALPHA"
    },
    "type": "risk",
    "reference": "R-001",
    "title": "Key supplier may not deliver on time",
    "description": "ACME Corp has flagged potential delays in the Q2 hardware delivery...",
    "status": "open",
    "rag_status": "amber",
    "impact": "high",
    "probability": "medium",
    "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "owner": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "full_name": "Jane Smith",
      "avatar_url": "https://example.com/avatars/jane.jpg"
    },
    "due_date": "2026-02-15",
    "source": "Identified during PSB meeting 28 Jan 2026",
    "mitigation": "Engage backup supplier; escalate at next board if no resolution by Feb 5",
    "escalated_from": null,
    "escalated_to": null,
    "links": [
      {
        "id": "link-001",
        "linked_item_id": "raid-880b1733-b52e-64a7-da49-779988003344",
        "linked_item_reference": "D-003",
        "linked_item_title": "Dependency on hardware delivery",
        "linked_item_project": {
          "id": "proj-770a0622-a41d-53f6-c938-668877992233",
          "name": "Project Beta",
          "code": "BETA"
        },
        "link_type": "related_to",
        "created_at": "2026-01-29T10:00:00.000Z"
      }
    ],
    "related_actions": [
      {
        "id": "act-001",
        "reference": "ACT-005",
        "title": "Contact backup supplier",
        "status": "open",
        "owner": {
          "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
          "full_name": "John Doe"
        },
        "due_date": "2026-02-01"
      }
    ],
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-28T10:00:00.000Z",
    "updated_at": "2026-01-29T14:00:00.000Z"
  },
  "meta": {
    "request_id": "229f1b44-f63b-b1dc-e2c3-11aa99887766",
    "timestamp": "2026-01-30T16:05:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | No access to the item's project |
| 404 | `NOT_FOUND` | RAID item does not exist |

---

### 7.4 PATCH /api/v1/raid-items/:raidItemId

Update a RAID item.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | RAID Item ID |

**Request Body (all fields optional):**

```json
{
  "title": "Updated risk title",
  "status": "mitigating",
  "rag_status": "red",
  "impact": "critical",
  "mitigation": "Updated mitigation strategy..."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | No | 1–500 characters |
| `description` | string \| null | No | 0–10000 characters |
| `status` | string (enum) | No | `open`, `mitigating`, `closed`, `escalated` |
| `rag_status` | string (enum) | No | `red`, `amber`, `green` |
| `impact` | string (enum) | No | `low`, `medium`, `high`, `critical` |
| `probability` | string (enum) | No | `low`, `medium`, `high`, `very_high` |
| `owner_id` | uuid | No | Must be workspace member |
| `due_date` | date \| null | No | ISO 8601 date |
| `source` | string \| null | No | 0–1000 characters |
| `mitigation` | string \| null | No | 0–5000 characters |

**Note:** `type` and `reference` are immutable after creation.

**Response: `200 OK`** — Returns full updated RAID item object (same as detail GET, minus `links` and `related_actions`).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 403 | `FORBIDDEN` | Viewer cannot update |
| 404 | `NOT_FOUND` | RAID item not found |

---

### 7.5 DELETE /api/v1/raid-items/:raidItemId

Soft-delete a RAID item.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | RAID Item ID |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Viewer cannot delete |
| 404 | `NOT_FOUND` | RAID item not found |

---

### 7.6 POST /api/v1/raid-items/:raidItemId/escalate

Escalate a RAID item to a different project within the same workspace. Creates a linked copy in the target project with `escalated_from` reference.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | RAID Item ID to escalate |

**Request Body:**

```json
{
  "target_project_id": "proj-880b1733-b52e-64a7-da49-779988003344",
  "message": "Escalating due to potential impact on Programme Board timeline. Requires portfolio-level decision by Feb 5."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `target_project_id` | uuid | Yes | Must be a project in the same workspace. Cannot be the same project |
| `message` | string | No | 0–2000 chars. Escalation reason/context |

**Behaviour:**
1. Creates a new RAID item in the target project with:
   - Same `type`, `title`, `description`, `impact`, `probability`
   - `status` set to `escalated`
   - `escalated_from_id` pointing to the original item
   - New `reference` generated in target project's sequence
   - `source` set to: `"Escalated from [PROJECT_CODE] [REFERENCE]"`
2. Updates the original item:
   - `escalated_to_id` pointing to the new item
   - `status` set to `escalated`
3. Both items are linked via the escalation chain
4. Audit log records the escalation with message

**Response: `201 Created`**

```json
{
  "data": {
    "original_item": {
      "id": "raid-770a0622-a41d-53f6-c938-668877992233",
      "reference": "R-001",
      "status": "escalated",
      "escalated_to_id": "raid-new-escalated-item-id"
    },
    "escalated_item": {
      "id": "raid-new-escalated-item-id",
      "project_id": "proj-880b1733-b52e-64a7-da49-779988003344",
      "type": "risk",
      "reference": "R-005",
      "title": "Key supplier may not deliver on time",
      "status": "escalated",
      "rag_status": "amber",
      "escalated_from_id": "raid-770a0622-a41d-53f6-c938-668877992233",
      "source": "Escalated from ALPHA R-001",
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-30T16:10:00.000Z",
      "updated_at": "2026-01-30T16:10:00.000Z"
    },
    "escalation_message": "Escalating due to potential impact on Programme Board timeline."
  },
  "meta": {
    "request_id": "33a02c55-a74c-c2ed-f3d4-22bb00998877",
    "timestamp": "2026-01-30T16:10:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing target_project_id |
| 403 | `FORBIDDEN` | No access to target project |
| 404 | `NOT_FOUND` | Source or target not found |
| 409 | `CONFLICT` | Item already escalated, or target is same project |

---

### 7.7 GET /api/v1/raid-items/:raidItemId/links

List all links for a RAID item (cross-project dependencies and related items).

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | RAID Item ID |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "link-001",
      "source_item_id": "raid-770a0622-a41d-53f6-c938-668877992233",
      "target_item_id": "raid-880b1733-b52e-64a7-da49-779988003344",
      "target_item": {
        "id": "raid-880b1733-b52e-64a7-da49-779988003344",
        "type": "dependency",
        "reference": "D-003",
        "title": "Dependency on hardware delivery",
        "status": "open",
        "rag_status": "amber",
        "project": {
          "id": "proj-770a0622-a41d-53f6-c938-668877992233",
          "name": "Project Beta",
          "code": "BETA"
        }
      },
      "link_type": "depends_on",
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-29T10:00:00.000Z"
    }
  ],
  "meta": {
    "request_id": "44b13d66-b85d-d3fe-a4e5-33cc11009988",
    "timestamp": "2026-01-30T16:15:00.000Z"
  }
}
```

**Note:** Links are returned as a flat array (not paginated) since an item typically has <20 links. If this becomes a performance issue, pagination will be added.

---

### 7.8 POST /api/v1/raid-items/:raidItemId/links

Create a link between two RAID items (cross-project dependency or relationship).

**Authentication:** Required (project access for both items)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | Source RAID Item ID |

**Request Body:**

```json
{
  "target_item_id": "raid-880b1733-b52e-64a7-da49-779988003344",
  "link_type": "depends_on"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `target_item_id` | uuid | Yes | Must exist. Must be in the same workspace. Cannot link to self |
| `link_type` | string (enum) | Yes | `depends_on`, `blocks`, `related_to` |

**Behaviour:** Links are bidirectional in display — if A `depends_on` B, then B's links show A as `depended_on_by`. The stored record is unidirectional (source → target).

**Response: `201 Created`**

```json
{
  "data": {
    "id": "link-002",
    "source_item_id": "raid-770a0622-a41d-53f6-c938-668877992233",
    "target_item_id": "raid-880b1733-b52e-64a7-da49-779988003344",
    "link_type": "depends_on",
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-30T16:20:00.000Z"
  },
  "meta": {
    "request_id": "55c24e77-c96e-e4af-b5f6-44dd22110099",
    "timestamp": "2026-01-30T16:20:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing fields, invalid link_type |
| 403 | `FORBIDDEN` | No access to target item's project |
| 404 | `NOT_FOUND` | Source or target item not found |
| 409 | `DUPLICATE` | Link already exists between these items |
| 409 | `CONFLICT` | Cannot link item to itself |

---

### 7.9 DELETE /api/v1/raid-items/:raidItemId/links/:linkId

Remove a link between RAID items.

**Authentication:** Required (project access for the source item)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `raidItemId` | uuid | Source RAID Item ID |
| `linkId` | uuid | Link ID |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | No access |
| 404 | `NOT_FOUND` | Link not found |

---

### 7.10 POST /api/v1/projects/:projectId/raid-items/bulk

Bulk operations on RAID items within a single project.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Request Body:**

```json
{
  "operation": "update",
  "item_ids": [
    "raid-770a0622-a41d-53f6-c938-668877992233",
    "raid-880b1733-b52e-64a7-da49-779988003344",
    "raid-990c2844-c63f-75b8-eb5a-880099114455"
  ],
  "fields": {
    "status": "closed",
    "rag_status": "green"
  }
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `operation` | string (enum) | Yes | v1 supports: `update` only |
| `item_ids` | array of uuid | Yes | 1–100 items. All must belong to the specified project |
| `fields` | object | Yes (for `update`) | Fields to update. Same constraints as PATCH. Only `status`, `rag_status`, `owner_id` are supported for bulk |

**Supported bulk fields (v1):**

| Field | Type | Constraints |
|-------|------|-------------|
| `status` | string (enum) | `open`, `mitigating`, `closed`, `escalated` |
| `rag_status` | string (enum) | `red`, `amber`, `green` |
| `owner_id` | uuid | Must be workspace member |

**Response: `200 OK`**

```json
{
  "data": {
    "updated_count": 3,
    "failed_count": 0,
    "results": [
      {
        "id": "raid-770a0622-a41d-53f6-c938-668877992233",
        "success": true
      },
      {
        "id": "raid-880b1733-b52e-64a7-da49-779988003344",
        "success": true
      },
      {
        "id": "raid-990c2844-c63f-75b8-eb5a-880099114455",
        "success": true
      }
    ]
  },
  "meta": {
    "request_id": "66d35f88-da7f-f5ba-c6a7-55ee33221100",
    "timestamp": "2026-01-30T16:25:00.000Z"
  }
}
```

**Partial failure example:**

```json
{
  "data": {
    "updated_count": 2,
    "failed_count": 1,
    "results": [
      {
        "id": "raid-770a0622-a41d-53f6-c938-668877992233",
        "success": true
      },
      {
        "id": "raid-880b1733-b52e-64a7-da49-779988003344",
        "success": true
      },
      {
        "id": "raid-invalid-item-id",
        "success": false,
        "error": {
          "code": "NOT_FOUND",
          "message": "RAID item not found in this project."
        }
      }
    ]
  },
  "meta": {
    "request_id": "77e46a99-eb8a-a6cb-d7b8-66ff44332211",
    "timestamp": "2026-01-30T16:25:00.000Z"
  }
}
```

**Behaviour:** Bulk operations are **best-effort** — if some items fail, the successful ones are still applied. The response reports each item's result.

**Errors (whole-request failures):**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing fields, >100 items, invalid operation, unsupported bulk field |
| 403 | `FORBIDDEN` | Viewer cannot bulk update |
| 404 | `NOT_FOUND` | Project not found |

---

## 8. Action Endpoints

Actions are tracked tasks with ownership, due dates, and source linking.

### 8.1 GET /api/v1/projects/:projectId/actions

List actions for a project with filtering.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `status` | string | — | Filter: `open`, `in_progress`, `completed`, `cancelled` (comma-separated) |
| `priority` | string | — | Filter: `low`, `medium`, `high`, `urgent` (comma-separated) |
| `owner_id` | uuid | — | Filter by action owner |
| `source_type` | string | — | Filter: `manual`, `meeting`, `raid_item` |
| `is_overdue` | boolean | — | `true` = only overdue; `false` = only not overdue |
| `due_date_from` | date | — | Due date range start (inclusive) |
| `due_date_to` | date | — | Due date range end (inclusive) |
| `search` | string | — | Search in title and description (partial match, case-insensitive) |
| `sort` | `reference` \| `title` \| `status` \| `priority` \| `owner` \| `due_date` \| `created_at` \| `updated_at` | `created_at` | Sort field |
| `order` | `asc` \| `desc` | `desc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "act-550e8400-e29b-41d4-a716-446655440000",
      "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "reference": "ACT-001",
      "title": "Update risk register with supplier assessment",
      "description": "Complete supplier risk assessment and update RAID log with findings.",
      "status": "open",
      "priority": "high",
      "owner_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "owner": {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "full_name": "John Doe",
        "avatar_url": null
      },
      "due_date": "2026-02-01",
      "is_overdue": false,
      "source_type": "meeting",
      "source_id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
      "source_title": "PSB Meeting 28 Jan 2026",
      "source": "Action raised during PSB meeting discussion on supplier risk",
      "completed_at": null,
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-28T11:00:00.000Z",
      "updated_at": "2026-01-28T11:00:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 1,
    "limit": 25
  },
  "meta": {
    "request_id": "88f57b00-fc9b-b7dc-e8c9-77aa55443322",
    "timestamp": "2026-01-30T16:30:00.000Z",
    "last_updated": "2026-01-28T11:00:00.000Z"
  }
}
```

---

### 8.2 POST /api/v1/projects/:projectId/actions

Create a new action.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Request Body:**

```json
{
  "title": "Update risk register with supplier assessment",
  "description": "Complete supplier risk assessment and update RAID log with findings.",
  "priority": "high",
  "owner_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "due_date": "2026-02-01",
  "source_type": "meeting",
  "source_id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
  "source": "Action raised during PSB meeting discussion on supplier risk"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1–500 characters |
| `description` | string | No | 0–10000 characters |
| `status` | string (enum) | No | Default: `open`. One of: `open`, `in_progress`, `completed`, `cancelled` |
| `priority` | string (enum) | No | Default: `medium`. One of: `low`, `medium`, `high`, `urgent` |
| `owner_id` | uuid | Yes | Must be workspace member |
| `due_date` | date | No | ISO 8601 date |
| `source_type` | string (enum) | No | `manual` (default), `meeting`, `raid_item` |
| `source_id` | uuid | No | Required if `source_type` is `meeting` or `raid_item`. References the source entity |
| `source` | string | No | 0–1000 chars. Free text provenance |

**Validation:**
- If `source_type` is `meeting`, `source_id` must reference a valid meeting in the same project.
- If `source_type` is `raid_item`, `source_id` must reference a valid RAID item in the same project.
- If `source_type` is `manual` or omitted, `source_id` must be null/omitted.

**Response: `201 Created`** — Returns full action object (same shape as list item, with `reference` auto-generated as `ACT-001`, `ACT-002`, etc.).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing required fields, invalid source link |
| 403 | `FORBIDDEN` | Viewer cannot create |
| 404 | `NOT_FOUND` | Project, owner, or source entity not found |

---

### 8.3 GET /api/v1/actions/:actionId

Get full details of an action.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `actionId` | uuid | Action ID |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "act-550e8400-e29b-41d4-a716-446655440000",
    "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
    "project": {
      "id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "name": "Project Alpha",
      "code": "ALPHA"
    },
    "reference": "ACT-001",
    "title": "Update risk register with supplier assessment",
    "description": "Complete supplier risk assessment and update RAID log with findings.",
    "status": "open",
    "priority": "high",
    "owner_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "owner": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "full_name": "John Doe",
      "avatar_url": null
    },
    "due_date": "2026-02-01",
    "is_overdue": false,
    "source_type": "meeting",
    "source_id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
    "source_detail": {
      "id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
      "title": "PSB Meeting 28 Jan 2026",
      "date": "2026-01-28"
    },
    "source": "Action raised during PSB meeting discussion on supplier risk",
    "completed_at": null,
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-28T11:00:00.000Z",
    "updated_at": "2026-01-28T11:00:00.000Z"
  },
  "meta": {
    "request_id": "99a68c11-adac-c8ed-f9da-88bb66554433",
    "timestamp": "2026-01-30T16:35:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | No project access |
| 404 | `NOT_FOUND` | Action not found |

---

### 8.4 PATCH /api/v1/actions/:actionId

Update an action.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `actionId` | uuid | Action ID |

**Request Body (all fields optional):**

```json
{
  "title": "Updated action title",
  "priority": "urgent",
  "due_date": "2026-02-05"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | No | 1–500 characters |
| `description` | string \| null | No | 0–10000 characters |
| `priority` | string (enum) | No | `low`, `medium`, `high`, `urgent` |
| `owner_id` | uuid | No | Must be workspace member |
| `due_date` | date \| null | No | ISO 8601 date |
| `source` | string \| null | No | 0–1000 characters |

**Note:** To change `status`, use the dedicated transition endpoint (8.6). Direct status updates via PATCH are **not allowed** — this ensures transitions are validated and audited.

**Response: `200 OK`** — Returns full updated action object.

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values, attempted status change via PATCH |
| 403 | `FORBIDDEN` | Viewer cannot update |
| 404 | `NOT_FOUND` | Action not found |

---

### 8.5 DELETE /api/v1/actions/:actionId

Soft-delete an action.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `actionId` | uuid | Action ID |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Viewer cannot delete |
| 404 | `NOT_FOUND` | Action not found |

---

### 8.6 POST /api/v1/actions/:actionId/transition

Transition an action's status. Validates the transition is allowed and records an audit entry.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `actionId` | uuid | Action ID |

**Request Body:**

```json
{
  "to_status": "in_progress",
  "comment": "Started working on supplier assessment."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `to_status` | string (enum) | Yes | Target status (see allowed transitions) |
| `comment` | string | No | 0–2000 characters. Reason for transition |

**Allowed Transitions:**

| From | Allowed To |
|------|------------|
| `open` | `in_progress`, `completed`, `cancelled` |
| `in_progress` | `open`, `completed`, `cancelled` |
| `completed` | `open` (reopen) |
| `cancelled` | `open` (reopen) |

**Behaviour:**
- On transition to `completed`: `completed_at` is set to current timestamp.
- On transition from `completed` to `open` (reopen): `completed_at` is cleared.
- All transitions are recorded in the audit log.
- The optional `comment` is stored in the audit log entry.

**Response: `200 OK`**

```json
{
  "data": {
    "id": "act-550e8400-e29b-41d4-a716-446655440000",
    "reference": "ACT-001",
    "title": "Update risk register with supplier assessment",
    "status": "in_progress",
    "previous_status": "open",
    "completed_at": null,
    "updated_at": "2026-01-30T16:40:00.000Z"
  },
  "meta": {
    "request_id": "aab79d22-bebd-d9fe-aafb-99cc77665544",
    "timestamp": "2026-01-30T16:40:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing to_status |
| 403 | `FORBIDDEN` | Viewer cannot transition |
| 404 | `NOT_FOUND` | Action not found |
| 409 | `CONFLICT` | Invalid transition (e.g., `completed` → `in_progress`) |

---

### 8.7 GET /api/v1/actions/mine

List all actions assigned to the current user, across all projects and workspaces they have access to.

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `status` | string | — | Filter: `open`, `in_progress`, `completed`, `cancelled` (comma-separated) |
| `priority` | string | — | Filter: `low`, `medium`, `high`, `urgent` (comma-separated) |
| `is_overdue` | boolean | — | `true` = only overdue; `false` = only not overdue |
| `workspace_id` | uuid | — | Filter to specific workspace |
| `project_id` | uuid | — | Filter to specific project |
| `due_date_from` | date | — | Due date range start |
| `due_date_to` | date | — | Due date range end |
| `sort` | `due_date` \| `priority` \| `status` \| `created_at` \| `project` | `due_date` | Sort field |
| `order` | `asc` \| `desc` | `asc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "act-550e8400-e29b-41d4-a716-446655440000",
      "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "project": {
        "id": "proj-660f9511-f30c-42e5-b827-557766881122",
        "name": "Project Alpha",
        "code": "ALPHA",
        "workspace_id": "ws-550e8400-e29b-41d4-a716-446655440000",
        "workspace_name": "Acme Corp PMO"
      },
      "reference": "ACT-001",
      "title": "Update risk register with supplier assessment",
      "status": "open",
      "priority": "high",
      "due_date": "2026-02-01",
      "is_overdue": false,
      "source_type": "meeting",
      "source_title": "PSB Meeting 28 Jan 2026",
      "created_at": "2026-01-28T11:00:00.000Z",
      "updated_at": "2026-01-28T11:00:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 1,
    "limit": 25
  },
  "meta": {
    "request_id": "bbc8ae33-cfce-eaaf-bbac-aabb88776655",
    "timestamp": "2026-01-30T16:45:00.000Z",
    "last_updated": "2026-01-28T11:00:00.000Z"
  }
}
```

**Note:** `is_overdue` is computed server-side: `true` when `due_date < today` AND `status` is `open` or `in_progress`. Default sort is `due_date ASC` (soonest/most overdue first).

---

## 9. Meeting Endpoints

Meetings in v1 are **manual capture only** — no AI transcription or extraction.

### 9.1 GET /api/v1/projects/:projectId/meetings

List meetings for a project.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cursor` | string | — | Pagination cursor |
| `limit` | integer | 25 | Items per page (1–100) |
| `status` | string | — | Filter: `scheduled`, `completed`, `cancelled` (comma-separated) |
| `meeting_type` | string | — | Filter by meeting type (e.g., `PSB`, `Programme Board`) |
| `date_from` | date | — | Meeting date range start (inclusive) |
| `date_to` | date | — | Meeting date range end (inclusive) |
| `search` | string | — | Search in title (partial match, case-insensitive) |
| `sort` | `date` \| `title` \| `status` \| `created_at` | `date` | Sort field |
| `order` | `asc` \| `desc` | `desc` | Sort direction |

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
      "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "title": "PSB Meeting 28 Jan 2026",
      "meeting_type": "PSB",
      "date": "2026-01-28",
      "start_time": "10:00:00",
      "end_time": "11:30:00",
      "location": "Board Room A / Teams",
      "status": "completed",
      "attendee_count": 8,
      "action_count": 5,
      "decision_count": 2,
      "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-01-25T09:00:00.000Z",
      "updated_at": "2026-01-28T12:00:00.000Z"
    }
  ],
  "pagination": {
    "cursor": null,
    "has_more": false,
    "total_count": 1,
    "limit": 25
  },
  "meta": {
    "request_id": "ccd9bf44-dadf-fbba-ccbd-bbcc99887766",
    "timestamp": "2026-01-30T16:50:00.000Z",
    "last_updated": "2026-01-28T12:00:00.000Z"
  }
}
```

---

### 9.2 POST /api/v1/projects/:projectId/meetings

Create a new meeting.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | uuid | Project ID |

**Request Body:**

```json
{
  "title": "PSB Meeting 28 Jan 2026",
  "meeting_type": "PSB",
  "date": "2026-01-28",
  "start_time": "10:00:00",
  "end_time": "11:30:00",
  "location": "Board Room A / Teams",
  "notes": "## Agenda\n1. Review open risks\n2. Action progress update\n3. Supplier discussion",
  "status": "scheduled",
  "attendees": [
    { "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "role": "chair" },
    { "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "role": "attendee" }
  ]
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1–500 characters |
| `meeting_type` | string | No | 0–100 chars. Free text (e.g., `PSB`, `Programme Board`, `Stand-up`) |
| `date` | date | Yes | ISO 8601 date |
| `start_time` | time | No | ISO 8601 time |
| `end_time` | time | No | ISO 8601 time. Must be > `start_time` if both provided |
| `location` | string | No | 0–500 characters |
| `notes` | string | No | 0–50000 characters. Supports Markdown |
| `status` | string (enum) | No | Default: `scheduled`. One of: `scheduled`, `completed`, `cancelled` |
| `attendees` | array | No | Array of attendee objects. Default: empty |
| `attendees[].user_id` | uuid | Yes | Must be a workspace member |
| `attendees[].role` | string (enum) | Yes | `chair`, `presenter`, `attendee`, `optional` |

**Response: `201 Created`** — Returns full meeting object (see GET detail response).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Missing required fields, invalid time range, invalid attendee |
| 403 | `FORBIDDEN` | Viewer cannot create |
| 404 | `NOT_FOUND` | Project or attendee user not found |

---

### 9.3 GET /api/v1/meetings/:meetingId

Get full details of a meeting, including attendees and linked actions/decisions.

**Authentication:** Required (project access)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `meetingId` | uuid | Meeting ID |

**Response: `200 OK`**

```json
{
  "data": {
    "id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
    "project_id": "proj-660f9511-f30c-42e5-b827-557766881122",
    "project": {
      "id": "proj-660f9511-f30c-42e5-b827-557766881122",
      "name": "Project Alpha",
      "code": "ALPHA"
    },
    "title": "PSB Meeting 28 Jan 2026",
    "meeting_type": "PSB",
    "date": "2026-01-28",
    "start_time": "10:00:00",
    "end_time": "11:30:00",
    "location": "Board Room A / Teams",
    "notes": "## Agenda\n1. Review open risks\n2. Action progress update\n3. Supplier discussion\n\n## Notes\n- Supplier delay confirmed; mitigation plan agreed...",
    "status": "completed",
    "attendees": [
      {
        "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "full_name": "Jane Smith",
        "avatar_url": "https://example.com/avatars/jane.jpg",
        "role": "chair"
      },
      {
        "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "full_name": "John Doe",
        "avatar_url": null,
        "role": "attendee"
      }
    ],
    "linked_actions": [
      {
        "id": "act-550e8400-e29b-41d4-a716-446655440000",
        "reference": "ACT-001",
        "title": "Update risk register with supplier assessment",
        "status": "open",
        "owner": {
          "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
          "full_name": "John Doe"
        },
        "due_date": "2026-02-01"
      }
    ],
    "linked_decisions": [
      {
        "id": "dec-001",
        "reference": "DEC-001",
        "title": "Engage backup supplier for Q2 hardware",
        "status": "approved",
        "decision_date": "2026-01-28"
      }
    ],
    "created_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2026-01-25T09:00:00.000Z",
    "updated_at": "2026-01-28T12:00:00.000Z"
  },
  "meta": {
    "request_id": "ddeac055-ebea-acca-ddce-ccdd00998877",
    "timestamp": "2026-01-30T16:55:00.000Z"
  }
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | No project access |
| 404 | `NOT_FOUND` | Meeting not found |

---

### 9.4 PATCH /api/v1/meetings/:meetingId

Update a meeting.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `meetingId` | uuid | Meeting ID |

**Request Body (all fields optional):**

```json
{
  "title": "PSB Meeting 28 Jan 2026 (Updated)",
  "notes": "Updated meeting notes with outcomes...",
  "status": "completed"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | No | 1–500 characters |
| `meeting_type` | string \| null | No | 0–100 characters |
| `date` | date | No | ISO 8601 date |
| `start_time` | time \| null | No | ISO 8601 time |
| `end_time` | time \| null | No | ISO 8601 time |
| `location` | string \| null | No | 0–500 characters |
| `notes` | string \| null | No | 0–50000 characters |
| `status` | string (enum) | No | `scheduled`, `completed`, `cancelled` |

**Note:** To update attendees, use the dedicated attendees endpoint (9.6).

**Response: `200 OK`** — Returns full updated meeting object (without `linked_actions`/`linked_decisions`).

**Errors:**

| Status | Code | When |
|--------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 403 | `FORBIDDEN` | Viewer cannot update |
| 404 | `NOT_FOUND` | Meeting not found |

---

### 9.5 DELETE /api/v1/meetings/:meetingId

Soft-delete a meeting. Linked actions and decisions are **not** deleted — their `source_id` references become orphaned (source_detail returns null).

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `meetingId` | uuid | Meeting ID |

**Response: `204 No Content`**

**Errors:**

| Status | Code | When |
|--------|------|------|
| 403 | `FORBIDDEN` | Viewer cannot delete |
| 404 | `NOT_FOUND` | Meeting not found |

---

### 9.6 PUT /api/v1/meetings/:meetingId/attendees

Set the attendee list for a meeting. This **replaces** the entire attendee list.

**Authentication:** Required (project `owner`/`admin`/`member`)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `meetingId` | uuid | Meeting ID |

**Request Body:**

```json
{
  "attendees": [
    { "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "role": "chair" },
    { "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "role": "attendee" },
    { "user_id": "c3d4e5f6-a7b8-9012-cdef-123456789012", "role": "presenter" }
  ]
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `attendees` | array | Yes | Array of attendee objects. Send empty array `[]` to clear all attendees |
| `attendees[].user_id` | uuid | Yes | Must be a workspace member |
| `attendees[].role` | string (enum) | Yes | `chair`, `presenter`, `attendee`, `optional` |

**Validation:**
- All `user_id` values must be workspace members.
- Duplicate `user_id` values are not allowed.
- Maximum 1 `chair` per meeting.

**Response: `200 OK`**

```json
{
  "data": {
    "meeting_id": "mtg-990c2844-c63f-75b8-eb5a-880099114455",
    "attendees": [
      {
        "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "full_name": "Jane Smith",
        "avatar_url": "https://example.com/avatars/jane.jpg",
        "role": "chair"
      },
      {
        "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "full_name": "John Doe",
        "avatar_url": null,
        "role": "attendee"
      },
      {
        "user_id": "c3d4e5f6-