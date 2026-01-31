# Helm Market Validation — Revised v2

**Date:** 31 January 2026  
**Author:** Silas (compiled from 4 specialist research sub-agents)  
**Status:** DRAFT — awaiting Bry's review  
**Supersedes:** market-validation-and-metagpt-analysis.md (graded C+)  

---

## Changes from v1

This document addresses the specific weaknesses Bry identified in the original (C+) draft:

| Issue | v1 Problem | v2 Fix |
|-------|-----------|--------|
| Unreliable market data | Averaged incompatible numbers from different report scopes | Reconciled 7 research firms, explained scope differences, anchored on IDC ($6.5B) |
| Surface-level competitive analysis | High-level feature claims without verification | 15 vendors scored across 10 capabilities with cited sources per cell |
| Asserted gaps not proven | "Meeting-to-action is a gap" stated, not demonstrated | ❌ confirmed across ALL 15 vendors with source evidence |
| Unsupported claims | "AI is #1 criterion" — no source | Flagged as unverified; rephrased with actual PMI data |
| Premature confidence | Tone implied certainty from weak evidence | Confidence levels stated explicitly; claims graded by evidence strength |
| MetaGPT category error | Positioned as Helm's AI framework | Correctly identified as wrong tool; LangGraph recommended with rationale |

**Source reports** (full detail available in `helm-app/docs/research/`):
1. `competitive-intelligence.md` — 55KB, 15 vendors, 10 capabilities
2. `market-data-verification.md` — 7 research firms reconciled, regulatory drivers
3. `user-evidence-and-surveys.md` — 40 user complaints, 6 industry surveys
4. `technical-landscape.md` — 5 AI frameworks compared, MetaGPT SOP claim verified

---

## Executive Summary

Helm targets a genuine, quantifiable gap in the PPM (Project Portfolio Management) software market.

**The market:** ~$6.5B (2023, IDC) growing at ~12% CAGR. Large enterprises command ~60% of spend; the remaining ~40% (~$2.6B) serves SMB and mid-market — the segment where governance tooling is weakest.

**The gap:** Mid-market organisations (50–500 employees) are stuck between enterprise PPM tools that cost $50–200+/user/month and work management tools (Monday.com, Asana, Smartsheet) that lack governance features. 82% of organisations have a PMO, but only 37% are satisfied with their PM maturity. 42% spend a full working day manually collating project reports.

**The white space:** No PPM vendor — across all 15 analysed — offers meeting-to-action traceability. This is Helm's primary differentiator: an AI-powered pipeline from meeting transcripts to structured RAID entries, decision records, and action items.

**Confidence assessment:**

| Claim | Confidence | Evidence |
|-------|-----------|----------|
| Market size ~$6.5–7.4B | **HIGH** | IDC vendor-reported revenue (bottom-up methodology) |
| Mid-market is underserved for governance | **HIGH** | 40 sourced user complaints + Gartner/Wellingtone survey data |
| Meeting-to-action is white space | **HIGH** | ❌ across all 15 vendors verified individually |
| Regulatory drivers force tool adoption | **HIGH** | FCA PS21/3 and EU DORA are mandatory compliance frameworks |
| AI is a top buyer priority | **MEDIUM** | 82% executives expect AI impact (PMI), but not verified as "#1" |
| Helm can capture £43–53M SAM | **LOW-MEDIUM** | Bottom-up estimate with reasonable assumptions; needs primary validation |

---

## 1. Market Sizing

### 1.1 Verified Market Size

The PPM software market is valued between $5.0B and $7.8B depending on scope definition. After reconciling 7 research firms:

| Research Firm | 2024 Estimate | Scope | Methodology |
|---------------|--------------|-------|-------------|
| **IDC** ⭐ | **$6.5B (2023)** | PPM software | Vendor-reported revenue (bottom-up) |
| Mordor Intelligence | $6.90B (2025) | PPM software | Primary + secondary research |
| Grand View Research | $5.71B (2024) | PPM software only | Survey-based, top-down |
| MarketsandMarkets | $7.8B (2024) | Solutions + services | Expert interviews + modelling |
| Fortune Business Insights | $5.04B (2024) | PPM software | Secondary research |
| Technavio | ~$4.8B growth (2025–2029) | PPM software | Mixed |
| Market Research Future | $5.0B (2022) | PPM software | Secondary research |

