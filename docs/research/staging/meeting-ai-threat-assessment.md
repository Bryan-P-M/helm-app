# Standalone Meeting AI Tools — Threat Assessment for Helm

**Date:** 2026-01-31
**Author:** Research Agent (Silas/Clawd)
**Status:** Staged research output
**Subjects:** Otter.ai, Fireflies.ai, Fathom

---

## Executive Summary

**Risk Level: LOW**

Otter.ai, Fireflies.ai, and Fathom are the three dominant standalone AI meeting assistants. All three have the transcript data that Helm needs, and all three can create tasks in project management tools. However, none of them produce — or are architecturally positioned to produce — structured governance artefacts. Their output is **meeting → task**, not **meeting → governance record**. Their business models, product roadmaps, and customer bases are oriented toward meeting productivity and sales enablement, not PMO governance. The gap between "extract action items" and "classify RAID entries with approval routing" is measured in years of domain-specific product development, not a simple feature addition.

---

## 1. Current Integration Capabilities

### What They Integrate With

| Tool | PM/PPM Integrations | CRM Integrations | Other Notable |
|------|---------------------|-------------------|---------------|
| **Otter.ai** | Asana, Jira (Atlassian), ClickUp, Monday.com, Airtable | Salesforce, HubSpot, Microsoft Dynamics, Zoho | Notion, Slack, Zapier, Public API, MCP Server |
| **Fireflies.ai** | Asana, Jira, Linear, Any.do, Microsoft To Do, Airtable | Salesforce, HubSpot, Pipedrive, Affinity, Redtail, Wealthbox | Confluence, SharePoint, Slack, Notion, Zapier, 60+ total |
| **Fathom** | Asana | Salesforce, HubSpot | Slack, Zapier, Relay.app, Public API |

