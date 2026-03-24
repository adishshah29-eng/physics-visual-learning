import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function RequireAuth({
  children,
  fallback = '/auth',
}: {
  children: React.ReactNode;
  fallback?: string;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to={fallback} replace />;
  return <>{children}</>;
}
