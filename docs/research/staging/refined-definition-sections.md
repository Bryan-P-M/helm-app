# Refined Definition Sections — Meeting-to-Governance Traceability

**Purpose:** Copy-paste-ready replacement sections for `market-validation-revised-v2.md`.  
**Reason:** Tighten the "Meeting→Action" white space claim. The original ❌-across-all-15 framing is defensible but imprecise — Otter.ai, Fireflies.ai, and Teams Premium *do* create basic tasks from meetings. The gap is specifically about **structured governance artefacts**, not generic task creation.  
**Date:** 2026-02-01

---

## 1. Definition Paragraph — New Addition

> **INSERT:** Immediately below the Executive Summary's "The white space:" paragraph, replacing the existing text. Also serves as the canonical definition wherever "Meeting-to-Governance Traceability" is referenced.

**The white space — Meeting-to-Governance Traceability:** Several tools already connect meetings to tasks. Otter.ai and Fireflies.ai extract action items from transcripts and push them to Asana, Monday.com, or Jira. Microsoft Teams Premium generates AI meeting recaps with suggested follow-ups. These integrations solve a real problem — but they operate at the *task* level: "John to send the revised budget by Friday." What no vendor offers is **meeting-to-governance traceability** — the automatic extraction of structured governance artefacts (RAID items, formal decision records, escalation triggers) from meeting transcripts, classified against a project's existing risk/issue taxonomy, and routed through approval workflows before becoming first-class entities in the PPM system. The distinction matters: a task is a to-do; a RAID entry is a governed, auditable, categorised record with ownership, review dates, and escalation paths. Existing meeting-AI tools create the former. Helm's white space is the latter.

---

## 2. Summary Matrix Footnote — Replace Existing

> **REPLACES:** The paragraph beginning "**Critical finding:** The 'Meeting→Action' column..." directly below the Section 2.1 matrix.  
> **ALSO:** Rename the column header in the matrix from `Meeting→Action` to `Meeting→Gov†`.

**Column header change:** `Meeting→Action` → `Meeting→Gov†`

**New footnote (replaces the "Critical finding" paragraph):**

**† Meeting→Gov (Meeting-to-Governance Traceability):** This column assesses whether the vendor natively extracts *structured governance artefacts* — RAID items, formal decision records, escalation triggers — from meeting content and routes them through approval workflows into the PPM system. It does **not** assess basic meeting-to-task integration, which exists via third-party tools: Otter.ai and Fireflies.ai push action items to Asana/Monday/Jira; Microsoft Teams Premium generates AI meeting recaps with suggested tasks. These integrations create tasks, not governed artefacts. The ❌ across all 15 vendors reflects the absence of governance-grade meeting extraction — not the absence of any meeting integration whatsoever.

*Full vendor-by-vendor analysis with sources per capability cell: see `competitive-intelligence.md`*

---

## 3. AI Landscape Section — Replace Key Gap Text

> **REPLACES:** The two paragraphs at the end of Section 2.2, beginning "**Planisware** has the deepest AI/ML stack..." through to "...This is Helm's AI positioning."

**Planisware** has the deepest AI/ML stack (predictive, Monte Carlo, PSO optimisation since 2016), but it's entirely quantitative — focused on numerical forecasting and resource optimisation. No qualitative/governance AI.

**Asana** has the most "agentic" approach (AI Teammates, AI Studio), but task-oriented — not governance-oriented.

**Key gap confirmed:** All vendor AI focuses on summarisation, prediction, content generation, or resource optimisation. Meeting-adjacent AI exists outside the PPM market — Otter.ai, Fireflies.ai, and Teams Premium can extract action items and generate recaps — but these tools produce flat task lists, not structured governance artefacts. **No vendor, PPM or otherwise, offers an AI pipeline from meeting transcript → classified RAID entries → approval gate → governed PPM record.** This is Helm's AI positioning: governance intelligence applied to unstructured meeting content.

---

## 4. Section 6.1 Bullet Point 1 — Replace Existing

> **REPLACES:** The first bullet in Section 6.1, beginning "1. **Meeting → Governance Pipeline:**..."

1. **Meeting-to-Governance Traceability:** ❌ across all 15 PPM vendors. Genuine white space — but precisely defined. Basic meeting-to-task pipelines exist (Otter.ai → Asana, Fireflies.ai → Monday, Teams Premium recaps), so the gap is not "meetings don't connect to work tools." The gap is that no tool extracts **structured governance artefacts** — RAID items classified against project taxonomies, formal decision records with ownership and review dates, escalation triggers routed through approval workflows — from meeting transcripts. Existing integrations create tasks; Helm creates governed, auditable, first-class PPM entities.

---

## 5. Additional Sections to Update (for consistency)

These sections also reference the old terminology and should be updated for consistency, though the task only explicitly requested items 1–4 above.

### 5a. Executive Summary — Confidence Table Row

> **REPLACES:** The row `| Meeting-to-action is white space | **HIGH** | ❌ across all 15 vendors verified individually |`

| Meeting-to-governance traceability is white space | **HIGH** | ❌ across all 15 vendors verified individually; basic meeting-to-task integrations (Otter, Fireflies, Teams) acknowledged — gap is governance-grade extraction |

### 5b. Section 2.4 — Competitive Threats Row 1

> **REPLACES:** The first row of the competitive threats table.

| Standalone meeting AI (Otter, Fireflies) adds governance extraction | **HIGH** | These tools already have transcript data and basic task extraction. Adding RAID classification and approval routing would directly challenge Helm's differentiator. Speed to market matters. |

### 5c. Section 6.2 — Positioning Statement

> **REPLACES:** The line `**Market position:** Mid-market governance-native PPM with AI-powered meeting-to-action pipeline.`

**Market position:** Mid-market governance-native PPM with AI-powered meeting-to-governance pipeline. Priced at $20–45/user/month — a clear premium over generic work management tools, a fraction of enterprise SPM.

### 5d. Changes from v1 Table — Row 3

> **REPLACES:** The row beginning `| Asserted gaps not proven |`

| Asserted gaps not proven | "Meeting-to-action is a gap" stated, not demonstrated | Meeting-to-governance traceability ❌ confirmed across all 15 vendors; gap precisely defined to exclude basic meeting-to-task integrations (Otter, Fireflies, Teams) |

---

## Summary of Changes

| What Changed | Why |
|-------------|-----|
| Renamed "Meeting→Action" → "Meeting-to-Governance Traceability" everywhere | The old name implied no meeting integration exists — misleading |
| Added canonical definition paragraph in Executive Summary | Precisely scopes the claim: governance artefacts, not tasks |
| Added matrix footnote with † marker | Explains what ❌ means (and doesn't mean) at point of reference |
| Acknowledged Otter/Fireflies/Teams capabilities | Preempts the obvious reviewer objection; strengthens credibility |
| Clarified the specific gap: RAID + decisions + approval routing | Makes the white space claim falsifiable and defensible |
| Updated competitive threats framing | Otter/Fireflies threat is now about them adding *governance* extraction, not just existing |
