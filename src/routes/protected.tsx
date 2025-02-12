import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Shell } from '@/components/layout/shell';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}