import { useQuery } from '@tanstack/react-query';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppAlert from '@/components/AppAlert';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppSegmentedControl from '@/components/AppSegmentedControl';
import AppSwitch from '@/components/AppSwitch';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import AppTextLink from '@/components/AppTextLink';
import Divider from '@/components/Divider';
import ErrorBadge from '@/components/ErrorBadge';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { formatDuration } from '@/i18n';
import { getUnlockSteelGateOptions } from '@/services/api/services';
import { isBeaconMonitoringAvailable, requestBeaconLocationPermission } from '@/services/beacon';
import { IS_DEV, IS_GATE_UNLOCK_ON_APPROACH_ENABLED } from '@/services/environment';
import { onPremiseQueryKeys } from '@/services/query';
import useSettingsStore from '@/stores/settings';
import useUnlockGateStore from '@/stores/unlock-gate';

const UNLOCK_GATE_DURATIONS_IN_MS = [3_000, 6_000, 12_000];
const UNLOCK_GATE_OPTIONS_STALE_TIME = 24 * 60 * 60 * 1000; // 24 hours

const UnlockGateOptionsBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<AppBottomSheetProps, 'children'>
> = ({ style, ...props }, forwardedRef) => {
  const { t } = useTranslation();
  const unlockGateDurationInMs = useSettingsStore((state) => state.unlockGateDurationInMs);
  const withGateUnlockOnApproach = useSettingsStore((state) => state.withGateUnlockOnApproach);

  const bottomSheetRef = useRef<AppBottomSheetRef | null>(null);
  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const {
    isFetching: isFetchingOptions,
    data: options,
    error: optionsError,
    refetch: refetchOptions,
  } = useQuery({
    queryKey: onPremiseQueryKeys.unlockGateOptions(),
    queryFn: getUnlockSteelGateOptions,
    staleTime: UNLOCK_GATE_OPTIONS_STALE_TIME,
    enabled: withGateUnlockOnApproach,
  });

  useEffect(() => {
    if (options?.beaconRegion) {
      useUnlockGateStore.setState({ beaconRegion: options.beaconRegion });
    }
  }, [options]);

  const onToggleGateUnlockOnApproach = useCallback(async (willEnable: boolean) => {
    if (!willEnable) {
      useSettingsStore.setState({ withGateUnlockOnApproach: false });
      return;
    }

    const isAlwaysGranted = await requestBeaconLocationPermission();
    // Reverts the switch if the user only grants "When In Use" — monitoring
    // can't survive the app being killed without "Always".
    useSettingsStore.setState({ withGateUnlockOnApproach: isAlwaysGranted });
  }, []);

  return (
    <AppBottomSheet ref={bottomSheetRef} {...props} style={[tw`p-6`, style]}>
      <AppText style={tw`mt-2 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('settings.home.unlockGateOptions.label')}
      </AppText>
      <AppText
        style={tw`mt-5 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('settings.home.unlockGateOptions.description')}
      </AppText>
      <AppSegmentedControl
        activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
        style={tw`mt-5 h-14 w-full bg-gray-200  dark:bg-zinc-800`}
        tabs={UNLOCK_GATE_DURATIONS_IN_MS.map((duration) => (
          <View
            key={`unlock-door-duration-${duration}`}
            style={tw`flex h-full flex-col items-center justify-center gap-1`}>
            <DurationGauge
              active={duration === unlockGateDurationInMs}
              count={4}
              filled={duration / 3000}
            />
            <AppText
              numberOfLines={1}
              style={tw`text-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {formatDuration(duration)}
            </AppText>
          </View>
        ))}
        value={UNLOCK_GATE_DURATIONS_IN_MS.findIndex(
          (duration) => duration === unlockGateDurationInMs,
        )}
        onChange={(index) =>
          useSettingsStore.setState({
            unlockGateDurationInMs: UNLOCK_GATE_DURATIONS_IN_MS[index],
          })
        }
      />

      {IS_GATE_UNLOCK_ON_APPROACH_ENABLED && (
        <>
          <Divider style={tw`mt-6`} />
          {isFetchingOptions && <LoadingProgressBar style={tw`-mt-px`} />}

          <SectionTitle
            loading={isFetchingOptions}
            style={tw`mt-3`}
            title={t('settings.home.unlockGateOptions.beacon.title')}>
            {optionsError && !isSilentError(optionsError) && !isFetchingOptions ? (
              <ErrorBadge
                error={optionsError}
                title={t('settings.home.unlockGateOptions.onFetch.fail')}
                onRetry={refetchOptions}
              />
            ) : null}
          </SectionTitle>
          <ServiceRow
            description={t('settings.home.unlockGateOptions.beacon.hint')}
            label={t('settings.home.unlockGateOptions.beacon.label')}
            style={tw`px-0`}>
            <AppSwitch
              disabled={!isBeaconMonitoringAvailable}
              value={withGateUnlockOnApproach}
              onValueChange={onToggleGateUnlockOnApproach}
            />
          </ServiceRow>

          {!isBeaconMonitoringAvailable ? (
            <AppAlert
              description={t('settings.home.unlockGateOptions.beacon.unavailable')}
              style={tw`mt-2 w-full`}
              type="warning"
            />
          ) : (
            <AppAlert style={tw`mt-2 w-full`} type="info">
              <Trans
                components={[
                  <AppTextLink
                    href={`/privacy`}
                    key="privacy-link"
                    style={tw`text-amber-500`}
                    onPress={() => bottomSheetRef.current?.close()}
                  />,
                ]}
                defaults={t('settings.home.unlockGateOptions.beacon.description')}
                parent={AppText}
                style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
              />
            </AppAlert>
          )}

          {IS_DEV && (
            <>
              <Divider style={tw`mb-3 mt-6`} />
              <ServiceRow label="shouldUnlock" style={tw`px-0`}>
                <AppSwitch
                  value={useUnlockGateStore((state) => state.shouldUnlock)}
                  onValueChange={(shouldUnlock) => useUnlockGateStore.setState({ shouldUnlock })}
                />
              </ServiceRow>
              <ServiceRow label="minRetryIntervalInMs" style={tw`px-0`}>
                <AppTextField
                  autoCapitalize="none"
                  keyboardType="numeric"
                  value={useUnlockGateStore((state) => `${state.minRetryIntervalInMs}`) ?? ''}
                  onChangeText={(minRetryIntervalInMs) =>
                    useUnlockGateStore.setState({
                      minRetryIntervalInMs: Number(minRetryIntervalInMs),
                    })
                  }
                />
              </ServiceRow>
              <ServiceRow label="lastAttemptAt" style={tw`px-0`}>
                <AppTextField
                  readOnly
                  autoCapitalize="none"
                  keyboardType="numeric"
                  value={useUnlockGateStore((state) =>
                    state.lastAttemptAt ? `${state.lastAttemptAt}` : '',
                  )}
                  onChangeText={(lastAttemptAt) =>
                    useUnlockGateStore.setState({
                      lastAttemptAt: lastAttemptAt ? Number(lastAttemptAt) : null,
                    })
                  }
                />
              </ServiceRow>
              <ServiceRow label="lastRegionState" style={tw`px-0`}>
                <AppTextField
                  readOnly
                  autoCapitalize="none"
                  value={useUnlockGateStore((state) => state.lastRegionState ?? '')}
                  onChangeText={(lastRegionState) =>
                    useUnlockGateStore.setState({
                      lastRegionState: (lastRegionState as never) || null,
                    })
                  }
                />
              </ServiceRow>
            </>
          )}
        </>
      )}
    </AppBottomSheet>
  );
};

const DurationGauge = ({
  count,
  filled,
  active,
}: {
  count: number;
  filled: number;
  active: boolean;
}) => {
  return (
    <View style={tw`flex flex-row items-center justify-center gap-1`}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            tw`size-2 rounded-sm`,
            i < filled
              ? active
                ? { backgroundColor: theme.miramonYellow }
                : tw`bg-gray-700 dark:bg-neutral-300`
              : tw`bg-gray-300 dark:bg-neutral-700`,
          ]}
        />
      ))}
    </View>
  );
};

export default forwardRef(UnlockGateOptionsBottomSheet);
