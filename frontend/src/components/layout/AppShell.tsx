import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '../common/CommandPalette';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();

  // If on Landing Page ('/'), render clean cinematic container without shell sidebar
  const isLanding = location.pathname === '/';

  // Global keyboard shortcut listener for Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLanding) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 cyber-grid relative">
        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 cyber-grid relative flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Header collapsed={collapsed} onOpenCommand={() => setIsCommandOpen(true)} />
        <main className="flex-1 pt-20 px-6 pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
};
