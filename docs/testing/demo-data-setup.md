# Helm P3O Governance Platform - Demo Data Specification

## Overview
This document defines the pre-populated data required for Helm P3O Governance Platform demonstration scenarios. The data is designed to support five key demos in an Isle of Man Government / Financial Services context.

## Demo Scenarios Supported
1. **PMO Monday Morning** - Dashboard overview with exceptions
2. **Meeting-to-Action AI Extraction** - Automated action capture from meeting transcripts
3. **Portfolio View** - Hierarchical portfolio/programme/project status
4. **Day-to-Day Delivery** - RAID management and action tracking
5. **Setup from Scratch** - Demonstration of initial configuration

## Team Members

| Name | Email | Role |
|------|-------|------|
| Claire Quayle | c.quayle@gov.im | Portfolio Director (Digital Transformation) |
| David Cretney | d.cretney@gov.im | Portfolio Director (Regulatory Compliance) |
| Mark Shimmin | m.shimmin@gov.im | SRO (Customer Experience Uplift) |
| Sarah Callister | s.callister@gov.im | Programme Manager |
| James Kelly | j.kelly@gov.im | Programme Manager |
| Helen Corlett | h.corlett@gov.im | Programme Manager |
| Tom Kerruish | t.kerruish@gov.im | Project Manager |
| Anna Craine | a.craine@gov.im | Business Analyst |
| Peter Quilliam | p.quilliam@gov.im | Tech Lead |
| Rachel Skillicorn | r.skillicorn@gov.im | PMO Lead |

## Portfolio Hierarchy

```
Portfolio: Digital Transformation (Claire Quayle, AMBER)
├── Programme: Customer Experience Uplift (SRO: Mark Shimmin, PM: Sarah Callister, AMBER)
│   ├── Project: Online Portal Redesign (Tom Kerruish, GREEN)
│   └── Project: Citizen Engagement Platform (Anna Craine, AMBER)
└── Programme: Core Systems Modernisation (SRO: Claire Quayle, PM: James Kelly, RED)
    ├── Project: Core Banking Migration (Peter Quilliam, RED) ← the problem child
    └── Project: Data Warehouse Consolidation (James Kelly, AMBER)

Portfolio: Regulatory Compliance (David Cretney, GREEN)
└── Programme: FCA Compliance Programme (SRO: David Cretney, PM: Helen Corlett, GREEN)
    ├── Project: AML/KYC Automation (Helen Corlett, GREEN)
    └── Project: Regulatory Reporting Dashboard (Tom Kerruish, GREEN)
```

## RAID Items

### Risks (2 items)
| ID | Title | Project | Owner | Status | Impact | Probability | Description |
|----|-------|---------|-------|--------|--------|-------------|-------------|
| R001 | Legacy system compatibility issues | Core Banking Migration | Peter Quilliam | RED | High | High | Legacy COBOL systems may not integrate cleanly with new banking platform, requiring extensive middleware development |
| R002 | Regulatory non-compliance risk | AML/KYC Automation | Helen Corlett | AMBER | High | Medium | Automated KYC checks may miss edge cases, leading to regulatory penalties |

### Assumptions (2 items)
| ID | Title | Project | Owner | Status | Description |
|----|-------|---------|-------|--------|-------------|
| A001 | Vendor delivery timeline | Data Warehouse Consolidation | James Kelly | GREEN | Assumes Snowflake implementation partner will deliver Phase 1 by 15th March |
| A002 | User adoption rate | Online Portal Redesign | Tom Kerruish | AMBER | Assumes 60% of citizens will migrate to new portal within 3 months of launch |

### Issues (4 items)
| ID | Title | Project | Owner | Status | Severity | Description | Escalated |
|----|-------|---------|-------|--------|----------|-------------|-----------|
| I001 | Critical resource shortage | Core Banking Migration | Peter Quilliam | RED | Critical | Lost two senior Java developers to competitor; project timeline at risk | Yes |
| I002 | Vendor contract dispute | Data Warehouse Consolidation | James Kelly | RED | High | Snowflake implementation partner disputing scope change for GDPR compliance module | No |
| I003 | Security vulnerability | Online Portal Redesign | Tom Kerruish | RED | Critical | Pen test revealed SQL injection vulnerability in citizen feedback module | No |
| I004 | Budget overrun | Citizen Engagement Platform | Anna Craine | AMBER | Medium | Social media integration costs 40% higher than budgeted | No |

