import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeIn, FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import SwitchDevicesAnimation from '@/components/Animations/SwitchDevicesAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import ErrorChip from '@/components/ErrorChip';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAppNewDevice } from '@/context/new-device';
import { getDeviceTypeIcon } from '@/helpers/device';
import { isSilentError } from '@/helpers/error';
import { ApiMemberDevice, DeviceType, getMemberDevices } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const Devices = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const authStore = useAuthStore();
  const { pairDevice } = useAppNewDevice();

  const {
    data: devices,
    isPending: isPendingDevices,
    isFetching: isFetchingDevices,
    error: devicesError,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'devices'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberDevices(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    retry: false,
    staleTime: 300_000,
  });

  return (
    <ServiceLayout
      contentStyle={tw`pt-6`}
      title={t('devices.title')}
      withBackButton={!_root}
      onRefresh={refetchDevices}>
      {devicesError && !isSilentError(devicesError) && (
        <ErrorChip
          error={devicesError}
          label={t('devices.onFetch.fail')}
          style={tw`mx-6 mb-6 self-start`}
        />
      )}
      {isPendingDevices ? (
        <View style={tw`flex flex-row items-stretch flex-wrap gap-4 px-6`}>
          {[0].map((index) => (
            <DeviceCard pending key={index} style={tw`grow shrink basis-0 min-w-32 max-w-44`} />
          ))}
          <AppTouchable
            style={tw`flex flex-row grow shrink basis-0 min-w-32 max-w-44`}
            onPress={pairDevice}>
            <NewDeviceCard style={tw`self-stretch w-full`} />
          </AppTouchable>
          {/* Placeholder for the last card to maintain layout */}
          <View style={tw`grow shrink basis-0 min-w-32 max-w-44`} />
        </View>
      ) : devices?.length ? (
        <View style={tw`flex flex-row items-stretch flex-wrap gap-4 px-6`}>
          {devices.map((device) => (
            <Link
              asChild
              href={`/devices/${device._id}`}
              key={device.macAddress}
              style={tw`flex flex-row grow shrink basis-0 min-w-32 max-w-44`}>
              <AppTouchable>
                <DeviceCard
                  device={device}
                  key={device.macAddress}
                  loading={isFetchingDevices}
                  style={tw`self-stretch w-full`}
                />
              </AppTouchable>
            </Link>
          ))}
          <AppTouchable
            style={tw`flex flex-row grow shrink basis-0 min-w-32 max-w-44`}
            onPress={pairDevice}>
            <NewDeviceCard style={tw`self-stretch w-full`} />
          </AppTouchable>
          {/* Placeholder for the last card to maintain layout */}
          <View style={tw`grow shrink basis-0 min-w-32 max-w-44`} />
        </View>
      ) : (
        <Animated.View
          style={tw`flex flex-col gap-2 grow items-center w-full px-6 max-w-md mx-auto`}>
          <SwitchDevicesAnimation style={tw`h-48 w-full`} />
          <AppText
            numberOfLines={1}
            style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('devices.empty.title')}
          </AppText>
          <AppText
            style={tw`text-base text-center font-normal text-slate-500 dark:text-slate-400 mb-auto`}>
            {t('devices.empty.description')}
          </AppText>
          <AppRoundedButton
            style={tw`h-14 mt-4 w-full self-center`}
            suffixIcon="plus"
            onPress={pairDevice}>
            <AppText style={tw`text-base text-black font-medium`}>
              {t('devices.add.pair.label')}
            </AppText>
          </AppRoundedButton>
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
        tw`flex flex-col items-start py-4 pl-4 rounded-2xl min-h-20 relative bg-gray-200 dark:bg-gray-800/80`,
        style,
      ]}>
      {pending ? (
        <>
          <View style={tw`rounded-full overflow-hidden`}>
            <LoadingSkeleton height={48} width={48} />
          </View>

          <View style={tw`mt-5 rounded-lg overflow-hidden`}>
            <LoadingSkeleton height={24} width={128} />
          </View>
          <View style={tw`mt-2.5 rounded-lg overflow-hidden`}>
            <LoadingSkeleton height={14} width={80} />
          </View>
        </>
      ) : (
        <>
          <View style={tw`bg-slate-300 dark:bg-gray-700 rounded-full p-2 z-20`}>
            <View style={tw`flex relative h-8 w-8 shrink-0`}>
              {loading ? (
                <HorizontalLoadingAnimation
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                  style={tw`absolute h-full w-full`}
                />
              ) : (
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  name={getDeviceTypeIcon(device?.type ?? DeviceType.UNKNOWN)}
                  size={32}
                  style={tw`shrink-0 self-center`}
                />
              )}
            </View>
          </View>

          <AppText
            ellipsizeMode={'tail'}
            numberOfLines={device?.name && !device?.heartbeat ? 2 : 1}
            style={tw`mt-4 text-xl text-left font-medium text-slate-900 dark:text-gray-200`}>
            {device?.name ?? device?.macAddress}
          </AppText>
          {device?.heartbeat && (
            <AppText
              numberOfLines={1}
              style={tw`text-base text-left font-normal text-slate-500 dark:text-slate-400`}>
              {dayjs(device.heartbeat).fromNow()}
            </AppText>
          )}

          {device?.attending && (
            <Animated.View
              entering={BounceIn.duration(1000).delay(300)}
              exiting={BounceOut.duration(1000)}
              style={tw`z-10 h-5 w-5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-1 -right-1`}>
              <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
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
        tw`flex flex-col items-start gap-4 px-4 py-4 rounded-2xl border-gray-400`,
        {
          borderStyle: 'dashed',
          borderWidth: 2,
        },
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        name={'plus-circle-outline'}
        size={44}
        style={tw`shrink-0 grow-0`}
      />
      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-xl text-left font-medium text-slate-900 dark:text-gray-200`}>
        {t('devices.new.title')}
      </AppText>
    </View>
  );
};

export default Devices;
