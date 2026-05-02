import PageHeader from '../components/PageHeader'

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Application configuration and preferences" />

      <div className="space-y-6">
        <div className="glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-sm text-white/80">Company Name</p>
                <p className="text-xs text-white/40">Displayed in reports and documents</p>
              </div>
              <input type="text" defaultValue="AL-Sebaei Group" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00d4ff]/50" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-sm text-white/80">Currency</p>
                <p className="text-xs text-white/40">Default currency for all transactions</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00d4ff]/50">
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="USD">USD - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-white/80">Language</p>
                <p className="text-xs text-white/40">Interface language</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00d4ff]/50">
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            {['Lease Expiry Alerts', 'Maintenance Updates', 'Payment Reminders', 'Monthly Reports'].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <p className="text-sm text-white/80">{item}</p>
                <div className="w-12 h-6 bg-[#00d4ff]/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-[#00d4ff] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card neon-glow p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Database</h3>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white/80">Supabase Connection</p>
              <p className="text-xs text-white/40">Connect to your Supabase project for live data</p>
            </div>
            <button className="px-4 py-2 bg-[#a855f7]/10 text-[#a855f7] rounded-xl hover:bg-[#a855f7]/20 transition-colors text-sm">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
