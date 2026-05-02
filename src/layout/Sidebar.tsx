import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Users, Wrench,
  Receipt, TrendingUp, FileText, BarChart3, Settings
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assets', icon: Building2, label: 'Assets' },
  { to: '/tenants', icon: Users, label: 'Tenants' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/revenue', icon: TrendingUp, label: 'Revenue' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen glass-card rounded-none border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold neon-text text-[#00d4ff]">AL-Sebaei</h1>
        <p className="text-xs text-white/40 mt-1">Asset Hub</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-[#00d4ff]/10 text-[#00d4ff] neon-glow'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#a855f7]" />
          <div>
            <p className="text-sm text-white/80">Admin</p>
            <p className="text-xs text-white/40">AL-Sebaei Group</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
