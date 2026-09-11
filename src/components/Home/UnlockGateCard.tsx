import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import LockUnlockAnimation from '@/components/Animations/LockUnlockAnimation';
import AppPressable from '@/components/AppPressable';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import ReanimatedText from '@/components/ReanimatedText';
import { useAppAuth } from '@/context/auth';
import { useAppUnlockGateOptions } from '@/context/unlock-gate-duration';
import { theme } from '@/helpers/colors';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';
import { unlockSteelGate } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';

const FILL_BACKGROUND_ANIMATION_DURATION_IN_MS = 300;
const WARN_ON_SUCCESSIVE_TAPS_COUNT = 3;
const WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS = 20_000;
const WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS = 60_000; // wait for 60 seconds before warning again

const UnlockCard = ({
  disabled = false,
  style,
  onSuccessiveTaps,
}: {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onSuccessiveTaps?: () => void;
}) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const user = useAuthStore((s) => s.user);
  const { login } = useAppAuth();
  const animation = useRef<LottieView>(null);
  const unlocking = useSharedValue(0);
  const { selectUnlockGateOptions } = useAppUnlockGateOptions();
  const unlockGateDurationInMs = useSettingsStore((state) => state.unlockGateDurationInMs);
  const [cardWidth, setCardWidth] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isUnlocked, setUnlocked] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tapHistory, setTapHistory] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  const onUnlock = useCallback(() => {
    if (isLoading || disabled) return;

    if (!lastWarning || dayjs().diff(lastWarning) > WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS) {
      setTapHistory([...tapHistory, new Date().toISOString()]);
    }

    setLoading(true);
    return unlockSteelGate(unlockGateDurationInMs)
      .then(({ locked }) => {
        const timeleftInMs = Date.parse(locked) - Date.now();
        const timeleftBeforeLockInMs =
          Math.max(timeleftInMs, 2 * FILL_BACKGROUND_ANIMATION_DURATION_IN_MS) -
          FILL_BACKGROUND_ANIMATION_DURATION_IN_MS;
        setTimeLeft(timeleftBeforeLockInMs);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        unlocking.value = withSequence(
          withTiming(1, {
            duration: FILL_BACKGROUND_ANIMATION_DURATION_IN_MS,
          }),
          withTiming(0, {
            duration: timeleftBeforeLockInMs,
            easing: Easing.linear,
          }),
        );
      })
      .catch((error) => {
        noticeStore
          .addError(error, {
            message: t('home.unlockGate.onFail.message'),
            action: {
              label: t('actions.retry'),
              onPress: () => setTimeout(onUnlock, 500),
              suffixIcon: 'reload',
            },
          })
          .catch(() => {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    disabled,
    isLoading,
    noticeStore,
    t,
    unlocking,
    unlockGateDurationInMs,
    tapHistory,
    lastWarning,
  ]);

  const onOpenOptionsSheet = useCallback(() => {
    vibrate(HapticFeedbackType.Medium);
    selectUnlockGateOptions();
  }, [selectUnlockGateOptions]);

  useEffect(() => {
    const recentTaps = [...tapHistory]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, WARN_ON_SUCCESSIVE_TAPS_COUNT);
    if (recentTaps.length === WARN_ON_SUCCESSIVE_TAPS_COUNT) {
      const [mostRecentTap] = recentTaps;
      const oldestTap = recentTaps.pop() || mostRecentTap;
      const isTappingSuccessively =
        new Date(mostRecentTap).getTime() - new Date(oldestTap).getTime() <
        WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS;

      if (isTappingSuccessively) {
        setLastWarning(new Date().toISOString());
        onSuccessiveTaps?.();
      }
    }
  }, [tapHistory]);

  useEffect(() => {
    if (animation.current && !isNil(isUnlocked)) {
      if (isUnlocked) {
        animation.current.play(100, 150);
      } else {
        animation.current.play(260, 300);
      }
    }
  }, [animation, isUnlocked]);

  const backgroundStyle = useAnimatedStyle(() => {
    const width = interpolate(unlocking.value, [0, 1], [0, cardWidth]);

    return {
      width,
    };
  }, [unlocking.value]);

  const timeLeftInSeconds = useDerivedValue(() => {
    const seconds = (unlocking.value * timeLeft) / 1000;
    return Platform.OS === 'android'
      ? `${Math.ceil(seconds).toFixed(0)}`.padStart(2, ' ')
      : `${Math.ceil(seconds).toFixed(0)}`;
  }, [unlocking, timeLeft]);

  useAnimatedReaction(
    () => {
      return unlocking.value > 0;
    },
    (isUnlocking, previous) => {
      if (isUnlocking !== previous) {
        scheduleOnRN(setUnlocked, isUnlocking);
      }
    },
    [unlocking],
  );

  return (
    <AppPressable
      disabled={disabled}
      style={style}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setCardWidth(nativeEvent.layout.width)}
      onPress={() => (user ? onUnlock() : login?.())}
      {...(user && {
        onLongPress: onOpenOptionsSheet,
      })}>
      <AppSquircleView
        style={[
          tw.style(
            `relative flex min-h-20 flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gray-300/60 py-4 pl-4 dark:bg-zinc-900/85`,
            disabled && tw`opacity-60`,
          ),
        ]}>
        <Animated.View
          style={[tw`absolute inset-0 w-full bg-gray-300 dark:bg-zinc-800/80`, backgroundStyle]}
        />
        <Animated.View
          style={[
            tw`z-20 rounded-full bg-gray-300 p-2 dark:bg-zinc-800`,
            isUnlocked && {
              backgroundColor: tw.prefixMatch('dark') ? tw.color('yellow-600') : theme.meatBrown,
            },
          ]}>
          <View style={tw`relative size-8 shrink-0`}>
            <LockUnlockAnimation
              ref={animation}
              autoPlay={false}
              color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
              loop={false}
              progress={0}
              style={[tw`size-full`, isLoading && { opacity: 0 }]}
            />
            {isLoading && <HorizontalLoadingAnimation style={tw`absolute size-full`} />}
          </View>
        </Animated.View>

        {isUnlocked ? (
          <View style={tw`z-20 flex w-full flex-col items-start`}>
            <AppText
              numberOfLines={1}
              style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
              {t('home.unlockGate.onUnlocked.firstLine')}
            </AppText>
            <View style={tw`flex flex-row items-end gap-1`}>
              <AppText
                numberOfLines={1}
                style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                {t('home.unlockGate.onUnlocked.secondLine')}
              </AppText>
              <ReanimatedText
                style={tw`android:pr-1 text-xl font-semibold text-slate-900 dark:text-gray-200`}
                text={timeLeftInSeconds}
              />
              <AppText
                numberOfLines={1}
                style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                {t('home.unlockGate.onUnlocked.suffix')}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={tw`z-20 flex w-full flex-col items-stretch overflow-hidden`}>
            <AppText
              ellipsizeMode="clip"
              numberOfLines={1}
              style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
              {t('home.unlockGate.label.firstLine')}
            </AppText>
            <AppText
              numberOfLines={1}
              style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
              {t('home.unlockGate.label.secondLine')}
            </AppText>
          </View>
        )}
      </AppSquircleView>
    </AppPressable>
  );
};

export default UnlockCard;
