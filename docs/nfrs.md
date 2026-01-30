# Non-Functional Requirements

This document defines non-functional requirements (NFRs) for Helm. Requirements are set at realistic levels for an early-stage product, with notes on what would need to change for enterprise-grade deployment.

---

## Summary Table

| Category | MVP Requirement | Enterprise Target (Future) |
|----------|-----------------|---------------------------|
| **Performance** | Page load <3s; API response <1s | Page load <1s; API <200ms |
| **Scalability** | Single tenant; 1 org, 50 users | Multi-tenant; 100+ orgs |
| **Availability** | 99% uptime; planned maintenance OK | 99.9% uptime; zero downtime deploys |
| **Security** | Azure AD SSO; HTTPS; encryption at rest | SOC2; penetration tested |
| **Compliance** | GDPR basics | SOC2 Type II; ISO 27001 |
| **Data** | Daily backups; 90-day retention | Real-time replication; 7-year retention |
| **Accessibility** | WCAG 2.1 Level A | WCAG 2.1 Level AA |
| **Browser Support** | Modern browsers (Chrome, Edge, Safari, Firefox) | Same + legacy support if required |

---

## Performance

### MVP Requirements

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Page load time** | <3 seconds (first contentful paint) | Acceptable for business applications |
| **API response time** | <1 second for standard operations | Users perceive <1s as responsive |
| **Dashboard render** | <3 seconds for portfolio dashboard | May involve aggregation queries |
| **Search response** | <2 seconds for RAID/action search | Acceptable for moderate data volumes |
| **Concurrent users** | 20 simultaneous users | Sufficient for single-org pilot |

### Enterprise Target (Future)

| Metric | Target | What Changes |
|--------|--------|--------------|
| Page load time | <1 second | CDN, caching, code splitting |
| API response time | <200ms | Database optimisation, caching layer |
| Concurrent users | 500+ simultaneous | Horizontal scaling, load balancing |

### Architecture Impact

- **MVP**: Simple architecture acceptable; single server can handle load
- **Future**: Will need caching layer (Redis), CDN, potentially read replicas

---

## Scalability

### MVP Requirements

| Dimension | Target | Rationale |
|-----------|--------|-----------|
| **Tenancy model** | Single tenant (one org per deployment) | Simplifies MVP; isolation guaranteed |
| **Organisations** | 1 organisation | Pilot focus |
| **Users per org** | Up to 50 | Covers typical PMO + programme teams |
| **Portfolios** | Up to 5 | Most organisations have 1-3 |
| **Programmes per portfolio** | Up to 20 | Reasonable upper bound |
| **Projects per programme** | Up to 50 | Allows for large programmes |
| **RAID items** | Up to 10,000 total | Sufficient for pilot |
| **Actions** | Up to 20,000 total | Sufficient for pilot |

### Enterprise Target (Future)

| Dimension | Target | What Changes |
|-----------|--------|--------------|
| Tenancy model | Multi-tenant | Data isolation, tenant routing |
| Organisations | 100+ | Shared infrastructure with tenant isolation |
| Users per org | 500+ | Performance optimisation |
| Total data volume | Millions of records | Database sharding, archival strategy |

### Architecture Impact

- **MVP**: Single-tenant simplifies everything; no tenant isolation complexity
- **Decision Point**: Multi-tenancy is a significant architectural change; build for it early if targeting SaaS at scale
- **Recommendation**: Design data model with `organisation_id` from day one, even if single-tenant initially

---

## Availability

### MVP Requirements

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Uptime target** | 99% (allows ~7 hours downtime/month) | Realistic for early stage |
| **Planned maintenance** | Acceptable with 24-hour notice | Business hours maintenance OK |
| **Recovery time objective (RTO)** | 4 hours | Time to restore service after failure |
| **Recovery point objective (RPO)** | 24 hours | Maximum acceptable data loss |

### Enterprise Target (Future)

| Metric | Target | What Changes |
|--------|--------|--------------|
| Uptime target | 99.9% (~9 hours downtime/year) | Redundancy, monitoring, auto-failover |
| Planned maintenance | Zero downtime deployments | Blue-green deploys, rolling updates |
| RTO | 1 hour | Hot standby, automated failover |
| RPO | 1 hour | Real-time replication |

### Architecture Impact

- **MVP**: Single instance acceptable; manual recovery from backups
- **Future**: Requires redundancy, health monitoring, automated failover
- **Recommendation**: Use managed cloud services (Azure App Service, managed database) to inherit platform reliability

