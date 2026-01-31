# Microsoft PPM — Competitive Matrix Entry

**Date:** 2026-01-31
**Author:** Research Agent (Silas/Clawd)
**Status:** Staged for merge into competitive-intelligence.md

---

## Microsoft (Planner / Planner Premium / Project Plans)

**Product landscape (as of Jan 2026):**
- **Microsoft Planner (Basic)** — free with any Microsoft 365 subscription. Task boards, grid/chart views.
- **Planner Plan 1** ($10/user/month) — Premium features: Gantt/timeline, dependencies, milestones, custom fields, critical path, sprints, goals.
- **Planner and Project Plan 3** ($30/user/month) — Adds: advanced dependencies (lead/lag), resource management, financials, roadmaps, portfolios, baselines.
- **Planner and Project Plan 5** ($55/user/month) — Adds: advanced analytics (Power BI), portfolio management, advanced security, audit logging.
- **Microsoft 365 Copilot** ($30/user/month add-on) — Required for all AI features including Copilot in Planner, Project Manager Agent, and Facilitator.

**Product transitions:**
- Project for the Web retired August 2025, merged into Planner. [Source: Microsoft Tech Community](https://techcommunity.microsoft.com/blog/plannerblog/transitioning-to-microsoft-planner-and-retiring-microsoft-project-for-the-web/4410149)
- Project Online retiring September 2026. [Source: Microsoft Tech Community](https://techcommunity.microsoft.com/blog/plannerblog/microsoft-project-online-is-retiring-what-you-need-to-know/4450558)
- Microsoft Project Desktop continues (not retiring).

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | No native RAID framework in Planner or Planner Premium. Project Online (retiring Sept 2026) had risk/issue tracking via PWA, but Planner does not carry this forward natively. Sensei Project Solutions confirms: "Project artifacts, such as issues, risks, and deliverables are not available in Planner." [Source: Sensei Project Solutions](https://www.senseiprojectsolutions.com/resources/microsoft-project-online-end-of-life/). Risks/issues require custom development on the Power Platform (Power Apps + Dataverse). SharePoint Lists can be manually configured as a RAID log. [Source: 365automate.com](https://www.365automate.com/posts/raid-log-sharepoint-online/). Copilot can identify "at-risk tasks" and surface "risks and blockers" in status reports, but as text summaries — not structured risk register entries. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796) |
| 2. Escalation Chains / Workflow | **Partial** | No native escalation chain hierarchy in Planner. Power Automate provides workflow automation. Dynamics Business Process Flows available for governance/approvals via Power Apps, but not included in Planner natively. Sensei confirms: "No native governance workflows inside of Planner." [Source: Sensei Project Solutions](https://www.senseiprojectsolutions.com/resources/microsoft-project-online-end-of-life/) |
| 3. Decision Logging (Audit Trail) | **Partial** | Copilot/Facilitator summarises "key decisions" from meetings as unstructured text in meeting notes — not as first-class decision entities. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6). Platform-level audit logging via Microsoft Purview (requires Purview Audit Premium license, separate from Planner licensing). [Source: Microsoft Purview Audit](https://techcommunity.microsoft.com/blog/projectblog/auditing-capabilities-coming-to-microsoft-project-microsoft-planner-and-microsof/3841229). Task history available in Premium plans. No dedicated decision log entity. |
| 4. P3O Hierarchical Governance | **Partial** | Portfolios feature added (Dec 2024/Jan 2025) — groups related premium plans, tracks progress at portfolio level, provides Roadmap view for cross-plan timeline. [Source: Microsoft Tech Community](https://techcommunity.microsoft.com/blog/plannerblog/manage-multiple-plans-effortlessly-with-the-new-portfolios-feature-in-microsoft-/4342145). However, Portfolios are flat — no native Programme tier between Portfolio and Project. "Lacks hierarchical portfolio management (e.g., epics → features → tasks)" per projectmanager.com review. [Source: ProjectManager.com](https://www.projectmanager.com/blog/microsoft-planner-roadmap). Requires Plan 3 or Plan 5 license. No P3O-aligned governance model. |
| 5. Meeting-to-Action Traceability | **Partial** | **This is Microsoft's closest approach to Helm's core differentiator.** The Facilitator agent (requires M365 Copilot license, $30/user/month) generates real-time AI notes, summarises decisions and open questions, and can create tasks that sync to Planner. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6). The Project Manager Agent can "automatically extract tasks from meeting transcripts" and structure them in Planner with assignees and due dates. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796). **CRITICAL LIMITATION:** The pipeline creates **generic Planner tasks**, not structured RAID entries, decision records, issue logs, or governance artefacts. There is no risk classification, severity/probability scoring, assumption tracking, or decision audit trail. Meeting outputs are task-oriented, not governance-oriented. The Facilitator "summarises key decisions" as freeform text in Loop meeting notes — it does not create first-class decision records with rationale, stakeholders, or audit metadata. [Source: Microsoft Support — Copilot in Meetings](https://support.microsoft.com/en-us/office/use-copilot-in-microsoft-teams-meetings-0bf9dd3c-96f7-44e2-8bb8-790bedf066b1). A third-party blog (nBold) proposes RAID prompt templates for Copilot, but the outputs are conversational text responses, not structured data in any RAID log. [Source: nBold prompt library](https://nboldapp.com/prompt-library-for-microsoft-planner-copilot-status-risks-and-raids-automation/). **Verdict: Meeting→Task exists. Meeting→Governance does not.** |
| 6. Board/Governance Reporting | **Partial** | Portfolio/Roadmap views for high-level progress tracking. Power BI integration for advanced analytics (Plan 5). Status reports via Channel Agent enriched with Planner data (highlighting "progress, risks, and blockers"). [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796). No native governance-specific reporting (board packs, RAG status dashboards, PRINCE2/P3O-style reports, executive governance summaries). Reporting is project/task-oriented, not governance-oriented. |
| 7. AI Features | **Yes** | Extensive and rapidly evolving AI capabilities (all require M365 Copilot license at $30/user/month): (a) **Copilot in Planner (Preview)** — create tasks from natural language, generate project plans, summarise plan progress, identify behind-schedule tasks, workload analysis. [Source: Microsoft Support — Copilot in Planner](https://support.microsoft.com/en-us/office/create-new-tasks-with-copilot-in-planner-preview-8cb4440c-0878-4470-a660-561c00dd4c44). (b) **Project Manager Agent** — create tasks in meetings, extract tasks from transcripts, generate status reports, workback plans, risk assessment prompts. [Source: Microsoft Ignite announcement](https://techcommunity.microsoft.com/blog/plannerblog/unleashing-the-power-of-agents-in-microsoft-planner/4304794). (c) **Facilitator Agent** — real-time meeting notes, decision/question summaries, agenda management, task tracking, document creation from meeting context. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6). (d) **Channel Agent** — create/update tasks in Teams channels, generate status reports with Planner data. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796). (e) **Copilot in Teams meetings** — summarise discussions, suggest action items, answer questions in real-time. Customisable meeting recap templates. [Source: Microsoft 365 Copilot Nov/Dec 2025 update](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/what%E2%80%99s-new-in-microsoft-365-copilot--november--december-2025/4469738). |
| 8. API / Integration Ecosystem | **Yes** | The largest integration ecosystem in the PPM market. Microsoft Graph API for Planner basic plans. Dataverse Web API for Premium plan data. Power Automate with hundreds of connectors. Power BI for analytics. Deep native integration with Teams, SharePoint, Loop, Outlook, OneDrive, Word, Excel. [Source: Microsoft Learn — Planner API](https://learn.microsoft.com/en-us/graph/planner-concept-overview). Note: Graph API for Premium plans has limitations — "The Dataverse schema for Planner Premium is not fully, and simply, documented." [Source: Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5601878/how-can-i-access-planner-premium-data-(dependencie). |
| 9. Pricing Tier | **Published** | Planner Basic: Free (with M365 subscription). Planner Plan 1: $10/user/month (annual). Planner & Project Plan 3: $30/user/month (annual). Planner & Project Plan 5: $55/user/month (annual). Microsoft 365 Copilot: $30/user/month (add-on, required for all AI features). [Source: Microsoft pricing page via Forbes](https://www.forbes.com/advisor/business/software/microsoft-planner-review/), [nBold licensing guide](https://nboldapp.com/planner-premium-licensing-guide-use-project-manager-agent-in-shared-plans/), [Digital Project Manager](https://thedigitalprojectmanager.com/tools/microsoft-project-pricing/). **Effective total for PPM + AI: $40–$85/user/month.** |
| 10. Target Company Size | **All sizes (massive distribution advantage)** | Planner Basic ships to every M365 user globally (>400M paid seats). Plan 1–3 targets SMB to Mid-Market. Plan 5 targets Mid-Market to Enterprise. Microsoft's distribution advantage is unparalleled — the tool is already on every knowledge worker's desktop. |

---

## Summary Matrix Row (for insertion into Section 1.4)

| Vendor | RAID | Escalation | Decision Log | P3O Hierarchy | Meeting→Action | Gov. Reporting | AI | API/Integration | Price Range | Target Size |
|--------|------|------------|--------------|---------------|----------------|----------------|----|----|-------------|-------------|
| **Microsoft (Planner/Project)** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️* | ⚠️ | ✅ | ✅✅ | Free–$55/u/m (+$30 Copilot) | All sizes |

*\*⚠️ with asterisk: Microsoft is the ONLY vendor scoring even Partial on Meeting→Action. Their Facilitator + Project Manager Agent pipeline creates tasks from meetings. But it creates generic tasks, not governance artefacts — no RAID entries, decision records, or audit-quality governance outputs. This is the closest any competitor comes to Helm's planned differentiator, but still falls materially short.*

---

## AI Feature Deep Dive

### Microsoft (Copilot + Agents in Planner)

**Brand:** Microsoft 365 Copilot, Project Manager Agent, Facilitator, Channel Agent

| AI Feature | Status | Details |
|---|---|---|
| Natural language task creation | **Live (Preview)** | Create tasks in Planner via natural language prompts. Copilot available only with Premium plans + Copilot license. [Source: Microsoft Support](https://support.microsoft.com/en-us/office/create-new-tasks-with-copilot-in-planner-preview-8cb4440c-0878-4470-a660-561c00dd4c44) |
| AI project plan generation | **Live (Preview)** | Generate full project plans from goals/descriptions. Includes workback plans with reverse timelines. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796) |
| Meeting transcript → tasks | **Live (Preview)** | Facilitator + Project Manager Agent extract tasks from meeting transcripts and sync to Planner. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796) |
| Real-time meeting notes | **Live** | Facilitator generates AI notes during meetings. Summarises decisions, open questions. Co-authorable in Loop. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6) |
| Meeting recap & summaries | **Live** | Post-meeting Copilot access via Recap tab. Customisable recap templates (Speaker Summary, etc.). [Source: M365 Copilot Nov/Dec 2025 update](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/what%E2%80%99s-new-in-microsoft-365-copilot--november--december-2025/4469738) |
| Plan progress summarisation | **Live (Preview)** | Ask Copilot: "Which tasks are behind?" — identifies late/at-risk tasks. [Source: Microsoft Planner enablement guide](https://enablement.microsoft.com/en-us/guides/professional-project-management-with-microsoft-planner/) |
| Status reports with Planner data | **Public Preview** | Channel Agent generates status reports enriched with Planner data — progress, risks, blockers. Output as Loop file. [Source: Microsoft Ignite Planner blog](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796) |
| Risk identification (prompt-based) | **Partial** | Users can prompt Copilot to assess risks, resource gaps, timeline delays. Conversational output, not structured risk register. [Source: nBold prompt library](https://nboldapp.com/prompt-library-for-microsoft-planner-copilot-status-risks-and-raids-automation/) |
| Document generation from meetings | **Live** | Facilitator creates Word/Loop documents based on meeting discussion topics. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6) |
| Agenda management | **Live** | Facilitator extracts agenda from invite/notes, tracks discussion progress against agenda, manages timers. [Source: Microsoft Support — Facilitator](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6) |

**Comparison to Helm:** Microsoft's AI is the most relevant competitive comparison due to the Facilitator/Project Manager Agent meeting integration. However, the pipeline produces **generic tasks**, not governance artefacts. There is no native path from meeting transcript → structured RAID log entry, decision record with audit metadata, or governance-ready output. Microsoft's AI is task-management-first; Helm's planned AI is governance-first. The gap is narrower than with other PPM vendors, but remains significant for governance-oriented buyers.

---

## Sources

### Microsoft Official
- [Microsoft Planner — Basic vs Premium comparison](https://support.microsoft.com/en-us/office/compare-microsoft-planner-basic-vs-premium-plans-5e351170-4ed5-43dc-bf30-d6762f5a6968)
- [Facilitator in Microsoft Teams meetings](https://support.microsoft.com/en-us/office/facilitator-in-microsoft-teams-meetings-37657f91-39b5-40eb-9421-45141e3ce9f6)
- [Copilot in Microsoft Teams meetings](https://support.microsoft.com/en-us/office/use-copilot-in-microsoft-teams-meetings-0bf9dd3c-96f7-44e2-8bb8-790bedf066b1)
- [The next chapter for AI-powered work management in Microsoft Planner (Ignite 2025)](https://techcommunity.microsoft.com/blog/plannerblog/the-next-chapter-for-ai-powered-work-management-in-microsoft-planner/4469796)
- [Unleashing the power of agents in Microsoft Planner](https://techcommunity.microsoft.com/blog/plannerblog/unleashing-the-power-of-agents-in-microsoft-planner/4304794)
- [Portfolios feature in Microsoft Planner](https://techcommunity.microsoft.com/blog/plannerblog/manage-multiple-plans-effortlessly-with-the-new-portfolios-feature-in-microsoft-/4342145)
- [Transitioning to Planner / retiring Project for the Web](https://techcommunity.microsoft.com/blog/plannerblog/transitioning-to-microsoft-planner-and-retiring-microsoft-project-for-the-web/4410149)
- [Project Online retirement announcement](https://techcommunity.microsoft.com/blog/plannerblog/microsoft-project-online-is-retiring-what-you-need-to-know/4450558)
- [Planner tasks and plans API overview (Microsoft Graph)](https://learn.microsoft.com/en-us/graph/planner-concept-overview)
- [Auditing in Planner/Project/To Do](https://techcommunity.microsoft.com/blog/projectblog/auditing-capabilities-coming-to-microsoft-project-microsoft-planner-and-microsof/3841229)
- [Create new tasks with Copilot in Planner](https://support.microsoft.com/en-us/office/create-new-tasks-with-copilot-in-planner-preview-8cb4440c-0878-4470-a660-561c00dd4c44)
- [What's new in M365 Copilot — Nov/Dec 2025](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/what%E2%80%99s-new-in-microsoft-365-copilot--november--december-2025/4469738)

### Third-Party Analysis
- [Sensei Project Solutions — Project Online End-of-Life options](https://www.senseiprojectsolutions.com/resources/microsoft-project-online-end-of-life/)
- [nBold — Planner Premium Licensing Guide 2025](https://nboldapp.com/planner-premium-licensing-guide-use-project-manager-agent-in-shared-plans/)
- [nBold — Copilot RAID prompt library](https://nboldapp.com/prompt-library-for-microsoft-planner-copilot-status-risks-and-raids-automation/)
- [nBold — How to use Copilot for meeting action items](https://nboldapp.com/how-to-use-microsoft-copilot-for-meeting-action-items/)
- [ProjectManager.com — Microsoft Planner Roadmap review](https://www.projectmanager.com/blog/microsoft-planner-roadmap)
- [Forbes — Microsoft Planner Review 2025](https://www.forbes.com/advisor/business/software/microsoft-planner-review/)
- [Digital Project Manager — Microsoft Project Pricing](https://thedigitalprojectmanager.com/tools/microsoft-project-pricing/)
- [365automate — RAID log in SharePoint/Teams](https://www.365automate.com/posts/raid-log-sharepoint-online/)
- [TheProjectGroup — MS Project for the Web Becoming Planner](https://www.theprojectgroup.com/blog/en/project-for-the-web-becoming-planner/)
- [Microsoft Q&A — Planner Premium API access](https://learn.microsoft.com/en-us/answers/questions/5601878/how-can-i-access-planner-premium-data-(dependencie)
- [FutureSavvy — Copilot meeting summary accuracy caveat](https://www.futuresavvy.co.uk/tips-tricks/step-by-step-guide-automating-teams-meeting-summaries-with-copilot)

---

*Document generated 2026-01-31. Feature data reflects publicly available information as of January 2026. Many Copilot/Agent features are in Preview and subject to change. Pricing reflects published Microsoft rates.*
