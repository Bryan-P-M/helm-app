# Helm — Success Criteria

**Last Updated:** 2026-01-31
**Status:** 📝 Draft — refine with measurable targets

---

## v1 MVP Success Criteria

### Must Achieve (MVP gate)

| # | Criterion | Measure | Target | How to Verify |
|---|----------|---------|--------|---------------|
| SC1 | Core CRUD functional | All RAID, Action, Meeting, Decision endpoints working | 100% of v1-api-contracts.md endpoints pass integration tests | Automated test suite |
| SC2 | Data integrity | RLS policies enforce workspace isolation | Zero cross-workspace data leakage in security test | Supabase RLS test with multi-user scenario |
| SC3 | Demo-ready | Complete walkthrough of Meridian FG scenario | Demo completes in <15 minutes without errors | Live demo run with demo-scenario.md |
| SC4 | Responsive UI | All screens usable on desktop and tablet | All v1-screen-map.md screens render correctly at 1024px and 1440px | Visual regression test |
| SC5 | Authentication working | Sign up, log in, log out, session persistence | User can complete full auth flow without errors | Manual test |

### Should Achieve (quality bar)

| # | Criterion | Measure | Target |
|---|----------|---------|--------|
| SC6 | Page load time | Largest Contentful Paint | < 2.5s on 4G connection |
| SC7 | Audit trail | All CRUD operations logged | 100% of create/update/delete actions in audit_log table |
| SC8 | Filter performance | RAID log with 100+ items | Filter response < 500ms |
| SC9 | Design compliance | 5 design principles (DIS) | All v1 screens pass design-qa review |

### v2 Success Criteria (future)

| # | Criterion | Measure | Target |
|---|----------|---------|--------|
| SC10 | AI extraction accuracy | Action items correctly identified from meeting notes | >80% precision, >70% recall |
| SC11 | User adoption | Active users after 30 days | >60% of invited users return weekly |
| SC12 | Time savings | Governance reporting effort | 50% reduction vs manual process |

---

*Referenced by: [helm-project-brief-v2.md](./helm-project-brief-v2.md)*
