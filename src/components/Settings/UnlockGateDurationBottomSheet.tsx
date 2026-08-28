import AppAlert from '../AppAlert';
import AppTextLink from '../AppTextLink';
import Divider from '../Divider';
import React, { forwardRef, ForwardRefRenderFunction, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppSegmentedControl from '@/components/AppSegmentedControl';
import AppSwitch from '@/components/AppSwitch';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { theme } from '@/helpers/colors';
import { formatDuration } from '@/i18n';
import { requestBeaconLocationPermission } from '@/services/beacon/permissions';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import useSettingsStore from '@/stores/settings';

const UNLOCK_GATE_DURATIONS_IN_MS = [3_000, 6_000, 12_000];

const UnlockGateDurationBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<AppBottomSheetProps, 'children'>
> = ({ style, ...props }, forwardedRef) => {
  const { t } = useTranslation();
  const unlockGateDurationInMs = useSettingsStore((state) => state.unlockGateDurationInMs);

  const onSwitch = useCallback(() => {
    requestBeaconLocationPermission();
  }, []);

  return (
    <AppBottomSheet ref={forwardedRef} {...props} style={[tw`p-6`, style]}>
      <AppText style={tw`mt-2 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('settings.home.unlockGateDuration.label')}
      </AppText>
      <AppText
        style={tw`mt-5 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('settings.home.unlockGateDuration.description')}
      </AppText>
      <View style={tw`mt-5 flex flex-row items-start justify-center gap-2`}>
        <AppSegmentedControl
          activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
          style={tw`w-full bg-gray-200 dark:bg-zinc-800`}
          tabs={UNLOCK_GATE_DURATIONS_IN_MS.map((duration) => (
            <View
              key={`unlock-door-duration-${duration}`}
              style={tw`flex shrink grow basis-0 flex-col items-center gap-1`}>
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
      </View>

      <Divider style={tw`mb-3 mt-6`} />

      <ServiceRow label={t('settings.home.unlockGateDuration.beacon.toggle')} style={tw`px-0`}>
        <AppSwitch
          value={useSettingsStore((state) => state.withBottomSheetFullHeight)}
          onValueChange={(value) => useSettingsStore.setState({ withBottomSheetFullHeight: value })}
        />
      </ServiceRow>

      <AppAlert style={tw`mb-4`} type="info">
        <Trans
          components={[
            <AppTextLink
              href={`${WORDPRESS_BASE_URL}/comment-desactiver-les-adresses-mac-aleatoires/`}
              key="how-to-disable-random-mac-addresses-link"
              style={tw`text-amber-500`}
              target="_blank"
            />,
          ]}
          defaults={t('settings.home.unlockGateDuration.beacon.description')}
          parent={AppText}
          style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />
      </AppAlert>
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

export default forwardRef(UnlockGateDurationBottomSheet);
