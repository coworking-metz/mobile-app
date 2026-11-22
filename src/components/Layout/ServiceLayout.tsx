import { MenuAction, MenuView } from '@react-native-menu/menu';
import { BlurTargetView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Platform,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
  type LayoutChangeEvent,
  type ViewInstance,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller';
import Animated, {
  FadeInLeft,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppText from '@/components/AppText';
import NativeHeader, {
  StandaloneHeaderContext,
  ScrollEdge,
  useHeaderTintColor,
  useTopBarHeight,
} from '@/components/Layout/NativeHeader';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppScreen, { useAppPaddingBottom } from '@/helpers/screen';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

// wide master column touches the left edge, any other pane only the right one
// base: the element's own padding on that side, which the inset would otherwise override
export const useContentInsets = (from?: string | null, base = 0) => {
  const insets = useSafeAreaInsets();
  const { isWide } = useAppScreen();
  return isWide && !!from
    ? { paddingLeft: insets.left || base }
    : { paddingRight: insets.right || base };
};

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
  actions?: (MenuAction & {
    onPress?: () => void;
  })[];
  menu?: ReactNode;
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
  const tintColor = useHeaderTintColor();
  const { isWide } = useAppScreen();
  // iOS native header, except in the wide master column (outside the Stack)
  const isMasterColumn = isWide && !!from;
  const hasStandaloneHeader = useContext(StandaloneHeaderContext);
  const withNativeHeader =
    Platform.OS === 'ios' && !menu && (!isMasterColumn || hasStandaloneHeader);
  // the side pane's own native stack already shows a native back
  const withRNBack = withBackButton && !withNativeHeader;
  const topBarHeight = useTopBarHeight(withNativeHeader);
  const paddingBottom = useAppPaddingBottom();
  const router = useRouter();
  const onBack = () =>
    from ? router.dismissTo(from) : router.canGoBack() ? router.back() : router.replace('/');
  const blurTargetRef = useRef<ViewInstance | null>(null);
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

  const onVerticalScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset, contentSize, layoutMeasurement }) => {
        verticalScrollProgress.value = contentOffset.y;
        if (onScroll) {
          scheduleOnRN(onScroll, {
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
              top: topBarHeight,
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
              { paddingTop: topBarHeight + headerHeight },
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
                // edge to edge: consumers pad their own content with the insets
                tw`relative flex w-full grow flex-col bg-gray-50 dark:bg-zinc-900`,
                { paddingBottom },
                contentStyle,
              ]}>
              {loading && <LoadingProgressBar style={tw`absolute inset-x-0 top-0 z-10`} />}
              {renderContent ? renderContent({ verticalScrollProgress }) : children}
            </View>
          </AnimatedKeyboardAwareScrollView>
        </ScrollEdge>
      </BlurTargetView>

      {withNativeHeader && (
        <>
          {!withRNBack && <AppTopFader style={tw`absolute inset-x-0 top-0`} />}
          {!hasStandaloneHeader && (
            <NativeHeader
              right={
                actions?.length
                  ? [
                      <Stack.Toolbar.Menu icon="ellipsis" key="actions" tintColor={tintColor}>
                        {actions.map((action) => (
                          <Stack.Toolbar.MenuAction
                            destructive={action.attributes?.destructive}
                            disabled={action.attributes?.disabled}
                            key={action.id}
                            onPress={action.onPress}>
                            {action.title}
                          </Stack.Toolbar.MenuAction>
                        ))}
                      </Stack.Toolbar.Menu>,
                    ]
                  : []
              }
              title={title}
              withBackButton={withBackButton}
              onBack={onBack}
            />
          )}
        </>
      )}
      {(!withNativeHeader || withRNBack) && (
        <Animated.View
          style={[
            tw`absolute inset-x-0 top-0 z-10 flex min-h-[4.5rem] flex-row items-center pb-2`,
            {
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          <AppTopFader style={tw`absolute inset-x-0 top-0`} />

          <View style={tw`ml-4 flex min-w-10 shrink-0 grow basis-0 flex-row overflow-visible`}>
            {withRNBack && (
              <AppIconButton
                blurTarget={blurTargetRef}
                icon="arrow-left"
                radius={25}
                style={tw`size-10`}
                onPress={onBack}
              />
            )}
          </View>

          {!withNativeHeader && (menu || actions?.length) ? (
            <View style={tw`mr-4 flex min-w-10 shrink grow basis-0 flex-row justify-end`}>
              {menu ?? (
                <MenuView
                  actions={actions}
                  shouldOpenOnLongPress={false}
                  onPressAction={({ nativeEvent: { event: actionId } }) => {
                    const action = actions.find(({ id }) => id === actionId);
                    action?.onPress?.();
                  }}>
                  <AppIconButton
                    blurTarget={blurTargetRef}
                    icon="dots-vertical"
                    radius={25}
                    style={tw`size-10`}
                  />
                </MenuView>
              )}
            </View>
          ) : null}
        </Animated.View>
      )}

      {footer}
    </View>
  );
};

export default ServiceLayout;
