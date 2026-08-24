import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Megaphone, Users, BookOpen, MessageSquareWarning, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Announcements', icon: Megaphone },
  { to: '/admin/residents', label: 'Residents', icon: Users },
  { to: '/admin/directory', label: 'Directory', icon: BookOpen },
  { to: '/admin/suggestions', label: 'Reports', icon: MessageSquareWarning },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg font-sans">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-primary-dark text-white flex-col p-4 border-r-[3px] border-accent">
        <div className="flex items-center gap-3 px-2 mb-8">
          <img src="/logo.png" alt="Brgy Lawa-an Seal" className="w-10 h-10 object-contain flex-shrink-0" />
          <div>
            <h2 className="text-base font-bold leading-tight">Brgy. Lawa-an</h2>
            <p className="text-xs tracking-wide uppercase text-white/50">Health Portal</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-primary-dark font-semibold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-white/50 mb-3">{user?.role}</p>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-white/30 text-white text-xs uppercase tracking-wide font-semibold py-2 rounded-md hover:border-urgent hover:text-urgent transition-colors"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar — logo + logout only, nav moved to bottom tab bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary-dark text-white flex items-center justify-between px-4 py-3 border-b-[3px] border-accent">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Brgy Lawa-an Seal" className="w-8 h-8 object-contain flex-shrink-0" />
          <div>
            <h2 className="text-base font-bold leading-tight">Brgy. Lawa-an</h2>
            <p className="text-[10px] tracking-wide uppercase text-white/50">Health Portal</p>
          </div>
        </div>
        <button
          onClick={logout}
          aria-label="Log out"
          className="flex items-center gap-1.5 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:border-urgent hover:text-urgent transition-colors"
        >
          <LogOut size={14} />
          Log Out
        </button>
      </div>

      {/* Mobile bottom tab bar — same pattern as public side */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line shadow-[0_-2px_8px_rgba(0,0,0,0.06)] flex items-stretch">
        {navItems.map(({ to, label, icon: Icon }) => {
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

      <main className="flex-1 p-4 md:p-8 overflow-x-auto mt-16 md:mt-0 pb-24 md:pb-8">{children}</main>
    </div>
  );
}