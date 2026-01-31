# Helm — Competitive Intelligence: PPM Software Market

**Date:** 2026-01-31  
**Author:** Research Agent (Silas/Clawd)  
**Version:** 1.0  
**Status:** Initial Research Complete  

---

## Executive Summary

The PPM (Project Portfolio Management) market is mature at the enterprise tier (Planview, ServiceNow SPM, Broadcom Clarity, Planisware) and crowded at the mid-market tier (Monday.com, Smartsheet, Asana, Celoxis, Completix). AI is the primary battleground in 2025–2026, with every vendor racing to embed generative AI features. However, **no vendor currently offers an integrated meeting-extraction → action items → RAID integration pipeline** — the core of Helm's planned AI differentiator.

Key findings:
- **RAID management** is strongest in traditional enterprise PPM tools (Planview, Clarity, Celoxis, Completix) and weakest in product-management-oriented tools (Productboard, Aha!).
- **P3O hierarchical governance** (Portfolio → Programme → Project) is only natively supported by 4–5 vendors. Most mid-market tools lack programme-level constructs entirely.
- **Meeting-to-action traceability** is a significant gap across the entire market. No PPM vendor natively extracts meeting content into structured governance artefacts.
- **Decision logging with audit trail** is partial in most tools — decisions are captured ad hoc, not as first-class entities.
- **AI features** are converging on: summarisation, risk prediction, resource optimisation, and content generation. Agentic AI (Planisware "Oscar", Asana "AI Teammates", Monday "Digital Workforce") is the 2025 frontier.

---

## Table of Contents

