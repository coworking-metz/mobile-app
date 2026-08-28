import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export default function useAppState() {
  const [activeSince, setActiveSince] = useState(dayjs().toISOString());
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      setActiveSince(dayjs().toISOString());
    }

    appState.current = nextAppState;
  }, []);

  useEffect(() => {
    const appChangeSubscription = AppState.addEventListener('change', handleAppStateChange);
    return () => appChangeSubscription.remove();
  }, [handleAppStateChange]);

  return activeSince;
}
