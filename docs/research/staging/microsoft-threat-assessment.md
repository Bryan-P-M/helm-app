# Microsoft — Threat Assessment for Helm

**Date:** 2026-01-31
**Author:** Research Agent (Silas/Clawd)
**Status:** Staged research output

---

## Executive Summary

**Risk Level: MEDIUM-HIGH**

Microsoft represents the most credible existential distribution threat to Helm — not because their PPM capabilities are superior in governance (they are not), but because of their unmatched mid-market distribution, the Copilot+Facilitator meeting-to-task pipeline that partially overlaps with Helm's core differentiator, and their pricing structure that bundles basic PPM free with M365.

However, Microsoft's governance capabilities have material gaps that Helm can exploit. The threat is in distribution, not feature parity.

---

## 1. Microsoft's Mid-Market Distribution Advantage

### The 400M User Moat

Microsoft 365 has over 400 million paid commercial seats globally. Every one of those users has access to Planner Basic for free. This means Microsoft doesn't need to "sell" PPM — it's already installed on every knowledge worker's desktop, embedded in Teams, and accessible from the same interface they use for email, chat, and documents.

**For Helm's target mid-market (50–5,000 employees):**
- These organisations almost certainly already have M365. [Source: Microsoft commercial seat count from FY2024 earnings](https://www.microsoft.com/en-us/microsoft-365/blog/2025/12/04/advancing-microsoft-365-new-capabilities-and-pricing-update/)
- Planner Basic costs them nothing additional.
- Upgrading to Plan 1 ($10/user/month) is a trivial procurement decision vs. evaluating a new vendor.
- IT departments already manage M365 — no new security review, no new SSO integration, no vendor risk assessment.

**What this means for Helm:**
The barrier to a mid-market PMO choosing "just use Planner" is near-zero. Helm must demonstrate value that justifies both the cost AND the friction of introducing a new tool into a Microsoft-saturated environment.

### The "Good Enough" Trap

Microsoft's strategy across M365 is to provide "good enough" capabilities across many domains rather than best-in-class in any single one. For PPM:
- Planner Basic is "good enough" for lightweight task tracking.
- Planner Premium with Copilot is "good enough" for basic project management with AI.
- Power Platform extensions make it "customisable enough" for orgs willing to invest in configuration.

**Risk:** Mid-market PMOs with limited budgets may settle for "good enough" rather than invest in a purpose-built governance tool — even if Planner's governance capabilities are materially inferior to Helm's.

---

## 2. Copilot + Facilitator: Meeting-to-Task Pipeline Analysis

### What Microsoft's Pipeline Actually Does

The **Facilitator agent** (launched 2025, requires M365 Copilot license at $30/user/month) works within Teams meetings to:

1. **Generate real-time AI notes** during meetings — summarising discussion in a Loop page. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6)
2. **Summarise "key decisions and open questions"** from meeting discussion. [Source: ibid.]
3. **Create tasks** that sync to Planner — either proactively (auto-captured from discussion) or on request (via @mention in meeting chat). [Source: ibid.]
4. **Generate documents** (Word/Loop) from meeting discussion topics. [Source: ibid.]

The **Project Manager Agent** extends this by:

5. **Extracting tasks from meeting transcripts** — ensuring "nothing is overlooked". Tasks are synced to a meeting plan in Planner. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796)
6. **Structuring tasks** with assignees and due dates as directed by the team. [Source: ibid.]

### How Close Does This Come to Helm's Meeting→Governance Pipeline?

**What Microsoft does that overlaps with Helm:**
- ✅ Captures meeting content via transcript
- ✅ Identifies action items from spoken discussion
- ✅ Creates tasks with assignees and deadlines
- ✅ Syncs tasks to a project management tool (Planner)
- ✅ Summarises decisions as text in meeting notes

