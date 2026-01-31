# Helm Documentation Index

This is the documentation root for the Helm project. Documents are grouped by category with a recommended reading order.

**Status key:** ✅ Approved | 📝 Draft | 📦 Archived

---

## Foundation (Read First)

Start here. These documents define what Helm is, who it's for, and the design principles that govern every specification.

| Document | Description | Status |
|----------|-------------|--------|
| [helm-project-brief-v2.md](helm-project-brief-v2.md) | Project brief and vision | ✅ Approved |
| [objectives.md](objectives.md) | Problem statement and objectives | ✅ Approved |
| [personas.md](personas.md) | User personas (6 defined) | ✅ Approved |
| [design-intelligence-spec.md](design-intelligence-spec.md) | The 5 design principles (P1-Traceable → P5-Risk-aware) | ✅ Approved |

> **⚠️ design-intelligence-spec.md is the foundational design document.** All specifications implement these five principles. Read it before reviewing any v1 spec.

---

## V1 Specifications

The source of truth for builders. These define exactly what gets built in MVP v1.

| Document | Description | Status |
|----------|-------------|--------|
| [v1-database-schema.md](v1-database-schema.md) | PostgreSQL schema — 12 tables, 34 RLS policies, 5 audit triggers, 67 indexes | ✅ Approved |
| [v1-api-contracts.md](v1-api-contracts.md) | REST API contracts — all endpoints | ✅ Approved |
| [v1-screen-map.md](v1-screen-map.md) | UI screens and navigation tree | ✅ Approved |
| [auth-spec.md](auth-spec.md) | Authentication and authorisation spec | ✅ Approved |
| [nfrs.md](nfrs.md) | Non-functional requirements | ✅ Approved |

---

## Planning

Scope, budget, effort estimation, and delivery planning.

| Document | Description | Status |
|----------|-------------|--------|
| [mvp-scope.md](mvp-scope.md) | Full MVP scope definition | ✅ Approved |
| [mvp-cutline.md](mvp-cutline.md) | v1 vs v2 boundary — what's in, what's deferred | ✅ Approved |
| [mvp-budget-cashflow.md](mvp-budget-cashflow.md) | Budget and cashflow projection | ✅ Approved |
| [pert-estimate.md](pert-estimate.md) | Effort estimation (PERT method) | ✅ Approved |
| [fleet-allocation.md](fleet-allocation.md) | Agent allocation for build | 📝 Draft |
| [deployment.md](deployment.md) | Deployment plan | ✅ Approved |
| [demo-scenario.md](demo-scenario.md) | Demo walkthrough scenario | ✅ Approved |

---

## Research

Market validation and survey methodology.

| Document | Description | Status |
|----------|-------------|--------|
| [research/market-validation-and-metagpt-analysis.md](research/market-validation-and-metagpt-analysis.md) | Market research and competitive analysis | ✅ Approved |
| [research/linkedin-survey-plan.md](research/linkedin-survey-plan.md) | LinkedIn survey methodology | 📝 Draft |

---

## Visualisations

Interactive HTML documents — open in a browser.

| Document | Description | Status |
|----------|-------------|--------|
| [product-map.html](product-map.html) | Interactive product map | ✅ Approved |
| [v1-architecture-map.html](v1-architecture-map.html) | Architecture visualisation | ✅ Approved |

---

## Archive

Superseded or early-draft documents. Retained for reference only — do not build from these.

| Document | Description | Status |
|----------|-------------|--------|
| [archive/api-spec.md](archive/api-spec.md) | Early API draft — superseded by [v1-api-contracts.md](v1-api-contracts.md) | 📦 Archived |
| [archive/data-model.md](archive/data-model.md) | Early data model draft — superseded by [v1-database-schema.md](v1-database-schema.md) | 📦 Archived |

---

## QA Reports

Quality assurance outputs are in [../qa-reports/](../qa-reports/).