1. [Competitive Feature Matrix](#1-competitive-feature-matrix)
2. [AI Feature Deep Dive (Top 6)](#2-ai-feature-deep-dive-top-6)
3. [Pricing Verification](#3-pricing-verification)
4. [Helm Positioning & Gap Analysis](#4-helm-positioning--gap-analysis)
5. [Sources](#5-sources)

---

## 1. Competitive Feature Matrix

### Scoring Key
- **Yes** = Native, out-of-box capability
- **Partial** = Available with configuration, workarounds, or add-ons
- **No** = Not available or requires third-party tool
- Notes in parentheses for context

---

### 1.1 Enterprise Tier

#### Planview (PPM Pro / AdaptiveWork)

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Risk registers, issue tracking, dependency mapping. Risks/issues tracked at project level with severity, probability, impact scoring. [Source: Planview PPM Pro features — demoprise.com](https://www.demoprise.com/products/planview-ppm-pro/features), [TrustRadius reviews](https://www.trustradius.com/products/planview-ppm-pro/reviews) |
| 2. Escalation Chains / Workflow | **Yes** | Configurable approval workflows, stage-gate processes, automated escalation rules. [Source: Planview solution page](https://www.planview.com/products-solutions/solutions/project-portfolio-management/) |
| 3. Decision Logging (Audit Trail) | **Partial** | Audit trail exists for changes; decisions are not first-class entities — captured via custom fields or notes. No dedicated decision log. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio → Programme → Project hierarchy native. Named a Leader in 2025 Gartner MQ for APMR. [Source: Planview website, Gartner recognition](https://info.planview.com/gartner-adaptive-pm-reporting-mq-_report_prm_en_reg.html) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting capture or transcript → action item pipeline. Actions created manually. |
| 6. Board/Governance Reporting | **Yes** | Executive dashboards, portfolio-level reporting, customisable governance reports. [Source: Planview PPM page](https://www.planview.com/products-solutions/solutions/project-portfolio-management/) |
| 7. AI Features | **Yes** | Planview Anvi (formerly Copilot): risk detection & alerts, sentiment analysis, content enhancement, performance anomaly detection, NLP-based conversational insights, custom agents. [Source: Planview AI page](https://www.planview.com/ai/) |
| 8. API / Integration Ecosystem | **Yes** | REST APIs, 150+ integrations including Jira, ServiceNow, Azure DevOps, Salesforce. [Source: Planview integrations](https://www.planview.com/products-solutions/solutions/project-portfolio-management/) |
| 9. Pricing Tier | **Enterprise (custom quote)** | Estimated $19–$25/user/month for large orgs (100+ users). Not publicly listed. [Source: SelectHub, ITQlick](https://www.selecthub.com/p/ppm-software/planview/) |
| 10. Target Company Size | **Large Enterprise** | 1,000+ employees, complex multi-portfolio environments |

#### ServiceNow SPM (Strategic Portfolio Management)

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Built-in risk management, issue tracking. Integrates with ServiceNow ITSM for dependency tracking. [Source: ServiceNow SPM page](https://www.servicenow.com/products/strategic-portfolio-management.html), [Cyntexa guide](https://cyntexa.com/blog/servicenow-strategic-portfolio-management-spm-everything-you-need-to-know/) |
| 2. Escalation Chains / Workflow | **Yes** | ServiceNow platform strength — advanced workflow engine, approval chains, SLA-based escalations. |
| 3. Decision Logging (Audit Trail) | **Yes** | Platform-level audit trail on all records. Decision records can be configured via custom tables. ServiceNow's audit infrastructure is enterprise-grade. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio → Programme → Project supported. Demand → Project → Resource lifecycle. Named a Leader in Forrester SPM evaluation (2024). [Source: BusinessWire](https://www.businesswire.com/news/home/20240605936420/en/ServiceNow-Named-a-Leader-in-Strategic-Portfolio-Management-Tools-Evaluation) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting extraction. Actions created manually or via integration with meeting tools. |
| 6. Board/Governance Reporting | **Yes** | Performance Analytics, configurable dashboards, real-time portfolio reporting. |
| 7. AI Features | **Yes** | Now Assist for SPM: summarise feedback/docs, generate user stories, project summaries, autonomous task monitoring, enhanced record creation, conversational demand creation, identify similar demands. [Source: ServiceNow Store](https://store.servicenow.com/store/app/5449a7ae1be06a50a85b16db234bcbb2), [Q2 2025 release](https://www.servicenow.com/community/spm-blog/strategic-portfolio-management-q2-2025-store-release-accelerate/ba-p/3264099) |
| 8. API / Integration Ecosystem | **Yes** | Massive ecosystem — IntegrationHub, REST/SOAP APIs, 1,000+ spoke integrations. Deepest ITSM integration of any PPM. |
| 9. Pricing Tier | **Enterprise (custom quote)** | SPM module pricing is part of ServiceNow platform licensing. Estimates: $100–$200/fulfiller/month (platform), SPM add-on varies. Total deals often $250K–$1M+/year. [Source: Rezolve.ai, HiverHQ](https://www.rezolve.ai/blog/servicenow-pricing-guide-custom-quotes-for-tailored-it-solutions) |
| 10. Target Company Size | **Large Enterprise** | 5,000+ employees, existing ServiceNow customers |

#### Broadcom Clarity PPM

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Risk registers, issue management, dependency tracking built-in. Strong financial risk modelling. [Source: Broadcom Clarity page](https://valueops.broadcom.com/products/clarity), [PeerSpot reviews](https://www.peerspot.com/products/broadcom-clarity-reviews) |
| 2. Escalation Chains / Workflow | **Yes** | Configurable processes and workflows. Stage-gate governance. |
| 3. Decision Logging (Audit Trail) | **Partial** | Audit trail on records. No dedicated decision entity — configured via custom objects. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio → Programme → Project. Investment hierarchy. FedRAMP authorised (only PPM with this). [Source: Broadcom FedRAMP page](https://www.broadcom.com/info/clarity-ppm/project-portfolio-management-federal-government) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting integration. |
| 6. Board/Governance Reporting | **Yes** | Portfolio analytics, executive dashboards, configurable reports. |
| 7. AI Features | **Partial** | Clarity for AI Strategy — manages AI project portfolios. Limited native AI assistive features compared to competitors. Focus is on ROI demonstration and technology governance. [Source: Broadcom ValueOps](https://valueops.broadcom.com/products/clarity) |
| 8. API / Integration Ecosystem | **Yes** | REST APIs, integrations with Jira, Rally, ServiceNow. Part of Broadcom ValueOps ecosystem. |
| 9. Pricing Tier | **Enterprise (varies)** | Estimated $29–$60/user/month depending on role (Team Member vs Enterprise). [Source: PricingNow, SelectHub](https://pricingnow.com/question/clarity-ppm-cost/) |
| 10. Target Company Size | **Large Enterprise / Government** | 2,000+ employees, regulated industries, government agencies |

#### Planisware

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Comprehensive risk assessment with Monte Carlo simulation. AI-powered risk scoring. Dependencies and issues native. [Source: Planisware AI page](https://planisware.com/artificial-intelligence) |
| 2. Escalation Chains / Workflow | **Yes** | Stage-gate processes, configurable workflows, approval chains. |
| 3. Decision Logging (Audit Trail) | **Partial** | Audit trail on data changes. Decisions not a first-class entity. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio → Programme → Project. Strong in R&D-heavy industries (pharma, aerospace). Leader in 2024 Gartner MQ for APMR (3rd consecutive year). [Source: Planisware Gartner page](https://planisware.com/gartner-2024-leader-magic-quadrant-adaptive-project-management-reporting) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting extraction. |
| 6. Board/Governance Reporting | **Yes** | Executive dashboards, portfolio analytics, scenario comparison reporting. |
| 7. AI Features | **Yes (Industry-leading)** | Most advanced AI in PPM space: (a) Assistive AI — RAG-based help, (b) Generative AI — auto-generate WBS, schedules, risk assessments, (c) AI Agents ("Oscar") — orchestration agent, forecasting, risk scoring, scheduling agents, zero-code agent builder, (d) Swarm Intelligence (PSO) — resource optimisation, (e) Predictive AI — ML-based outcome forecasting, (f) Data anomaly detection, (g) Machine learning for cost/duration prediction. AI features since 2016. [Source: Planisware AI page](https://planisware.com/artificial-intelligence) |
| 8. API / Integration Ecosystem | **Yes** | REST APIs, integrations with Jira, SAP, Oracle, Azure DevOps. |
| 9. Pricing Tier | **Enterprise (custom quote)** | Estimated $30–$50/user/month (1,000+ users: $30–$40). [Source: ITQlick](https://www.itqlick.com/planisware/pricing) |
| 10. Target Company Size | **Large Enterprise** | 1,000+ employees, R&D-intensive industries (pharma, automotive, aerospace) |

---

### 1.2 Mid-Market Tier

#### Smartsheet

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | Risk tracking via custom sheets/columns. No native RAID framework — requires template configuration. Issues tracked as tasks. |
| 2. Escalation Chains / Workflow | **Partial** | Automation rules for notifications and approvals. No native escalation chain hierarchy. |
| 3. Decision Logging (Audit Trail) | **Partial** | Cell-level change history (Activity Log). No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Partial** | New Portfolios feature (2025) provides portfolio-level views. No native Programme tier. [Source: Smartsheet Forward 2025](https://www.smartsheet.com/content-center/product-news/product-releases/smartsheet-forward-november-18-2025) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting capture. |
| 6. Board/Governance Reporting | **Yes** | Dashboards, automated reports, executive views. Charts from sheet data. |
| 7. AI Features | **Yes** | AI formula generation, data analysis/charts from natural language, text summarisation, suggested descriptions, AI-powered project setup. Integrations with Amazon Q, Glean, Atlassian Rovo, Microsoft Copilot. [Source: Smartsheet AI features page](https://www.smartsheet.com/platform/features/ai) |
| 8. API / Integration Ecosystem | **Yes** | REST API, 100+ integrations, Zapier, connectors for Jira, Salesforce, Teams, Slack. |
| 9. Pricing Tier | **Published** | Pro: $9/member/month (annual), Business: $19/member/month (annual), Enterprise: custom pricing. [Source: Smartsheet pricing page](https://www.smartsheet.com/pricing) |
| 10. Target Company Size | **Mid-market to Enterprise** | 50–10,000+ employees |

#### Monday.com

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | Risk management via AI Power-up (flags potential delays). Issues/dependencies tracked as board items. No formal RAID log structure. |
| 2. Escalation Chains / Workflow | **Partial** | Automation recipes for notifications/assignments. No native hierarchical escalation. |
| 3. Decision Logging (Audit Trail) | **Partial** | Activity log for item changes. No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Partial** | Portfolio views via multi-board dashboards. No native Programme tier. Workspaces provide some grouping. [Source: TechRepublic](https://www.techrepublic.com/article/monday-2025-new-features/) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting capture or transcript integration. |
| 6. Board/Governance Reporting | **Yes** | Customisable dashboards, portfolio views, chart widgets. |
| 7. AI Features | **Yes** | monday AI: (a) AI Blocks — summarise, categorise, extract info, translate, custom prompts, (b) Product Power-ups — risk management, resource management, CRM automation, (c) Digital Workforce (agents) — monday Expert, monday magic, monday vibe, monday sidekick, (d) Agent Builder for custom AI agents. [Source: monday.com AI press release](https://ir.monday.com/news-and-events/news-releases/news-details/2025/monday-com-Expands-AI-Powered-Agents-CRM-Suite-and-Enterprise-Grade-Capabilities/), [eesel.ai guide](https://www.eesel.ai/blog/monday-com-ai) |
| 8. API / Integration Ecosystem | **Yes** | GraphQL API, 200+ integrations, Zapier, native connectors for Slack, Teams, Jira, GitHub. |
| 9. Pricing Tier | **Published** | Basic: $9/seat/month, Standard: $12/seat/month, Pro: $19/seat/month, Enterprise: ~$24–30/seat/month (estimated, contact sales). Min 3 seats. [Source: monday.com pricing](https://monday.com/pricing), [Advaiya cost guide](https://advaiya.com/cost-to-implement-monday-com/) |
| 10. Target Company Size | **SMB to Mid-Market** | 10–5,000 employees |

#### Asana

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | Risk identification via AI portfolio assessment (flags at-risk projects). Issues tracked as tasks with custom fields. No formal RAID log. [Source: BestAIProjectHub review](https://bestaiprojecthub.com/execution-collaboration/asana-intelligence-ai-review) |
| 2. Escalation Chains / Workflow | **Partial** | Rules engine for automations. Approval workflows available. No native escalation hierarchy. |
| 3. Decision Logging (Audit Trail) | **Partial** | Activity feed on tasks/projects. No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Partial** | Portfolios (capped at 20 on Advanced plan). Goals hierarchy. No native Programme tier. [Source: CloudEagle pricing guide](https://www.cloudeagle.ai/blogs/asana-pricing-guide) |
| 5. Meeting-to-Action Traceability | **No** | No native meeting extraction. AI Connectors bridge with external AI tools, but no transcript → action pipeline. |
| 6. Board/Governance Reporting | **Yes** | Portfolio dashboards, Universal Reporting, Status updates. Enhanced reporting API (Summer 2025). [Source: Asana Summer 2025 release](https://asana.com/inside-asana/summer-release-2025) |
| 7. AI Features | **Yes** | Asana Intelligence: (a) AI Teammates — prebuilt or custom AI agents for complex work, (b) AI Studio — no-code AI workflow builder, (c) Smart Assists — project/portfolio summaries, insights, status updates, (d) AI Connectors — bridge to external AI tools, (e) Smart Workflow Gallery — pre-built AI workflows. [Source: Asana AI page](https://asana.com/product/ai), [Fall 2025 release](https://asana.com/inside-asana/fall-release-2025) |
| 8. API / Integration Ecosystem | **Yes** | REST API, 200+ integrations, Zapier, native connectors for Slack, Teams, Salesforce, Jira. |
| 9. Pricing Tier | **Published** | Personal: Free (10 users), Starter: $10.99/user/month, Advanced: $24.99/user/month, Enterprise/Enterprise+: contact sales. [Source: Asana pricing](https://asana.com/pricing), [Plaky pricing guide](https://plaky.com/learn/plaky/asana-pricing/) |
| 10. Target Company Size | **SMB to Enterprise** | 10–10,000+ employees |

#### Celoxis

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Native risk management with RAG health indicators, critical path analysis. Issue tracking. Inter-project dependencies. [Source: Celoxis features page](https://www.celoxis.com/features) |
| 2. Escalation Chains / Workflow | **Partial** | Multi-level approval workflows for timesheets/expenses. Automatic email alerts. No configurable escalation chains for governance. |
| 3. Decision Logging (Audit Trail) | **Partial** | Audit trail on project changes. No dedicated decision log entity. |
| 4. P3O Hierarchical Governance | **Partial** | Portfolio dashboards with customisable KPIs. Portfolio-level governance. No explicit Programme tier. [Source: Celoxis PPM page](https://www.celoxis.com/lp-project-portfolio-management-software-tools) |
| 5. Meeting-to-Action Traceability | **No** | No meeting capture functionality. |
| 6. Board/Governance Reporting | **Yes** | Customisable portfolio dashboards, automated reports, financial KPIs. |
| 7. AI Features | **Yes** | "Lex" AI assistant — analyses project data for real-time insights, actionable recommendations, natural language commands, dashboard access. [Source: Celoxis features page](https://www.celoxis.com/features), [Celoxis AI page](https://www.celoxis.com/ai) |
| 8. API / Integration Ecosystem | **Yes** | REST API, 400+ integrations via Zapier, native Jira and Azure DevOps connectors. [Source: Celoxis features page](https://www.celoxis.com/features) |
| 9. Pricing Tier | **Published** | Cloud: Team Members $15/user/month, Managers $25/user/month. On-premise: $450/user one-time. [Source: SelectHub, Digital PM](https://www.selecthub.com/p/ppm-software/celoxis/) |
| 10. Target Company Size | **SMB to Mid-Market** | 20–2,000 employees |

#### Completix

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Native RAID management — issues, risks, decisions in a single place with automated assignments. Explicitly called out as a feature. [Source: Completix overview](https://www.completix.com/overview/) |
| 2. Escalation Chains / Workflow | **Partial** | Governance gating, flexible governance processes. No explicit escalation chain configuration. |
| 3. Decision Logging (Audit Trail) | **Yes** | Decisions listed as part of RAID management. Integrated into project governance workflow. [Source: Completix overview](https://www.completix.com/overview/) |
| 4. P3O Hierarchical Governance | **Partial** | Portfolio planning with OKR alignment. Flexible governance with gating. No explicit Programme tier, but scalable governance processes. |
| 5. Meeting-to-Action Traceability | **No** | No meeting capture functionality. |
| 6. Board/Governance Reporting | **Yes** | Executive dashboards, automated status reports, 360° portfolio visibility. [Source: Completix overview](https://www.completix.com/overview/) |
| 7. AI Features | **Partial** | Mentions AI foresight for scenario planning in PMO playbook content. No publicly documented AI assistant or generative features yet. [Source: Celoxis PMO Playbook article](https://www.celoxis.com/article/pmo-playbook) — Note: this reference may be from Celoxis, not Completix |
| 8. API / Integration Ecosystem | **Partial** | Integrations mentioned but ecosystem is smaller than competitors. |
| 9. Pricing Tier | **Published** | Starting from $12.50/user/month. Free trial available. [Source: GetApp, Capterra, SoftwareAdvice](https://www.getapp.com/project-management-planning-software/a/completix/) |
| 10. Target Company Size | **SMB to Mid-Market** | 10–1,000 employees |

---

### 1.3 Specialist / Adjacent Tier

#### Tempo Strategic Roadmaps (Jira ecosystem)

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | Leverages Jira's native issue tracking. Risk management via Jira add-ons. Not native to Tempo itself. |
| 2. Escalation Chains / Workflow | **Partial** | Uses Jira workflow engine. |
| 3. Decision Logging (Audit Trail) | **Partial** | Jira's audit log. No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Partial** | Structure by Tempo provides portfolio hierarchy in Jira. Roadmap views across epics/portfolios. No formal Programme governance. [Source: Atlassian Marketplace](https://marketplace.atlassian.com/apps/34717/structure-by-tempo-jira-portfolio-management-ppm) |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Partial** | Roadmap and Gantt views. Relies on Jira dashboards for detailed reporting. |
| 7. AI Features | **No** | No documented AI features. |
| 8. API / Integration Ecosystem | **Yes** | Deep Jira integration (native). Part of Tempo product suite (Timesheets, Budgets, Planner). BI connectors (BigQuery, Looker, PowerBI, Tableau). [Source: Tempo website](https://www.tempo.io/) |
| 9. Pricing Tier | **Published (Marketplace)** | Atlassian Marketplace pricing — scales by Jira instance users. Approximately $2–$5/user/month at scale. Price increase of 15% effective Sept 2025. [Source: Tempo pricing update](https://www.tempo.io/blog/upcoming-tempo-price-changes-effective-september-15-2025) |
| 10. Target Company Size | **Mid-Market (Jira shops)** | Teams already invested in Atlassian/Jira ecosystem |

#### Targetprocess / Apptio (IBM)

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Partial** | Risk and issue tracking via configurable entities. Dependency management across teams. Not formal RAID framework. [Source: Apptio Targetprocess features](https://www.apptio.com/products/targetprocess/features/) |
| 2. Escalation Chains / Workflow | **Partial** | Configurable workflows for agile ceremonies. No traditional escalation chains. |
| 3. Decision Logging (Audit Trail) | **Partial** | Entity history tracking. No dedicated decision log. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio → Investment → Team → Iteration hierarchy. SAFe framework support. End-to-end view from user stories to strategic priorities. [Source: Apptio EAP solutions](https://www.apptio.com/solutions/eap/) |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Yes** | Portfolio dashboards, value stream analytics, investment tracking. |
| 7. AI Features | **Partial** | IBM's broader AI capabilities may apply. No documented Targetprocess-specific AI features in product docs. |
| 8. API / Integration Ecosystem | **Yes** | REST API, integrations with Jira, Azure DevOps, Rally. Part of IBM/Apptio ecosystem. |
| 9. Pricing Tier | **Enterprise (custom quote)** | Not publicly listed. Subscription-based. Likely $30–$50+/user/month based on enterprise positioning. [Source: TrustRadius, SaaSWorthy](https://www.trustradius.com/products/ibm-targetprocess/pricing) |
| 10. Target Company Size | **Enterprise (SAFe/Agile)** | 500–10,000+ employees, SAFe adopters |

#### Aha! Roadmaps

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **No** | Product management focus. No native RAID framework. Risk is assessed at idea/feature level, not project governance. |
| 2. Escalation Chains / Workflow | **Partial** | Workflow statuses for features/ideas. No escalation chain concept. |
| 3. Decision Logging (Audit Trail) | **Partial** | Activity history on records. No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Partial** | Workspace → Product Line → Product hierarchy. Portfolio-level views. But oriented to product management, not P3O governance. [Source: Aha! pricing page](https://www.aha.io/roadmaps/pricing) |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Yes** | Visual roadmaps, portfolio reports, custom dashboards. Strategy → roadmap → delivery views. |
| 7. AI Features | **Yes** | AI-powered analysis for research → roadmap workflows. Feature/idea generation. AI assistance in Q4 2025 release for customer feedback analysis and planning. [Source: Aha! Q4 2025 blog](https://www.aha.io/blog/most-popular-new-aha-features-launched-in-q4-2025) |
| 8. API / Integration Ecosystem | **Yes** | REST API, 30+ native integrations (Jira, Azure DevOps, Salesforce, Slack). Aha! Develop for engineering integration. |
| 9. Pricing Tier | **Published** | Premium: $59/user/month (annual), Enterprise: $99/user/month, Enterprise+: $149/user/month. Monthly pricing higher ($74/$124/$189). [Source: UserJot pricing breakdown](https://userjot.com/blog/aha-pricing), [monday.com comparison](https://monday.com/blog/rnd/aha-product-management/) |
| 10. Target Company Size | **Mid-Market to Enterprise** | Product-led companies, 50–5,000 employees |

#### Productboard

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **No** | Product management/feedback tool. No RAID concepts. |
| 2. Escalation Chains / Workflow | **No** | Feature prioritisation workflows only. No escalation. |
| 3. Decision Logging (Audit Trail) | **Partial** | Feature decision rationale can be documented. No formal audit trail. |
| 4. P3O Hierarchical Governance | **No** | Product hierarchy only. No portfolio/programme/project governance. |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Partial** | Product roadmaps, prioritisation views. Not governance-oriented. |
| 7. AI Features | **Yes** | Productboard AI: feedback summarisation, pattern identification, product spec writing, customer insight analysis. $20/maker/month add-on. [Source: Featurebase review](https://www.featurebase.app/blog/productboard-pricing), [Productboard AI page](https://www.productboard.com/product/ai-for-product-management/) |
| 8. API / Integration Ecosystem | **Yes** | REST API, integrations with Jira, Slack, Salesforce, Intercom, Zendesk. |
| 9. Pricing Tier | **Published** | Essentials: ~$19/maker/month (annual), Pro: ~$59/maker/month. Enterprise: $300–$400/maker/month (custom). AI add-on: $20/maker/month. [Source: CPO Club, Featurebase](https://cpoclub.com/tools/productboard-pricing/) |
| 10. Target Company Size | **Mid-Market (Product teams)** | Product-led organisations, 20–5,000 employees |

#### Sciforma (Now owned by Planview, acquired Feb 2025)

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Issues, actions, change requests, risks, lessons learned — collaborative work management at portfolio level. [Source: Sciforma solutions page](https://www.sciforma.com/solutions/portfolio-management/) |
| 2. Escalation Chains / Workflow | **Partial** | Governance practices, approval workflows. Configurable but not as rich as ServiceNow. |
| 3. Decision Logging (Audit Trail) | **Partial** | Project data tracking. No dedicated decision entity. |
| 4. P3O Hierarchical Governance | **Yes** | Portfolio management with governance. Recognised as Visionary in 2025 Gartner MQ for APMR (under Planview). [Source: Planview Gartner page](https://info.planview.com/gartner-adaptive-pm-reporting-mq-_report_prm_en_reg.html) |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Yes** | Dashboards, KPI tracking, portfolio reports. |
| 7. AI Features | **Partial** | Scenario planning capabilities. No documented AI assistant or generative features at time of acquisition. |
| 8. API / Integration Ecosystem | **Yes** | REST APIs, integrations with Jira, Azure DevOps. |
| 9. Pricing Tier | **Published (range)** | $15–$90/user/month depending on role and user count. Volume discounts for 100+ users ($15/user/month). [Source: Sciforma FAQ](https://www.sciforma.com/faqs/), [ITQlick](https://www.itqlick.com/sciforma/pricing) |
| 10. Target Company Size | **Mid-Market to Enterprise** | 100–5,000+ employees. NOTE: Acquired by Planview Feb 2025. [Source: Planview newsroom](https://newsroom.planview.com/planview-acquires-sciforma-expanding-global-leadership-in-portfolio-management-solutions/) |

#### KeyedIn

| Capability | Score | Notes |
|---|---|---|
| 1. RAID Management | **Yes** | Risk management, issue tracking, dependency tracking. Built for enterprise PMO. [Source: GetApp review](https://www.getapp.com/project-management-planning-software/a/keyedin/) |
| 2. Escalation Chains / Workflow | **Partial** | Configurable workflows. Scenario modelling for portfolio decisions. |
| 3. Decision Logging (Audit Trail) | **Partial** | Activity tracking. Benefits tracking. No dedicated decision log. |
| 4. P3O Hierarchical Governance | **Yes** | End-to-end portfolio management. Portfolio Kanban, scenario modelling, benefits tracking. [Source: SaaSWorthy](https://www.saasworthy.com/product/keyedin) |
| 5. Meeting-to-Action Traceability | **No** | No meeting features. |
| 6. Board/Governance Reporting | **Yes** | Insights feature for portfolio performance. Executive reporting. [Source: Capterra reviews](https://www.capterra.com/p/163842/KeyedIn-Projects/) |
| 7. AI Features | **No** | No documented AI features. |
| 8. API / Integration Ecosystem | **Partial** | API available. Smaller integration ecosystem than market leaders. |
| 9. Pricing Tier | **Published** | Starting from $25/user/month. Multiple license types (Managed Resource, Manager, Team Member). [Source: GetApp, Capterra UK](https://www.getapp.com/project-management-planning-software/a/keyedin/pricing/) |
| 10. Target Company Size | **Mid-Market to Enterprise PMO** | 50–5,000 employees |

---

### 1.4 Summary Matrix (Consolidated View)

| Vendor | RAID | Escalation | Decision Log | P3O Hierarchy | Meeting→Action | Gov. Reporting | AI | API/Integration | Price Range | Target Size |
|--------|------|------------|--------------|---------------|----------------|----------------|----|----|-------------|-------------|
| **Planview** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ | ✅ | $19–25/u/m | Enterprise |
| **ServiceNow SPM** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | $100–200+/u/m | Enterprise |
| **Clarity PPM** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $29–60/u/m | Enterprise/Gov |
| **Planisware** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅✅ | ✅ | $30–50/u/m | Enterprise |
| **Smartsheet** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $9–19/u/m | Mid→Enterprise |
| **Monday.com** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $9–30/u/m | SMB→Mid |
| **Asana** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $11–25/u/m | SMB→Enterprise |
| **Celoxis** | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $15–25/u/m | SMB→Mid |
| **Completix** | ✅ | ⚠️ | ✅ | ⚠️ | ❌ | ✅ | ⚠️ | ⚠️ | $12.50/u/m | SMB→Mid |
| **Tempo (Jira)** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | $2–5/u/m | Mid (Jira) |
| **Targetprocess** | ⚠️ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $30–50/u/m (est) | Enterprise |
| **Aha!** | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $59–149/u/m | Mid→Enterprise |
| **Productboard** | ❌ | ❌ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ | ✅ | $19–59/u/m | Mid (Product) |
| **Sciforma** | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $15–90/u/m | Mid→Enterprise |
| **KeyedIn** | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ❌ | ⚠️ | $25/u/m | Mid→Enterprise |

**Legend:** ✅ = Yes/Native | ⚠️ = Partial | ❌ = No | ✅✅ = Industry-leading

**Critical observation:** The "Meeting-to-Action Traceability" column is ❌ across ALL 15 vendors. This is Helm's primary market gap to exploit.

---

## 2. AI Feature Deep Dive (Top 6)

### 2.1 Planview (Anvi / formerly Copilot)

**Brand:** Planview Anvi (rebranded from Copilot late 2025)

| AI Feature | Status | Details |
|---|---|---|
| Risk Detection & Alerts | **Live** | Proactively flags potential roadblocks, performance issues, timeline risks based on patterns and historical outcomes. |
| Sentiment Analysis | **Live** | Tracks team sentiment and stakeholder engagement across project communications. |
| Personalised Insights | **Live** | AI-powered recommendations in Planview.Me — surfaces relevant data, actions, priorities per role. |
| Content Enhancement | **Live** | Improves writing quality, tone, clarity across project documentation. |
| Performance Anomaly Detection | **Live** | Identifies unusual patterns in team performance, resource utilisation, delivery metrics. |
| Conversational AI | **Live** | Natural language queries about any work aspect. Contextual recommendations, best practice guidance. |
| Custom Agents | **Live** | Create agents tailored to specific workflows — execute complex analysis and action sequences. |
| AI Help (RAG) | **Live** | In-app answers to user questions from thousands of help articles. |
| Data Fabric | **Live** | Cross-tool contextual understanding across ecosystem. |

**Source:** [Planview AI page](https://www.planview.com/ai/), [Planview Copilot announcement](https://newsroom.planview.com/planview-redefines-strategic-decision-making-with-advanced-ai/), [Planview Copilot blog](https://blog.planview.com/announcing-planview-copilot-accelerate-transformation-and-action-data-driven-strategic-decision-making/)

**Comparison to Helm:** Planview Anvi is the most directly competitive AI offering — but focuses on data-fabric insights and risk detection, **not** meeting extraction. No meeting → action item pipeline. Helm's meeting-first AI approach is differentiated.

---

### 2.2 ServiceNow SPM (Now Assist)

**Brand:** Now Assist for SPM

| AI Feature | Status | Details |
|---|---|---|
| Summarise Feedback/Docs | **Live** | Summarises customer feedback, documentation content. |
| Generate User Stories | **Live** | Auto-generates user stories from requirements/feedback. |
| Project Summaries | **Live** | Creates concise project summaries on demand. |
| Autonomous Task Monitoring | **Live** | Monitors project tasks, surfaces all related risks before they occur. |
| Enhanced Record Creation | **Live** | AI-assisted creation of project records/demands. |
| Conversational Demand Creation | **Live** | Initiate demands through natural language conversations. |
| Identify Similar Demands | **Live** | Flags duplicate or similar demand requests. |
| CWM (Collaborative Work Management) | **Live (May 2025)** | Gen AI features for collaborative work management. Yokohama release. |

**Source:** [ServiceNow Store — Now Assist for SPM](https://store.servicenow.com/store/app/5449a7ae1be06a50a85b16db234bcbb2), [Q2 2025 Store Release](https://www.servicenow.com/community/spm-blog/strategic-portfolio-management-q2-2025-store-release-accelerate/ba-p/3264099), [Quick Start Guide](https://www.servicenow.com/community/spm-articles/quick-start-guide-for-now-assist-for-spm/ta-p/3006963)

**Comparison to Helm:** ServiceNow's AI is deeply integrated with its platform but is oriented to IT-centric workflows (demands, user stories, service management). **No meeting extraction**, no RAID-specific AI generation, no governance-meeting integration.

---

### 2.3 Monday.com (monday AI)

**Brand:** monday AI (AI Blocks, Power-ups, Digital Workforce)

| AI Feature | Status | Details |
|---|---|---|
| AI Blocks — Summarise | **Live** | Condenses long threads/documents to key points. |
| AI Blocks — Categorise | **Live** | Auto-categorise by urgency, sentiment, type. |
| AI Blocks — Extract Info | **Live** | Scans documents/PDFs to extract specific details. |
| AI Blocks — Translate | **Live** | Multi-language translation within boards. |
| AI Blocks — Custom | **Live** | Plain-English custom AI automation prompts. |
| Risk Management Power-up | **In Rollout** | Flags tasks at risk of delay based on project data. |
| Resource Management Power-up | **In Rollout** | Suggests task assignments based on skills/availability. |
| monday Expert (Agent) | **2025** | Guidance agent for new users. |
| monday Magic | **Live** | AI writing/content generation. |
| monday Vibe | **Live** | AI-powered design assistance. |
| monday Sidekick | **Live** | AI assistant for workflow management. |
| Agent Builder | **Live** | Custom AI agent creation. |

**Source:** [monday.com AI press release](https://ir.monday.com/news-and-events/news-releases/news-details/2025/monday-com-Expands-AI-Powered-Agents-CRM-Suite-and-Enterprise-Grade-Capabilities/), [eesel.ai comprehensive guide](https://www.eesel.ai/blog/monday-com-ai)

**Comparison to Helm:** monday.com's AI is broad but shallow — focused on general work automation. **No meeting extraction**, no RAID integration, no governance-specific features. Many Power-ups still in rollout, not fully available.

---

### 2.4 Smartsheet (Smartsheet AI)

**Brand:** Smartsheet AI

| AI Feature | Status | Details |
|---|---|---|
| AI-Powered Project Setup | **Live** | Personalised onboarding — role/goal-based workspace setup. |
| Formula Generation | **Live** | Natural language → working formulas. |
| Data Analysis/Charts | **Live** | Natural language → charts and metrics. First work management platform with AI chart generation. |
| Text Summarisation | **Live** | Summarise tasks, generate copy, identify sentiment, translate. |
| Suggested Descriptions | **Live** | AI-generated descriptions for Brandfolder assets. |
| Amazon Q Connector | **Live** | Sync Smartsheet data to AWS Q generative AI assistant. |
| Glean Connector | **Live** | AI-powered enterprise search across Smartsheet data. |
| Microsoft Copilot Connector | **Public Preview** | Index sheet content for Copilot chat/search. |
| Atlassian Rovo Connector | **Live** | Cross-platform AI insights with Smartsheet data. |
| Scenario Planning | **Early Adopter** | AI-powered scenario modelling (announced Nov 2025). |

**Source:** [Smartsheet AI features page](https://www.smartsheet.com/platform/features/ai), [Forward 2025 Edition 3](https://www.smartsheet.com/content-center/product-news/product-releases/smartsheet-forward-november-18-2025)

**Comparison to Helm:** Smartsheet AI is integration-focused — connecting to external AI platforms rather than building deep domain AI. **No meeting extraction**, no RAID-specific features, no governance-oriented AI. Potential interop partner but not competitor in governance AI space.

---

### 2.5 Planisware (Oscar AI + ML suite)

**Brand:** Oscar (AI Agents), plus embedded ML/Predictive features

| AI Feature | Status | Details |
|---|---|---|
| Assistive AI (RAG Help) | **Live** | In-app AI help using retrieval-augmented generation. |
| Generative AI — WBS | **Live** | Auto-generate work breakdown structures in seconds. |
| Generative AI — Schedules | **Live** | Auto-generate project schedules. |
| Generative AI — Risk Assessments | **Live** | Auto-generate risk assessments for projects. |
| AI Agents (Oscar) | **Live** | Orchestration agent coordinates specialised agents (forecasting, risk scoring, scheduling). |
| Zero-Code Agent Builder | **Live** | Business users build automations without code. |
| Swarm Intelligence (PSO) | **Live (since 2016)** | Particle Swarm Optimisation for resource allocation — evaluates millions of combinations. |
| Predictive AI | **Live** | Historical data → outcome prediction. Risk identification 3 months in advance. |
| Data Anomaly Detection | **Live** | Identifies unusual patterns in project data. |
| Machine Learning | **Live** | Predict resource demand, costs, task durations. Validate plans against benchmarks. |
| Monte Carlo Simulation | **Live** | Probabilistic schedule/cost forecasting. |

**Source:** [Planisware AI page](https://planisware.com/artificial-intelligence), [Planisware GenAI article](https://planisware.com/resources/artificial-intelligence-ppm/how-generative-ai-shaping-future-ppm-article-key-insights-and)

**Comparison to Helm:** Planisware has the **deepest AI/ML stack** in the PPM market — but it's entirely focused on numerical optimisation, prediction, and project data generation. **No meeting extraction**, no meeting-to-governance pipeline, no action-item-from-transcript capability. Their strength is quantitative AI; Helm's planned strength is qualitative/governance AI.

---

### 2.6 Asana (Asana Intelligence)

**Brand:** Asana Intelligence (AI Teammates, AI Studio, Smart Assists)

| AI Feature | Status | Details |
|---|---|---|
| AI Teammates | **Live** | Prebuilt or custom AI agents that handle complex work. |
| AI Studio | **Live** | No-code AI workflow builder for routine tasks. |
| Smart Assists | **Live** | Task/project/portfolio activity summaries, project status insights, decision support. |
| Smart Workflow Gallery | **Live** | Pre-built AI workflows with best practices. |
| AI Connectors | **Live** | Bridge between AI tools (ChatGPT, etc.) and Asana — kick off projects from AI apps. |
| Portfolio Risk Assessment | **Live** | AI-powered early warning system for portfolio health. |
| Enhanced Reporting API | **Live (Summer 2025)** | Custom BI connectors, export data across portfolios/projects/tasks. |
| Goals with Custom Fields | **Live (Fall 2025)** | Rich metadata on goals for filtering and reporting. |

**Source:** [Asana AI page](https://asana.com/product/ai), [Asana Summer 2025 release](https://asana.com/inside-asana/summer-release-2025), [Asana Fall 2025 release](https://asana.com/inside-asana/fall-release-2025), [UC Today review](https://www.uctoday.com/unified-communications/the-best-asana-ai-features-for-productivity-in-2024/)

**Comparison to Helm:** Asana's AI is the most "agent-oriented" in the mid-market — AI Teammates and AI Studio are strong. But still focused on **task management**, not governance. **No meeting extraction**, no RAID log generation, no decision audit trail. Asana's AI Connectors concept is interesting — allows external AI to create Asana work, similar to how meeting AI could feed Helm.

---

### 2.7 AI Comparison Summary

| Capability | Planview | ServiceNow | Monday.com | Smartsheet | Planisware | Asana | **Helm (Planned)** |
|---|---|---|---|---|---|---|---|
| Meeting Transcript → Actions | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Auto-generate RAID entries | ❌ | ❌ | ❌ | ❌ | ✅ (risk only) | ❌ | ✅ |
| Decision extraction from meetings | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Risk prediction (data-driven) | ✅ | ✅ | ⚠️ | ❌ | ✅✅ | ⚠️ | 🔜 v2 |
| Resource optimisation (AI) | ✅ | ⚠️ | ⚠️ | ❌ | ✅✅ | ❌ | ❌ |
| NLP summarisation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom AI agents | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | 🔜 v2+ |
| AI governance reporting | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ✅ |

**Key insight:** Helm's unique positioning is the **meeting → governance artefact pipeline**. No competitor connects meeting content to RAID logs, decision records, and action items as a unified workflow. This is a genuine market gap.

---

## 3. Pricing Verification

### 3.1 Pricing Data Table

| Vendor | Published? | Pricing Data | Source |
|--------|-----------|------|--------|
| **Planview** | ❌ Custom quote | Est. $19–25/user/month (100+ users). Large enterprise deals negotiated. Not publicly listed. | [SelectHub](https://www.selecthub.com/p/ppm-software/planview/), [ITQlick](https://www.itqlick.com/planview/pricing) |
| **ServiceNow SPM** | ❌ Custom quote | Platform licensing $100–200/fulfiller/month. SPM add-on additional. Total deals $250K–$1M+/year. | [Rezolve.ai](https://www.rezolve.ai/blog/servicenow-pricing-guide-custom-quotes-for-tailored-it-solutions), [HiverHQ](https://hiverhq.com/blog/servicenow-pricing) |
| **Clarity PPM** | ❌ Custom quote | Est. $29–60/user/month (Team Member $29, Enterprise $55). | [PricingNow](https://pricingnow.com/question/clarity-ppm-cost/), [SelectHub](https://www.selecthub.com/p/ppm-software/clarity-ppm/) |
| **Planisware** | ❌ Custom quote | Est. $30–50/user/month (small biz $50, enterprise 1000+ users $30–40). | [ITQlick](https://www.itqlick.com/planisware/pricing) |
| **Smartsheet** | ✅ Published | Pro: $9/member/month (annual), Business: $19/member/month (annual), Enterprise: custom. | [Smartsheet pricing page](https://www.smartsheet.com/pricing) |
| **Monday.com** | ✅ Published | Basic: $9/seat/month, Standard: $12/seat/month, Pro: $19/seat/month, Enterprise: est. $24–30/seat/month. Min 3 seats. | [monday.com pricing](https://monday.com/pricing), [Advaiya](https://advaiya.com/cost-to-implement-monday-com/) |
| **Asana** | ✅ Published (except Enterprise) | Personal: Free, Starter: $10.99/user/month, Advanced: $24.99/user/month, Enterprise: contact sales. | [Asana pricing](https://asana.com/pricing), [Plaky](https://plaky.com/learn/plaky/asana-pricing/) |
| **Celoxis** | ✅ Published | Cloud: Team $15/user/month, Manager $25/user/month. On-prem: $450/user one-time. | [Digital PM](https://thedigitalprojectmanager.com/tools/celoxis-pricing/), [SelectHub](https://www.selecthub.com/p/ppm-software/celoxis/) |
| **Completix** | ✅ Published | Starting $12.50/user/month. Free trial. Per-project licensing also available. | [GetApp](https://www.getapp.com/project-management-planning-software/a/completix/), [Capterra](https://www.capterra.com/p/10010838/Completix/) |
| **Tempo (Jira)** | ✅ Published (Marketplace) | Atlassian Marketplace pricing, ~$2–5/user/month at scale. 15% increase Sept 2025. | [Atlassian Marketplace](https://marketplace.atlassian.com/apps/34717/structure-project-management-at-scale), [Tempo blog](https://www.tempo.io/blog/upcoming-tempo-price-changes-effective-september-15-2025) |
| **Targetprocess/Apptio** | ❌ Custom quote | Not publicly listed. Enterprise subscription. Est. $30–50+/user/month. | [TrustRadius](https://www.trustradius.com/products/ibm-targetprocess/pricing), [SaaSWorthy](https://www.saasworthy.com/product/targetprocess/pricing) |
| **Aha! Roadmaps** | ✅ Published | Premium: $59/user/month (annual), Enterprise: $99/user/month, Enterprise+: $149/user/month. Add-ons extra ($9–$20/user/month). | [UserJot](https://userjot.com/blog/aha-pricing), [Aha! pricing page](https://www.aha.io/roadmaps/pricing) |
| **Productboard** | ✅ Published (except Enterprise) | Essentials: ~$19/maker/month, Pro: ~$59/maker/month, Enterprise: $300–400/maker/month (custom). AI: +$20/maker/month. | [CPO Club](https://cpoclub.com/tools/productboard-pricing/), [Featurebase](https://www.featurebase.app/blog/productboard-pricing) |
| **Sciforma** | ⚠️ Range published | $15–90/user/month depending on role and volume. Volume 100+: $15/user/month. | [Sciforma FAQ](https://www.sciforma.com/faqs/), [ITQlick](https://www.itqlick.com/sciforma/pricing) |
| **KeyedIn** | ✅ Published (starting) | Starting $25/user/month. License types vary (Managed Resource, Manager, Team Member). | [GetApp](https://www.getapp.com/project-management-planning-software/a/keyedin/pricing/), [SelectHub](https://www.selecthub.com/p/ppm-software/keyedin/) |

### 3.2 Pricing Tiers Visualised (Annual per-user/month cost)

```
$0        $25       $50       $75       $100      $150      $200+
|---------|---------|---------|---------|---------|---------|
Completix   [$12.50]
Smartsheet  [$9——$19——————custom]
Monday.com  [$9—$12—$19——~$30]
Asana       [$11—————$25——————custom]
Celoxis     [$15———$25]
Sciforma    [$15—————————————$90]
Planview    [——————$19—$25]
KeyedIn     [————————$25]
Clarity     [——————————$29————$60]
Planisware  [————————————$30——$50]
Targetproc  [————————————$30——$50]
Aha!        [——————————————————$59—————$99——$149]
Productbrd  [——————$19—————————$59————————$300+]
ServiceNow  [————————————————————————————$100——$200+]
```

**Helm pricing insight:** At the mid-market sweet spot ($15–$35/user/month), Helm competes directly with Celoxis, Completix, KeyedIn, and the lower tiers of Smartsheet/Monday/Asana. Governance-focused features (RAID, decisions, meeting integration) justify premium positioning above generic mid-market tools.

---

## 4. Helm Positioning & Gap Analysis

### 4.1 Helm's Unique Value Proposition

Based on this competitive analysis, Helm's planned differentiators occupy a genuine market gap:

1. **Meeting → Governance Pipeline:** No vendor offers AI extraction of meeting transcripts into structured RAID entries, decision records, and action items. This is a **white space** opportunity.

2. **First-Class Decision Logging:** Only Completix explicitly includes "decisions" in their RAID management. Most tools treat decisions as notes or custom fields. Helm can own this.

3. **P3O-Native Design:** Most mid-market tools lack Programme-level constructs. Helm can be the first affordable PPM with true Portfolio → Programme → Project hierarchy.

4. **Governance-AI Focus:** While competitors focus AI on resource optimisation (Planisware), content generation (Monday/Asana), or IT workflows (ServiceNow), Helm can focus on **governance intelligence** — the underserved domain.

### 4.2 Competitive Threats

| Threat | Risk | Mitigation |
|--------|------|------------|
| Planview adds meeting AI | **Medium** | Planview is enterprise-only ($19–25+/user). Helm targets mid-market. Different segments. |
| Asana AI Teammates expand to governance | **Medium** | Asana's AI is task-oriented, not governance-oriented. Would require fundamental product shift. |
| Standalone meeting AI tools (Otter, Fireflies) add RAID integration | **High** | These tools lack PPM context. Helm's integration is native, not bolted on. Speed matters — be first. |
| Monday/Smartsheet add RAID management | **Low-Medium** | These platforms optimise for simplicity. RAID adds complexity that conflicts with their UX philosophy. |
| Enterprise vendors move down-market | **Low** | Enterprise vendors (ServiceNow, Planisware) have no incentive to simplify or reduce pricing. |

### 4.3 Recommended Positioning

**Tagline concept:** "Where governance meets intelligence — the PPM that listens to your meetings."

**Market position:** Mid-market governance-first PPM with AI-powered meeting-to-action pipeline. Priced between generic tools (Monday/Asana at $10–25/user/month) and enterprise PPM (Planview/ServiceNow at $50–200+/user/month).

**Recommended price range:** $20–$45/user/month — justifiable premium over generic tools due to governance + AI features, significant savings vs enterprise tools.

---

## 5. Sources

### Vendor Pages
- [Planview PPM](https://www.planview.com/products-solutions/solutions/project-portfolio-management/)
- [Planview Anvi (AI)](https://www.planview.com/ai/)
- [ServiceNow SPM](https://www.servicenow.com/products/strategic-portfolio-management.html)
- [Now Assist for SPM](https://store.servicenow.com/store/app/5449a7ae1be06a50a85b16db234bcbb2)
- [Broadcom Clarity](https://valueops.broadcom.com/products/clarity)
- [Planisware AI](https://planisware.com/artificial-intelligence)
- [Smartsheet AI](https://www.smartsheet.com/platform/features/ai)
- [Smartsheet Pricing](https://www.smartsheet.com/pricing)
- [Monday.com Pricing](https://monday.com/pricing)
- [Asana AI](https://asana.com/product/ai)
- [Asana Pricing](https://asana.com/pricing)
- [Celoxis Features](https://www.celoxis.com/features)
- [Completix Overview](https://www.completix.com/overview/)
- [Tempo SPM Collection](https://www.tempo.io/collections/spm-for-jira)
- [Apptio Targetprocess](https://www.apptio.com/products/targetprocess/)
- [Aha! Roadmaps Pricing](https://www.aha.io/roadmaps/pricing)
- [Productboard AI](https://www.productboard.com/product/ai-for-product-management/)
- [Sciforma Portfolio Management](https://www.sciforma.com/solutions/portfolio-management/)
- [KeyedIn GetApp](https://www.getapp.com/project-management-planning-software/a/keyedin/)

### Analyst Reports & Reviews
- [Gartner MQ for APMR 2025 (via Planview)](https://info.planview.com/gartner-adaptive-pm-reporting-mq-_report_prm_en_reg.html)
- [Gartner MQ for APMR 2024 (via Asana)](https://asana.com/resources/gartner-magic-quadrant-adaptive-project-management)
- [Gartner MQ for APMR 2024 (via Planisware)](https://planisware.com/gartner-2024-leader-magic-quadrant-adaptive-project-management-reporting)
- [Forrester SPM Leader — ServiceNow (2024)](https://www.businesswire.com/news/home/20240605936420/en/ServiceNow-Named-a-Leader-in-Strategic-Portfolio-Management-Tools-Evaluation)
- [Planview acquires Sciforma (Feb 2025)](https://newsroom.planview.com/planview-acquires-sciforma-expanding-global-leadership-in-portfolio-management-solutions/)

### Pricing Sources
- [Planview — SelectHub](https://www.selecthub.com/p/ppm-software/planview/)
- [Planview — ITQlick](https://www.itqlick.com/planview/pricing)
- [ServiceNow — Rezolve.ai](https://www.rezolve.ai/blog/servicenow-pricing-guide-custom-quotes-for-tailored-it-solutions)
- [ServiceNow — HiverHQ](https://hiverhq.com/blog/servicenow-pricing)
- [Clarity — PricingNow](https://pricingnow.com/question/clarity-ppm-cost/)
- [Clarity — SelectHub](https://www.selecthub.com/p/ppm-software/clarity-ppm/)
- [Planisware — ITQlick](https://www.itqlick.com/planisware/pricing)
- [Monday.com — Advaiya](https://advaiya.com/cost-to-implement-monday-com/)
- [Asana — Plaky](https://plaky.com/learn/plaky/asana-pricing/)
- [Asana — CloudEagle](https://www.cloudeagle.ai/blogs/asana-pricing-guide)
- [Celoxis — Digital PM](https://thedigitalprojectmanager.com/tools/celoxis-pricing/)
- [Completix — GetApp](https://www.getapp.com/project-management-planning-software/a/completix/)
- [Aha! — UserJot](https://userjot.com/blog/aha-pricing)
- [Productboard — CPO Club](https://cpoclub.com/tools/productboard-pricing/)
- [Productboard — Featurebase](https://www.featurebase.app/blog/productboard-pricing)
- [Sciforma — FAQ](https://www.sciforma.com/faqs/)
- [KeyedIn — GetApp](https://www.getapp.com/project-management-planning-software/a/keyedin/pricing/)

### Third-Party Reviews & Comparisons
- [PeerSpot PPM Rankings](https://www.peerspot.com/categories/project-portfolio-management)
- [Gartner Peer Insights — PPM](https://www.gartner.com/reviews/market/project-portfolio-management-worldwide)
- [Top 10 PPM Vendors — AppsRunTheWorld](https://www.appsruntheworld.com/top-10-project-portfolio-management-software-vendors-and-market-forecast/)
- [Completix PPM Comparison](https://www.completix.com/top-5-ppm-tools-compared/)
- [Monday.com AI Guide — eesel.ai](https://www.eesel.ai/blog/monday-com-ai)
- [Asana AI Review — BestAIProjectHub](https://bestaiprojecthub.com/execution-collaboration/asana-intelligence-ai-review)
- [Planview PPM Pro — Research.com](https://research.com/software/reviews/planview-ppm-pro)

---

*Document generated 2026-01-31. Pricing and feature data reflects publicly available information as of January 2026. Enterprise vendor pricing is estimated from third-party sources and may not reflect actual negotiated rates.*
