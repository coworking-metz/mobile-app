import WifiNetworkAnimation from '../Animations/WifiNetworkAnimation';
import AppTextButton from '../AppTextButton';
import LoadingSkeleton from '../LoadingSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import { FadeIn, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import tw from 'twrnc';
import AppBottomSheet, { AppBottomSheetRef } from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { useAppReview } from '@/context/review';
import { AppErrorCode, handleSilentError, useErrorNotice } from '@/helpers/error';
import { log } from '@/helpers/logger';
import {
  addMemberDevice,
  ApiMemberDevice,
  DeviceType,
  getMemberDevice,
} from '@/services/api/members';
import { getDeviceInfo, isDeviceInfoAvailable, ProbeDevice } from '@/services/api/probe';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const detectLogger = log.extend(`[detect]`);

const FETCH_DEVICES_MAX_ATTEMPTS_COUNT = 10;
const FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT = 10;
const RETRY_BASE_DELAY_IN_MS = 1000;

const DetectDeviceBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const noticeStore = useNoticeStore();
  const noticeError = useErrorNotice();
  const toastStore = useToastStore();
  const settingsStore = useSettingsStore();
  const review = useAppReview();
  const animation = useRef<LottieView>(null);
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const queryClient = useQueryClient();

  const [isReachingService, setReachingService] = useState<boolean>(false);
  const [isServiceReachable, setServiceReachable] = useState<boolean>(false);
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [addedDevice, setAddedDevice] = useState<ApiMemberDevice | null>(null);
  const [verifiedDevice, setVerifiedDevice] = useState<ApiMemberDevice | null>(null);

  const [isAnimating, setAnimating] = useState<boolean>(false);
  const [shouldLoopAnimation, setLoopAnimation] = useState<boolean>(false);
  const [shouldEndAnimation, setEndAnimation] = useState<boolean>(false);
  const [abortController] = useState<AbortController>(new AbortController());

  // https://stackoverflow.com/a/65805464
  const verifyAttendingDevice = useCallback(
    async (memberId: string, deviceId: string, count = 0) => {
      return new Promise((resolve, reject) => {
        if (count > FETCH_DEVICES_MAX_ATTEMPTS_COUNT) {
          throw new Error(t('devices.add.onVerifyDevice.tooManyAttempts'));
        }

        if (abortController.signal.aborted) {
          return reject({ code: AppErrorCode.CANCELED });
        }

        setTimeout(() => {
          detectLogger.debug(`verifyAttendingDevice ${deviceId} attempt ${count + 1}`);
          getMemberDevice(memberId, deviceId)
            .then((device) => {
              if (device?.attending) {
                return resolve(device);
              }
              return verifyAttendingDevice(memberId, deviceId, count + 1).then(resolve);
            })
            .catch(reject);
        }, RETRY_BASE_DELAY_IN_MS * count); // increase the delay on each retry
      });
    },
    [abortController],
  );

  // fetch device info until it has been scanned by the probe
  const fetchDeviceInfo = useCallback(
    async (count = 0) => {
      return new Promise((resolve, reject) => {
        if (count > FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT) {
          throw new Error(t('devices.add.onFetchDeviceInfo.tooManyAttempts'));
        }

        if (abortController.signal.aborted) {
          return reject({ code: AppErrorCode.CANCELED });
        }

        setTimeout(() => {
          detectLogger.debug(`fetchDeviceInfo attempt ${count + 1}`);
          getDeviceInfo()
            .then(({ device }) => {
              if (device) {
                return resolve(device);
              }
              return fetchDeviceInfo(count + 1).then(resolve);
            })
            .catch(reject);
        }, RETRY_BASE_DELAY_IN_MS * count); // increase the delay on each retry
      });
    },
    [abortController],
  );

  const onStart = useCallback(() => {
    startAnimation();

    const fetchAddThenVerify: Promise<ApiMemberDevice> = new Promise((resolve, reject) => {
      const abortListener = () => {
        abortController.signal.removeEventListener('abort', abortListener);
        reject({ code: AppErrorCode.CANCELED });
      };
      abortController.signal.addEventListener('abort', abortListener);

      (async () => {
        const deviceInfo = (await fetchDeviceInfo().catch((error) => {
          if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
            throw new Error(t('devices.add.onFetchDeviceInfo.unavailable', { cause: error }));
          }
          return Promise.reject(error);
        })) as ProbeDevice;
        const deviceMacAddress = deviceInfo.macAddress || null;
        setMacAddress(deviceInfo.macAddress);
        const deviceName = deviceInfo.name || Device.deviceName || null;
        setName(deviceName);

        const newDevice = await addMemberDevice(
          authStore.user?.id as string,
          {
            name: deviceName,
            macAddress: deviceMacAddress,
            type: DeviceType.MOBILE,
          } as ApiMemberDevice,
        );
        setAddedDevice(newDevice);

        const attendingDevice = await verifyAttendingDevice(
          authStore.user?.id as string,
          newDevice._id as string,
        );
        resolve(attendingDevice as never);
      })().catch(reject);
    });
    fetchAddThenVerify
      .then((device) => {
        if (device) {
          setVerifiedDevice(device);
        }

        setEndAnimation(true);
      })
      .catch(handleSilentError)
      .catch((error) => {
        noticeError(error, t('devices.add.onDetect.fail'));
        resetAnimation();
      });
  }, [authStore]);

  const onCancel = useCallback(() => {
    abortController.abort();
    onClose?.();
  }, [onClose, abortController]);

  const startAnimation = useCallback(() => {
    setAnimating(true);
    setEndAnimation(false);
    setLoopAnimation(true);
    animation.current?.play(0, 150);
  }, [animation]);

  const continueAnimation = useCallback(() => {
    animation.current?.play(100, 150);
  }, [animation]);

  const enddAnimation = useCallback(() => {
    setLoopAnimation(false);
    setEndAnimation(false);
    animation.current?.play(150, 250);
  }, [animation]);

  const resetAnimation = useCallback(() => {
    setLoopAnimation(false);
    setEndAnimation(false);
    animation.current?.play(0, 0);
    animation.current?.reset();
  }, [animation]);

  const onAnimationFinish = useCallback(() => {
    if (shouldEndAnimation) {
      enddAnimation();
    } else if (shouldLoopAnimation) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      continueAnimation();
    } else if (isAnimating) {
      setAnimating(false);
      onAnimationEnded();
    }
  }, [shouldLoopAnimation, shouldEndAnimation, isAnimating]);

  const onAnimationEnded = useCallback(() => {
    if (verifiedDevice) {
      bottomSheetRef.current?.close();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      noticeStore.add({
        message: t('devices.add.onDetect.success', {
          name: verifiedDevice.name || verifiedDevice.macAddress,
        }),
        type: 'success',
        onClose: () => {
          if (!settingsStore.hasBeenInvitedToReview) {
            useSettingsStore.setState({ hasBeenInvitedToReview: true });
            toastStore.add({
              message: t('review.onInvite.message'),
              type: 'info',
              action: {
                label: t('review.onInvite.confirm'),
                onPress: async () => {
                  toast.dismiss();
                  review();
                },
              },
            });
          }
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['members', authStore.user?.id, 'devices'],
        exact: true,
      });
    }
  }, [verifiedDevice, noticeStore, t, bottomSheetRef, queryClient, settingsStore, toastStore]);

  useEffect(() => {
    setReachingService(true);
    isDeviceInfoAvailable()
      .then(() => {
        setServiceReachable(true);
      })
      .catch(() => {
        setServiceReachable(false);
      })
      .finally(() => {
        setReachingService(false);
      });
  }, []);

  return (
    <AppBottomSheet ref={bottomSheetRef} style={style} onClose={onCancel}>
      <View style={tw`flex flex-col w-full gap-4 px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <WifiNetworkAnimation
            ref={animation}
            loop={false}
            style={tw`h-64 w-full bg-transparent`}
            onAnimationFinish={onAnimationFinish}
          />
        </View>
        {!isAnimating && (
          <AppText
            exiting={FadeOutRight.duration(500)}
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('devices.add.detect.label')}
          </AppText>
        )}
        {isAnimating && (
          <>
            {!macAddress && (
              <AppText
                entering={FadeInLeft.duration(1000)}
                exiting={FadeOutRight.duration(500)}
                style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.add.onFetchDeviceInfo.pending')}
              </AppText>
            )}

            {macAddress && !addedDevice && (
              <AppText
                entering={FadeInLeft.duration(1000)}
                exiting={FadeOutRight.duration(500)}
                style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.onAdd.pending')}
              </AppText>
            )}

            {macAddress && addedDevice && (
              <AppText
                entering={FadeInLeft.duration(1000)}
                style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.add.onVerifyDevice.pending')}
              </AppText>
            )}
          </>
        )}
        <ReadMore
          numberOfLines={3}
          renderRevealedFooter={(handlePress) => (
            <AppText
              style={tw`text-base font-normal text-amber-500 text-left`}
              onPress={handlePress}>
              {t('actions.hide')}
            </AppText>
          )}
          renderTruncatedFooter={(handlePress) => (
            <AppText
              style={tw`text-base font-normal text-amber-500 text-left`}
              onPress={handlePress}>
              {t('actions.readMore')}
            </AppText>
          )}>
          <AppText
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutRight.duration(300)}
            style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400 w-full`}>
            {t('devices.add.detect.description')}
          </AppText>
        </ReadMore>
        <ReachableService pending={isReachingService} reachable={isServiceReachable} />
        <AppRoundedButton
          disabled={isAnimating}
          style={tw`mt-2 w-full max-w-md self-center`}
          onPress={onStart}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('devices.add.detect.start')}
          </AppText>
        </AppRoundedButton>
        <Link
          asChild
          href={{
            pathname: '/devices/new',
            params: {
              name,
              macAddress,
            },
          }}>
          <AppTextButton onPress={() => bottomSheetRef.current?.close()}>
            <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('devices.add.manual')}
            </AppText>
          </AppTextButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

