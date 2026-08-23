import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Megaphone, Users, BookOpen, MessageSquareWarning, LogOut, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <>
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
              onClick={() => setMobileOpen(false)}
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-bg font-sans">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-primary-dark text-white flex-col p-4 border-r-[3px] border-accent">
        {SidebarContent}
      </aside>

      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary-dark text-white flex items-center justify-between px-4 py-3 border-b-[3px] border-accent">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Brgy Lawa-an Seal" className="w-8 h-8 object-contain flex-shrink-0" />
          <div>
            <h2 className="text-base font-bold leading-tight">Brgy. Lawa-an</h2>
            <p className="text-[10px] tracking-wide uppercase text-white/50">Health Portal</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-primary-dark text-white flex flex-col p-4">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="self-end mb-4 text-white/70 hover:text-white"
            >
              <X size={22} />
            </button>
            {SidebarContent}
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 overflow-x-auto mt-16 md:mt-0">{children}</main>
    </div>
  );
}