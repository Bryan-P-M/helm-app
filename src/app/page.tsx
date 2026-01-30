import { createClient } from '@/lib/supabase/server'

async function getSupabaseStatus() {
  try {
    const supabase = await createClient()
    // Query information_schema to count user tables as proof of life
    const { data, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    if (error && error.code === '42P01') {
      // Table doesn't exist yet — but connection works
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-gray-950">
            H
          </div>
          <span className="text-xl font-semibold tracking-tight">Helm</span>
        </div>
        <a
          href="/login"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-medium rounded-lg transition-colors"
        >
          Sign In
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now in development
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Helm
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed">
            Portfolio, Programme &amp; Project Governance
          </p>

          <p className="text-gray-500 max-w-lg mx-auto">
            Structured governance for delivery teams. RAID logs, decisions,
            actions, and dashboards — all in one place.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <a
              href="/login"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
            >
              Get Started
            </a>
            <a
              href="https://github.com/Bryan-P-M/helm-app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>

      {/* Footer with Supabase status */}
      <footer className="border-t border-gray-800 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
        <span>© 2026 Helm</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status.connected ? 'bg-emerald-400' : 'bg-red-400'
            }`}
          />
          <span>Supabase: {status.message}</span>
        </div>
      </footer>
    </div>
  )
}
