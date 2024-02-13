import PullToRefreshHint from './PullToRefreshHint';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import tw from 'twrnc';

const STALE_PERIOD_IN_SECONDS = 300; // 5 minutes

const StaleDataText = ({ lastFetch }: { lastFetch?: number }) => {
  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const [durationSinceLastFetch, setDurationSinceLastFetch] = useState<number | null>(null);

  const updateStaleStatus = useCallback(
    (lastFetchAt?: number) => {
      setDurationSinceLastFetch(lastFetchAt ? dayjs().diff(lastFetchAt, 'second') : null);
    },
    [setDurationSinceLastFetch],
  );

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        updateStaleStatus(lastFetch);
      }

      appState.current = nextAppState;
    },
    [lastFetch],
  );

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const appChangeSubscription = AppState.addEventListener('change', handleAppStateChange);
    return () => appChangeSubscription.remove();
  }, [handleAppStateChange]);

  useEffect(() => updateStaleStatus(lastFetch), [lastFetch]);
  useFocusEffect(() => {
    updateStaleStatus(lastFetch);
  });

  if ((durationSinceLastFetch ?? 0) < STALE_PERIOD_IN_SECONDS) {
    return null;
  }

  return (
    <>
      <Animated.Text
        entering={FadeInUp.duration(300)}
        exiting={FadeOutUp.duration(300)}
        numberOfLines={2}
        style={tw`ml-3 text-sm font-normal text-slate-500 dark:text-slate-400 shrink grow basis-0`}>
        {capitalize(
          dayjs().diff(lastFetch, 'hour') > 2
            ? dayjs(lastFetch).calendar()
            : dayjs(lastFetch).fromNow(),
        )}
      </Animated.Text>
      {/* mr-3 to be perflectly center aligned */}
      <PullToRefreshHint style={tw`mr-3 grow`} />
    </>
  );
};

export default StaleDataText;
