import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { ShieldAlert, LogIn } from 'lucide-react';

interface RouteGuardProps {
  requiredRole: Role;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ requiredRole, children }) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying access credentials...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated or wrong role guard
  if (!user || role !== requiredRole) {
    const loginPath = `/${requiredRole}/login`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
          <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-400 mb-6">
            {!user
              ? `You must be logged in as a ${requiredRole.toUpperCase()} to access this portal.`
              : `Your account role (${role}) is not authorized to access the ${requiredRole.toUpperCase()} area.`}
          </p>
          <a
            href={loginPath}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            <LogIn className="w-4 h-4" />
            Go to {requiredRole.toUpperCase()} Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
