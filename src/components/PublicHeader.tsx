import { Link, useLocation } from 'react-router-dom';

export default function PublicHeader() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Updates' },
    { to: '/register', label: 'Register for SMS' },
    { to: '/directory', label: 'Directory' },
    { to: '/report', label: 'Report a Concern' },
  ];

  return (
    <header className="bg-primary-dark border-t-[3px] border-accent shadow-sm">
      <div className="w-full flex items-center justify-between flex-wrap gap-3 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Brgy Lawa-an Seal" className="w-10 h-10 object-contain" />
          <span className="text-white font-extrabold text-lg tracking-tight leading-tight">
            Brgy. Lawa-an Health
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium transition-colors ${
                isActive(link.to) ? 'text-white' : 'text-white/75 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="border-[1.5px] border-white/40 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-white hover:text-primary-dark hover:border-white transition-colors"
          >
            BHW Login
          </Link>
        </nav>
      </div>
    </header>
  );
}