import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RefreshControl, StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, {
  FadeInLeft,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppText from '@/components/AppText';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAppPaddingBottom } from '@/helpers/screen';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

const ServiceLayout = ({
  title,
  description,
  loading,
  actions = [],
  header,
  footer,
  children,
  renderContent,
  from,
  withBackButton = true,
  style,
  contentStyle,
  onRefresh,
}: {
  title?: string;
  description?: string;
  loading?: boolean;
  actions?: (MenuAction & {
    onPress?: () => void;
  })[];
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  renderContent?: (params: { verticalScrollProgress: SharedValue<number> }) => ReactNode;
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

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(20 + headerHeight + insets.top);
    }, 300);

    return () => clearTimeout(timeout);
  }, [headerHeight, insets.top]);

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
              {loading && !title ? (
                <LoadingSkeleton height={40} width={172} />
              ) : (
                <AppText
                  entering={FadeInLeft.duration(500)}
                  style={tw`text-4xl leading-[2.75rem] font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                  {title}
                </AppText>
              )}
              {description ? (
                <AppText
                  entering={FadeInLeft.duration(500).delay(150)}
                  style={tw`text-xl tracking-tight font-normal text-slate-500 dark:text-neutral-500`}>
                  {description}
                </AppText>
              ) : null}
            </>
          )}
        </Animated.View>

        <AnimatedKeyboardAwareScrollView
          contentContainerStyle={[
            tw`relative flex flex-col min-h-full`,
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
                progressViewOffset={progressViewOffset}
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
            {loading && <LoadingProgressBar style={tw`absolute top-0 inset-x-0`} />}
            {renderContent ? renderContent({ verticalScrollProgress }) : children}
          </View>
        </AnimatedKeyboardAwareScrollView>
      </View>

      <Animated.View
        style={[
          tw`absolute top-0 left-0 right-0 z-10 flex flex-row pb-2 items-center min-h-18`,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <AppTopFader style={tw`absolute inset-x-0 top-0`} />

        <View style={tw`flex flex-row shrink-0 min-w-10 overflow-visible basis-0 grow ml-4`}>
          {withBackButton && (
            <AppIconButton
              icon="arrow-left"
              style={tw`h-10 w-10`}
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

        <View style={tw`flex flex-row justify-end shrink basis-0 grow mr-4 min-w-10`}>
          {actions?.length ? (
            <MenuView
              actions={actions}
              shouldOpenOnLongPress={false}
              onPressAction={({ nativeEvent: { event: actionId } }) => {
                const action = actions.find(({ id }) => id === actionId);
                action?.onPress?.();
              }}>
              <AppIconButton icon="dots-vertical" style={tw`h-10 w-10`} />
            </MenuView>
          ) : null}
        </View>
      </Animated.View>

      {footer}
    </View>
  );
};

export default ServiceLayout;
