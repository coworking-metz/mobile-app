import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeOut, FadeOutRight } from 'react-native-reanimated';
import tw from 'twrnc';
import WifiScanningAnimation from '@/components/Animations/WifiScanningAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppIcon from '@/components/AppIcon';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { useOnPremise } from '@/components/OnPremise/OnPremiseContext';
import { AppErrorCode, handleSilentError } from '@/helpers/error';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';
import { log } from '@/helpers/logger';
import {
  addMemberDevice,
  ApiMemberDevice,
  DeviceType,
  getMemberDevice,
} from '@/services/api/members';
import { getDeviceInfo, ProbeDevice } from '@/services/api/probe';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const pairLogger = log.extend(`[pair-device]`);

const VERIFY_ATTENDING_DEVICE_MAX_ATTEMPTS_COUNT = 10;
const FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT = 10;
const RETRY_BASE_DELAY_IN_MS = 1000;

const PairDeviceBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const settingsStore = useSettingsStore();
  const animation = useRef<LottieView>(null);
  const queryClient = useQueryClient();
  const { selectWifi } = useOnPremise();

  const bottomSheetRef = useRef<AppBottomSheetRef | null>(null);
  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const [fetchDeviveInfoAttemptsCount, setFetchDeviveInfoAttemptsCount] = useState<number>(0);
  const [fetchDeviceTimeoutHandle, setFetchDeviceTimeoutHandle] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [addedDevice, setAddedDevice] = useState<ApiMemberDevice | null>(null);
  const [verifyingAttemptsCount, setVerifyingAttemptsCount] = useState<number>(0);
  const [verifyingTimeoutHandle, setVerifyingTimeoutHandle] = useState<NodeJS.Timeout | null>(null);
  const [verifiedDevice, setVerifiedDevice] = useState<ApiMemberDevice | null>(null);

  const [isAnimating, setAnimating] = useState<boolean>(false);
  const [shouldLoopAnimation, setLoopAnimation] = useState<boolean>(false);
  const [shouldEndAnimation, setEndAnimation] = useState<boolean>(false);
  const [abortController] = useState<AbortController>(new AbortController());

  // https://stackoverflow.com/a/65805464
  const verifyAttendingDevice = useCallback(
    async (memberId: string, deviceId: string, count = 1) => {
      return new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
          pairLogger.debug(`verifyAttendingDevice ${deviceId} attempt ${count}`);
          if (count > VERIFY_ATTENDING_DEVICE_MAX_ATTEMPTS_COUNT) {
            return reject(
              Error(
                t('devices.add.onVerifyDevice.tooManyAttempts', {
                  count: VERIFY_ATTENDING_DEVICE_MAX_ATTEMPTS_COUNT,
                }),
              ),
            );
          }

          if (abortController.signal.aborted) {
            return reject({ code: AppErrorCode.CANCELED });
          }

          setVerifyingAttemptsCount(count);
          getMemberDevice(memberId, deviceId)
            .then((device) => {
              if (device?.attending) {
                return device;
              }
              return verifyAttendingDevice(memberId, deviceId, count + 1);
            })
            .then(resolve)
            .catch(reject);
        }, RETRY_BASE_DELAY_IN_MS * count); // increase the delay on each retry
        setFetchDeviceTimeoutHandle(handle);
      });
    },
    [abortController],
  );

  // fetch device info until it has been scanned by the probe
  const fetchDeviceInfo = useCallback(
    async (count = 1) => {
      return new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
          pairLogger.debug(`fetchDeviceInfo attempt ${count}`);
          if (count > FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT) {
            return reject(
              new Error(
                t('devices.add.onFetchDeviceInfo.tooManyAttempts', {
                  count: FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT,
                }),
              ),
            );
          }

          if (abortController.signal.aborted) {
            return reject({ code: AppErrorCode.CANCELED });
          }

          setFetchDeviveInfoAttemptsCount(count);
          getDeviceInfo()
            .then(({ device }) => {
              if (device) {
                return device;
              }
              return fetchDeviceInfo(count + 1);
            })
            .then(resolve)
            .catch(reject);
        }, RETRY_BASE_DELAY_IN_MS * count); // increase the delay on each retry
        setVerifyingTimeoutHandle(handle);
      });
    },
    [abortController],
  );

  const onStart = useCallback(async () => {
    startAnimation();

    const fetchAddThenVerify: Promise<ApiMemberDevice> = new Promise((resolve, reject) => {
      const abortListener = () => {
        abortController.signal.removeEventListener('abort', abortListener);
        reject({ code: AppErrorCode.CANCELED });
      };
      abortController.signal.addEventListener('abort', abortListener);

      (async () => {
        setMacAddress(null);
        setName(null);
        setAddedDevice(null);
        setVerifiedDevice(null);
        setVerifyingAttemptsCount(0);
        setFetchDeviveInfoAttemptsCount(0);
        const deviceInfo = (await fetchDeviceInfo().catch((error) => {
          if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
            throw new Error(t('devices.add.onFetchDeviceInfo.unavailable'), { cause: error });
          }
          throw new Error([t('devices.add.onFetchDeviceInfo.fail'), error.message].join('\n'));
        })) as ProbeDevice;
        const deviceMacAddress = deviceInfo.macAddress || null;
        setMacAddress(deviceInfo.macAddress);
        const deviceName = deviceInfo.name || Device.deviceName || null;
        setName(deviceName);

        const [newDevice] = await Promise.all([
          addMemberDevice(
            authStore.user?.id as string,
            {
              name: deviceName,
              macAddress: deviceMacAddress,
              type: DeviceType.MOBILE,
            } as ApiMemberDevice,
          ),
          // wait at least 1 second to let the user read the text
          new Promise((r) => setTimeout(r, 1_000)),
        ]);
        setAddedDevice(newDevice);
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
          exact: true,
        });

        const attendingDevice = await verifyAttendingDevice(
          authStore.user?.id as string,
          newDevice._id as string,
        ).catch((error) => {
          throw new Error([t('devices.add.onVerifyDevice.fail'), error.message].join('\n'));
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
          exact: true,
        });
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
        noticeStore.addError(error, { message: t('devices.add.onPair.fail') });
        resetAnimation();
      });
  }, [authStore]);

  const onCancel = useCallback(() => {
    abortController.abort();
    if (fetchDeviceTimeoutHandle) {
      clearTimeout(fetchDeviceTimeoutHandle);
    }
    if (verifyingTimeoutHandle) {
      clearTimeout(verifyingTimeoutHandle);
    }
    resetAnimation();
    onClose?.();
  }, [onClose, abortController, fetchDeviceTimeoutHandle, verifyingTimeoutHandle]);

  const startAnimation = useCallback(() => {
    setAnimating(true);
    setEndAnimation(false);
    setLoopAnimation(true);
    animation.current?.play(0, 150);
  }, [animation]);

  const continueAnimation = useCallback(() => {
    animation.current?.play(100, 150);
  }, [animation]);

  const endAnimation = useCallback(() => {
    setLoopAnimation(false);
    setEndAnimation(false);
    animation.current?.play(150, 250);
  }, [animation]);

  const resetAnimation = useCallback(() => {
    setLoopAnimation(false);
    setEndAnimation(false);
    setAnimating(false);
    animation.current?.play(0, 0);
    animation.current?.reset();
  }, [animation]);

  const onAnimationFinish = useCallback(() => {
    if (shouldEndAnimation) {
      endAnimation();
    } else if (shouldLoopAnimation) {
      vibrate(HapticFeedbackType.Medium);
      continueAnimation();
    } else if (isAnimating) {
      setAnimating(false);
      onAnimationEnded();
    }
  }, [shouldLoopAnimation, shouldEndAnimation, isAnimating]);

  const onAnimationEnded = useCallback(() => {
    if (verifiedDevice) {
      bottomSheetRef.current?.close();
      noticeStore.add({
        message: t('devices.add.onPair.success', {
          name: verifiedDevice.name || verifiedDevice.macAddress,
        }),
        type: 'success',
      });

      // refresh attending members and profile to be consistent
      queryClient.invalidateQueries({
        queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
      });
      queryClient.invalidateQueries({ queryKey: membersQueryKeys.attending() });
    }
  }, [verifiedDevice, noticeStore, t, bottomSheetRef, queryClient, settingsStore, toastStore]);

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      style={[tw`flex w-full flex-col gap-4 p-6`, style]}
      onClose={onCancel}
      onWillPresent={() => {
        animation.current?.reset();
        animation.current?.pause();
      }}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <WifiScanningAnimation
          ref={animation}
          autoPlay={false}
          loop={false}
          progress={0}
          style={tw`h-64 w-full bg-transparent`}
          onAnimationFinish={onAnimationFinish}
        />
      </View>
      {isAnimating ? (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={tw`flex flex-col gap-1`}>
          {!macAddress && (
            <>
              <AppText
                entering={FadeInLeft.duration(1000)}
                exiting={FadeOutRight.duration(500)}
                style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.add.onFetchDeviceInfo.pending')}
              </AppText>
              {fetchDeviveInfoAttemptsCount > 1 && (
                <AppShimmerText
                  active
                  entering={FadeIn.duration(1000)}
                  exiting={FadeOutRight.duration(500)}
                  style={tw`text-center text-xs font-normal text-slate-500 dark:text-neutral-500`}>
                  {t('devices.add.onFetchDeviceInfo.attempts', {
                    count: fetchDeviveInfoAttemptsCount,
                    max: FETCH_DEVICE_INFO_MAX_ATTEMPTS_COUNT,
                  })}
                </AppShimmerText>
              )}
            </>
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
            <>
              <AppText
                entering={FadeInLeft.duration(1000)}
                style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.add.onVerifyDevice.pending')}
              </AppText>
              {verifyingAttemptsCount > 1 && (
                <AppShimmerText
                  active
                  entering={FadeIn.duration(1000)}
                  style={tw`text-center text-xs font-normal text-slate-500 dark:text-neutral-500`}>
                  {t('devices.add.onVerifyDevice.attempts', {
                    count: verifyingAttemptsCount,
                    max: VERIFY_ATTENDING_DEVICE_MAX_ATTEMPTS_COUNT,
                  })}
                </AppShimmerText>
              )}
            </>
          )}
        </Animated.View>
      ) : (
        <AppText
          entering={FadeIn.duration(500)}
          exiting={FadeOutRight.duration(500)}
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('devices.add.pair.label')}
        </AppText>
      )}
      <AppText
        entering={FadeInLeft.duration(300)}
        exiting={FadeOutRight.duration(300)}
        style={tw`w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('devices.add.pair.description')}
      </AppText>
      <View style={tw`flex w-full flex-row items-start gap-2 overflow-hidden`}>
        <AppIcon
          color={tw.color('blue-600')}
          icon="information"
          size={24}
          style={tw`shrink-0 grow-0`}
        />
        <Trans
          components={[
            <AppText key="wifi-network" style={tw`text-amber-500`} onPress={selectWifi} />,
            <AppText
              key="open-settings"
              style={tw`text-amber-500`}
              onPress={Linking.openSettings}
            />,
          ]}
          defaults={t('devices.add.pair.localNetworkPermissions')}
          parent={AppText}
          style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />
      </View>

      <AppRoundedButton
        disabled={isAnimating}
        label={isAnimating ? t('devices.add.pair.pairing') : t('devices.add.pair.start')}
        style={tw`mt-2 w-full max-w-sm self-center`}
        onPress={onStart}
      />
      <Link
        asChild
        href={{
          pathname: '/devices/new',
          params: {
            name,
            macAddress,
          },
        }}>
        <AppTextButton
          style={tw`mx-auto w-full max-w-sm`}
          onPress={() => bottomSheetRef.current?.close()}>
          <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('devices.add.manual')}
          </AppText>
        </AppTextButton>
      </Link>
    </AppBottomSheet>
  );
};

export default forwardRef(PairDeviceBottomSheet);
