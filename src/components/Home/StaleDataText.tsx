import PullToRefreshHint from './PullToRefreshHint';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import tw from 'twrnc';

const STALE_PERIOD_IN_SECONDS = 300; // 5 minutes

const StaleDataText = ({
  lastFetch,
  activeSince,
}: {
  lastFetch?: number;
  activeSince?: string;
}) => {
  const isFocus = useIsFocused();

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return lastFetch ? dayjs().diff(lastFetch, 'second') : null;
  }, [lastFetch, isFocus, activeSince]);

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
