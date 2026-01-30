# Helm MVP v1 — PERT Estimate (Fleet-Accelerated)
**Prepared:** 30 January 2026
**Method:** PERT — (Optimistic + 4×Most Likely + Pessimistic) / 6
**Assumptions:** Full agent fleet, AI-assisted coding, Bry directing/reviewing

---

## Individual Feature PERT Estimates

| # | Feature | O (hrs) | M (hrs) | P (hrs) | **PERT (hrs)** | σ (hrs) |
|---|---------|---------|---------|---------|----------------|---------|
| 1 | Auth + Users | 1.0 | 2.0 | 4.0 | **2.2** | 0.50 |
| 2 | Workspace + Projects | 2.0 | 3.0 | 6.0 | **3.3** | 0.67 |
| 3 | RAID Log (full CRUD) | 4.0 | 6.0 | 10.0 | **6.3** | 1.00 |
| 4 | Actions Tracker | 3.0 | 4.0 | 7.0 | **4.3** | 0.67 |
| 5 | Dashboard | 2.0 | 3.0 | 6.0 | **3.3** | 0.67 |
| 6 | Nav + Layout | 2.0 | 3.0 | 5.0 | **3.2** | 0.50 |
| 7 | Meeting Hub | 2.0 | 4.0 | 7.0 | **4.2** | 0.83 |
| 8 | Decisions Log | 1.0 | 2.0 | 4.0 | **2.2** | 0.50 |
| | **Total (serial)** | | | | **29.0** | |

## Overhead Tasks

| Task | O | M | P | **PERT** | σ |
|------|---|---|---|----------|---|
| Scaffolding + CI/CD | 1.0 | 1.5 | 3.0 | **1.7** | 0.33 |
| Integration testing | 2.0 | 4.0 | 8.0 | **4.3** | 1.00 |
| Bug fixing (from QA) | 2.0 | 4.0 | 8.0 | **4.3** | 1.00 |
| Demo prep + polish | 1.0 | 2.5 | 4.0 | **2.5** | 0.50 |
| **Total overhead** | | | | **12.8** | |

## Total Effort: ~42h (serial) — but we're not going serial.

---

## Critical Path — Fleet Parallelisation

### Phase 0: Foundation (Day 1 AM)
Sequential — everything depends on this.

```
Scaffolding (1.7h) → Nav + Layout (3.2h) + Auth (2.2h parallel)
```
**Phase time: ~4.5h** (scaffold, then nav+auth in parallel with shared agent)

### Phase 1: Data Layer (Day 1 PM)
Depends on Phase 0.

```
Workspace + Projects (3.3h)
```
**Phase time: ~3.3h**

### Phase 2: Features (Day 2) — FULL PARALLEL
4 agents, 4 features, simultaneously. Critical path = longest task.

```
Agent 1: RAID Log .............. 6.3h  ← CRITICAL PATH
Agent 2: Actions Tracker ....... 4.3h
Agent 3: Meeting Hub ........... 4.2h
Agent 4: Decisions Log ......... 2.2h
```
**Phase time: ~6.3h** (bounded by RAID Log)

### Phase 3: Integration (Day 3 AM)
Depends on Phase 2.

```
Dashboard (3.3h) — needs data from all Phase 2 features
```
**Phase time: ~3.3h**

### Phase 4: QA + Polish (Day 3 PM → Day 4)
```
Integration testing (4.3h) → Bug fixing (4.3h) → Demo prep (2.5h)
```
**Phase time: ~11.1h** (partially parallelisable: 2 QA agents)
**Compressed: ~8h** with parallel QA agents

---

## Critical Path Summary

| Phase | Duration | Cumulative | Calendar |
|-------|----------|------------|----------|
| 0: Foundation | 4.5h | 4.5h | Day 1 AM |
| 1: Data Layer | 3.3h | 7.8h | Day 1 PM |
| 2: Features (parallel) | 6.3h | 14.1h | Day 2 |
| 3: Dashboard | 3.3h | 17.4h | Day 3 AM |
| 4: QA + Polish | 8.0h | 25.4h | Day 3 PM → Day 4 |
| **TOTAL CRITICAL PATH** | | **25.4h** | |

---

## PERT Confidence Intervals

**Critical path σ (combined):**
σ_cp = √(0.33² + 0.50² + 0.67² + 1.00² + 0.67² + 1.00² + 1.00² + 0.50²)
σ_cp = √(0.11 + 0.25 + 0.45 + 1.00 + 0.45 + 1.00 + 1.00 + 0.25)
σ_cp = √4.51 = **2.1h**

| Confidence | Range | At 10h/day |
|------------|-------|------------|
| 50% (expected) | 25.4h | **~3 days** |
| 68% (+1σ) | 27.5h | ~3 days |
| 85% (+1.5σ) | 28.6h | 3–4 days |
| 95% (+2σ) | 29.6h | **~4 days** |
| 99% (+3σ) | 31.7h | 4 days |

---

## Bottom Line

| Scenario | Calendar Days | Confidence |
|----------|---------------|------------|
| **Aggressive** | 3 days | 50% |
| **Target** | 4 days | 95% |
| **Worst case** | 5 days | 99%+ |

**Assumes:** 10h working days, tech stack confirmed, 4 parallel agents, Bry available for review/direction.

---

## Key Risks to Timeline

1. **Tech stack decision not yet confirmed** — adds 0.5–1 day if there's deliberation
2. **Agent coordination overhead** — merge conflicts, integration gaps between parallel features
3. **Supabase schema changes mid-build** — ripple effects across agents
4. **Bry as bottleneck** — review/approval queues between phases
5. **Scope creep** — "while we're at it" additions during build

## Mitigations

1. Confirm tech stack TODAY (15 min decision)
2. Shared schema/types repo that all agents reference
3. Integration checkpoints between phases (not just at the end)
4. Bry reviews in batches, not per-commit
5. Hard cut-line — anything not on the v1 list goes to v2, no exceptions
