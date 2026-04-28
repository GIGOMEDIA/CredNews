import { useAuth, AuthStatus } from 'rn-swiftauth-sdk';
import { useMemo } from 'react';

import { useNetworkStatus } from '@/utils/network';

export type EffectiveAuthStatus =
  | 'loading'
  | 'authenticated'
  | 'offline-authenticated'
  | 'unauthenticated';

export function useAppAuth() {
  const auth = useAuth();
  const { isOnline, isChecking } = useNetworkStatus();

  const effectiveStatus = useMemo<EffectiveAuthStatus>(() => {
    if (auth.status === AuthStatus.LOADING) {
      return 'loading';
    }

    if (auth.status === AuthStatus.AUTHENTICATED) {
      return isOnline ? 'authenticated' : 'offline-authenticated';
    }

    return 'unauthenticated';
  }, [auth.status, isOnline]);

  const isAuthenticated =
    effectiveStatus === 'authenticated' ||
    effectiveStatus === 'offline-authenticated';

  return {
    ...auth,
    effectiveStatus,
    isAuthenticated,
    isCheckingNetwork: isChecking,
    isOffline: !isOnline,
    isOnline,
  };
}
