# Helm Brainstorming Session Agenda

## Purpose

Structured agenda for reviewing Helm project gaps and exploring how to apply Boris Cherny's 13 techniques for AI-assisted development.

---

# Part 1: Helm Gaps Review

## 1.1 Data Model Decisions

**Questions to Discuss:**
- What entities do we need beyond the basics (Workspace, Project, Task, Meeting)?
- How should task inheritance work? (fields cascade from parent?)
- Soft delete vs hard delete?
- Multi-tenancy: shared database with tenant ID or separate schemas?

**Reference:** [data-model.md](./data-model.md)

---

## 1.2 Tech Stack Finalization

**PostgreSQL vs Supabase:**
- Supabase pros: Auth built-in, real-time, hosted, Row Level Security
- Supabase cons: Vendor lock-in, less control, cost at scale
- Pure PostgreSQL pros: Full control, any host, mature tooling
- Pure PostgreSQL cons: Build auth ourselves, more ops work

**Decision needed:**
- [ ] Which database approach?
- [ ] ORM choice (Prisma, Drizzle, raw SQL)?
- [ ] Hosting decision (self-host vs managed)?

---

## 1.3 API Design Approach

**Questions to Discuss:**
- REST vs GraphQL vs tRPC?
- Versioning strategy?
- Pagination approach (cursor vs offset)?
- Error response format?
- OpenAPI spec?

**Reference:** [api-spec.md](./api-spec.md)

---

## 1.4 Demo Scenario Requirements

**Questions to Discuss:**
- When is the IOM Gov demo?
- What's the minimum feature set needed?
- Do we need a dedicated demo environment?
- Pre-populated data strategy?
- Fallback plan if live demo fails?

**Reference:** [demo-scenario.md](./demo-scenario.md)

---

## 1.5 Deployment Strategy

**Questions to Discuss:**
- Where are we deploying? (Vercel, Fly.io, AWS, self-host?)
- CI/CD pipeline tooling?
- Environment management (dev/staging/prod)?
- Secrets management?
- Monitoring/logging stack?

**Reference:** [deployment.md](./deployment.md)

---

# Part 2: Boris Cherny's AI Development Techniques

For each technique, discuss:
1. How does this apply to Helm development?
2. What would we need to set up?
3. Priority: implement now vs later?

---

## 2.1 Running Multiple Claude Instances (5+ Parallel)

**Technique:** Run 5+ Claude instances in parallel on different parts of the codebase.

**Discussion:**
- How does this apply to Helm development?
  - Split by feature area (auth, tasks, meetings, AI)?
  - Split by layer (frontend, backend, database)?
  - One instance per doc/spec?

- What would we need to set up?
  - Multiple terminal sessions/workspaces
  - Clear boundaries between work areas
  - Merge/conflict resolution process

- Priority: implement now vs later?
  - [ ] Now - we have distinct features to parallelize
  - [ ] Later - project not big enough yet
  - [ ] Never - doesn't fit our workflow

---

## 2.2 Model Selection (Opus 4.5 + Thinking Mode)

**Technique:** Use Claude's strongest model with thinking mode for complex work.

**Discussion:**
- How does this apply to Helm development?
  - Architecture decisions
  - Complex debugging
  - Security reviews
  - Prompt engineering for AI features

- What would we need to set up?
  - Sonnet for routine tasks, Opus for complex
  - When to enable extended thinking
  - Cost monitoring

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later
  - [ ] Already doing this

---

## 2.3 CLAUDE.md Team Knowledge Base

**Technique:** Maintain a CLAUDE.md with project context, conventions, and decisions.

**Discussion:**
- How does this apply to Helm development?
  - Document architecture decisions
  - Coding conventions
  - File structure explanation
  - Common commands

- What would we need to set up?
  - Create `/helm-app/CLAUDE.md`
  - Keep it updated as decisions are made
  - Include links to spec docs

- Priority: implement now vs later?
  - [ ] Now - essential for context
  - [ ] Later
  - [ ] Already have something similar

---

## 2.4 Plan Mode as Default (Shift+Tab Twice)