### Dependencies (4 items)
| ID | Title | Project | Owner | Status | Dependency Type | Blocked By | Due Date |
|----|-------|---------|-------|--------|-----------------|------------|----------|
| D001 | FCA regulatory approval | AML/KYC Automation | Helen Corlett | GREEN | External | Financial Conduct Authority | 2024-04-15 |
| D002 | Legacy data migration | Core Banking Migration | Peter Quilliam | AMBER | Internal | Data Warehouse team | 2024-03-31 |
| D003 | Identity provider integration | Online Portal Redesign | Tom Kerruish | GREEN | External | Government Digital Identity team | 2024-03-15 |
| D004 | Compliance sign-off | Regulatory Reporting Dashboard | Tom Kerruish | AMBER | Internal | Legal & Compliance department | 2024-04-01 |

## Actions

### OVERDUE Actions (3 items)
| ID | Title | Project | Owner | Due Date | Status | Description |
|----|-------|---------|-------|----------|--------|-------------|
| ACT001 | Finalise migration cutover plan | Core Banking Migration | Peter Quilliam | 2024-02-10 | OVERDUE | Complete detailed cutover plan for banking migration weekend |
| ACT002 | Submit budget variance report | Data Warehouse Consolidation | James Kelly | 2024-02-15 | OVERDUE | Document and justify 15% budget overrun to Portfolio Board |
| ACT003 | Remediate SQL injection vulnerability | Online Portal Redesign | Tom Kerruish | 2024-02-20 | OVERDUE | Implement parameterised queries and re-test vulnerable modules |

### OPEN Actions (3 items)
| ID | Title | Project | Owner | Due Date | Status | Description |
|----|-------|---------|-------|----------|--------|-------------|
| ACT004 | Conduct user acceptance testing | Citizen Engagement Platform | Anna Craine | 2024-03-25 | OPEN | Schedule and execute UAT with 50 citizen volunteers |
| ACT005 | Draft vendor performance review | Data Warehouse Consolidation | James Kelly | 2024-03-30 | OPEN | Prepare assessment of Snowflake implementation partner performance |
| ACT006 | Update risk register | AML/KYC Automation | Helen Corlett | 2024-04-05 | OPEN | Incorporate new FCA guidance on AI-assisted KYC checks |

### COMPLETED Actions (4 items)
| ID | Title | Project | Owner | Due Date | Status | Completed Date | Description |
|----|-------|---------|-------|----------|--------|----------------|-------------|
| ACT007 | Initial project kick-off | Core Banking Migration | Peter Quilliam | 2024-01-15 | COMPLETED | 2024-01-12 | Conducted project kick-off with all stakeholders |
| ACT008 | Requirements workshop | Online Portal Redesign | Tom Kerruish | 2024-01-20 | COMPLETED | 2024-01-18 | Facilitated requirements gathering with citizen focus groups |
| ACT009 | Technology stack selection | Regulatory Reporting Dashboard | Tom Kerruish | 2024-01-25 | COMPLETED | 2024-01-22 | Evaluated and selected Power BI vs Tableau for dashboard |
| ACT010 | Compliance framework review | AML/KYC Automation | Helen Corlett | 2024-02-01 | COMPLETED | 2024-01-30 | Reviewed FCA and IOM FSA compliance requirements |

## Meetings

### Meeting 1: Core Banking Migration Steering Committee
**Date:** 2024-02-28  
**Time:** 14:00-15:30  
**Attendees:** Claire Quayle, James Kelly, Peter Quilliam, Rachel Skillicorn, Mark Shimmin (guest)  
**Project:** Core Banking Migration  
**Status:** Completed

#### Full Transcript (AI Extraction Demo)
**Claire Quayle:** Right, let's get started. Thanks everyone for making time. Peter, can you give us a status update on the Core Banking Migration?

**Peter Quilliam:** Thanks Claire. We're at a critical juncture. The good news is we've completed 70% of the code migration from the legacy COBOL systems. The bad news is we've hit a major resource constraint. We lost both our senior Java developers last week to a competitor offering 30% higher salaries.

**James Kelly:** That's concerning. What's the impact on our March 31st deadline?

**Peter Quilliam:** Realistically, we're looking at a 4-6 week delay unless we can backfill immediately. I've been working with HR but the market for banking system Java expertise is incredibly tight right now.

**Claire Quayle:** This can't slip into Q2. We have regulatory reporting deadlines tied to this migration. Rachel, what are our options?

