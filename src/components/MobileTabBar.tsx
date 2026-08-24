import { Link, useLocation } from 'react-router-dom';
import { Megaphone, UserPlus, BookOpen, MessageSquareWarning } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Updates', icon: Megaphone },
  { to: '/register', label: 'Register', icon: UserPlus },
  { to: '/directory', label: 'Directory', icon: BookOpen },
  { to: '/report', label: 'Report', icon: MessageSquareWarning },
];

export default function MobileTabBar() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line shadow-[0_-2px_8px_rgba(0,0,0,0.06)] flex items-stretch">
      {tabs.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              active ? 'text-primary' : 'text-ink-soft'
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}