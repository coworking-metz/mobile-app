import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeInDown, interpolate, useSharedValue } from 'react-native-reanimated';
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import PaginationDot from '@/components/Onboarding/PaginationDot';
import Step from '@/components/Onboarding/Step';
import AboutStep from '@/components/Onboarding/Steps/AboutStep';
import ActivityStep from '@/components/Onboarding/Steps/ActivityStep';
import EventsStep from '@/components/Onboarding/Steps/EventsStep';
import ServicesStep from '@/components/Onboarding/Steps/ServicesStep';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';
import { theme } from '@/helpers/colors';
import { log } from '@/helpers/logger';
import useSettingsStore from '@/stores/settings';

const onboardingLogger = log.extend(`[onboarding]`);
const MIN_PADDING_BOTTOM = 24;

type OnboardingScreen = {
  key: string;
  component: (active: boolean) => ReactNode;
};

const Onboarding = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [layoutWidth, setLayoutWidth] = useState(0);

  const carouselRef = useRef<ICarouselInstance>(null);
  const offset = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPickingLanguage, setPickingLanguage] = useState(false);
  const [isPickingTheme, setPickingTheme] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      onboardingLogger.debug('User has dismiss onboarding');
      useSettingsStore.setState({ hasOnboard: true });
    });
    return unsubscribe;
  }, []);

  const screens: OnboardingScreen[] = [
    {
      key: 'about',
      component: (active: boolean) => (
        <AboutStep active={active} onPickingLanguage={() => setPickingLanguage(true)} />
      ),
    },
    {
      key: 'activity',
      component: (active: boolean) => <ActivityStep active={active} />,
    },
    {
      key: 'services',
      component: (active: boolean) => (
        <ServicesStep active={active} onPickingTheme={() => setPickingTheme(true)} />
      ),
    },
    {
      key: 'events',
      component: (active: boolean) => <EventsStep active={active} />,
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

      const zIndex = interpolate(value, [-1, 0, 1], [300, 0, -300]);
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
    <>
      <View
        pointerEvents={isPickingLanguage ? 'none' : 'auto'}
        style={[
          tw`overflow-hidden bg-gray-100 dark:bg-black`,
          {
            paddingLeft: insets.left,
            paddingBottom: Math.max(insets.bottom, MIN_PADDING_BOTTOM),
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
              <View pointerEvents={'none'} style={tw`flex flex-row ml-2`}>
                {screens.map((_, index) => (
                  <PaginationDot
                    animationValue={offset}
                    containerWidth={layoutWidth}
                    index={index}
                    key={`pagination-dot-${index}`}
                  />
                ))}
              </View>
              <MaterialCommunityIcons.Button
                backgroundColor="transparent"
                borderRadius={24}
                color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
                iconStyle={{ height: 32, width: 32, marginRight: 0 }}
                name="close"
                size={32}
                style={tw`p-1`}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
                onPress={onClose}
              />
            </View>
            <View style={tw`grow basis-0`}>
              <Carousel
                ref={carouselRef}
                customAnimation={animationStyle}
                data={screens.map((screen, index) => ({ ...screen, index }))}
                loop={false}
                renderItem={({ item, index, animationValue }) => (
                  <Step animationValue={animationValue} index={index} key={index}>
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
            <Animated.View
              entering={FadeInDown.duration(500).delay(1000)}
              style={tw`shrink-0 pt-1 px-6`}>
              <AppRoundedButton style={tw`min-h-14`} onPress={onNext}>
                <AppText style={tw`text-base font-medium text-black`}>{t('actions.next')}</AppText>
              </AppRoundedButton>
            </Animated.View>
          </View>
        ) : null}
      </View>

      <Animated.View style={[tw`absolute top-0 left-0 right-0`]}>
        <Fader
          position={Fader.position.TOP}
          size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </Animated.View>

      {isPickingLanguage && <LanguageBottomSheet onClose={() => setPickingLanguage(false)} />}
      {isPickingTheme && <ThemeBottomSheet onClose={() => setPickingTheme(false)} />}
    </>
  );
};

export default Onboarding;