**Why the range?** MarketsandMarkets includes consulting/integration services in their $7.8B figure. Grand View Research and Fortune Business Insights use narrower software-only definitions ($5.0–5.7B). IDC's $6.5B uses vendor-reported financials — the most defensible methodology for software market sizing.

**Recommended anchor for Helm:** IDC's $6.5B (2023), estimated ~$7.4B for 2024 at the reported 13.3% YoY growth rate.

*⚠️ Corrected from v1: The original report averaged incompatible figures. The $5.0–7.8B range isn't uncertainty about a single number — it's different analysts measuring different things.*

### 1.2 Growth Trajectory

| Metric | Figure | Source |
|--------|--------|--------|
| Overall PPM CAGR | 11.6–14.2% | Multiple (Mordor, GVR, M&M) |
| Cloud PPM CAGR | 16.85% | Mordor Intelligence |
| Cloud PPM share (2025) | 69.45% | Mordor Intelligence |
| SME segment CAGR | ~12–15% (PPM-specific estimate) | Derived — see note |

*⚠️ Corrected from v1: The "16.89% SME CAGR" figure comes from Mordor Intelligence's broader "Project Management Software Systems" market report — not the PPM-specific report. The PPM-specific SME CAGR is likely 12–15% based on the overall market growth rate and the faster-growing cloud segment.*

### 1.3 Market Structure

| Metric | Figure | Source | Verified? |
|--------|--------|--------|-----------|
| Top 10 vendor share | 60.5% | Apps Run The World (Sept 2025) | ✅ Confirmed |
| Top vendor (Oracle) | 8.5% share | Apps Run The World | ✅ Confirmed |
| Large enterprise share | ~60–61% | Mordor (60.30%), GVR (61.0%) | ✅ Cross-verified |
| SME/mid-market share | ~39–40% (~$2.6B) | Derived from enterprise share | ✅ Consistent |

**Implication:** A moderately fragmented market (no vendor above 8.5%) with 39.5% outside the top 10 — suggesting room for specialised entrants.

### 1.4 TAM / SAM / SOM

**TAM (Total Addressable Market):**
- Global PPM software: ~$7.4B (2024 est.)
- SME/mid-market portion (~40%): ~$3.0B

**SAM (Serviceable Addressable Market) — UK Core:**
- ~42,000 UK businesses with 50–500 employees (UK BPE 2024)
- ×35–45% with formal programme governance needs
- ×~60% in target sectors (financial services, government, healthcare)
- = **~9,000–11,000 addressable firms**
- At £400/month ARPU: **SAM ≈ £43M–53M/year**

**SOM (Serviceable Obtainable Market):**

| Year | Customers | ARR |
|------|-----------|-----|
| 1 | 10–30 | £48K–144K |
| 2 | 50–100 | £240K–480K |
| 3 | 150–300 | £720K–1.44M |

*Confidence: LOW-MEDIUM. These are reasonable estimates based on SaaS benchmarks, but have not been validated through primary research (customer interviews, sales pipeline data). The SAM calculation depends on the 35–45% governance-needs assumption, which is an author synthesis, not a directly sourced figure.*

---

## 2. Competitive Landscape

### 2.1 Summary Matrix (15 Vendors, 10 Capabilities)

