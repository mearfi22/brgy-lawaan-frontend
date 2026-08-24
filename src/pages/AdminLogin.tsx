import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!isLoading && user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password }, rememberMe);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center p-6">
      <img src="/logo.png" alt="Brgy Lawa-an Seal" className="w-20 h-20 object-contain mb-5" />

      <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-2xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold text-ink mb-1">Admin Login</h2>
        <p className="text-xs uppercase tracking-wide text-ink-soft mb-6">LawaanOnKonek</p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-primary mb-4">
          Email
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
            className="block w-full mt-2 px-3.5 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <label className="block text-xs font-semibold uppercase tracking-wide text-primary mb-2">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3.5 py-2.5 pr-10 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink-soft mb-4 mt-1 normal-case font-normal">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4"
          />
          Remember me
        </label>

        {error && <p className="text-urgent text-sm mb-4">{error}</p>}

        <button
          type="submit" disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}