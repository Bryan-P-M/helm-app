# Authentication & Authorization Specification

## Purpose

Define the RBAC (Role-Based Access Control) permission model, authentication flows, and security requirements for Helm.

---

## Authentication

### Authentication Method
- TBD: Session-based vs JWT
- TBD: Token storage (cookies vs localStorage)
- TBD: Token expiration policy

### Login Flow
- TBD: Username/password
- TBD: OAuth providers (if any)
- TBD: MFA requirements (if any)

### Session Management
- TBD: Session duration
- TBD: Refresh mechanism
- TBD: Concurrent session policy

---

## Authorization Model

### RBAC Overview
- TBD: Role hierarchy
- TBD: Permission inheritance model
- TBD: Default roles

---

## Role Definitions

### System-Level Roles

#### Super Admin
- TBD: Permissions list
- TBD: Use cases

#### Regular User
- TBD: Base permissions

### Workspace-Level Roles

#### Workspace Owner
- TBD: Full control over workspace
- TBD: Member management
- TBD: Billing (if applicable)

#### Workspace Admin
- TBD: Admin permissions
- TBD: What they can't do (vs Owner)

#### Workspace Member
- TBD: Standard member permissions

#### Workspace Guest
- TBD: Limited access
- TBD: Use cases (external stakeholders)

### Project-Level Roles

#### Project Lead
- TBD: Full project control
- TBD: Task management
- TBD: Team assignment

#### Project Member
- TBD: Task interaction
- TBD: What they can create/edit

#### Project Viewer
- TBD: Read-only access
- TBD: Comment permissions?

---

## Permission Matrix

### Workspace Permissions

| Action | Owner | Admin | Member | Guest |
|--------|-------|-------|--------|-------|
| View workspace | TBD | TBD | TBD | TBD |
| Edit workspace | TBD | TBD | TBD | TBD |
| Delete workspace | TBD | TBD | TBD | TBD |
| Invite members | TBD | TBD | TBD | TBD |
| Remove members | TBD | TBD | TBD | TBD |
| Create projects | TBD | TBD | TBD | TBD |

### Project Permissions

| Action | Lead | Member | Viewer |
|--------|------|--------|--------|
| View project | TBD | TBD | TBD |
| Edit project | TBD | TBD | TBD |
| Delete project | TBD | TBD | TBD |
| Create tasks | TBD | TBD | TBD |
| Assign tasks | TBD | TBD | TBD |
| Create meetings | TBD | TBD | TBD |

### Task Permissions

| Action | Creator | Assignee | Project Member |
|--------|---------|----------|----------------|
| View task | TBD | TBD | TBD |
| Edit task | TBD | TBD | TBD |
| Delete task | TBD | TBD | TBD |
| Change status | TBD | TBD | TBD |
| Add comments | TBD | TBD | TBD |

---

## Permission Inheritance

### Hierarchy
```
Workspace
  └── Project
        └── Task
```

- TBD: How workspace roles cascade to projects
- TBD: Override vs inherit model
- TBD: Explicit vs implicit permissions

→ See: [data-model.md](./data-model.md) for entity relationships

---

## API Security

### Authentication Headers
- TBD: Header format
- TBD: Token validation

### Authorization Checks
- TBD: Middleware approach
- TBD: Resource-level checks
- TBD: Error responses (403 vs 404)

→ See: [api-spec.md](./api-spec.md)

---

## Security Requirements

### Password Policy
- TBD: Minimum requirements
- TBD: Hashing algorithm

### Rate Limiting
- TBD: Login attempt limits
- TBD: API rate limits

### Audit Logging
- TBD: What to log
- TBD: Retention policy

---

## IOM Gov Compliance

- TBD: Specific compliance requirements
- TBD: Data residency needs
- TBD: Audit requirements

---

## Related Documents

- [Data Model](./data-model.md) - User and role entities
- [API Spec](./api-spec.md) - Auth endpoints
- [Deployment](./deployment.md) - Security configuration
