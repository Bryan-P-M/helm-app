import { createClient } from '@/lib/supabase/server'

async function getSupabaseStatus() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    if (error && error.code === '42P01') {
      return { connected: true, message: 'Connected (no tables yet)' }
    }
    if (error) {
      return { connected: false, message: error.message }
    }
    return { connected: true, message: 'Connected' }
  } catch (e) {
    return { connected: false, message: 'Failed to connect' }
  }
}

export default async function Home() {
  const status = await getSupabaseStatus()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E0C389] flex items-center justify-center font-bold text-primary">
            H
          </div>
          <span className="text-xl font-semibold tracking-tight">Helm</span>
        </div>
        <a
          href="/login"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
        >
          Sign In
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20">
          <div className="max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0C389]/10 border border-[#E0C389]/20 text-[#E0C389] text-sm">
              <span className="w-2 h-2 rounded-full bg-[#E0C389] animate-pulse" />
              Now in development
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
              From organisational anxiety
              <br />
              <span className="text-[#E0C389]">to operational confidence</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Helm is governance infrastructure for delivery teams.
              RAID logs, decisions, actions, meetings, and dashboards —
              unified in a single source of truth with full audit trail.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <a
                href="/login"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
              >
                Get Started
              </a>
              <a
                href="https://github.com/Bryan-P-M/helm-app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-border hover:border-primary text-foreground rounded-lg transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Design Principles — Trust Signals */}
        <section className="px-6 py-20 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-medium tracking-widest text-[#E0C389] uppercase text-center mb-3">
              Design Principles
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
              Governance that earns trust
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
              Every design decision optimises for the escalation judgment — the 3–5 seconds
              when a user sees a red indicator and decides: noise or signal?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* P1: Traceable */}
              <div className="rounded-xl bg-card border border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Traceable, Not Trusted</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every number links to its source. Every status shows its timestamp.
                  Every decision connects to its evidence. A number without provenance
                  is a liability, not an asset.
                </p>
              </div>

              {/* P2: Escalation Paths */}
              <div className="rounded-xl bg-card border border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">One-Click Escalation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every problem state shows who owns it, what happens next, and how
                  to escalate. No dead ends. No red indicators without resolution routes.
                  See a problem — act on it in seconds.
                </p>
              </div>

              {/* P3: Hierarchy as Navigation */}
              <div className="rounded-xl bg-card border border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Hierarchy as Navigation</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Portfolio → Programme → Project isn't just structure — it's how you
                  move. Drill down preserves context. Drill up restores state. Nothing
                  is ever orphaned.
                </p>
              </div>

              {/* P4: Exception First */}
              <div className="rounded-xl bg-card border border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Exceptions First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  RED and AMBER surface by default. GREEN hides until you ask.
                  The interface does the scanning — you do the deciding.
                  Showing everything means seeing nothing.
                </p>
              </div>

              {/* P5: Governance Through Workflow */}
              <div className="rounded-xl bg-card border border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Risk-Aware Defaults</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Audit trails captured automatically. Compliance achieved through
                  system design, not user burden. When users take the easy route,
                  they&apos;re also taking the compliant route.
                </p>
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-[#E0C389]/20 bg-[#E0C389]/5 p-6 flex flex-col justify-center space-y-3">
                <p className="text-sm font-medium text-[#E0C389] tracking-wide uppercase">The Result</p>
                <p className="text-lg font-semibold leading-snug">
                  Decisive action,<br />not governance theatre
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Five principles. One goal: the right information reaches
                  the right person at the right time — with the evidence to act on it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personas — Who Helm Serves */}
        <section className="px-6 py-20 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium tracking-widest text-[#E0C389] uppercase text-center mb-3">
              Built For
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">
              Every seat at the governance table
            </h2>

            <div className="space-y-6">
              {/* PMO Lead */}
              <div className="flex items-start gap-5 rounded-xl bg-card border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">PMO Lead</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Governance Enablement</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Board packs generated from live data — not assembled from stale spreadsheets.
                    Spend time analysing, not chasing updates.
                  </p>
                </div>
              </div>

              {/* Programme Manager */}
              <div className="flex items-start gap-5 rounded-xl bg-card border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">Programme Manager</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Delivery &amp; Coordination</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Actions from meetings captured and tracked automatically. Dependencies mapped.
                    Escalation paths clear. Less admin, more delivery.
                  </p>
                </div>
              </div>

              {/* Board Member */}
              <div className="flex items-start gap-5 rounded-xl bg-card border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-[#E0C389]/10 border border-[#E0C389]/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#E0C389]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">Board Member</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Strategic Oversight</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Portfolio health legible at a glance. Risk exposure surfaced, not buried.
                    Earned assurance through evidence — spend board time deciding, not debating the numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Supabase status */}
      <footer className="border-t border-border px-6 py-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>© 2026 Helm</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status.connected ? 'bg-[#E0C389]' : 'bg-red-400'
            }`}
          />
          <span>Supabase: {status.message}</span>
        </div>
      </footer>
    </div>
  )
}
