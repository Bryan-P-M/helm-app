# Currency Fixes for market-validation-revised-v2.md

**Prepared:** Subagent currency-fix  
**Exchange rate used:** 1 GBP ≈ 1.25 USD (1 USD ≈ 0.80 GBP). All conversions marked "at current rates."

---

## 1. Add Currency Convention Note

**Insert after the `Supersedes:` line and before the `---` separator**, so it sits inside the document header block:

```markdown
**Currency convention:** Global market figures are reported in USD ($), as published by the research firms. UK-specific figures (SAM, SOM, ARPU) use GBP (£), Helm's operating currency. Competitor pricing is quoted in USD, matching vendor-published rates. Where a figure bridges between scopes, both currencies are shown.
```

---

## 2. Specific Find → Replace Instructions

### Fix 2a — Executive Summary: SAM claim (body text)

**Context:** Paragraph starting "**The gap:**" in Executive Summary  
**Find:**
```
Helm can capture £43–53M SAM | **LOW-MEDIUM**
```
**Replace:**
```
Helm can capture £43–53M (~$54–66M) SAM | **LOW-MEDIUM**
```

### Fix 2b — Section 1.4 SAM: ARPU figure

**Context:** SAM bullet list under "**SAM (Serviceable Addressable Market) — UK Core:**"  
**Find:**
```
- At £400/month ARPU: **SAM ≈ £43M–53M/year**
```
**Replace:**
```
- At £400/month (~$500) ARPU: **SAM ≈ £43M–53M/year (~$54M–$66M)**
```

### Fix 2c — Section 1.4 SOM: Year 1 ARR

**Context:** SOM table, Year 1 row  
**Find:**
```
| 1 | 10–30 | £48K–144K |
```
**Replace:**
```
| 1 | 10–30 | £48K–144K (~$60K–180K) |
```

### Fix 2d — Section 1.4 SOM: Year 2 ARR

**Context:** SOM table, Year 2 row  
**Find:**
```
| 2 | 50–100 | £240K–480K |
```
**Replace:**
```
| 2 | 50–100 | £240K–480K (~$300K–600K) |
```

### Fix 2e — Section 1.4 SOM: Year 3 ARR

**Context:** SOM table, Year 3 row  
**Find:**
```
| 3 | 150–300 | £720K–1.44M |
```
**Replace:**
```
| 3 | 150–300 | £720K–1.44M (~$900K–1.8M) |
```

### Fix 2f — Section 2.3 Pricing Chart: Helm target line

**Context:** ASCII pricing chart in Section 2.3  
**Find:**
```
                                    ←— Helm target: $20-45/u/m —→
```
**Replace:**
```
                                    ←— Helm target: ~£16–36/u/m ($20–45) —→
```

### Fix 2g — Section 2.3 Pricing Positioning: prose below chart

**Context:** Bold summary line after the ASCII chart  
**Find:**
```
**Helm's sweet spot: $20–45/user/month.** This justifies a premium over generic mid-market tools ($9–25) through governance-native features while remaining a fraction of enterprise PPM ($50–200+).
```
**Replace:**
```
**Helm's sweet spot: ~£16–36/user/month ($20–45 at current rates).** This justifies a premium over generic mid-market tools ($9–25) through governance-native features while remaining a fraction of enterprise PPM ($50–200+).
```

### Fix 2h — Section 6.2 Positioning Statement: pricing in market position line

**Context:** Paragraph under "**Market position:**" in Section 6.2  
**Find:**
```
Priced at $20–45/user/month — a clear premium over generic work management tools, a fraction of enterprise SPM.
```
**Replace:**
```
Priced at ~£16–36/user/month ($20–45 at current rates) — a clear premium over generic work management tools, a fraction of enterprise SPM.
```

### Fix 2i — Section 6.3 Validation Table: willingness-to-pay row

**Context:** "What Still Needs Validation" table  
**Find:**
```
| Willingness to pay | Test $20–45/user/month range with real prospects |
```
**Replace:**
```
| Willingness to pay | Test ~£16–36/user/month ($20–45) range with real prospects |
```

---

## 3. Summary of Changes

| # | Section | What changed | Why |
|---|---------|-------------|-----|
| 1 | Header | Added currency convention note | Reader needs to understand why both currencies appear |
| 2a | Exec summary confidence table | £43–53M → £43–53M (~$54–66M) | UK SAM bridged to USD for context |
| 2b | §1.4 SAM | ARPU and SAM total get USD equivalents | UK figures need USD bridge from TAM |
| 2c–e | §1.4 SOM table | All 3 ARR rows get USD equivalents | Consistency with SAM treatment |
| 2f | §2.3 pricing chart | Helm target → GBP-primary with USD | Helm prices in GBP; USD for comparison |
| 2g | §2.3 prose | Helm sweet spot → GBP-primary with USD | Same rationale |
| 2h | §6.2 positioning | Helm pricing → GBP-primary with USD | Same rationale |
| 2i | §6.3 validation table | Pricing test → GBP-primary with USD | Same rationale |

### Figures NOT changed (and why)

| Figure | Section | Reason kept as-is |
|--------|---------|-------------------|
| ~$6.5B, ~$7.4B, $5.0–7.8B | §1.1, Exec Summary | Global market figures — USD per research firms |
| ~$2.6B, ~$3.0B | Exec Summary, §1.4 TAM | Global SME/mid-market portion — USD scope |
| $9–$200+/u/m (all competitor prices) | §2.1, §2.3, §2.4 | Competitor pricing — USD as published |
| ~$2 trillion | §3.1 | Global PMI waste figure — USD |
| $50–200+/user/month | Exec Summary | Competitor enterprise pricing — USD |

---

## 4. Notes for Reviewer

1. **Exchange rate sensitivity:** All conversions use ~1.25 USD/GBP. If Bry prefers a different rate or wants a fixed date reference, adjust accordingly.
2. **Helm's actual pricing** hasn't been set yet — the $20–45 range is positioning guidance. Once real pricing is decided (presumably in GBP), these figures should be updated.
3. **No structural rewrite needed.** The document's currency usage was mostly correct — global figures in USD, UK SAM/SOM in GBP. The main inconsistency was Helm's own pricing appearing in USD only (§2.3, §6.2, §6.3), and UK figures lacking USD equivalents for readers bridging from the global TAM.
