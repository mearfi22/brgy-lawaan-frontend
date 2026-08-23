import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</p>;

  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}