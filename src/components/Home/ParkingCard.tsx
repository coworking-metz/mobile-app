import BarrierAnimation from '../Animations/BarrierAnimation';
import HorizontalLoadingAnimation from '../Animations/HorizontalLoadingAnimation';
import ReanimatedText from '../ReanimatedText';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { isNil } from 'lodash';
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ForwardRefRenderFunction,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
  type StyleProps,
} from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import { theme } from '@/helpers/colors';
import { parseErrorText } from '@/helpers/error';
import { openParkingGate } from '@/services/api/intercom';
import useNoticeStore from '@/stores/notice';
import useToastStore from '@/stores/toast';

const FILL_BACKGROUND_ANIMATION_DURATION_IN_MS = 300;
const WARN_ON_SUCCESSIVE_TAPS_COUNT = 3;
const WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS = 20_000;
const WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS = 60_000; // wait for 60 seconds before warning again

const ParkingCard: ForwardRefRenderFunction<
  TouchableOpacity,
  {
    children?: ReactNode;
    disabled?: boolean;
    style?: StyleProps;
  }
> = ({ children, disabled = false, style }, ref) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const animation = useRef<LottieView>(null);
  const opening = useSharedValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isUnlocked, setUnlocked] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tapHistory, setTapHistory] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  const onOpen = () => {
    if (isLoading) return;
    if (
      !lastWarning ||
      Date.now() - Date.parse(lastWarning) > WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS
    ) {
      setTapHistory([...tapHistory, new Date().toISOString()]);
    }
    setLoading(true);
    openParkingGate()
      .then(({ open, triggered }) => {
        const timeleftInMs = Date.parse(open) - Date.now();
        const timeleftBeforeLockInMs =
          (timeleftInMs > 0 ? timeleftInMs : 2 * FILL_BACKGROUND_ANIMATION_DURATION_IN_MS) -
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
          message: t('home.intercom.onFail.message'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // TODO: enable the following code once Help section is ready
  /*
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
        const toast = toastStore.add({
          message: t('home.parking.onSuccessiveTaps.message'),
          type: ToastPresets.GENERAL,
          action: {
            label: t('home.parking.onSuccessiveTaps.action'),
            onPress: () => {
              router.push('/help/gate');
              toastStore.dismiss(toast.id);
            },
          },
        });
        setLastWarning(new Date().toISOString());
      }
    }
  }, [tapHistory]);
  */

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
    return `${Math.ceil((opening.value * timeLeft) / 1000).toFixed(0)}`;
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
    <TouchableOpacity
      ref={ref}
      disabled={disabled}
      style={[
        tw`flex flex-row items-center gap-3 px-3 rounded-2xl min-h-18 overflow-hidden relative bg-gray-200 dark:bg-gray-900`,
        style,
      ]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setCardWidth(nativeEvent.layout.width)}
      onPress={onOpen}>
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
        <View style={[tw`relative h-8 w-8 shrink-0`]}>
          {isLoading && (
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            />
          )}
          <BarrierAnimation
            ref={animation}
            autoPlay={false}
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            loop={false}
            style={isLoading && { opacity: 0 }}
          />
        </View>
      </Animated.View>
      <Animated.View style={tw`flex flex-col z-20`}>
        <Text
          style={[
            tw`text-xl font-medium text-slate-900 dark:text-gray-200`,
            disabled && tw`opacity-30`,
          ]}>
          {isUnlocked ? t('home.parking.onUnlocked.label') : t('home.parking.label')}
        </Text>
        <View style={[tw`flex flex-row items-center`]}>
          {isLoading ? (
            <Text
              style={[
                tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400`,
                disabled && tw`opacity-30`,
              ]}>
              {t('home.parking.loading')}
            </Text>
          ) : isUnlocked ? (
            <>
              <Text
                style={[
                  tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400`,
                  disabled && tw`opacity-30`,
                ]}>
                {t('home.parking.onUnlocked.description')}
              </Text>
              <ReanimatedText
                style={[tw`font-semibold text-slate-900 dark:text-gray-200`]}
                text={timeLeftInSeconds}
              />
            </>
          ) : (
            <Text
              style={[
                tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400`,
                disabled && tw`opacity-30`,
              ]}>
              {t('home.parking.description')}
            </Text>
          )}
        </View>
      </Animated.View>

      <>{children}</>
    </TouchableOpacity>
  );
};

export default forwardRef(ParkingCard);
