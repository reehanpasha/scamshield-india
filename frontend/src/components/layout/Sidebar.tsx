import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  MessageSquare,
  ShieldAlert,
  FileText,
  Briefcase,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { ShieldEmblem } from '../common/ShieldEmblem';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'URL Intelligence', path: '/url-scanner', icon: Globe },
    { name: 'Message Analysis', path: '/message-scanner', icon: MessageSquare },
    { name: 'Threat Explorer', path: '/threat-explorer', icon: ShieldAlert },
    { name: 'Scam Reports', path: '/community-reports', icon: FileText },
    { name: 'Investigation Workspace', path: '/investigations', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Security Education', path: '/cyber-safety', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 glass-panel border-r border-white/10 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <NavLink to="/" className="flex items-center space-x-3 overflow-hidden">
            <ShieldEmblem size={34} glow={false} pulse={false} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                  SCAMSHIELD
                  <span className="text-[10px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    IN
                  </span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                  CYBER COMMAND
                </span>
              </div>
            )}
          </NavLink>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-xl transition-all font-medium text-sm ${
                  collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5 space-x-3'
                } ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Banner & Engine Info */}
      <div className="p-3 border-t border-white/10 space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 text-xs">
            <div className="flex items-center space-x-2 text-red-400 font-bold mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Victim of Fraud?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight mb-2">
              Report financial fraud to National Cyber Helpline <strong className="text-white">1930</strong> immediately.
            </p>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 hover:underline"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div className={`flex items-center text-[10px] font-mono text-slate-500 ${collapsed ? 'justify-center' : 'justify-between px-1'}`}>
          {!collapsed && <span>RULESET v1.2.0-IN</span>}
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {!collapsed && <span className="text-emerald-400 font-medium">SHIELD ACTIVE</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};
