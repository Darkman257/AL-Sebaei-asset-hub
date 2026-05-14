import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    // Establish base channel state
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setLoading(false)
    })

    // Subscribe to session revocation/injection events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) throw authErr
    } catch (err: any) {
      setError(err.message || 'Operational handshake failure.')
    } finally {
      setLoginLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-2 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
        <div className="text-xs text-white/30 uppercase tracking-widest font-bold animate-pulse">Access Gateway Initializing...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,212,255,0.08),rgba(255,255,255,0))]">
        <div className="glass-card neon-glow w-full max-w-md p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00d4ff]/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-2xl mb-4 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
              <Lock className="text-[#00d4ff]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ASSET HUB</h1>
            <p className="text-xs text-white/40 tracking-widest uppercase mt-1 font-bold">Secure Terminal Access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400 uppercase font-bold tracking-wider leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold flex items-center gap-2">
                <Mail size={10} className="text-[#00d4ff]/50" /> Identity Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
                placeholder="secure@domain.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold flex items-center gap-2">
                <Lock size={10} className="text-[#00d4ff]/50" /> Authentication Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-4 py-3.5 bg-[#00d4ff]/20 border border-[#00d4ff]/30 text-[#00d4ff] rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#00d4ff]/30 disabled:opacity-50 shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] active:scale-[0.98]"
            >
              {loginLoading ? 'Initiating Handshake...' : 'Initialize Authentication'}
              {!loginLoading && <ArrowRight size={14} />}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