**Rachel Skillicorn:** I've spoken with the PMO across government. There are two possibilities: we could bring in contractors from Deloitte at a premium rate, or we could borrow developers from the Online Portal project temporarily.

**Mark Shimmin:** I'd caution against pulling from the Portal project. We're already behind on citizen engagement targets. The contractors option sounds better but we need budget approval.

**Claire Quayle:** Agreed. **ACTION: James to prepare a budget variance request for contractor costs by Friday 8th March.** We'll need to present this to the Portfolio Board next week. Any other issues?

**Peter Quilliam:** Yes, the data migration from the legacy warehouse is also behind schedule. The Data Warehouse team is dealing with their own vendor issues.

**James Kelly:** That's my problem child. Snowflake are disputing the scope of the GDPR module. **DECISION: We need to make a call here - either accept their additional charges or find an alternative compliance solution.** I recommend we accept their terms to avoid further delay. The additional £85k is painful but cheaper than missing our regulatory deadlines.

**Claire Quayle:** I agree. **DECISION: Approved - accept Snowflake's terms for GDPR module.** Document the rationale as vendor lock-in risk versus regulatory compliance imperative. Now, risks - Peter, update us on the legacy integration concerns.

**Peter Quilliam:** Our pen test revealed the middleware API has authentication vulnerabilities when connecting to the old mainframe. **RISK: High probability of security breach during parallel run period.** We need to implement additional security layers before we go live.

**Rachel Skillicorn:** **ACTION: Peter to schedule a security review with the CISO team by Wednesday 6th March.** We can't afford a breach during migration.

**Claire Quayle:** Good. Final item - cutover planning. Peter, when will we have the detailed plan?

**Peter Quilliam:** The team is working on it but with the resource gap... **ACTION: I'll have the draft cutover plan by Monday 11th March for review.** We'll need a full weekend outage approved by the banks.

**Claire Quayle:** Make it happen. James, support Peter on the resource issue. Rachel, track these actions. Next steering committee in two weeks. Meeting adjourned.

### Meeting 2: Customer Experience Programme Review
**Date:** 2024-02-25  
**Time:** 10:00-11:00  
**Attendees:** Mark Shimmin, Sarah Callister, Tom Kerruish, Anna Craine  
**Projects:** Online Portal Redesign, Citizen Engagement Platform  
**Status:** Completed  
**Brief:** Reviewed progress on both projects. Portal redesign is GREEN despite security fix required. Citizen Engagement Platform AMBER due to budget overrun. Agreed to reprioritise features to stay within budget.

### Meeting 3: Regulatory Compliance Quarterly Review
**Date:** 2024-02-20  
**Time:** 09:30-10:30  
**Attendees:** David Cretney, Helen Corlett, Tom Kerruish  
**Projects:** AML/KYC Automation, Regulatory Reporting Dashboard  
**Status:** Completed  
**Brief:** Both projects GREEN. FCA approval on track for April. Dashboard prototype well received by compliance team.

### Meeting 4: Portfolio Board Monthly
**Date:** 2024-02-15  
**Time:** 13:00-15:00  
**Attendees:** All Portfolio Directors, PMO Lead, SROs  
**Status:** Completed  
**Brief:** Reviewed all programmes. Approved additional funding for Data Warehouse GDPR module. Escalated Core Banking resource issue to Director level.

## Decisions

| ID | Title | Project | Made By | Date | Rationale | Linked Meeting |
|----|-------|---------|---------|------|-----------|----------------|
| DEC001 | Accept Snowflake GDPR module terms | Data Warehouse Consolidation | Claire Quayle | 2024-02-28 | Vendor lock-in risk outweighed by regulatory compliance imperative and timeline constraints | Core Banking Migration Steering Committee |
| DEC002 | Select Power BI over Tableau | Regulatory Reporting Dashboard | Tom Kerruish | 2024-01-22 | Lower total cost of ownership, better integration with existing Microsoft stack, stronger IOM government support | Technology evaluation workshop |
| DEC003 | Approve budget increase for social media integration | Citizen Engagement Platform | Mark Shimmin | 2024-02-25 | Required for meeting citizen engagement KPIs; cost offset by reducing print marketing budget | Customer Experience Programme Review |
| DEC004 | Proceed with contractor hiring for Java developers | Core Banking Migration | Claire Quayle | 2024-02-28 | Critical path activity; internal resource market insufficient; premium cost acceptable to meet regulatory deadlines | Core Banking Migration Steering Committee |
| DEC005 | Implement two-phase security approach for legacy integration | Core Banking Migration | Peter Quilliam | 2024-02-20 | Addresses immediate vulnerability while allowing time for comprehensive security redesign | Security review meeting |
| DEC006 | Defer advanced analytics module from Phase 1 | Data Warehouse Consolidation | James Kelly | 2024-02-10 | Scope reduction necessary to meet budget constraints; analytics can be added in Phase 2 | Project team meeting |