const ReachableService = ({
  reachable,
  pending,
  style,
}: {
  reachable?: boolean;
  pending?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();

  return (
    <View style={[tw`flex flex-row items-start flex-gap-2 w-full overflow-hidden`, style]}>
      {pending ? (
        <View style={tw`rounded-full overflow-hidden`}>
          <LoadingSkeleton height={24} width={24} />
        </View>
      ) : (
        <MaterialCommunityIcons
          color={
            reachable
              ? tw.prefixMatch('dark')
                ? tw.color('emerald-700')
                : tw.color('emerald-600')
              : tw.color('yellow-500')
          }
          iconStyle={tw`h-6 w-6 mr-0`}
          name={reachable ? 'check-circle' : 'alert'}
          size={24}
          style={tw`shrink-0 grow-0`}
        />
      )}

      {pending ? (
        <View style={tw`flex flex-col gap-1 mt-1`}>
          <LoadingSkeleton height={18} width={172} />
        </View>
      ) : (
        <View style={tw`flex flex-row items-center min-h-6 shrink grow basis-0`}>
          <AppText
            entering={FadeIn.duration(300)}
            style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400`}>
            {reachable ? t('devices.add.detect.reachable') : t('devices.add.detect.unreachable')}
          </AppText>
        </View>
      )}
    </View>
  );
};

export default DetectDeviceBottomSheet;
