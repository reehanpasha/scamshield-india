import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Globe,
  MessageSquare,
  ShieldAlert,
  FileText,
  Briefcase,
  BookOpen,
  Settings,
  Flame,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  action?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    { id: 'url', title: 'Launch URL Intelligence Scanner', category: 'Analysis', icon: Globe, path: '/url-scanner' },
    { id: 'msg', title: 'Analyze Suspicious Message / WhatsApp', category: 'Analysis', icon: MessageSquare, path: '/message-scanner' },
    { id: 'threats', title: 'Explore Threat Database & Lookalikes', category: 'Threat Mesh', icon: ShieldAlert, path: '/threat-explorer' },
    { id: 'reports', title: 'Browse & Submit Community Scam Reports', category: 'Community', icon: FileText, path: '/community-reports' },
    { id: 'inv', title: 'Open Incident Investigation Workspace', category: 'Forensics', icon: Briefcase, path: '/investigations' },
    { id: 'safety', title: 'Official Cyber Safety Center (Helpline 1930)', category: 'Safety & Guides', icon: BookOpen, path: '/cyber-safety' },
    { id: 'settings', title: 'Detection Engine & Security Settings', category: 'Configuration', icon: Settings, path: '/settings' },
    { id: 'hot', title: 'View Digital Arrest Threat Advisory', category: 'Intelligence Alert', icon: Flame, path: '/cyber-safety' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleExecute(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const handleExecute = (cmd: CommandItem) => {
    onClose();
    if (cmd.path) {
      navigate(cmd.path);
    } else if (cmd.action) {
      cmd.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-xl glass-panel-glow rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/50">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 font-mono">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleExecute(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-500/20 text-white' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{cmd.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cmd.category}</div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400">ScamShield Fast Navigator</span>
        </div>
      </div>
    </div>
  );
};