---

## Security

### MVP Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| **Authentication** | Azure AD / Entra ID SSO | No local passwords; leverage enterprise identity |
| **Authorisation** | Role-based access control (RBAC) | Admin, Portfolio, Programme, Project roles |
| **Transport encryption** | HTTPS (TLS 1.2+) | All traffic encrypted in transit |
| **Data encryption at rest** | Database encryption enabled | Use cloud provider's encryption |
| **Session management** | Secure session tokens; timeout after inactivity | 30-minute inactivity timeout |
| **Input validation** | Server-side validation on all inputs | Prevent injection attacks |
| **Audit logging** | Log authentication events and data changes | Who changed what, when |

### Enterprise Target (Future)

| Requirement | Implementation | What Changes |
|-------------|----------------|--------------|
| Multi-factor authentication | Enforce MFA via Azure AD policy | Configuration, not code change |
| Penetration testing | Annual third-party pen test | Budget for testing |
| Vulnerability scanning | Automated scanning in CI/CD | Integrate security tools |
| SOC2 compliance | Implement SOC2 controls | Significant process/documentation |
| Data residency | Region-specific data storage | Multi-region deployment |

### Architecture Impact

- **MVP**: Azure AD integration is core; design RBAC model early
- **Critical**: Never store passwords; never build custom auth
- **Recommendation**: Use established auth libraries; don't roll your own security

### Role-Based Access Control (MVP)

| Role | Portfolio Data | Programme Data | Project Data | Admin Functions |
|------|----------------|----------------|--------------|-----------------|
| **Admin** | Full | Full | Full | Yes |
| **Portfolio User** | Full | Read all | Read all | No |
| **Programme User** | Read summary | Full (own) | Read (own programme) | No |
| **Project User** | None | Read (own programme) | Full (own) | No |

---

## Compliance

### MVP Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| **GDPR** | Basic compliance | Privacy policy; data subject rights; lawful basis |
| **Data processing** | Clear terms of service | Define what data is collected and why |
| **Cookie consent** | Cookie notice if analytics used | May not need if no tracking cookies |
| **Right to deletion** | Ability to delete user data on request | Manual process acceptable for MVP |
| **Data export** | Ability to export user's data | Manual process acceptable for MVP |

### Enterprise Target (Future)

| Requirement | Implementation | What Changes |
|-------------|----------------|--------------|
| SOC2 Type II | Full SOC2 certification | Significant investment; ~6-12 months |
| ISO 27001 | Information security certification | Process and documentation |
| Cyber Essentials | UK government security standard | Required for UK public sector |
| HIPAA | Healthcare compliance (if applicable) | Only if targeting healthcare |
| Industry-specific | Financial services, government, etc. | Depends on target market |

### Architecture Impact

- **MVP**: GDPR basics don't significantly impact architecture
- **Future**: SOC2/ISO 27001 require audit trails, access controls, documented processes
- **Public Sector**: Cyber Essentials likely required; relatively achievable
- **Recommendation**: Document security practices from day one; makes certification easier later

---

## Data

### MVP Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| **Backup frequency** | Daily automated backups | Use cloud provider's backup service |
| **Backup retention** | 30 days | Sufficient for early stage |
| **Data retention** | 90 days after account closure | Define in terms of service |
| **Data export** | CSV/Excel export of RAID and actions | Manual or basic export feature |
| **Data import** | Not required for MVP | Users start fresh |

### Enterprise Target (Future)

| Requirement | Implementation | What Changes |
|-------------|----------------|--------------|
| Backup frequency | Continuous / point-in-time recovery | Managed database feature |
| Backup retention | 90 days + annual archives | Storage costs increase |
| Data retention | 7 years (regulatory requirement) | Archival strategy needed |
| Data export | Full data export via API | Build export API |
| Data import | Migration tools from Excel/other systems | Build import functionality |
| Data residency | EU, UK, US data centre options | Multi-region deployment |

### Architecture Impact

- **MVP**: Use managed database with built-in backup; minimal custom work
- **Future**: Archival strategy, data lifecycle management
- **Recommendation**: Use Azure SQL or PostgreSQL managed service for built-in backup/recovery

---

## Accessibility

### MVP Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| **WCAG level** | 2.1 Level A (minimum) | Basic accessibility |
| **Keyboard navigation** | All functions accessible via keyboard | No mouse-only interactions |
| **Screen reader support** | Semantic HTML; ARIA labels where needed | Test with basic screen reader |
| **Colour contrast** | Minimum 4.5:1 for normal text | Use accessible colour palette |
| **Text resizing** | Page usable at 200% zoom | Responsive design handles this |