| Vendor | RAID | Escalation | Decision Log | P3O Hierarchy | Meeting→Action | Gov. Reporting | AI | API | Price | Target |
|--------|------|------------|--------------|---------------|----------------|----------------|----|----|-------|--------|
| **Planview** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ | ✅ | $19–25/u/m | Enterprise |
| **ServiceNow SPM** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | $100–200+/u/m | Enterprise |
| **Clarity PPM** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $29–60/u/m | Enterprise/Gov |
| **Planisware** | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅✅ | ✅ | $30–50/u/m | Enterprise |
| **Smartsheet** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $9–19/u/m | Mid→Ent |
| **Monday.com** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $9–30/u/m | SMB→Mid |
| **Asana** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $11–25/u/m | SMB→Ent |
| **Celoxis** | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $15–25/u/m | SMB→Mid |
| **Completix** | ✅ | ⚠️ | ✅ | ⚠️ | ❌ | ✅ | ⚠️ | ⚠️ | $12.50/u/m | SMB→Mid |
| **Tempo (Jira)** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | $2–5/u/m | Mid (Jira) |
| **Targetprocess** | ⚠️ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $30–50/u/m | Enterprise |
| **Aha!** | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ✅ | $59–149/u/m | Mid→Ent |
| **Productboard** | ❌ | ❌ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ | ✅ | $19–59/u/m | Mid (Product) |
| **Sciforma** | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | $15–90/u/m | Mid→Ent |
| **KeyedIn** | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ❌ | ⚠️ | $25/u/m | Mid→Ent |

**Legend:** ✅ Native | ⚠️ Partial/workaround | ❌ Not available | ✅✅ Industry-leading

**Critical finding:** The "Meeting→Action" column is **❌ across ALL 15 vendors**. This is not an inference — each vendor was individually verified through their product pages, feature documentation, and user reviews. No PPM tool natively extracts meeting content into structured governance artefacts.

*Full vendor-by-vendor analysis with sources per capability cell: see `competitive-intelligence.md`*

### 2.2 AI Landscape (Top 6 Vendors)

Every major PPM vendor is racing to embed AI, but their focus areas differ:

| Vendor | AI Brand | Focus Area | Meeting Extraction? |
|--------|----------|-----------|---------------------|
| **Planview** | Anvi (formerly Copilot) | Risk detection, sentiment analysis, custom agents | ❌ |
| **ServiceNow** | Now Assist for SPM | Demand creation, user stories, task monitoring | ❌ |
| **Monday.com** | monday AI / Digital Workforce | Content generation, categorisation, agent builder | ❌ |
| **Smartsheet** | Smartsheet AI | Formula generation, data analysis, external AI connectors | ❌ |
| **Planisware** | Oscar (AI Agents) + ML | WBS generation, risk scoring, Monte Carlo, swarm optimisation | ❌ |
| **Asana** | Asana Intelligence | AI Teammates, AI Studio, portfolio risk assessment | ❌ |

**Planisware** has the deepest AI/ML stack (predictive, Monte Carlo, PSO optimisation since 2016), but it's entirely quantitative — focused on numerical forecasting and resource optimisation. No qualitative/governance AI.

**Asana** has the most "agentic" approach (AI Teammates, AI Studio), but task-oriented — not governance-oriented.

**Key gap confirmed:** All vendor AI focuses on summarisation, prediction, content generation, or resource optimisation. **None addresses the qualitative governance domain** — meeting extraction, RAID generation from unstructured content, decision logging from conversations. This is Helm's AI positioning.

### 2.3 Pricing Positioning

```
$0        $25       $50       $75       $100      $150      $200+
|---------|---------|---------|---------|---------|---------|
Completix   [$12.50]
Smartsheet  [$9——$19——————custom]
Monday.com  [$9—$12—$19——~$30]
Celoxis     [$15———$25]
                                    ←— Helm target: $20-45/u/m —→
Planview    [——————$19—$25]
Clarity     [——————————$29————$60]
Planisware  [————————————$30——$50]
ServiceNow  [————————————————————————————$100——$200+]
```

**Helm's sweet spot: $20–45/user/month.** This justifies a premium over generic mid-market tools ($9–25) through governance-native features while remaining a fraction of enterprise PPM ($50–200+).

### 2.4 Competitive Threats

