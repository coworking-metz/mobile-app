import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeIn, FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import SwitchDevicesAnimation from '@/components/Animations/SwitchDevicesAnimation';
import AppIcon from '@/components/AppIcon';
import AppPressable from '@/components/AppPressable';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import ErrorChip from '@/components/ErrorChip';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAppNewDevice } from '@/context/new-device';
import { getDeviceTypeIcon } from '@/helpers/device';
import { isSilentError } from '@/helpers/error';
import { ApiMemberDevice, DeviceType, getMemberDevices } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const Devices = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const authStore = useAuthStore();
  const { pairDevice } = useAppNewDevice();

  const {
    isPending: isPendingDevices,
    isFetching: isFetchingDevices,
    isEnabled: isDevicesEnabled,
    data: devices,
    error: devicesError,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberDevices(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  return (
    <ServiceLayout
      contentStyle={tw`pt-4`}
      loading={isFetchingDevices}
      title={t('devices.title')}
      withBackButton={!_root}
      {...(isDevicesEnabled && { onRefresh: refetchDevices })}>
      {devicesError && !isSilentError(devicesError) ? (
        <ErrorChip
          error={devicesError}
          label={t('devices.onFetch.fail')}
          style={tw`mx-6 mb-4 self-start`}
          onRetry={refetchDevices}
        />
      ) : null}
      {isDevicesEnabled && isPendingDevices ? (
        <View style={tw`flex flex-row flex-wrap items-stretch gap-4 px-4`}>
          {[0].map((index) => (
            <DeviceCard pending key={index} style={tw`min-w-32 max-w-48 shrink grow basis-0`} />
          ))}
          <AppPressable
            style={tw`flex min-w-32 max-w-48 shrink grow basis-0 flex-row`}
            onPress={pairDevice}>
            <NewDeviceCard style={tw`w-full self-stretch`} />
          </AppPressable>
          {/* Placeholder for the last card to maintain layout */}
          <View style={tw`min-w-32 max-w-48 shrink grow basis-0`} />
        </View>
      ) : devices?.length ? (
        <View style={tw`flex flex-row flex-wrap items-stretch gap-4 px-4`}>
          {devices.map((device) => (
            <Link
              asChild
              href={`/devices/${device._id}`}
              key={device.macAddress}
              style={tw`flex min-w-32 max-w-48 shrink grow basis-0 flex-row`}>
              <AppPressable>
                <DeviceCard
                  device={device}
                  key={device.macAddress}
                  loading={isFetchingDevices}
                  style={tw`w-full self-stretch`}
                />
              </AppPressable>
            </Link>
          ))}
          <AppPressable
            style={tw`flex min-w-32 max-w-48 shrink grow basis-0 flex-row`}
            onPress={pairDevice}>
            <NewDeviceCard style={tw`w-full self-stretch`} />
          </AppPressable>
          {/* Placeholder for the last card to maintain layout */}
          <View style={tw`min-w-32 max-w-48 shrink grow basis-0`} />
        </View>
      ) : (
        <Animated.View
          style={tw`mx-auto flex w-full max-w-md grow flex-col items-center gap-2 px-6`}>
          <SwitchDevicesAnimation style={tw`h-48 w-full`} />
          <AppText
            numberOfLines={1}
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('devices.empty.title')}
          </AppText>
          <AppText
            style={tw`mb-auto text-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('devices.empty.description')}
          </AppText>
          <AppRoundedButton
            disabled={!isDevicesEnabled}
            label={t('devices.add.pair.label')}
            style={tw`mt-4 w-full self-center`}
            suffixIcon="plus"
            onPress={pairDevice}
          />
        </Animated.View>
      )}
    </ServiceLayout>
  );
};

const DeviceCard = ({
  device,
  pending = false,
  loading,
  style,
}: {
  device?: ApiMemberDevice;
  pending?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        tw`relative flex min-h-20 flex-col items-start rounded-2xl bg-gray-200 py-4 pl-4 dark:bg-neutral-800/80`,
        style,
      ]}>
      {pending ? (
        <>
          <View style={tw`overflow-hidden rounded-full`}>
            <LoadingSkeleton height={48} width={48} />
          </View>

          <View style={tw`mt-5 overflow-hidden rounded-lg`}>
            <LoadingSkeleton height={24} width={128} />
          </View>
          <View style={tw`mt-2.5 overflow-hidden rounded-lg`}>
            <LoadingSkeleton height={14} width={80} />
          </View>
        </>
      ) : (
        <>
          <View style={tw`z-20 rounded-full bg-gray-300 p-2 dark:bg-zinc-900/80`}>
            <View style={tw`relative flex size-8 shrink-0`}>
              <AppIcon
                color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                icon={getDeviceTypeIcon(device?.type ?? DeviceType.UNKNOWN)}
                size={32}
                style={tw`shrink-0 self-center`}
              />
            </View>
          </View>

          <AppText
            ellipsizeMode={'tail'}
            numberOfLines={device?.name && !device?.heartbeat ? 2 : 1}
            style={tw`mt-4 text-left text-xl font-medium text-slate-900 dark:text-gray-200`}>
            {device?.name ?? device?.macAddress}
          </AppText>
          {device?.heartbeat && (
            <View style={tw`shrink grow overflow-hidden`}>
              <AppShimmerText
                active={loading}
                numberOfLines={1}
                style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
                {dayjs(device.heartbeat).fromNow()}
              </AppShimmerText>
            </View>
          )}

          {device?.attending && (
            <Animated.View
              entering={BounceIn.duration(1000).delay(300)}
              exiting={BounceOut.duration(1000)}
              style={tw`absolute -bottom-1 -right-1 z-10 flex size-5 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-900`}>
              <View style={tw`size-3 rounded-full bg-emerald-600 dark:bg-emerald-700`} />
            </Animated.View>
          )}
        </>
      )}
    </Animated.View>
  );
};

const NewDeviceCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { t } = useTranslation();

  return (
    <View
      // eslint-disable-next-line tailwindcss/no-custom-classname
      style={[
        tw`flex flex-col items-start gap-4 rounded-2xl border-gray-400 p-4 dark:border-stone-500`,
        {
          borderStyle: 'dashed',
          borderWidth: 2,
        },
        style,
      ]}>
      <AppIcon
        color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
        icon={'plus-circle-outline'}
        size={44}
        style={tw`shrink-0 grow-0`}
      />
      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-left text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('devices.new.title')}
      </AppText>
    </View>
  );
};

export default Devices;