### Enterprise Target (Future)

| Requirement | Implementation | What Changes |
|-------------|----------------|--------------|
| WCAG level | 2.1 Level AA | More stringent requirements |
| Accessibility audit | Third-party accessibility audit | Budget for audit |
| Public sector | Meet government accessibility requirements | May be mandatory for public sector sales |

### Architecture Impact

- **MVP**: Accessibility is primarily a front-end concern; design accessibly from start
- **Recommendation**: Use accessible component library; test with keyboard; run automated checks

---

## Browser and Device Support

### MVP Requirements

| Requirement | Support Level | Notes |
|-------------|---------------|-------|
| **Chrome** | Full support | Latest 2 versions |
| **Edge** | Full support | Latest 2 versions |
| **Safari** | Full support | Latest 2 versions |
| **Firefox** | Full support | Latest 2 versions |
| **Mobile browsers** | Responsive design | Same browsers on mobile |
| **Internet Explorer** | Not supported | End of life; not worth supporting |
| **Native mobile app** | Not required | Web responsive is sufficient |

### Enterprise Target (Future)

| Requirement | Support Level | What Changes |
|-------------|---------------|--------------|
| Legacy browsers | Case-by-case | Some enterprises still use older browsers |
| Native mobile app | Consider if demand exists | Significant development effort |
| Offline support | Progressive Web App (PWA) | If connectivity is unreliable |

### Architecture Impact

- **MVP**: Modern browsers only; simplifies development significantly
- **Recommendation**: Use modern CSS/JS; don't polyfill for legacy browsers in MVP

---

## Monitoring and Observability

### MVP Requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| **Uptime monitoring** | External ping monitoring | Free tier of UptimeRobot or similar |
| **Error tracking** | Basic error logging | Log errors to file or cloud logging |
| **Performance monitoring** | Basic metrics | Cloud provider's built-in metrics |
| **Alerting** | Email alerts for downtime | Simple notification |

### Enterprise Target (Future)

| Requirement | Implementation | What Changes |
|-------------|----------------|--------------|
| APM | Application Performance Monitoring | Azure Application Insights or similar |
| Log aggregation | Centralised logging | Log analytics service |
| Custom dashboards | Operational dashboards | Grafana or similar |
| On-call rotation | 24/7 incident response | Process and tooling |

---

## Architecture-Impacting Decisions

The following NFRs significantly impact architecture choices:

| Decision | Impact | Recommendation |
|----------|--------|----------------|
| **Single vs Multi-tenant** | Data model, isolation, routing | Design data model with `organisation_id`; single-tenant deployment for MVP |
| **Authentication method** | Identity provider integration | Azure AD from day one; no local auth |
| **Hosting model** | Cloud vs on-prem | Cloud-only for MVP; on-prem is significant scope |
| **Database choice** | Scalability, features, cost | Managed PostgreSQL or Azure SQL; avoid vendor lock-in where practical |
| **Stateless architecture** | Scalability, deployment | Design stateless from start; enables horizontal scaling later |

### Technology Recommendations (MVP)

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| **Frontend** | React / Next.js | Modern, well-documented, large community |
| **Backend** | Node.js | Matches frontend language; good for API development |
| **Database** | PostgreSQL (managed) | Reliable, scalable, good tooling |
| **Hosting** | Azure App Service | Managed platform; built-in scaling, SSL, backups |
| **Authentication** | Azure AD / MSAL | Enterprise SSO; no password management |
| **File storage** | Azure Blob Storage | If document attachments needed |

---

## NFR Prioritisation

### Must Address in MVP

| Category | Why |
|----------|-----|
| Security (auth, HTTPS, RBAC) | Non-negotiable for enterprise software |
| Basic performance (<3s page load) | Unusable if too slow |
| Data backup | Cannot risk data loss |
| GDPR basics | Legal requirement |

### Can Defer Post-MVP

| Category | Why |
|----------|-----|
| SOC2 / ISO 27001 certification | Expensive; pursue when revenue justifies |
| 99.9% availability | 99% is acceptable for early stage |
| Multi-tenant architecture | Single-tenant works for pilots |
| WCAG AA compliance | Level A is acceptable starting point |

---

## Document History

| Date | Changes |
|------|---------|
| 2026-01-26 | Initial version created |

---

*NFRs should be reviewed as the product matures and customer requirements become clearer.*
