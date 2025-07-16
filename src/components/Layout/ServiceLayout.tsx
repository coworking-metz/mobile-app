import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useRouter } from 'expo-router';
import React, { useCallback, useState, type ReactNode } from 'react';
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
import AppBlurView from '@/components/AppBlurView';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { theme } from '@/helpers/colors';
import { useAppPaddingBottom } from '@/helpers/screen';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView =
  Animated.createAnimatedComponent<KeyboardAwareScrollViewProps>(KeyboardAwareScrollView);

const ServiceLayout = ({
  title,
  description,
  loading,
  actions = [],
  header,
  footer,
  children,
  from,
  withBackButton = true,
  style,
  contentStyle,
  onRefresh,
}: {
  title: string;
  description?: string;
  loading?: boolean;
  actions?: (MenuAction & {
    onPress?: () => void;
  })[];
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  from?: string;
  withBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => Promise<unknown>;
}) => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const paddingBottom = useAppPaddingBottom();
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
    <View style={[tw`flex-1 bg-gray-100 dark:bg-black`, style]}>
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
          {header ?? (
            <>
              {loading ? (
                <LoadingSkeleton height={40} width={172} />
              ) : (
                <AppText
                  entering={FadeInLeft.duration(500)}
                  numberOfLines={2}
                  style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                  {title}
                </AppText>
              )}
              {description ? (
                <AppText
                  entering={FadeInLeft.duration(500).delay(150)}
                  style={tw`text-xl tracking-tight font-normal text-slate-500 dark:text-slate-400`}>
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
              tw`flex flex-col w-full grow bg-gray-50 dark:bg-zinc-900 relative`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingBottom,
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
          {withBackButton && (
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() =>
                from
                  ? router.dismissTo(from)
                  : router.canGoBack()
                    ? router.back()
                    : router.replace('/')
              }
            />
          )}
        </View>
        <Animated.View style={[tw`flex flex-row justify-center shrink grow`, titleStyle]}>
          {loading ? (
            <LoadingSkeleton height={28} width={128} />
          ) : (
            <AppText
              numberOfLines={1}
              style={tw`text-lg tracking-tight text-slate-900 dark:text-gray-200 font-medium`}>
              {title}
            </AppText>
          )}
        </Animated.View>
        <View style={tw`flex flex-row justify-end shrink basis-0 grow mr-4 min-w-10`}>
          {actions?.length ? (
            <MenuView
              actions={actions}
              shouldOpenOnLongPress={false}
              onPressAction={({ nativeEvent: { event: actionId } }) => {
                const action = actions.find(({ id }) => id === actionId);
                action?.onPress?.();
              }}>
              <MaterialCommunityIcons.Button
                backgroundColor="transparent"
                borderRadius={24}
                color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
                iconStyle={{ marginRight: 0 }}
                name="dots-vertical"
                size={28}
                style={tw`p-1`}
                underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              />
            </MenuView>
          ) : null}
        </View>
      </Animated.View>

      {footer}
    </View>
  );
};

export default ServiceLayout;
