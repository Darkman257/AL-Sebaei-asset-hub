import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Users, Wrench,
  Receipt, TrendingUp, FileText, BarChart3, Settings, LogOut
} from 'lucide-react'
import { supabase } from '../lib/supabase'

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
    <aside className="w-64 h-screen bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-transparent border-r border-white/5 flex flex-col backdrop-blur-xl">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold neon-text text-[#00d4ff]">Asset Hub</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Portfolio Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 m-3 rounded-xl bg-white/[0.02] flex items-center justify-between group">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#a855f7] shadow-[0_0_12px_rgba(0,212,255,0.3)]" />
          <div>
            <p className="text-sm text-white/80 font-medium">Admin</p>
            <p className="text-[10px] text-white/30">AL-Sebaei Group</p>
          </div>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-lg transition-all duration-200 cursor-pointer"
          title="Terminate Session"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
