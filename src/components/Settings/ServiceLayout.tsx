import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { type LayoutChangeEvent } from 'react-native/types';
import Animated, {
  FadeInLeft,
  type StyleProps,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import { theme } from '@/helpers/colors';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView =
  Animated.createAnimatedComponent<KeyboardAwareScrollView>(KeyboardAwareScrollView);

const ServiceLayout = ({
  title,
  description,
  renderHeader,
  children,
  style,
}: {
  title: string;
  description?: string;
  renderHeader?: () => ReactNode;
  children: ReactNode;
  style?: StyleProps;
}) => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const verticalScrollProgress = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const headlineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(verticalScrollProgress.value, [-1, 0, headerHeight], [1, 1, 0]);
    const scale = interpolate(verticalScrollProgress.value, [-1, 0, headerHeight], [1, 1, 0.9]);

    return {
      opacity,
      transform: [{ scale }],
    };
  }, [verticalScrollProgress, headerHeight]);

  const navigationBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [-1, 0, headerHeight - 16, headerHeight],
      [0, 0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, headerHeight]);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [0, headerHeight, headerHeight + 32],
      [0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, headerHeight]);

  return (
    <View style={[{ flex: 1 }, tw`dark:bg-black`]}>
      <View style={tw`flex flex-col grow relative`}>
        <Animated.View
          style={[
            tw`absolute flex flex-col px-6 pb-6`,
            {
              top: NAVIGATION_HEIGHT + insets.top,
              left: insets.left,
              right: insets.right,
            },
            headlineStyle,
          ]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setHeaderHeight(nativeEvent.layout.height)
          }>
          {renderHeader ? (
            renderHeader()
          ) : (
            <>
              <Animated.Text
                entering={FadeInLeft.duration(500)}
                numberOfLines={1}
                style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {title}
              </Animated.Text>
              {description ? (
                <Animated.Text
                  entering={FadeInLeft.duration(500).delay(150)}
                  numberOfLines={1}
                  style={tw`text-xl text-slate-500 dark:text-slate-400`}>
                  {description}
                </Animated.Text>
              ) : null}
            </>
          )}
        </Animated.View>

        <AnimatedKeyboardAwareScrollView
          contentContainerStyle={[
            tw`flex flex-col min-h-full`,
            { paddingTop: NAVIGATION_HEIGHT + headerHeight + insets.top },
          ]}
          horizontal={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          onScroll={onVerticalScroll}>
          <View
            style={[
              tw`flex flex-col w-full grow bg-gray-50 dark:bg-zinc-900`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
              style,
            ]}>
            {children}
          </View>
        </AnimatedKeyboardAwareScrollView>
      </View>

      <Animated.View
        style={[
          tw`absolute top-0 left-0 right-0 z-10 flex flex-row pb-2 items-center`,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
            navigationBackgroundStyle,
          ]}>
          <BlurView
            intensity={64}
            style={tw`h-full w-full`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
          />
        </Animated.View>
        <View style={tw`flex flex-row shrink basis-0 grow ml-4`}>
          <MaterialCommunityIcons.Button
            backgroundColor="transparent"
            borderRadius={24}
            color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
            iconStyle={{ marginRight: 0 }}
            name="arrow-left"
            size={32}
            style={tw`p-1`}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </View>
        <Animated.Text
          style={[
            tw`shrink-0 text-base text-slate-900 dark:text-gray-200 font-medium`,
            titleStyle,
          ]}>
          {title}
        </Animated.Text>
        <View style={tw`shrink basis-0 grow mr-4`} />
      </Animated.View>
    </View>
  );
};

export default ServiceLayout;
