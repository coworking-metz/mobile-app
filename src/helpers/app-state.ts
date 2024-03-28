import { log } from './logger';
import dayjs from 'dayjs';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const appStateLogger = log.extend(`[app-state.ts]`);

export default function useAppState() {
  const [activeSince, setActiveSince] = useState(dayjs().toISOString());
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      appStateLogger.debug('App has come to the foreground!');
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
