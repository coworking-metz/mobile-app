import AppBlurView from '../AppBlurView';
import AppText from '../AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, type ReactNode, useCallback } from 'react';
import { RefreshControl, StyleProp, View, ViewStyle } from 'react-native';
import { type LayoutChangeEvent } from 'react-native/types';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import Animated, {
  FadeInLeft,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { theme } from '@/helpers/colors';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView =
  Animated.createAnimatedComponent<KeyboardAwareScrollViewProps>(KeyboardAwareScrollView);

const ServiceLayout = ({
  title,
  description,
  renderHeader,
  children,
  style,
  contentStyle,
  onRefresh,
}: {
  title: string;
  description?: string;
  renderHeader?: () => ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => Promise<unknown>;
}) => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const verticalScrollProgress = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

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

  const onShouldRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh?.().finally(() => {
      setRefreshing(false);
    });
  }, [onRefresh]);

  return (
    <View style={[{ flex: 1 }, tw`bg-gray-100 dark:bg-black`, style]}>
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
              <AppText
                entering={FadeInLeft.duration(500)}
                style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {title}
              </AppText>
              {description ? (
                <AppText
                  entering={FadeInLeft.duration(500).delay(150)}
                  style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
                  {description}
                </AppText>
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
          onScroll={onVerticalScroll}
          {...(onRefresh && {
            refreshControl: (
              <RefreshControl
                progressViewOffset={NAVIGATION_HEIGHT + headerHeight + insets.top}
                refreshing={refreshing}
                onRefresh={onShouldRefresh}
              />
            ),
          })}>
          <View
            style={[
              tw`flex flex-col w-full grow bg-gray-50 dark:bg-zinc-900`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
              contentStyle,
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
          <AppBlurView
            intensity={64}
            style={tw`h-full w-full`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
          />
        </Animated.View>
        <View style={tw`flex flex-row shrink-0 min-w-10 overflow-visible basis-0 grow ml-4`}>
          <MaterialCommunityIcons.Button
            backgroundColor="transparent"
            borderRadius={24}
            color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
            iconStyle={{ marginRight: 0 }}
            name="arrow-left"
            size={32}
            style={tw`p-1`}
            underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </View>
        <View style={tw`flex flex-row justify-center shrink grow`}>
          <AppText
            numberOfLines={1}
            style={[tw`text-lg text-slate-900 dark:text-gray-200 font-medium`, titleStyle]}>
            {title}
          </AppText>
        </View>
        <View style={tw`shrink basis-0 grow mr-4 min-w-10`} />
      </Animated.View>
    </View>
  );
};

export default ServiceLayout;
