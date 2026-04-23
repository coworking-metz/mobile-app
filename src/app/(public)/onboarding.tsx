import dayjs from 'dayjs';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeInDown, interpolate, useSharedValue } from 'react-native-reanimated';
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppFader from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import OnboardingEnrollStep from '@/components/Onboarding/OnboardingEnrollStep';
import OnboardingTourStep from '@/components/Onboarding/OnboardingTourStep';
import OnboardingTrialStep from '@/components/Onboarding/OnboardingTrialStep';
import Step from '@/components/Onboarding/Step';
import { log } from '@/helpers/logger';
import { useAppPaddingBottom } from '@/helpers/screen';
import useSettingsStore from '@/stores/settings';

const onboardingLogger = log.extend(`[onboarding]`);

type OnboardingScreen = {
  key: string;
  component: (active: boolean) => ReactNode;
};

const Onboarding = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const paddingBottom = useAppPaddingBottom();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [actionHeight, setActionHeight] = useState(0);

  const carouselRef = useRef<ICarouselInstance>(null);
  const offset = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      onboardingLogger.debug('User has dismissed onboarding');
      useSettingsStore.setState({ hasReadOnboardingInstructionsAt: dayjs().toISOString() });
    });
    return unsubscribe;
  }, []);

  const screens: OnboardingScreen[] = [
    {
      key: 'tour',
      component: (active: boolean) => <OnboardingTourStep active={active} />,
    },
    {
      key: 'trial',
      component: (active: boolean) => <OnboardingTrialStep active={active} />,
    },
    {
      key: 'enroll',
      component: (active: boolean) => <OnboardingEnrollStep active={active} />,
    },
  ];

  const onClose = useCallback(() => {
    router.canDismiss() ? router.dismiss() : router.replace('/home');
  }, [router]);

  const onNext = useCallback(() => {
    if (carouselRef.current) {
      if (carouselRef.current.getCurrentIndex() !== screens.length - 1) {
        carouselRef.current.next();
      } else {
        onClose();
      }
    }
  }, [carouselRef, onClose]);

  const animationStyle = useCallback(
    (value: number) => {
      'worklet';
      const translateX = interpolate(value, [-1, 0, 1], [-layoutWidth, 0, 0]);

      const zIndex = Math.round(interpolate(value, [-1, 0, 1], [300, 0, -300]));
      const opacity = interpolate(value, [-1, 0, 1], [0, 1, 0]);

      const scale = interpolate(value, [-1, 0, 1], [1, 1, 0.8]);

      return {
        transform: [{ translateX }, { scale }],
        opacity,
        zIndex,
      };
    },
    [layoutWidth],
  );

  return (
    <View
      style={[
        tw`overflow-hidden bg-gray-100 dark:bg-black`,
        {
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setLayoutWidth(nativeEvent.layout.width)}>
      {layoutWidth ? (
        <View style={tw`relative h-full flex grow flex-col`}>
          <View
            style={[
              tw`absolute top-0 z-10 flex flex-row items-center w-full justify-between px-4`,
              {
                paddingTop: insets.top,
                left: insets.left,
                right: insets.right,
              },
            ]}>
            <AppFader
              position={Fader.position.TOP}
              size={(insets.top || (Platform.OS === 'android' ? 16 : 0)) + 64}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
            />
            <AppIconButton icon="window-close" onPress={onClose} />
          </View>
          <View style={tw`grow basis-0`}>
            <Carousel
              ref={carouselRef}
              customAnimation={animationStyle}
              data={screens.map((screen, index) => ({ ...screen, index }))}
              loop={false}
              renderItem={({ item, index, animationValue }) => (
                <Step actionHeight={actionHeight} animationValue={animationValue} key={index}>
                  {item.component(currentIndex === index)}
                </Step>
              )}
              style={{
                width: layoutWidth,
              }}
              vertical={false}
              // to let the user scroll vertically inside the carousel
              // https://github.com/dohooo/react-native-reanimated-carousel/issues/143#issuecomment-1022276126
              width={layoutWidth}
              onConfigurePanGesture={(gestureChain) => {
                gestureChain.activeOffsetX([-10, 10]);
              }}
              onProgressChange={(progress) => {
                offset.set(-progress);
              }}
              onSnapToItem={setCurrentIndex}
            />
          </View>

          {/* <Animated.View
            entering={FadeInDown.duration(500).delay(1000)}
            style={[tw`flex flex-col absolute bottom-0 px-6 w-full`, { paddingBottom }]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setActionHeight(nativeEvent.layout.height)
            }>
            <AppFader
              position={Fader.position.BOTTOM}
              size={actionHeight + 32}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
            />

            <AppRoundedButton style={tw`mx-auto w-full max-w-md`} onPress={onNext}>
              <AppText style={tw`text-base font-medium text-black`}>{t('actions.next')}</AppText>
            </AppRoundedButton>
          </Animated.View> */}
        </View>
      ) : null}
    </View>
  );
};

export default Onboarding;
