import { ReactNode, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInitializeSuperAdmin } from '../hooks/useInitializeSuperAdmin';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, refetch } = useIsCallerAdmin();
  const initializeSuperAdminMutation = useInitializeSuperAdmin();

  useEffect(() => {
    const initializeIfNeeded = async () => {
      if (identity && !isCheckingAdmin && isAdmin === false && !initializeSuperAdminMutation.isPending) {
        try {
          const success = await initializeSuperAdminMutation.mutateAsync();
          if (success) {
            await refetch();
          }
        } catch (error) {
          console.error('Failed to initialize super admin:', error);
        }
      }
    };

    initializeIfNeeded();
  }, [identity, isAdmin, isCheckingAdmin]);

  if (isInitializing || isCheckingAdmin || initializeSuperAdminMutation.isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return <AccessDeniedScreen />;
  }

  if (isAdmin === false) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