| Threat | Risk | Rationale |
|--------|------|-----------|
| Standalone meeting AI (Otter, Fireflies) adds RAID integration | **HIGH** | These tools have the transcript data; they just lack PPM context. Speed to market matters. |
| Planview adds meeting AI | **MEDIUM** | Enterprise-only pricing ($19–25+/user). Different segment. |
| Asana AI Teammates expand to governance | **MEDIUM** | Would require fundamental product shift from task management to governance. |
| Monday/Smartsheet add RAID management | **LOW-MEDIUM** | RAID adds complexity that conflicts with their simplicity-first UX philosophy. |
| Enterprise vendors move down-market | **LOW** | No economic incentive to simplify or reduce pricing. |

---

## 3. User Evidence

### 3.1 The Mid-Market Governance Gap — Quantified

| Metric | Finding | Source |
|--------|---------|--------|
| Organisations with a PMO | 82% (89% per 2025 data) | Wellingtone 2024/2025 |
| Satisfied with PM maturity | **Only 37%** | Wellingtone 2025 |
| Spend 1+ day manually collating reports | **42%** | Wellingtone 2025 |
| No access to real-time KPIs | **~50%** | Wellingtone 2025 |
| Complete projects on time | Only 38% | Wellingtone 2025 |
| Complete projects on budget | Only 41% | Wellingtone 2025 |
| Projects fully successful (time + budget + scope) | Only 31% | Standish CHAOS Report |
| PMs with high business acumen | Only 18% | PMI Pulse 2025 |
| PMOs less than 4 years old | ~50% | Wellingtone 2025 |
| Organisations waste from poor PM | ~$2 trillion annually | PMI via Voyage Advisory |

**The PMO Paradox:** 82% of organisations have a PMO, but only 37% are satisfied. PMO investment dropped from 57% to 38% YoY. Organisations aren't abandoning governance — they're abandoning *traditional* governance. They want lighter, smarter, risk-based approaches.

### 3.2 User Complaints — Sourced and Categorised

40 specific user complaints collected from G2, Capterra, Reddit, TrustRadius, and expert review sites across Monday.com, Smartsheet, Asana, and Celoxis:

**Top complaint themes:**

| Theme | Count | Representative Quote |
|-------|-------|---------------------|
| **Missing portfolio/programme visibility** | 9 | "Asana for portfolio management lacks robust work intake, prioritisation scoring models, enterprise resource capacity planning, portfolio-level risk management" — Acuity PPM |
| **No governance features (RAID, escalation, audit)** | 9 | "I am going to look into switching... The main request is to be able to produce useable Gantt charts and ideally have some form of RAID logging" — Reddit r/projectmanagement |
| **Reporting limitations** | 9 | "Time-tracking and reporting tools are quite limited compared to dedicated project management suites" — SoftwareReviews |
| **Multi-project dependency failures** | 8 | "Sheets crawl once you hit a few hundred rows with dependencies/links… Gantt charts are too basic — dependencies & constraints often break" — Reddit |
| **UX complexity at scale** | 5 | "Monday can be infuriatingly complex to use. The near-infinite list of templates, marketplace apps, and other add-ons..." — SmartTask |

*Full complaint catalogue with 40 sourced quotes: see `user-evidence-and-surveys.md`*

### 3.3 AI Adoption — Reality vs Hype

| Metric | Finding | Source |
|--------|---------|--------|
| PMs already using AI | 51% | Xergy/Proteus compilation |
| PMs reporting positive AI ROI | 90% | Same |
| Senior leaders expecting AI role (5yr) | 82% | PMI Shaping the Future |
| PMOs expected to use AI for decisions by 2026 | 80% | Gartner via PM Study Circle |
| PMs with extensive AI skills | **Only ~20%** | PMI Pulse 2025 |
| Main AI adoption barrier | Resistance to change (26%) | Xergy compilation |

*⚠️ Corrected from v1: The original claimed "AI is the #1 buyer criterion." No source supports this exact ranking. AI is among the top emerging priorities, but cloud adoption, integration capability, and remote work support rank equally or higher as actual purchasing drivers.*

---

## 4. Regulatory Drivers

### 4.1 Forcing Functions for Tool Adoption

Two regulations create mandatory demand for governed programme management in financial services:

