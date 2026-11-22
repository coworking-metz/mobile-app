import { BlurTargetView } from 'expo-blur';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { RefreshControl, StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller';
import Animated, {
  FadeInLeft,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppText from '@/components/AppText';
import NativeHeader, {
  ScrollEdge,
  NAVIGATION_HEIGHT,
  useNavigationHeight,
  type HeaderAction,
} from '@/components/Layout/NativeHeader';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAppPaddingBottom } from '@/helpers/screen';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

const ServiceLayout = ({
  title,
  description,
  loading,
  actions = [],
  menu,
  header,
  footer,
  children,
  renderContent,
  from,
  withBackButton = true,
  style,
  contentStyle,
  onRefresh,
  onScroll,
  scrollViewRef,
}: {
  title?: string;
  description?: string;
  loading?: boolean;
  actions?: HeaderAction[];
  menu?: ReactElement;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  renderContent?: (params: { verticalScrollProgress: SharedValue<number> }) => ReactNode;
  from?: string;
  withBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => Promise<unknown>;
  onScroll?: (metrics: {
    contentOffsetY: number;
    contentHeight: number;
    layoutHeight: number;
  }) => void;
  scrollViewRef?: Ref<KeyboardAwareScrollViewRef>;
}) => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const paddingBottom = useAppPaddingBottom();
  const blurTargetRef = useRef<View | null>(null);
  const verticalScrollProgress = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  // `from` means we're rendered in the wide master column: no header, back lives in the detail pane
  const withNativeHeader = !from;
  const navigationHeight = useNavigationHeight();

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(20 + headerHeight + navigationHeight - NAVIGATION_HEIGHT);
    }, 300);

    return () => clearTimeout(timeout);
  }, [headerHeight, navigationHeight]);

  const onVerticalScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset, contentSize, layoutMeasurement }) => {
        verticalScrollProgress.value = contentOffset.y;
        if (onScroll) {
          runOnJS(onScroll)({
            contentOffsetY: contentOffset.y,
            contentHeight: contentSize.height,
            layoutHeight: layoutMeasurement.height,
          });
        }
      },
    },
    [onScroll],
  );

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
      <BlurTargetView ref={blurTargetRef} style={tw`relative flex grow flex-col`}>
        <Animated.View
          style={[
            tw`absolute flex flex-col px-6 pb-6`,
            {
              top: navigationHeight,
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
                  style={tw`text-4xl font-bold leading-[2.75rem] tracking-tight text-slate-900 dark:text-gray-200`}>
                  {title}
                </AppText>
              )}
              {description ? (
                <AppText
                  entering={FadeInLeft.duration(500).delay(150)}
                  style={tw`text-xl font-normal tracking-tight text-slate-500 dark:text-neutral-500`}>
                  {description}
                </AppText>
              ) : null}
            </>
          )}
        </Animated.View>

        <ScrollEdge>
          <AnimatedKeyboardAwareScrollView
            // layout mode renders the ScrollView directly, as ScrollEdge's marker requires
            ref={scrollViewRef}
            contentContainerStyle={[
              tw`relative flex min-h-full flex-col`,
              { paddingTop: navigationHeight + headerHeight },
            ]}
            horizontal={false}
            keyboardShouldPersistTaps="handled"
            mode="layout"
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
                tw`relative flex w-full grow flex-col bg-gray-50 dark:bg-zinc-900`,
                {
                  paddingLeft: insets.left,
                  paddingRight: insets.right,
                  paddingBottom,
                },
                contentStyle,
              ]}>
              {loading && <LoadingProgressBar style={tw`absolute inset-x-0 top-0 z-10`} />}
              {renderContent ? renderContent({ verticalScrollProgress }) : children}
            </View>
          </AnimatedKeyboardAwareScrollView>
        </ScrollEdge>
      </BlurTargetView>

      {withNativeHeader && (
        <NativeHeader actions={actions} menu={menu} title={title} withBackButton={withBackButton} />
      )}
      <AppTopFader style={tw`absolute inset-x-0 top-0`} />

      {footer}
    </View>
  );
};

export default ServiceLayout;