[Sources: [Otter.ai Integrations](https://otter.ai/integrations), [Fireflies.ai Integrations](https://fireflies.ai/integrations), [Fathom Integrations](https://www.fathom.ai/integrations)]

### What Exactly Gets Created

This is the critical question. All three tools create the same thing: **generic tasks or issues containing meeting action items**. None create typed governance entities.

**Otter.ai → Asana/Jira:**
- AI extracts action items from transcript and auto-assigns to meeting participants. [Source: [Otter Action Items](https://otter.ai/blog/otter-ai-new-feature-my-action-items)]
- Each action item includes a link back to the transcript moment for context.
- Output: A flat task with description text and an assignee. No priority classification, no entity type, no governance metadata.
- "Otter consolidates and shows action items that have been assigned to you across all conversations." [Source: [Otter Help Centre](https://help.otter.ai/hc/en-us/articles/25983095114519-Action-Items-Overview)]

**Fireflies.ai → Asana/Jira:**
- AI identifies action items and automatically creates tasks/issues in connected project. [Source: [Fireflies Asana Guide](https://guide.fireflies.ai/articles/1901313269-how-to-integrate-asana-with-fireflies)]
- Supports voice commands: say "create a task for…" during meeting to trigger task creation. [Source: [Fireflies Voice Commands](https://guide.fireflies.ai/articles/2235152965-How+to+Use+Voice+Commands+to+Create+Tasks+in+Asana+and+Other+Tools)]
- Topic Tracker can trigger task creation when specific keywords are mentioned. [Source: [Fireflies Topic Tracker](https://fireflies.ai/blog/fireflies-topic-tracker/)]
- Jira integration: "Fireflies identifies action items and automatically generates Jira issues" with "meeting details, timestamps, and links within Jira issues." [Source: [Fireflies Jira Integration](https://fireflies.ai/integrations/project-management/jira)]
- Output: A task/issue with description and meeting link. Customisable issue types (bug, task, feature) in Jira — but the classification is pre-configured, not AI-inferred from governance context.

**Fathom → Asana:**
- "Turn Fathom action items into trackable Asana tasks in one click." [Source: [Fathom Integrations](https://www.fathom.ai/integrations)]
- CRM sync to HubSpot/Salesforce: "automatically syncs meeting summaries, action items, and deal insights." [Source: [Fathom HubSpot](https://www.fathom.ai/integrations/hubspot)]
- Output: Action items as Asana tasks, CRM field updates. Sales-oriented, not governance-oriented.

### The Integration Gap

**None of these tools create:**
- ❌ Risk register entries with severity/probability/impact scoring
- ❌ Decision records with rationale, stakeholders, approval status, or audit trail
- ❌ Issue log entries with escalation metadata
- ❌ Assumption records with validation status
- ❌ Any typed governance entity linked to a project, programme, or portfolio hierarchy
- ❌ Any artefact with approval routing or workflow state

The output in every case is an untyped task with freeform text. This is meeting-to-task, not meeting-to-governance.

---

## 2. Pricing and Target Market

### Pricing Comparison

| Tool | Free | Mid-Tier | Business/Enterprise | Target Buyer |
|------|------|----------|---------------------|-------------|
| **Otter.ai** | 300 min/month | Pro: $8–$17/user/month | Business: $20–$30/user/month; Enterprise: custom | Knowledge workers, sales teams, recruiters |
| **Fireflies.ai** | 800 min storage | Pro: $10/user/month | Business: $19/user/month; Enterprise: $39/user/month | Sales, CS, HR, marketing teams |
| **Fathom** | Unlimited recordings (5 premium/month) | Premium: $20/user/month | Team: $18/user/month; Business: $28/user/month | Sales teams, individual professionals |

[Sources: [Otter Pricing](https://otter.ai/pricing), [Fireflies Pricing](https://fireflies.ai/pricing), [Fathom Pricing](https://www.fathom.ai/pricing), [G2 Fireflies](https://www.g2.com/products/fireflies-ai/pricing), [tl;dv on Otter pricing](https://tldv.io/blog/otter-pricing/)]

### Scale and Traction

| Tool | ARR/Revenue | Users | Funding | Valuation |
|------|------------|-------|---------|-----------|
| **Otter.ai** | $100M+ ARR (Dec 2025) | 35M+ users | Early backers of Google, DeepMind, Zoom | Implied >$1B |
| **Fireflies.ai** | $10.9M revenue (2024) | 20M+ users, 500K+ orgs | Khosla Ventures, Canaan Partners | $1B (Jun 2025 tender) |
| **Fathom** | Not disclosed (90x growth in 2 years) | Not disclosed | $17M Series A (Sep 2024) | Not disclosed |

[Sources: [Otter $100M ARR](https://otter.ai/blog/otter-ai-caps-transformational-2025-with-100m-arr-milestone-industry-first-ai-meeting-agents-and-global-enterprise-expansion), [Fireflies $1B valuation](https://fireflies.ai/blog/fireflies-1-billion-valuation/), [Fathom Series A — TechCrunch](https://techcrunch.com/2024/09/19/ai-notetaker-fathom-raises-17m/), [Getlatka Fireflies revenue](https://getlatka.com/companies/firefliesai)]

### Who Are They Selling To?

All three tools are selling to **general knowledge workers and sales teams** — not PMOs, not governance professionals, not P3O offices.

**Otter.ai's product evolution** has been: transcription → meeting notes → sales agent → SDR agent → corporate knowledge base. Their October 2025 enterprise suite focused on public API, MCP server, HIPAA compliance, and custom meeting templates. [Source: [Otter Enterprise Suite](https://otter.ai/blog/having-generated-1-billion-annual-roi-for-customers-otter-ai-aims-for-complete-meeting-transformation-by-launching-next-gen-enterprise-suite)] CEO Sam Liang's stated vision: "the definitive corporate knowledge base." Not governance. Not PMO. Knowledge base.

**Fireflies.ai's product evolution** has been: transcription → conversation intelligence → topic tracking → "Talk to Fireflies" (real-time web search via Perplexity partnership). Their conversation intelligence offers speaker analytics, sentiment analysis, and custom topic tracking — useful for sales coaching, not governance classification. [Source: [Fireflies Conversation Intelligence](https://guide.fireflies.ai/articles/2608597716-fireflies-conversation-intelligence)]

**Fathom's product evolution** has been: free transcription → CRM sync → coaching metrics → AI scorecards → deal view. Their entire Business tier ($28/user/month) is oriented around "CRM field sync, Deal View summarizing insights across calls, Coaching metrics and AI scorecards for maximizing call efficacy." [Source: [Fathom Pricing](https://www.fathom.ai/pricing)] This is a sales performance tool, not a governance tool.

---

## 3. Technical Barriers to Adding Governance Classification

For any of these tools to become a genuine threat to Helm's meeting-to-governance traceability, they would need to build:

### 3.1 A Governance Data Model (Effort: HIGH)

**What they'd need:**
- RAID entity types (Risk, Assumption, Issue, Dependency) as first-class objects with typed fields (severity, probability, impact, owner, mitigation plan, review date)
- Decision records as first-class entities (rationale, stakeholders, date, approval status, version history)
- Entity relationships: risk → project, decision → programme, issue → escalation path
- Portfolio → Programme → Project hierarchy (P3O structure)

**Why it's hard:** These tools have a single output entity: the task. Their entire data model is meeting → transcript → summary + action items. Building a governance data model requires deep PMO domain expertise that doesn't exist in organisations focused on meeting productivity. This is not an AI problem — it's a domain modelling problem.

### 3.2 Classification AI (Effort: MEDIUM)

**What they'd need:**
- NLP/LLM pipeline to classify meeting utterances as risks, decisions, issues, assumptions, or plain actions
- Confidence scoring and human-in-the-loop review for governance-grade accuracy
- Context awareness: "we need to think about GDPR" is a risk; "let's move the deadline" is a decision; "the API is down" is an issue

**Why it's partially addressable:** All three have the transcript data and AI capabilities. Fireflies' Topic Tracker already demonstrates keyword-based classification. [Source: [Fireflies Topic Tracker](https://fireflies.ai/blog/fireflies-topic-tracker/)] The step from "track mentions of keyword X" to "classify governance entity type" is achievable with modern LLMs. However, the classification alone is worthless without the governance data model to receive it.

### 3.3 Governance Workflows (Effort: HIGH)

**What they'd need:**
- Approval routing for decisions (draft → review → approved → communicated)
- Risk escalation workflows (project risk → programme risk → portfolio risk)
- Issue triage and assignment with SLA tracking
- Audit trail with version history, timestamp, and actor
- Role-based access: who can approve a decision vs. who can log one

**Why it's hard:** Workflow engines are complex to build and require deep understanding of organisational governance processes. These vary by industry, regulatory environment, and maturity level. None of these companies have any experience building workflow systems — they build media processing and NLP pipelines.

### 3.4 Governance Reporting (Effort: HIGH)

**What they'd need:**
- Board-ready governance packs from structured data
- Risk heatmaps, decision logs, issue trend analysis
- P3O escalation views (project → programme → portfolio)
- Compliance dashboards (FCA, DORA, ISO 27001)
- Export formats suitable for regulatory audit

**Why it's hard:** This requires understanding what boards and regulators actually want to see. It's not a data visualisation problem — it's a domain expertise problem. None of these tools have any reporting beyond basic meeting analytics (talk time, sentiment, topic frequency).

### Total Build Estimate

| Component | Effort | Timeline |
|-----------|--------|----------|
| Governance data model | HIGH | 6–12 months |
| Classification AI | MEDIUM | 3–6 months |
| Governance workflows | HIGH | 9–18 months |
| Governance reporting | HIGH | 6–12 months |
| PMO domain expertise hiring | HIGH | 6–12 months |
| **Total (with parallel execution)** | **VERY HIGH** | **18–36 months** |

And this assumes they *want* to build it — which brings us to the strategic question.

---

## 4. Time-to-Threat Estimate

### Product Trajectory Analysis

**Otter.ai** is moving toward being a "corporate knowledge base" and agentic AI platform. Their October 2025 enterprise suite and December 2025 year-end announcement emphasise knowledge search, AI agents, and API/MCP connectivity. [Source: [Otter 2025 Milestones](https://otter.ai/blog/otter-ai-caps-transformational-2025-with-100m-arr-milestone-industry-first-ai-meeting-agents-and-global-enterprise-expansion)] The direction is horizontal platform expansion, not vertical governance depth. Their CEO explicitly positioned Otter as different from "general tools like ChatGPT" by being "purpose-built for meeting productivity." [Source: [Otter Enterprise Suite Launch](https://otter.ai/blog/having-generated-1-billion-annual-roi-for-customers-otter-ai-aims-for-complete-meeting-transformation-by-launching-next-gen-enterprise-suite)]

**Fireflies.ai** is moving toward conversation intelligence, agentic meeting participation ("Talk to Fireflies"), and sales enablement. Their partnership with Perplexity for real-time web search and their focus on "voice-activated AI meeting companion" signals investment in meeting experience, not post-meeting governance. [Source: [Fireflies $1B Announcement](https://fireflies.ai/blog/fireflies-1-billion-valuation/)]

**Fathom** is moving toward sales performance — coaching metrics, AI scorecards, deal view. Their October 2025 feature expansion added Asana integration and customisable summary formats, not governance entities. [Source: [Fathom Feature Expansion — BusinessWire](https://www.businesswire.com/news/home/20251008689349/en/Fathom-Expands-with-New-Features-Designed-to-Extract-Maximum-Value-From-Every-Conversation)]

### Roadmap Signals for Governance: Zero

Across all three vendors:
- ❌ No mention of RAID, risk register, or issue log in any product announcement, blog post, or feature roadmap
- ❌ No mention of decision records as first-class entities
- ❌ No mention of P3O, PMO, governance, or compliance in positioning
- ❌ No integration with PPM tools (Planview, Clarity, Planisware) — only lightweight PM tools (Asana, Jira, Monday)
- ❌ No hiring signals for PMO domain expertise (checked LinkedIn job listings for all three)

### Time-to-Threat

**If they decided today to build governance features:**
- 18–36 months to build a credible governance layer
- Requires hiring PPM domain experts (they have none)
- Requires fundamental data model changes (not incremental)
- Requires new go-to-market for a completely different buyer persona (PMO director vs. sales manager)

**Probability they decide to build it:** Very low. All three are succeeding with meeting productivity and sales enablement. The PMO governance market is a fraction of the size of the general meeting productivity market. Building governance features would distract from their core growth trajectory.

---

## 5. Risk Level Assessment

### Overall Risk: LOW

| Factor | Risk Level | Rationale |
|--------|-----------|-----------|
| Transcript data advantage | **MEDIUM** | They have the raw material (transcripts) that Helm also needs. If Helm is slow to market, these vendors could theoretically pivot. But having data ≠ having the domain model to structure it. |
| Integration reach | **LOW** | Their integrations are with PM tools (Asana, Jira) not PPM tools (Planview, Clarity). They create tasks, not governance artefacts. The integration architecture would need fundamental redesign. |
| Feature overlap | **LOW** | Action item extraction is table stakes. Helm's differentiator is governance *classification* and *structured records*, which none of these tools attempt. |
| Business model alignment | **VERY LOW** | All three are optimised for meeting productivity and sales enablement. PMO governance is a different market, different buyer, different sales motion, different pricing model. Pivoting would be irrational. |
| AI investment | **MEDIUM** | All three are investing heavily in AI. But the AI is aimed at summarisation, search, and agentic meeting participation — not governance classification. |
| Acquisition risk | **MEDIUM** | A PPM vendor (Planview, Broadcom/Clarity) could acquire one of these tools to bolt on meeting intelligence. This would be the most credible threat path. See monitoring section. |
| Market positioning | **LOW** | None position as governance tools. None target PMOs. None mention RAID, compliance, or audit trails in marketing materials. |

### Why LOW and Not MEDIUM

The Microsoft assessment was rated MEDIUM-HIGH because Microsoft already has a PPM tool (Planner), a meeting pipeline (Facilitator + PMA), enterprise distribution (400M seats), and the resources to build governance features. Meeting AI tools have *none* of these advantages:

1. **No PPM tool.** They'd need to build one from scratch or partner deeply with one.
2. **No governance data model.** Their entire architecture is transcript → summary → tasks. Adding governance requires a new data layer.
3. **No PMO buyer relationships.** Their customers are sales managers and team leads, not PMO directors.
4. **No business incentive.** Governance is a niche within a niche. Otter just hit $100M ARR on meeting productivity. Why chase a £43–53M UK SAM?
5. **Different DNA.** These are media/AI companies, not enterprise software companies. Building governance workflows is enterprise software work.

### The One Scenario That Elevates Risk

**Acquisition:** If a PPM vendor acquires Otter, Fireflies, or Fathom and integrates the transcript intelligence into their governance data model, the combined entity would be a credible threat. This is the scenario to monitor.

**Partnership:** If Otter's Public API or MCP Server is used by a PPM vendor to consume transcript data and produce governance artefacts, this achieves a similar result without acquisition. Otter has explicitly positioned its API for this use case: "meeting data connects to any system, including niche CRMs and proprietary systems, unlocking advanced AI meeting agent workflows." [Source: [Otter Enterprise Suite](https://otter.ai/blog/having-generated-1-billion-annual-roi-for-customers-otter-ai-aims-for-complete-meeting-transformation-by-launching-next-gen-enterprise-suite)]

---

## 6. Strategic Implications for Helm

### Helm's Advantage

Helm should view these tools as **potential data sources, not competitors**. The ideal architecture:

1. **Consume their transcripts.** Helm should be able to ingest meeting transcripts from Otter, Fireflies, Fathom (or any source) via API or email forwarding.
2. **Add the governance layer.** Helm's AI classifies transcript content into RAID entries, decision records, and action items — the layer these tools don't provide.
3. **Coexist, don't compete.** The pitch: "Keep Otter/Fireflies for meeting notes. Add Helm for governance."

This is the same strategic logic as the Microsoft assessment: complement the meeting capture tool, own the governance extraction pipeline.

### Immediate Actions

1. **Build transcript ingestion from all three.** Otter has a Public API and MCP Server. Fireflies has Zapier and a webhook system. Fathom has a Public API. Helm should consume transcripts from any source.
2. **Don't build a meeting bot.** Competing with Otter/Fireflies on meeting transcription would be irrational. Their transcription quality, platform support, and scale are years ahead. Use their output as input.
3. **Position governance as the missing layer.** Marketing: "Your meeting AI captures what was said. Helm captures what it *means* for your projects."

### Long-Term Monitoring

- **Watch Otter's API/MCP ecosystem.** If PPM vendors start building on Otter's API, the transcript → governance pipeline could emerge outside Helm. Monitor Otter's partner announcements.
- **Watch acquisition activity.** If Planview, Broadcom, or ServiceNow acquires a meeting AI tool, reassess immediately. Rating would escalate to MEDIUM-HIGH.
- **Watch for "governance" language.** If any of these tools starts mentioning risk registers, decision records, or compliance in their marketing, the threat clock starts.

---

## Sources

All claims in this document are cited inline. Key sources:

- [Otter.ai Integrations](https://otter.ai/integrations)
- [Otter.ai Pricing](https://otter.ai/pricing)
- [Otter.ai Action Items Feature](https://otter.ai/blog/otter-ai-new-feature-my-action-items)
- [Otter.ai Help Centre — Action Items Overview](https://help.otter.ai/hc/en-us/articles/25983095114519-Action-Items-Overview)
- [Otter.ai Enterprise Suite Launch (Oct 2025)](https://otter.ai/blog/having-generated-1-billion-annual-roi-for-customers-otter-ai-aims-for-complete-meeting-transformation-by-launching-next-gen-enterprise-suite)
- [Otter.ai $100M ARR Milestone (Dec 2025)](https://otter.ai/blog/otter-ai-caps-transformational-2025-with-100m-arr-milestone-industry-first-ai-meeting-agents-and-global-enterprise-expansion)
- [Otter.ai — ITPro interview on agentic features](https://www.itpro.com/technology/artificial-intelligence/otter-ai-wants-to-bring-agents-to-third-party-systems)
- [Fireflies.ai Integrations](https://fireflies.ai/integrations)
- [Fireflies.ai Project Management Integrations](https://fireflies.ai/integrations/project-management)
- [Fireflies.ai Pricing (via G2)](https://www.g2.com/products/fireflies-ai/pricing)
- [Fireflies.ai Asana Integration Guide](https://guide.fireflies.ai/articles/1901313269-how-to-integrate-asana-with-fireflies)
- [Fireflies.ai Jira Integration](https://fireflies.ai/integrations/project-management/jira)
- [Fireflies.ai Topic Tracker](https://fireflies.ai/blog/fireflies-topic-tracker/)
- [Fireflies.ai Conversation Intelligence](https://guide.fireflies.ai/articles/2608597716-fireflies-conversation-intelligence)
- [Fireflies.ai $1B Valuation (Jun 2025)](https://fireflies.ai/blog/fireflies-1-billion-valuation/)
- [Fireflies.ai Revenue — Getlatka](https://getlatka.com/companies/firefliesai)
- [Fathom Integrations](https://www.fathom.ai/integrations)
- [Fathom Pricing](https://www.fathom.ai/pricing)
- [Fathom Series A — TechCrunch](https://techcrunch.com/2024/09/19/ai-notetaker-fathom-raises-17m/)
- [Fathom Feature Expansion (Oct 2025) — BusinessWire](https://www.businesswire.com/news/home/20251008689349/en/Fathom-Expands-with-New-Features-Designed-to-Extract-Maximum-Value-From-Every-Conversation)
- [Fathom Asana Integration — Asana Marketplace](https://asana.com/apps/fathom-ai)
- [Fathom HubSpot Integration](https://www.fathom.ai/integrations/hubspot)
- [Otter.ai Pricing Analysis — tl;dv](https://tldv.io/blog/otter-pricing/)
- [Fireflies.ai Pricing Analysis — AFFiNE](https://affine.pro/blog/fireflies-ai-pricing-tips)

---

*Document generated 2026-01-31. All capabilities and pricing verified against January 2026 public sources. Meeting AI tools are evolving rapidly — this assessment should be reviewed quarterly. The primary escalation trigger is acquisition of any of these tools by a PPM vendor.*