**Technique:** Use plan mode to think before acting; only switch to act mode when plan is solid.

**Discussion:**
- How does this apply to Helm development?
  - Architecture planning before coding
  - Breaking down features into steps
  - Reviewing approach before implementation

- What would we need to set up?
  - Habit/workflow change
  - Template for planning output

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later
  - [ ] Already doing this

---

## 2.5 Slash Commands for Recurring Tasks

**Technique:** Create `/commands` for repetitive workflows.

**Discussion:**
- How does this apply to Helm development?
  - `/create-component` - scaffold new React component
  - `/create-endpoint` - scaffold API endpoint
  - `/run-tests` - run test suite with context
  - `/deploy-staging` - deployment workflow

- What would we need to set up?
  - Identify repetitive tasks
  - Create command definitions
  - Test and refine

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later - identify patterns first
  - [ ] Not needed

---

## 2.6 Sub-Agents as Tasks Not Personas

**Technique:** Spawn sub-agents for specific tasks, not as role-playing personas.

**Discussion:**
- How does this apply to Helm development?
  - "Write tests for this module"
  - "Research best practices for X"
  - "Review this PR for security issues"
  - NOT: "You are a senior developer..."

- What would we need to set up?
  - Clear task definitions
  - Output format expectations
  - Handoff protocol

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later
  - [ ] Already doing this

---

## 2.7 PostToolUse Hooks for Finishing Work

**Technique:** Use hooks to automatically run linting, tests, etc. after tool use.

**Discussion:**
- How does this apply to Helm development?
  - Auto-lint after file edits
  - Auto-format on save
  - Run related tests after changes
  - Type-check after edits

- What would we need to set up?
  - Configure PostToolUse hooks
  - Set up linting/formatting tools
  - Test runner integration

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later - after tooling is set up
  - [ ] Not needed

---

## 2.8 Permission Whitelisting (/permissions)

**Technique:** Whitelist safe operations to reduce confirmation prompts.

**Discussion:**
- How does this apply to Helm development?
  - Allow file writes in `/helm-app/`
  - Allow npm/pnpm commands
  - Allow git operations
  - Block destructive commands

- What would we need to set up?
  - Define permission whitelist
  - Test safety boundaries

- Priority: implement now vs later?
  - [ ] Now - reduce friction
  - [ ] Later
  - [ ] Keep confirmations for safety

---

## 2.9 Tool Integration (Slack, Monitoring, etc.)

**Technique:** Connect Claude to external tools for broader context and actions.

**Discussion:**
- How does this apply to Helm development?
  - GitHub integration (PRs, issues)
  - Slack for team communication?
  - Error monitoring (Sentry?)
  - Analytics dashboard?

- What would we need to set up?
  - API integrations
  - Authentication
  - Usage patterns

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later - after core features
  - [ ] Not needed for this project

---

## 2.10 Automating Extended Tasks (Loop Plugins)

**Technique:** Use loop plugins for long-running, multi-step tasks.

**Discussion:**
- How does this apply to Helm development?
  - Large refactoring tasks
  - Comprehensive test writing
  - Documentation generation
  - Code migration

- What would we need to set up?
  - Loop plugin configuration
  - Task breakdown templates
  - Progress tracking

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later
  - [ ] Not needed

---

## 2.11 Feedback Loops (2-3x Quality Improvement)

**Technique:** Implement feedback loops where Claude reviews and improves its own output.

**Discussion:**
- How does this apply to Helm development?
  - Code review pass after writing
  - Test coverage check
  - Security audit pass
  - Documentation completeness check

- What would we need to set up?
  - Review prompts/checklists
  - Quality criteria definition
  - Iteration limits

- Priority: implement now vs later?
  - [ ] Now
  - [ ] Later
  - [ ] For critical features only

---

# Action Items from Session

| Decision | Owner | Due |
|----------|-------|-----|
| TBD | TBD | TBD |
| TBD | TBD | TBD |
| TBD | TBD | TBD |

---

# Next Steps

- [ ] TBD
- [ ] TBD
- [ ] TBD
