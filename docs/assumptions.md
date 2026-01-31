# Helm — Assumptions Register

**Last Updated:** 2026-01-31
**Status:** 📝 Living document — update as assumptions are validated or invalidated

---

## Active Assumptions

| # | Assumption | Impact if Wrong | Validation Plan | Status |
|---|-----------|----------------|-----------------|--------|
| A1 | PMO/programme managers will pay for a governance-specific tool rather than using Excel/ServiceNow | Product has no market | Market validation survey (see research/linkedin-survey-plan.md) | ⏳ Unvalidated |
| A2 | Supabase free tier is sufficient for MVP demo and early users | Need to upgrade or migrate before demo | Monitor usage during development | ✅ Validated (deployed, working) |
| A3 | Next.js + Vercel is the right stack for rapid MVP delivery | Rewrite cost if wrong | Scaffold deployed, team familiar with React | ✅ Validated |
| A4 | Manual RAID/Action entry (v1) provides enough value without AI extraction (v2) | Users won't adopt without AI differentiator | Demo feedback from target personas | ⏳ Unvalidated |
| A5 | Isle of Man financial services sector has enough demand for initial customer base | Need to target wider market sooner | Networking, LinkedIn outreach | ⏳ Unvalidated |
| A6 | Single-workspace model is sufficient for v1 (multi-tenancy in v2) | Enterprise customers blocked | Persona analysis suggests single-workspace covers 80% of use cases | ✅ Accepted |
| A7 | 54-72 hour build estimate (PERT) is achievable with AI-assisted development | Timeline slips, demo delayed | Track velocity against PERT estimate | ⏳ In progress |

## Invalidated Assumptions

| # | Original Assumption | When Invalidated | What Changed |
|---|-------------------|-----------------|--------------|
| — | *(none yet)* | | |

---

*Referenced by: [helm-project-brief-v2.md](./helm-project-brief-v2.md)*
