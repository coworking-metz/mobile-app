import PullToRefreshHint from './PullToRefreshHint';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';

export const STALE_PERIOD_IN_SECONDS = 300; // 5 minutes

const StaleDataText = ({
  lastFetch,
  activeSince,
  loading,
}: {
  lastFetch?: number;
  activeSince?: string;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const isFocus = useIsFocused();
  const queryClient = useQueryClient();

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
      <Animated.View
        entering={FadeInUp.duration(300)}
        exiting={FadeOutUp.duration(300)}
        style={tw`ml-3 flex flex-col items-start gap-1 shrink grow basis-0`}>
        {loading ? (
          <AppText
            numberOfLines={1}
            style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
            {t('home.refresh.loading')}
          </AppText>
        ) : (
          <>
            <AppText
              numberOfLines={1}
              style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
              {capitalize(
                dayjs().diff(lastFetch, 'minutes') > 60
                  ? dayjs(lastFetch).calendar()
                  : dayjs(lastFetch).fromNow(),
              )}
            </AppText>
            <TouchableOpacity
              style={tw`flex flex-row items-center gap-1`}
              onPress={() => {
                queryClient.invalidateQueries();
              }}>
              <AppText
                entering={FadeInUp.duration(300)}
                exiting={FadeOutUp.duration(300)}
                style={tw`text-sm font-normal leading-5 grow-0 text-amber-500`}>
                {t('home.refresh.label')}
              </AppText>
              <MaterialCommunityIcons
                iconStyle={{ height: 20, width: 20, marginRight: 0 }}
                name="refresh"
                size={16}
                style={tw`shrink-0 grow-0 text-amber-500`}
              />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {/* mr-3 to be perflectly center aligned */}
      {!loading && <PullToRefreshHint style={tw`mr-3 shrink-0`} />}
    </>
  );
};

export default StaleDataText;
