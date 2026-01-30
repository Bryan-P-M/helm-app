# Helm MVP — Production Cost Estimate & Cashflow Plan
**Prepared:** 29 January 2026
**Author:** Silas (for Bry's review)
**Status:** DRAFT — estimates based on current pricing and projected scope

---

## 1. Executive Summary

**Total MVP development cost:** £280 – £520 (one-off)
**Monthly running cost (production):** £25 – £55/month
**Time to MVP:** 8–12 weeks (part-time, AI-assisted)
**Break-even users (at £49/mo SaaS):** 1–2 paying customers

---

## 2. Costs to Date

| Item | Cost | Notes |
|------|------|-------|
| Anthropic API (Opus) | ~£40 est. | Helm planning/docs sessions within broader Silas usage |
| OpenAI API | £0 | Not yet used for Helm |
| Infrastructure | £0 | No hosting yet |
| **Total spent** | **~£40** | Rough estimate — Helm share of overall API usage |

*Note: Exact Helm-specific token usage is hard to isolate from general Silas usage. Consider tagging future Helm sessions.*

---

## 3. Development Phase — Cost Estimate

### 3a. AI Token Costs (Building the MVP)

| Model | Usage | Est. Tokens | Cost/M (in/out) | Est. Cost |
|-------|-------|-------------|------------------|-----------|
| **Opus** (architecture, planning, complex logic) | 10-15 sessions | ~3M total | $15/$75 | £60–£120 |
| **Sonnet** (most coding, CRUD, UI, testing) | 40-60 sessions | ~20M total | $3/$15 | £40–£70 |
| **OpenAI/Codex CLI** (grunt coding, boilerplate) | Ongoing | Included | ChatGPT sub | £20/mo × 3mo = £60 |
| **Total AI development** | | | | **£160–£250** |

**Cost-saving strategy:** Use Opus only for architecture decisions and complex AI feature design. Sonnet for 80% of coding. Codex CLI for boilerplate and repetitive tasks.

### 3b. Tool Subscriptions During Development

| Tool | Cost | Duration | Total |
|------|------|----------|-------|
| Figma (free tier) | £0 | Ongoing | £0 |
| ChatGPT Plus (Codex CLI) | £20/mo | 3 months | £60 |
| Anthropic API credits | Pay-as-go | 3 months | Included above |
| GitHub (free tier) | £0 | Ongoing | £0 |
| Domain (helm-app.com or similar) | ~£12/yr | 1 year | £12 |
| **Total tools** | | | **£72** |

### 3c. Infrastructure During Development

| Service | Cost | Notes |
|---------|------|-------|
| Local development (silas-server) | £0 | Already running |
| Supabase (free tier) | £0 | 500MB DB, 50K auth users, generous limits |
| Vercel (free tier) | £0 | Hobby plan for dev/staging |
| **Total infrastructure** | **£0** | Free tier covers development |

### 📊 Total Development Phase

| Category | Low | High |
|----------|-----|------|
| AI tokens (Opus + Sonnet) | £100 | £190 |
| ChatGPT subscription (3mo) | £60 | £60 |
| Tools & domain | £12 | £12 |
| Infrastructure | £0 | £0 |
| Contingency (20%) | £34 | £52 |
| **TOTAL DEVELOPMENT** | **£206** | **£314** |

---

## 4. Production Phase — Monthly Running Costs

### MVP Launch (Month 1-6)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| **Vercel Pro** | £16/mo | Production hosting, custom domain, analytics |
| **Supabase Pro** | £20/mo | 8GB DB, 100K auth users, daily backups |
| **Anthropic API** (meeting extraction) | £5–£15/mo | Sonnet for AI features. ~200 extractions/mo × ~5K tokens = £5. Scale with usage |
| **Domain renewal** | £1/mo | Amortised annual |
| **Error monitoring** (Sentry free) | £0 | Free tier |
| **Email (transactional)** | £0 | Resend free tier (3K emails/mo) |
| **TOTAL MONTHLY** | **£42–£52/mo** | |

### Scaling Triggers (when to upgrade)

| Trigger | Action | Added Cost |
|---------|--------|------------|
| >500MB database | Supabase Pro (already included) | £0 |
| >100 concurrent users | Vercel Pro (already included) | £0 |
| >1000 AI extractions/mo | Monitor Anthropic costs | +£10-30/mo |
| >100K auth users | Supabase Team | +£30/mo |
| Custom email domain | Resend Pro | +£15/mo |

---

## 5. Cashflow Worksheet — 6 Month View

### Assumptions
- Development starts Feb 2026
- MVP ready by April 2026
- Soft launch May 2026
- First paying customers June 2026
- SaaS price: £49/user/month (PMO/Enterprise tier)

| | **Feb** | **Mar** | **Apr** | **May** | **Jun** | **Jul** |
|---|---------|---------|---------|---------|---------|---------|
| **Phase** | Dev | Dev | Dev+Test | Launch | Growth | Growth |
| | | | | | | |
| **COSTS** | | | | | | |
| Anthropic API | £50 | £50 | £30 | £10 | £10 | £15 |
| ChatGPT Plus | £20 | £20 | £20 | £20 | £20 | £20 |
| Vercel | £0 | £0 | £16 | £16 | £16 | £16 |
| Supabase | £0 | £0 | £20 | £20 | £20 | £20 |
| Domain | £12 | – | – | – | – | – |
| Contingency | £10 | £10 | £10 | £5 | £5 | £5 |
| **Total Costs** | **£92** | **£80** | **£96** | **£71** | **£71** | **£76** |
| | | | | | | |
| **Cumulative Cost** | £92 | £172 | £268 | £339 | £410 | £486 |
| | | | | | | |
| **REVENUE** | | | | | | |
| Paying users | 0 | 0 | 0 | 0 | 2 | 4 |
| Monthly revenue | – | – | – | – | £98 | £196 |
| **Cumulative Revenue** | £0 | £0 | £0 | £0 | £98 | £294 |
| | | | | | | |
| **NET MONTHLY** | -£92 | -£80 | -£96 | -£71 | +£27 | +£120 |
| **Cumulative P&L** | -£92 | -£172 | -£268 | -£339 | -£312 | -£192 |

### Break-even Analysis
- **Maximum cash outlay before revenue:** ~£340
- **Monthly break-even:** 2 users at £49/mo covers running costs
- **Full cost recovery:** ~8 months (with 4+ users by month 6)
- **Payback point:** Month 8-9 (cumulative revenue exceeds cumulative cost)

---

## 6. Revenue Assumptions & Pricing Tiers (Draft)

| Tier | Price | Target |
|------|-------|--------|
| **Starter** | £29/mo | Small team, 1 programme, basic features |
| **Professional** | £49/mo | PMO team, multiple programmes, AI features |
| **Enterprise** | £99/mo | Portfolio-level, advanced reporting, API access |

*Per-seat or per-workspace pricing TBD — needs market research.*

---

## 7. Risk Register (Financial)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI API costs spike with usage | Med | Med | Cap per-user extraction limits; use cheapest viable model (Sonnet > Haiku) |
| Development takes longer than estimated | Med | High | Keep MVP scope tight; cut features, not quality |
| No paying customers by month 6 | High | Med | Validate with IOM Gov demo first; adjust pricing/positioning |
| Anthropic/OpenAI pricing changes | Low | Low | Multi-provider support; swap models if needed |
| Free tier limits hit during dev | Low | Low | Generous limits on both Vercel and Supabase |

---

## 8. Decisions Needed

- [ ] **Tech stack confirmation:** Supabase + Vercel + Next.js? (Affects cost structure)
- [ ] **AI model for extraction:** Sonnet (quality) vs Haiku (cost) vs OpenAI GPT-4o-mini (cheapest)?
- [ ] **Pricing model:** Per-seat vs per-workspace vs flat rate?
- [ ] **Demo target date:** When is the IOM Gov demo? (Drives timeline)
- [ ] **MVP feature cut-line:** What's in v1 vs v2?

---

## 9. What This Doesn't Include

- Bry's time (opportunity cost)
- Marketing/sales costs
- Legal (terms of service, data processing agreements)
- Insurance (PI, cyber)
- Company formation costs (if creating a Ltd)
- VAT implications

---

*This estimate assumes AI-assisted development using Silas + sub-agents. Traditional developer costs would be 10-20× higher. The advantage of this approach is the cash outlay is an order of magnitude lower — the trade-off is Bry's time investment in directing the build.*
