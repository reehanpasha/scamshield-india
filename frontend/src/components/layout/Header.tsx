import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';
import { NotificationCenter } from '../common/NotificationCenter';

interface HeaderProps {
  collapsed: boolean;
  onOpenCommand: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onOpenCommand }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [istTime, setIstTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format breadcrumbs
  const pathMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Overview',
    '/url-scanner': 'URL Intelligence',
    '/message-scanner': 'Message Analysis',
    '/threat-explorer': 'Threat Explorer',
    '/community-reports': 'Scam Reports',
    '/investigations': 'Investigation Workspace',
    '/analytics': 'Analytics',
    '/cyber-safety': 'Security Education',
    '/settings': 'Settings',
  };

  const currentTitle = pathMap[location.pathname] || 'Intelligence Hub';

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 transition-all duration-300 glass-panel border-b border-white/10 flex items-center justify-between px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Breadcrumbs & System Status */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors text-xs font-mono">
          ScamShield
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-sm font-semibold text-white tracking-wide">{currentTitle}</span>
        <div className="hidden md:flex items-center space-x-2 pl-3 ml-3 border-l border-white/10 text-[11px] font-mono text-cyan-400">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>MESH: DEFCON 3</span>
        </div>
      </div>

      {/* Right: Search, Clock, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Global Command Palette search trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs font-mono"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Search indicators, cases...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Live IST Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{istTime || 'IST'}</span>
        </div>

        {/* Notification center */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </button>
          <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-none">Officer K. Rao</span>
            <span className="text-[10px] text-cyan-400 font-mono leading-tight mt-0.5">Analyst Tier 1</span>
          </div>
        </div>
      </div>
    </header>
  );
};