**FCA Operational Resilience (PS21/3)** — UK
- Mandatory compliance deadline: **31 March 2025 (already passed)**
- Requires firms to identify important business services, set impact tolerances, perform mapping/testing, make ongoing investments
- Demands **continuous, auditable** governance of resilience programmes
- Scope: banks, insurers, PRA-designated investment firms, payment providers
- **Driver strength: HIGH — compliance mandate, not a nice-to-have**

**EU Digital Operational Resilience Act (DORA)** — EU
- Mandatory since **17 January 2025**
- Article 6 requires "sound, comprehensive and well-documented ICT risk management framework"
- Mandates documented strategies, procedures, and regular audit of ICT risk management
- Scope: banks, insurers, investment firms, crypto-asset providers across the entire EU
- **Driver strength: HIGH — non-compliance carries significant regulatory sanctions**

**Supporting regulatory environment:**
- Basel III operational risk requirements (indirect but culture-setting)
- MiFID II organisational governance (indirect)
- IOMFSA Corporate Governance Codes (mandatory for IOM-regulated entities)

### 4.2 Isle of Man Beachhead

The IoM has disproportionate concentration of regulated mid-market firms:
- Financial services = ~27% of IoM economy (banking 9% + insurance 18.2%)
- eGaming = 15.7% (also governance/compliance-heavy)
- Estimated 200–400 regulated financial services entities
- Firms are typically in Helm's 50–500 employee sweet spot
- Face substantially the same governance pressures as UK-regulated firms
- But are typically smaller and may lack enterprise-grade tooling

---

## 5. Technical Approach — AI Framework

### 5.1 Framework Comparison

| Dimension | MetaGPT | CrewAI | AutoGen | LangGraph | Agency Swarm |
|-----------|---------|--------|---------|-----------|--------------|
| GitHub Stars | ~60k | ~40k | ~52k | ~12k | ~3.5k |
| Monthly Downloads | Moderate | ~1M | ~250k | **~4.2M** | Low |
| Status | v0.8.2 | **v1.0 GA** | Maintenance mode | Active | v1.4.0 |
| Durable Execution | ❌ | ❌ | ❌ | **✅** | ❌ |
| Human-in-the-Loop | ❌ | Limited | Limited | **✅ (first-class)** | ❌ |
| JS/TS Support | ❌ | ❌ | ❌ | **✅ (langgraphjs)** | ❌ |
| Helm Relevance | LOW-MEDIUM | HIGH | MEDIUM | **HIGHEST** | LOW |

### 5.2 Recommendation: LangGraph, Not MetaGPT

*⚠️ Corrected from v1: The original analysis focused on MetaGPT as Helm's AI framework. This was a category error.*

**MetaGPT** is a software company simulator, not a general-purpose workflow framework. Its roles (PM, Architect, Engineer, QA), outputs (PRDs, code), and assembly line are all hardcoded around software development. Adapting it for governance workflows would mean replacing every component — at which point you're not using MetaGPT, you're using its *ideas* in custom code.

**LangGraph** is recommended because it's the only framework with:
1. **Durable execution** — governance pipelines can survive failures and resume
2. **First-class human-in-the-loop** — governance approval gates are native, not bolted on
3. **Checkpointing** — long-running report generation persists state
4. **JavaScript support** — integrates directly with Helm's Next.js stack

### 5.3 Patterns Worth Borrowing from MetaGPT

Despite being the wrong framework, MetaGPT's *design principles* are directly applicable:

- **SOP-encoded workflows** — agents follow explicit procedures, not freeform chat (maps to P3O governance)
- **Structured intermediate outputs** — standardised documents between stages (maps to RAID → Actions → Reporting)
- **Role-based bounded responsibility** — clear scope, goal, and constraints per agent
- **Watch triggers** — deterministic activation based on upstream outputs

### 5.4 The MetaGPT SOP Claim — Corrected

The v1 report stated: *"MetaGPT's core thesis: a software company's real intellectual property is its Standard Operating Procedures, not its code."*

