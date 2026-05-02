import PageHeader from '../components/PageHeader'

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Application configuration and preferences" />
      <div className="space-y-6">
        <div className="glass-card neon-glow p-6 card-enter stagger-1">
          <h3 className="text-lg font-semibold text-white mb-6">General</h3>
          <div className="space-y-1">
            {[
              { label: 'Company Name', desc: 'Displayed in reports and documents', type: 'input', value: 'AL-Sebaei Group' },
              { label: 'Currency', desc: 'Default currency for all transactions', type: 'select', options: ['SAR - Saudi Riyal', 'USD - US Dollar', 'AED - UAE Dirham'] },
              { label: 'Language', desc: 'Interface language', type: 'select', options: ['English', 'العربية'] },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-sm text-white/80 font-medium">{item.label}</p>
                  <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                </div>
                {item.type === 'input' ? (
                  <input type="text" defaultValue={item.value} className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-[#00d4ff]/40 transition-colors w-48" />
                ) : (
                  <select className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-[#00d4ff]/40 transition-colors">
                    {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card neon-glow p-6 card-enter stagger-2">
          <h3 className="text-lg font-semibold text-white mb-6">Notifications</h3>
          <div className="space-y-1">
            {['Lease Expiry Alerts', 'Maintenance Updates', 'Payment Reminders', 'Monthly Reports'].map((item) => (
              <div key={item} className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
                <p className="text-sm text-white/70">{item}</p>
                <div className="w-11 h-6 bg-[#00d4ff]/20 rounded-full relative cursor-pointer border border-[#00d4ff]/30 transition-all hover:bg-[#00d4ff]/30">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-[#00d4ff] rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card neon-glow p-6 card-enter stagger-3">
          <h3 className="text-lg font-semibold text-white mb-6">Database</h3>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-white/80 font-medium">Supabase Connection</p>
              <p className="text-xs text-white/30 mt-0.5">Connect to your Supabase project for live data</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-active">Connected</span>
              <button className="px-4 py-2.5 bg-[#a855f7]/10 text-[#a855f7] rounded-xl hover:bg-[#a855f7]/20 border border-[#a855f7]/20 transition-colors text-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
