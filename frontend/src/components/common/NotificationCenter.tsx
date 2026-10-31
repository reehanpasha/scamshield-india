import React from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'CRITICAL',
      title: 'Active Digital Arrest Alert',
      message: 'Surge in coordinated Skype video extortion impersonating CBI Delhi registered in Maharashtra & Karnataka.',
      time: '12m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'WARNING',
      title: 'New Lookalike Domain Active',
      message: 'Detected sbi-kyc-verification.top harvesting net banking credentials on disposable .top TLD.',
      time: '45m ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'INFO',
      title: 'Detection Rules Updated',
      message: 'ScamShield ruleset upgraded to v1.2.0-in with enhanced Hindi token recognition.',
      time: '2h ago',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 glass-panel-glow rounded-xl shadow-2xl border border-cyan-500/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Threat Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer ${
              !item.read ? 'bg-cyan-950/20' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 shrink-0">
                {item.type === 'CRITICAL' ? (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                ) : item.type === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 bg-slate-950/80 border-t border-white/5 text-center">
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-200 font-mono py-1"
        >
          Close panel
        </button>
      </div>
    </div>
  );
};
