# Helm

**SaaS P3O (Portfolio, Programme, Project) Governance Solution**

Helm is a governance tool designed for project and programme managers who need structured tracking of RAID items (Risks, Assumptions, Issues, Dependencies), actions, meetings, and decisions. It provides traceable, auditable project governance out of the box — with AI-assisted extraction of governance items from meeting notes and documents planned for v2.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth |
| Hosting | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and keys

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
helm-app/
├── src/              # Application source code
├── docs/             # Specifications and project documentation
├── qa-reports/       # Quality assurance reports
├── public/           # Static assets
└── .env.example      # Environment variable template
```

## Documentation

See **[docs/README.md](docs/README.md)** for the full documentation index and reading order.

## Current Status

**MVP v1 — In Development**

- ✅ Database schema deployed (12 tables, 34 RLS policies, demo data seeded)
- ✅ Next.js scaffold created
- ⬜ UI implementation in progress
- ⬜ Vercel deployment pending

## Repository

[github.com/Bryan-P-M/helm-app](https://github.com/Bryan-P-M/helm-app)

## Licence

Proprietary. All rights reserved.
