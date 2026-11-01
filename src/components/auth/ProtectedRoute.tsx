import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-softWhite dark:bg-brand-navy flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-google-gradient flex items-center justify-center text-white shadow-lg animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Authenticating PlanoAI session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
};
