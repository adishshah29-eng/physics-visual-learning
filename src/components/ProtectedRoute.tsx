import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, profile } = useAuthStore();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  // Not authenticated → redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but no profile → redirect to onboarding
  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }

  // Authenticated + profile → render children
  return <Outlet />;
};

export default ProtectedRoute;
