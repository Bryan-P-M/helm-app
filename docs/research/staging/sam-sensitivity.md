### 1.4.1 SAM Sensitivity Analysis

*The SAM estimate of £43M–53M rests on three multiplied assumptions. Since errors compound multiplicatively, even modest shifts in any single variable swing the final figure dramatically. This section stress-tests those assumptions.*

#### Variable Confidence Rating

| Variable | Value Used | Source | Confidence |
|----------|-----------|--------|------------|
| UK firms (50–500 employees) | 42,000 | UK Business Population Estimates 2024 (BEIS/DBT) | **FIRM** — government statistical release, published methodology |
| Governance needs filter | 35–45% | Author synthesis from PMI/Wellingtone survey data | **SOFT** — no direct source; inferred from adjacent data points |
| Sector filter | 60% | Author estimate of regulated/governance-heavy sectors | **SOFT** — no source; plausible but unvalidated |
| ARPU | £400/month | Benchmarked against competitor mid-market pricing | **MEDIUM** — grounded in competitor data (£9–60/user/month × assumed seat count) but untested with buyers |

The 42,000 base is the one number we can defend in a pitch. The other three are the variables a diligent reviewer — or investor — would attack.

---

#### Sensitivity Table: SAM Under Different Assumption Combinations

Formula: `42,000 × governance % × sector % × ARPU × 12`

The following 10 scenarios span the plausible range, from pessimistic through to optimistic:

| # | Scenario | Gov. Needs | Sector Filter | ARPU/mo | Addressable Firms | SAM (£M/yr) |
|---|----------|-----------|---------------|---------|-------------------|-------------|
| 1 | **Pessimistic floor** | 25% | 40% | £200 | 4,200 | **£10.1M** |
| 2 | **Low-conservative** | 25% | 50% | £400 | 5,250 | **£25.2M** |
| 3 | **Low gov, broad sector** | 25% | 70% | £400 | 7,350 | **£35.3M** |
| 4 | **Base case (low end)** | 35% | 60% | £400 | 8,820 | **£42.3M** |
| 5 | **Base case (high end)** | 45% | 60% | £400 | 11,340 | **£54.4M** |
| 6 | **Higher gov, narrower sector** | 45% | 50% | £400 | 9,450 | **£45.4M** |
| 7 | **Mid gov, mid sector, premium** | 35% | 50% | £600 | 7,350 | **£52.9M** |
| 8 | **Broad adoption, budget ARPU** | 55% | 70% | £200 | 16,170 | **£38.8M** |
| 9 | **High gov, broad sector** | 55% | 70% | £400 | 16,170 | **£77.6M** |
| 10 | **Optimistic ceiling** | 55% | 70% | £600 | 16,170 | **£116.4M** |

**Key observations:**

- **The realistic range is roughly £25M–£55M.** Scenarios 2–7 represent defensible combinations; the base case sits comfortably mid-range.
- **ARPU is the highest-leverage variable.** Compare scenarios 4 vs 7: shifting ARPU from £400 to £600 while *lowering* the sector filter still produces a higher SAM (£52.9M vs £42.3M). Pricing strategy matters more than TAM precision.
- **Even the pessimistic floor (£10.1M) is a viable market** for a startup targeting £1–3M ARR (see break-even analysis below).
- **Governance needs and sector filter partially offset each other.** Low governance needs + broad sector reach (scenario 3) produces a similar SAM to high governance needs + narrow sector (scenario 6). The *combination* matters more than either variable alone.

---

#### Break-Even Reality Check

**Question:** What is the minimum SAM at which Helm's business plan remains viable?

**Working backwards from Year 3 targets:**

| Metric | Conservative | Moderate | Ambitious |
|--------|-------------|----------|-----------|
| Year 3 ARR target | £720K | £1.0M | £1.44M |
| Required market penetration at base SAM (£43M) | 1.7% | 2.3% | 3.3% |
| Required market penetration at pessimistic SAM (£10M) | 7.2% | 10.0% | 14.4% |
| Required market penetration at low-conservative SAM (£25M) | 2.9% | 4.0% | 5.8% |

**SaaS penetration benchmarks:**
- Year 3 penetration of 1–3% of SAM is typical for a well-executed B2B SaaS startup (Bessemer, OpenView data)
- Penetration above 5% in Year 3 is uncommon without significant funding or viral adoption
- Penetration above 10% in Year 3 would be exceptional and shouldn't be planned for

**Verdict:** Helm needs a SAM of **at least ~£20M** for the business model to work on realistic penetration assumptions (≤3–4% by Year 3). The base case of £43–53M gives comfortable headroom. Even the pessimistic floor of £10M is survivable only if Helm dramatically outperforms typical penetration rates — which shouldn't be the plan.

**The critical threshold is not "is the SAM big enough?" but "is the SAM big enough at realistic penetration rates?"** At £25M+, the answer is yes. Below £20M, the plan starts to depend on heroic assumptions about market capture.

---

#### What Primary Research Would Resolve

Each soft variable maps to a specific, achievable research activity:

| Variable | Current Basis | What Would Harden It | Effort |
|----------|--------------|---------------------|--------|
| **Governance needs (35–45%)** | Inferred from PMI adoption stats + Wellingtone satisfaction gap | **10–15 discovery interviews** with mid-market PMO leads asking: "Do you have formal programme governance? What triggers it?" Would also reveal whether governance is binary or a spectrum. | 2–3 weeks |
| **Sector filter (60%)** | Author estimate of "governance-heavy sectors" | **Cross-reference** ONS IDBR sector breakdown for 50–500 employee firms against FCA/DORA/NHS regulatory scope. Desk research — no interviews needed. | 2–3 days |
| **ARPU (£400/month)** | Competitor pricing benchmarked, seat-count estimated | **5–8 pricing validation conversations** during discovery interviews. Ask: "What do you pay now? What would you pay for [described Helm value]?" Alternately, run a Van Westendorp pricing survey. | Bundled with interviews |
| **Base count (42,000)** | UK BPE 2024 | **No action needed** — this is the firm number. If anything, cross-check with ONS IDBR for sector-specific breakdowns. | N/A |

**Recommended sequence:** Sector filter first (desk research, fast, cheap), then discovery interviews (resolves governance needs + ARPU simultaneously). Total cost to harden all three soft variables: ~3 weeks and £0 in direct spend.

---

*This analysis should be inserted after the SAM/SOM table in Section 1.4 of the main document. When the primary research listed above is completed, update the base case ranges and re-run this sensitivity table with validated inputs.*
