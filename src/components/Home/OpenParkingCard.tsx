import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
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
import BarrierAnimation from '@/components/Animations/BarrierAnimation';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppPressable from '@/components/AppPressable';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import ReanimatedText from '@/components/ReanimatedText';
import { useAppAuth } from '@/context/auth';
import { theme } from '@/helpers/colors';
import { parseErrorText } from '@/helpers/error';
import { openParkingGate } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const FILL_BACKGROUND_ANIMATION_DURATION_IN_MS = 300;
const WARN_ON_SUCCESSIVE_TAPS_COUNT = 3;
const WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS = 20_000;
const WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS = 60_000; // wait for 60 seconds before warning again

const OpenParkingCard = ({
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
  const opening = useSharedValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isUnlocked, setUnlocked] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tapHistory, setTapHistory] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  const onOpen = () => {
    if (isLoading || disabled) return;

    if (!lastWarning || dayjs().diff(lastWarning) > WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS) {
      setTapHistory([...tapHistory, new Date().toISOString()]);
    }

    setLoading(true);
    openParkingGate()
      .then(({ closed }) => {
        const timeleftInMs = Date.parse(closed) - Date.now();
        const timeleftBeforeLockInMs =
          Math.max(timeleftInMs, 2 * FILL_BACKGROUND_ANIMATION_DURATION_IN_MS) -
          FILL_BACKGROUND_ANIMATION_DURATION_IN_MS;
        setTimeLeft(timeleftBeforeLockInMs);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        opening.value = withSequence(
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
          message: t('home.parking.onFail.message'),
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
        setLastWarning(new Date().toISOString());
        onSuccessiveTaps?.();
      }
    }
  }, [tapHistory]);

  useEffect(() => {
    if (animation.current && !isNil(isUnlocked)) {
      if (isUnlocked) {
        animation.current.play(80, 192);
      } else {
        animation.current.play(470, 600);
      }
    }
  }, [animation, isUnlocked]);

  const backgroundStyle = useAnimatedStyle(() => {
    const width = interpolate(opening.value, [0, 1], [0, cardWidth]);

    return {
      width,
    };
  }, [opening.value]);

  const timeLeftInSeconds = useDerivedValue(() => {
    const seconds = (opening.value * timeLeft) / 1000;
    return `${seconds > 10 ? Math.ceil(seconds).toFixed(0) : seconds.toFixed(1)}`;
  }, [opening, timeLeft]);

  useAnimatedReaction(
    () => {
      return opening.value > 0;
    },
    (isOpening, previous) => {
      if (isOpening !== previous) {
        runOnJS(setUnlocked)(isOpening);
      }
    },
    [opening],
  );

  return (
    <AppPressable
      disabled={disabled}
      style={style}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setCardWidth(nativeEvent.layout.width)}
      onPress={() => (authStore.user ? onOpen() : login?.())}>
      <AppSquircleView
        style={[
          tw.style(
            `relative flex min-h-20 flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gray-300/60 py-4 pl-4 dark:bg-zinc-900/85`,
            disabled && `opacity-60`,
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
            <BarrierAnimation
              ref={animation}
              autoPlay={false}
              progress={tw.prefixMatch('dark') ? 0.133 : 0.132} // hack to keep the progress in sync with the color scheme
              style={[tw`size-full`, isLoading && { opacity: 0 }]}
            />
            {isLoading && <HorizontalLoadingAnimation style={tw`absolute size-full`} />}
          </View>
        </Animated.View>

        {isUnlocked ? (
          <View style={tw`z-20 flex flex-col`}>
            <AppText
              numberOfLines={1}
              style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
              {t('home.parking.onUnlocked.firstLine')}
            </AppText>
            <View style={tw`flex flex-row items-end gap-1`}>
              <AppText
                numberOfLines={1}
                style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                {t('home.parking.onUnlocked.secondLine')}
              </AppText>
              <ReanimatedText
                style={tw`android:pr-1 text-xl font-semibold text-slate-900 dark:text-gray-200`}
                text={timeLeftInSeconds}
              />
              <AppText
                numberOfLines={1}
                style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                {t('home.parking.onUnlocked.suffix')}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={tw`z-20 flex w-full flex-col items-stretch overflow-hidden`}>
            <AppText
              ellipsizeMode="clip"
              numberOfLines={2}
              style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
              {t('home.parking.label')}
            </AppText>
          </View>
        )}
      </AppSquircleView>
    </AppPressable>
  );
};

export default OpenParkingCard;
