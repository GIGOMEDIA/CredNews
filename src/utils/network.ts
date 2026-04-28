import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export type NetworkStatus = {
  isOnline: boolean;
  isChecking: boolean;
};

const computeOnline = (state: Network.NetworkState): boolean => {
  if (state.isConnected === false) {
    return false;
  }
  if (state.isInternetReachable === false) {
    return false;
  }
  return true;
};

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const sync = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (!isActive) {
          return;
        }
        setIsOnline(computeOnline(state));
      } catch {
        if (isActive) {
          setIsOnline(false);
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    void sync();

    const subscription = Network.addNetworkStateListener((state) => {
      if (!isActive) {
        return;
      }
      setIsOnline(computeOnline(state));
      setIsChecking(false);
    });

    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);

  return { isOnline, isChecking };
}
