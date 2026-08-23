import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-2xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold text-ink mb-1">BHW / Admin Login</h2>
        <p className="text-xs uppercase tracking-wide text-ink-soft mb-6">Brgy Lawa-an Health Portal</p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-primary mb-4">
          Email
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
            className="block w-full mt-2 px-3.5 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <label className="block text-xs font-semibold uppercase tracking-wide text-primary mb-4">
          Password
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="block w-full mt-2 px-3.5 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
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