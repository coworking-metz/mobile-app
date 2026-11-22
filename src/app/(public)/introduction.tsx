import { BlurTargetView } from 'expo-blur';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, type LayoutChangeEvent, type ViewInstance } from 'react-native';
import Animated, { interpolate, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Carousel, type CarouselRef } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import AppFader, { FaderPosition } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppRoundedButton from '@/components/AppRoundedButton';
import IntroductionAboutStep from '@/components/Introduction/IntroductionAboutStep';
import IntroductionActivityStep from '@/components/Introduction/IntroductionActivityStep';
import IntroductionEventsStep from '@/components/Introduction/IntroductionEventsStep';
import IntroductionServicesStep from '@/components/Introduction/IntroductionServicesStep';
import PaginationDot from '@/components/Introduction/PaginationDot';
import Step from '@/components/Introduction/Step';
import { useHeaderTintColor, useNavigationHeight } from '@/components/Layout/NativeHeader';
import { log } from '@/helpers/logger';
import { MIN_MINIMUM_EDGE, useAppPaddingBottom } from '@/helpers/screen';
import useSettingsStore from '@/stores/settings';

const introductionLogger = log.extend(`[introduction]`);

type IntroductionScreen = {
  key: string;
  component: (active: boolean) => ReactNode;
};

const Introduction = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const paddingBottom = useAppPaddingBottom();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [actionHeight, setActionHeight] = useState(0);

  const carouselRef = useRef<CarouselRef>(null);
  const blurTargetRef = useRef<ViewInstance | null>(null);
  const offset = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tintColor = useHeaderTintColor();
  const navigationHeight = useNavigationHeight();

  useEffect(() => {
    const unsubscribe = navigation.addListener('removed', () => {
      introductionLogger.debug('User has dismissed introduction');
      useSettingsStore.setState({ hasSeenIntroduction: true });
    });
    // `removed` fires after effect cleanup: unsubscribing synchronously would miss it
    return () => queueMicrotask(unsubscribe);
  }, [navigation]);

  const screens: IntroductionScreen[] = [
    {
      key: 'about',
      component: (active: boolean) => <IntroductionAboutStep active={active} />,
    },
    {
      key: 'activity',
      component: (active: boolean) => <IntroductionActivityStep active={active} />,
    },
    {
      key: 'services',
      component: (active: boolean) => <IntroductionServicesStep active={active} />,
    },
    {
      key: 'events',
      component: (active: boolean) => <IntroductionEventsStep active={active} />,
    },
  ];

  const onClose = useCallback(() => {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.replace('/home');
    }
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

  const invertedOffset = useDerivedValue(() => -offset.value, [offset]);

  return (
    <View
      // edge to edge for immersion: carousel and button centered on the full screen width
      style={tw`overflow-hidden bg-gray-100 dark:bg-black`}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setLayoutWidth(nativeEvent.layout.width)}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          title: '',
          headerTintColor: tintColor,
          headerBackVisible: false,
          ...(Platform.OS === 'android' && {
            headerLeft: () => (
              <AppIconButton
                blurTarget={blurTargetRef}
                icon="window-close"
                radius={25}
                style={tw`size-10`}
                onPress={onClose}
              />
            ),
          }),
        }}
      />
      {Platform.OS === 'ios' && (
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="xmark" tintColor={tintColor} onPress={onClose} />
        </Stack.Toolbar>
      )}
      {layoutWidth ? (
        <BlurTargetView ref={blurTargetRef} style={tw`relative flex h-full grow flex-col`}>
          {/* pagination stays custom, vertically aligned with the native header bar */}
          <View
            pointerEvents="none"
            style={[
              tw`absolute top-0 z-10 flex min-h-12 w-full flex-row items-center justify-end px-4`,
              {
                height: navigationHeight,
                paddingTop: insets.top,
                paddingLeft: insets.left || MIN_MINIMUM_EDGE,
                paddingRight: insets.right || MIN_MINIMUM_EDGE,
              },
            ]}>
            <AppFader
              position={FaderPosition.TOP}
              size={(insets.top || (Platform.OS === 'android' ? 16 : 0)) + 64}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
            />
            <View style={tw`flex flex-row`}>
              {screens.map((_, index) => (
                <PaginationDot
                  animationValue={invertedOffset}
                  containerWidth={layoutWidth}
                  index={index}
                  key={`pagination-dot-${index}`}
                />
              ))}
            </View>
          </View>
          <View style={tw`grow basis-0`}>
            <Carousel
              ref={carouselRef}
              data={screens.map((screen, index) => ({ ...screen, index }))}
              itemAnimation={animationStyle}
              loop={false}
              orientation="horizontal"
              renderItem={({ item, index, relativeProgress }) => (
                <Step actionHeight={actionHeight} animationValue={relativeProgress} key={index}>
                  {item.component(currentIndex === index)}
                </Step>
              )}
              scrollOffsetValue={offset}
              style={{
                width: layoutWidth,
              }}
              // to let the user scroll vertically inside the carousel
              // https://github.com/dohooo/react-native-reanimated-carousel/issues/143#issuecomment-1022276126

              onConfigurePanGesture={(gestureChain) => {
                gestureChain.activeOffsetX([-10, 10]);
              }}
              onSnapToItem={setCurrentIndex}
            />
          </View>

          <Animated.View
            // no fade-in: iOS glass created under an opacity-0 ancestor never renders
            style={[tw`absolute bottom-0 flex w-full flex-col px-6`, { paddingBottom }]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setActionHeight(nativeEvent.layout.height)
            }>
            <AppFader
              position={FaderPosition.BOTTOM}
              size={actionHeight + 32}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
            />

            <AppRoundedButton
              label={t('actions.next')}
              style={tw`mx-auto w-full max-w-sm`}
              onPress={onNext}
            />
          </Animated.View>
        </BlurTargetView>
      ) : null}
    </View>
  );
};

export default Introduction;