**This is an interpretive paraphrase, not a direct quote.** The actual MetaGPT philosophy is:

> "Code = SOP(Team)" — output is a function of applying SOPs to teams of LLM agents.

The academic paper states SOPs "play a critical role in supporting task decomposition and effective coordination" — a statement about process efficiency, not intellectual property. The "IP" framing was editorialised.

### 5.5 Recommended AI Architecture for Helm

```
Meeting Recording
       ↓
[Transcription] — Whisper/Deepgram
       ↓
[Extraction Agent] — extract actions, decisions, risks, issues
       ↓
[Classification Agent] — categorise into RAID taxonomy
       ↓
[Human Review Gate] — PM reviews/approves (LangGraph interrupt)  ← CRITICAL
       ↓
[RAID Integration] — approved items → Helm database
       ↓
[Reporting Agent] — governance summaries on schedule
       ↓
[Dashboard Update] — push to Helm UI
```

Each node follows an SOP template with explicit instructions, structured output schemas, validation rules, and escalation-to-human error handling.

---

## 6. Helm's Positioning

### 6.1 Unique Value Proposition

Based on the evidence gathered:

1. **Meeting → Governance Pipeline:** ❌ across all 15 vendors. Genuine white space. No PPM vendor connects meeting content to RAID logs, decision records, and action items.

2. **First-Class Decision Logging:** Only Completix includes "decisions" in RAID. Most tools treat decisions as notes or custom fields. Helm can own this as a first-class entity.

3. **P3O-Native Design:** Only 4–5 vendors support true Portfolio → Programme → Project hierarchy. None in the mid-market price range. Helm can be the first affordable PPM with native P3O.

4. **Governance-AI Focus:** While competitors focus AI on resource optimisation, content generation, or IT workflows, Helm focuses on **governance intelligence** — the underserved qualitative domain.

### 6.2 Positioning Statement

> **Helm:** Governance-first portfolio management for regulated mid-market organisations. AI that turns meetings into accountability.

**Market position:** Mid-market governance-native PPM with AI-powered meeting-to-action pipeline. Priced at $20–45/user/month — a clear premium over generic work management tools, a fraction of enterprise SPM.

### 6.3 What Still Needs Validation

This document is a desk research exercise. Before it's investment-ready:

| Gap | How to Close |
|-----|-------------|
| Customer interviews | Talk to 10–20 mid-market PMO leads in financial services |
| Willingness to pay | Test $20–45/user/month range with real prospects |
| Meeting-AI demand | Validate that meeting→action is a *purchase* driver, not just a nice-to-have |
| SAM assumptions | Verify the 35–45% governance-needs estimate through primary research |
| IOM beachhead viability | Assess whether 200–400 regulated entities is enough for initial traction |
| Build vs buy for transcription | Evaluate Whisper/Deepgram cost at target volumes |

---

## Source Summary

This document synthesises findings from 4 specialist research reports containing:
- **15 vendor analyses** across 10 capabilities (150+ individual assessments)
- **7 market research firms** reconciled for market sizing
- **6 industry surveys** (PMI, Wellingtone, KPMG, Standish, Monday.com, multiple AI adoption surveys)
- **40 sourced user complaints** from G2, Capterra, Reddit, TrustRadius, expert reviews
- **5 AI framework evaluations** with architecture analysis
- **5 regulatory frameworks** assessed for tool-adoption forcing function strength
- **100+ individual sources** cited across all reports

Full source lists are in each specialist report. Key sources:
- IDC PPM Forecast 2024–2028
- Gartner MQ for Strategic Portfolio Management 2025
- Forrester Wave: SPM Tools Q2 2024
- PMI Pulse of the Profession 2025
- Wellingtone State of Project Management 2025
- Apps Run The World — Top 10 PPM Vendors (Sept 2025)
- FCA PS21/3 — Building Operational Resilience
- EU Digital Operational Resilience Act (DORA) — Article 6

---

*This is a DRAFT for Bry's review. The source reports contain the full evidence base. This synthesis prioritises clarity and confidence-grading over exhaustive detail.*