## RACI Matrix Samples

### Core Banking Migration - Key Deliverables
| Deliverable | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|-------------|-----------------|-----------------|---------------|--------------|
| Migration Cutover Plan | Peter Quilliam | Claire Quayle | James Kelly, Rachel Skillicorn | All team members |
| Legacy System Integration | Peter Quilliam | Peter Quilliam | Anna Craine (BA), Tech Architecture team | Claire Quayle |
| Security Implementation | Security team | Peter Quilliam | CISO office | Claire Quayle, James Kelly |
| Regulatory Compliance Sign-off | Helen Corlett | Claire Quayle | Legal department, FSA liaison | Portfolio Board |

### Online Portal Redesign - Key Deliverables
| Deliverable | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|-------------|-----------------|-----------------|---------------|--------------|
| User Interface Design | Tom Kerruish | Mark Shimmin | Citizen focus groups, Accessibility team | Sarah Callister |
| Security Remediation | Tom Kerruish | Tom Kerruish | CISO office, Pen test team | Mark Shimmin |
| Identity Provider Integration | Tom Kerruish | Mark Shimmin | Government Digital Identity team | Sarah Callister, Claire Quayle |
| User Acceptance Testing | Anna Craine | Tom Kerruish | Citizen volunteers, Business users | Mark Shimmin |

## Reset Instructions

To restore demo data to a clean state:

### SQL Approach (Recommended)
```sql
-- Truncate all demo data tables (adjust table names as per your schema)
TRUNCATE TABLE actions CASCADE;
TRUNCATE TABLE decisions CASCADE;
TRUNCATE TABLE meetings CASCADE;
TRUNCATE TABLE rai_items CASCADE;
TRUNCATE TABLE project_members CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE programmes CASCADE;
TRUNCATE TABLE portfolios CASCADE;
TRUNCATE TABLE team_members CASCADE;

-- Re-seed with demo data
-- Run the seed script that inserts all data from this specification
\i /path/to/helm-app/docs/testing/seed-demo-data.sql
```

### API Approach
```bash
# Use the Helm API reset endpoint (if implemented)
curl -X POST https://helm-api.gov.im/api/demo/reset \
  -H "Authorization: Bearer DEMO_TOKEN" \
  -H "Content-Type: application/json"
```

### Manual Reset Steps
1. **Backup current data** (if needed)
2. **Run truncate script** to clear demo tables
3. **Execute seed script** to insert fresh demo data
4. **Verify data integrity** by checking record counts match this specification
5. **Clear any cached data** in the application layer

### Seed Script Structure
The seed script should:
1. Insert team members (10 records)
2. Insert portfolios (2 records)
3. Insert programmes (3 records)
4. Insert projects (6 records)
5. Insert RAID items (12+ records)
6. Insert actions (10+ records)
7. Insert meetings (4+ records)
8. Insert decisions (6+ records)
9. Set up RACI relationships
10. Link all items appropriately (foreign keys)

### Testing Reset
After reset, verify:
- Dashboard shows correct exception counts (3 RED RAID items, 3 OVERDUE actions)
- Portfolio hierarchy displays correctly
- All demo scenarios work as expected
- AI extraction demo has the full meeting transcript available

## Data Validation Checklist
- [ ] 10 team members inserted
- [ ] 2 portfolios with correct statuses
- [ ] 3 programmes with correct SRO/PM assignments
- [ ] 6 projects with correct RAG statuses
- [ ] 12+ RAID items (3 RED, 4 AMBER, 5 GREEN)
- [ ] 10+ actions (3 OVERDUE, 3 OPEN, 4 COMPLETED)
- [ ] 4+ meetings with one full transcript
- [ ] 6+ decisions with rationale
- [ ] RACI matrices populated for two projects
- [ ] All foreign key relationships intact
- [ ] Demo scenarios all functional

---

*Last Updated: 2024-02-29*  
*Maintainer: PMO Team*  
*Version: 2.0*