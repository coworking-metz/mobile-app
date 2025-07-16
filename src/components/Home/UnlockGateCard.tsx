import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import LockUnlockAnimation from '@/components/Animations/LockUnlockAnimation';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import ReanimatedText from '@/components/ReanimatedText';
import { useAppAuth } from '@/context/auth';
import { theme } from '@/helpers/colors';
import { parseErrorText } from '@/helpers/error';
import { unlockSteelGate } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

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
  const authStore = useAuthStore();
  const { login } = useAppAuth();
  const animation = useRef<LottieView>(null);
  const unlocking = useSharedValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isUnlocked, setUnlocked] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tapHistory, setTapHistory] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  const onUnlock = () => {
    if (isLoading || disabled) return;

    if (!lastWarning || dayjs().diff(lastWarning) > WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS) {
      setTapHistory([...tapHistory, new Date().toISOString()]);
    }

    setLoading(true);
    unlockSteelGate()
      .then(({ locked }) => {
        const timeleftInMs = Date.parse(locked) - Date.now();
        const timeleftBeforeLockInMs =
          (timeleftInMs > 0 ? timeleftInMs : 2 * FILL_BACKGROUND_ANIMATION_DURATION_IN_MS) -
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
      .catch(async (error) => {
        const description = await parseErrorText(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        noticeStore.add({
          message: t('home.intercom.onFail.message'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        Sentry.captureMessage('Tapping successively on unlock gate card', {
          level: 'warning',
        });
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
        runOnJS(setUnlocked)(isUnlocking);
      }
    },
    [unlocking],
  );

  return (
    <AppTouchable
      disabled={disabled}
      style={[
        tw`flex flex-col items-start gap-4 pl-4 py-4 rounded-2xl min-h-20 overflow-hidden relative bg-gray-200 dark:bg-gray-900`,
        disabled && tw`opacity-60`,
        style,
      ]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setCardWidth(nativeEvent.layout.width)}
      onPress={() => (authStore.user ? onUnlock() : login?.())}>
      <Animated.View
        style={[
          tw`absolute top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-800 w-full`,
          backgroundStyle,
        ]}
      />
      <Animated.View
        style={[
          tw`bg-gray-300 dark:bg-gray-700 rounded-full p-2 z-20`,
          isUnlocked && {
            backgroundColor: tw.prefixMatch('dark') ? tw.color('yellow-600') : theme.meatBrown,
          },
        ]}>
        <View style={tw`relative h-8 w-8 shrink-0`}>
          <LockUnlockAnimation
            ref={animation}
            autoPlay={false}
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            loop={false}
            style={[tw`h-full w-full`, isLoading && { opacity: 0 }]}
          />
          {isLoading && (
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
              style={tw`absolute h-full w-full`}
            />
          )}
        </View>
      </Animated.View>

      {isUnlocked ? (
        <View style={tw`flex flex-col items-start z-20`}>
          <AppText
            numberOfLines={1}
            style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
            {t('home.intercom.onUnlocked.firstLine')}
          </AppText>
          <View style={tw`flex flex-row items-end gap-1`}>
            <AppText
              numberOfLines={1}
              style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
              {t('home.intercom.onUnlocked.secondLine')}
            </AppText>
            <ReanimatedText
              style={[
                tw`text-xl font-semibold text-slate-900 dark:text-gray-200`,
                Platform.OS === 'ios' && tw`mb-0.5`,
              ]}
              text={timeLeftInSeconds}
            />
            <AppText
              numberOfLines={1}
              style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
              {t('home.intercom.onUnlocked.suffix')}
            </AppText>
          </View>
        </View>
      ) : (
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={2}
          style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
          {t('home.intercom.label')}
        </AppText>
      )}
    </AppTouchable>
  );
};

export default UnlockCard;