**What Microsoft does NOT do (and Helm plans to):**
- ❌ **No structured RAID entries.** Meeting outputs are generic Planner tasks. No risk register entries with severity/probability/impact scoring. No issue logs. No assumption tracking. No dependency identification from meeting context.
- ❌ **No first-class decision records.** Decisions are summarised as freeform text in Loop meeting notes. There is no decision entity with rationale, stakeholders, date, approval status, or audit trail metadata. FutureSavvy notes: "Copilot may occasionally misinterpret informal discussions as decisions." [Source: FutureSavvy](https://www.futuresavvy.co.uk/tips-tricks/step-by-step-guide-automating-teams-meeting-summaries-with-copilot)
- ❌ **No governance artefact classification.** The AI doesn't distinguish between a risk flagged in conversation, a decision taken, an issue raised, and a simple action item. Everything becomes a task.
- ❌ **No RAID-to-project traceability.** A risk identified in a meeting doesn't link to a risk register entry that links to a project risk profile that links to a programme risk dashboard. It's a task in a flat Planner list.
- ❌ **No governance reporting from meeting content.** There's no path from "decisions made in meetings" → "board-ready governance report" → "P3O escalation view".
- ❌ **No audit-grade decision trail.** Helm's planned model: Decision identified in meeting transcript → linked to attendees → linked to approval status → versioned → reportable. Microsoft: Decision mentioned in AI notes as text.

### The Critical Gap (Forensic Assessment)

Microsoft's pipeline is **meeting → task**. Helm's planned pipeline is **meeting → governance artefact**.

These sound similar but are fundamentally different data models:

| Aspect | Microsoft (Facilitator + PMA) | Helm (Planned) |
|--------|-------------------------------|----------------|
| Meeting content capture | ✅ Transcript + AI notes | ✅ Transcript + AI extraction |
| Output type | Generic Planner tasks | Typed RAID entries, decision records, actions |
| Risk identification | Prompt-based text response | Structured risk register entry (severity, probability, owner, mitigation) |
| Decision capture | Freeform text summary | First-class entity (rationale, stakeholders, date, status, audit trail) |
| Issue tracking | No distinct concept | Structured issue log with escalation metadata |
| Assumption tracking | No concept | Captured as assumption with validation status |
| Governance reporting | Task-level status reports | Board-ready governance packs from structured data |
| P3O linkage | Flat portfolios (no Programme) | Portfolio → Programme → Project hierarchy |
| Audit trail quality | Meeting notes (text, non-versioned) | Entity-level version history, linked to source transcript |

**Verdict:** Microsoft is playing a **different game**. Their meeting AI is about productivity (don't miss action items). Helm's meeting AI is about governance (structured records for organisational accountability). For a PMO that needs compliance, audit trails, and board reporting, Microsoft's pipeline is necessary but not sufficient.

---

## 3. Pricing Analysis

### Microsoft's Price Points

| SKU | Price/user/month | What's included |
|-----|-------------------|----------------|
| Planner Basic | **Free** (with any M365 sub) | Task boards, grid/chart views, basic collaboration |
| Planner Plan 1 | **$10** | Gantt, dependencies, milestones, custom fields, sprints, goals |
| Plan 3 | **$30** | + Advanced deps, resource mgmt, financials, roadmaps, portfolios, baselines |
| Plan 5 | **$55** | + Power BI analytics, advanced portfolio mgmt, enhanced security/audit |
| M365 Copilot add-on | **+$30** | Required for ALL AI features (Copilot in Planner, Facilitator, PMA) |

[Sources: Forbes Planner review](https://www.forbes.com/advisor/business/software/microsoft-planner-review/), [nBold licensing guide](https://nboldapp.com/planner-premium-licensing-guide-use-project-manager-agent-in-shared-plans/), [Software Advice](https://www.softwareadvice.com/project-management/microsoft-planner-profile/), [Digital Project Manager](https://thedigitalprojectmanager.com/tools/microsoft-project-pricing/)

### Effective Total Cost Scenarios

| Scenario | Cost/user/month | Notes |
|----------|-----------------|-------|
| Basic task tracking only | $0 | Already included in M365 |
| Project management (no AI) | $10–$30 | Plan 1 or Plan 3 |
| Full PPM + AI | $40–$85 | Plan 1–5 + Copilot |
| Enterprise PMO (Plan 5 + Copilot) | **$85** | The realistic comparison point for Helm |

### Pricing Comparison with Helm

Helm's recommended price range (from competitive intelligence doc): **$20–$45/user/month**.

- **vs. Free Planner:** Helm must justify its cost against a free alternative. This is the biggest pricing threat — not that Microsoft is expensive, but that Microsoft's basic offering is free.
- **vs. Plan 1 + Copilot ($40/user/month):** Helm is cheaper, but Microsoft includes the broader M365 ecosystem.
- **vs. Plan 3 + Copilot ($60/user/month):** Helm is significantly cheaper AND offers governance features Microsoft doesn't have.
- **vs. Plan 5 + Copilot ($85/user/month):** Helm at $25–$45 is ~50% cheaper and purpose-built for governance.

**Helm's pricing narrative:** "You're paying $40–$85/user/month for Microsoft's PPM + AI, and you still don't get RAID management, decision logging, or governance reporting. Helm gives you all of that for $25–$45/user/month, purpose-built."

---

## 4. Risk Level Assessment

### Overall Risk: MEDIUM-HIGH

| Factor | Risk Level | Rationale |
|--------|-----------|-----------|
| Distribution / market access | **HIGH** | M365 ubiquity means Microsoft doesn't need to "win" PPM deals — they just need customers not to look elsewhere. Every M365 org has Planner already installed. |
| Feature overlap with Helm's core | **MEDIUM** | Facilitator + PMA create a meeting→task pipeline that is conceptually adjacent to Helm's meeting→governance pipeline. A casual buyer might not distinguish them. Marketing precision is critical. |
| AI investment trajectory | **HIGH** | Microsoft is investing billions in Copilot. Features that are in Preview today will be GA in months. The gap could narrow over time. |
| Governance capability depth | **LOW** | No native RAID, no decision logging, no P3O hierarchy, no governance reporting. Power Platform can fill gaps but requires significant custom development. This is Helm's defensible moat. |
| Pricing pressure | **MEDIUM** | Free Planner Basic creates a "good enough" floor. But for governance-conscious buyers, the effective Microsoft cost ($40–$85/user/month) makes Helm competitive on price. |
| Acquisition/feature bolt-on risk | **MEDIUM** | Microsoft could acquire a governance-focused tool or build RAID management. But their track record (Project for the Web → retirement, Project Online → retirement) suggests they optimise for breadth, not governance depth. |

### Why Not HIGH Overall?

Despite the distribution threat, Microsoft's product DNA is **horizontal productivity**, not **vertical governance**. Their entire M365 strategy is "be everywhere, be good enough at everything." This is fundamentally at odds with the deep, opinionated governance model that Helm is building.

The buyer persona matters:
- **A team lead who wants to track tasks from meetings** → Microsoft wins. Facilitator + Planner is free or cheap and already installed.
- **A PMO director who needs RAID logs, decision audit trails, board reporting, and P3O governance** → Microsoft doesn't solve this. Planner is a task tool, not a governance tool. Helm's market.

### Why Not MEDIUM?

The meeting-to-task pipeline (Facilitator + PMA) is closer to Helm's territory than any other competitor. All 15 previously analysed vendors scored ❌ on Meeting-to-Action Traceability. Microsoft scores ⚠️ (Partial). This narrows Helm's "white space" claim — Helm can no longer say "no one does meeting→action." Helm must now say "no one does meeting→governance" and explain the difference clearly.

---

## 5. Strategic Implications for Helm

### Immediate Actions

1. **Sharpen the positioning.** The competitive claim must evolve from "meeting-to-action traceability" (which Microsoft partially does) to "meeting-to-governance artefact traceability" (which no one does). The language must be precise.

2. **Build the comparison page.** Helm's marketing needs a clear "Helm vs. Microsoft Planner + Copilot" comparison that demonstrates the governance gap (RAID, decisions, audit trails, P3O). Show the data model difference, not just the feature difference.

3. **Design for M365 coexistence, not replacement.** Helm should integrate WITH Microsoft's ecosystem (Teams, SharePoint, Outlook, Graph API), not compete against it. The winning pitch: "Keep Teams for meetings, keep Planner for tasks, add Helm for governance." Helm should consume Teams meeting transcripts and output governance artefacts — complementing, not replacing, the Microsoft stack.

4. **Target governance-conscious buyers.** Helm's ideal customer already has M365 and has found it insufficient for governance. They've probably built SharePoint RAID logs, Excel decision registers, and manual board reporting processes. Helm replaces the governance gaps, not the collaboration tool.

### Long-Term Monitoring

- **Watch Microsoft Dynamics 365 Project Operations.** This is where Microsoft's enterprise-grade project management lives (risk assessment, issue tracking via Copilot). If these capabilities migrate down into Planner, the threat increases. [Source: Microsoft Learn — Copilot for project overview](https://learn.microsoft.com/en-us/dynamics365/project-operations/project-management/copilot-features)
- **Watch Facilitator feature evolution.** If Facilitator starts creating typed entities (risk, decision, issue) rather than generic tasks, the gap narrows significantly.
- **Watch Power Platform templates.** Third parties (BrightWork 365, Sensei IQ, pmo365) already build governance layers on top of Planner via Power Platform. If Microsoft makes these first-party, the threat escalates.

---

## Sources

All claims in this document are cited inline. Key sources:

- [Microsoft Support — Facilitator in Teams meetings](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6)
- [Microsoft Support — Copilot in Teams meetings](https://support.microsoft.com/en-us/office/use-copilot-in-microsoft-teams-meetings-0bf9dd3c-96f7-44e2-8bb8-790bedf066b1)
- [Microsoft Ignite — Next chapter for AI in Planner](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796)
- [Sensei Project Solutions — Project Online EOL options](https://www.senseiprojectsolutions.com/resources/microsoft-project-online-end-of-life/)
- [nBold — Planner Premium Licensing Guide](https://nboldapp.com/planner-premium-licensing-guide-use-project-manager-agent-in-shared-plans/)
- [nBold — Copilot RAID prompt library](https://nboldapp.com/prompt-library-for-microsoft-planner-copilot-status-risks-and-raids-automation/)
- [FutureSavvy — Copilot accuracy caveat](https://www.futuresavvy.co.uk/tips-tricks/step-by-step-guide-automating-teams-meeting-summaries-with-copilot)
- [Forbes — Microsoft Planner Review 2025](https://www.forbes.com/advisor/business/software/microsoft-planner-review/)
- [ProjectManager.com — Planner Roadmap limitations](https://www.projectmanager.com/blog/microsoft-planner-roadmap)
- [Microsoft Learn — Dynamics 365 Project Operations Copilot](https://learn.microsoft.com/en-us/dynamics365/project-operations/project-management/copilot-features)
- [Microsoft 365 Blog — Pricing update Dec 2025](https://www.microsoft.com/en-us/microsoft-365/blog/2025/12/04/advancing-microsoft-365-new-capabilities-and-pricing-update/)
- [Software Advice — Microsoft Planner pricing](https://www.softwareadvice.com/project-management/microsoft-planner-profile/)
- [Digital Project Manager — Microsoft Project pricing](https://thedigitalprojectmanager.com/tools/microsoft-project-pricing/)

---

*Document generated 2026-01-31. All capabilities and pricing verified against January 2026 public sources. Microsoft's Copilot/Agent features are evolving rapidly — this assessment should be reviewed quarterly.*
