import { useQuery } from '@tanstack/react-query';
import { BlurTargetView } from 'expo-blur';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { includes } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type ViewInstance,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import NativeHeader, {
  ScrollEdge,
  useHeaderTintColor,
  useTopBarHeight,
} from '@/components/Layout/NativeHeader';
import { useContentInsets } from '@/components/Layout/ServiceLayout';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import useAppScreen from '@/helpers/screen';
import { getOnPremiseState } from '@/services/api/services';
import { IS_DEV } from '@/services/environment';
import { onPremiseQueryKeys } from '@/services/query';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];
// max-w-lg: wide shows both plans side by side, each up to half the screen
const PLAN_MAX_WIDTH = 512;

const OnPremise = () => {
  useDeviceContext(tw);
  const { isWide } = useAppScreen();
  const [areInformationsVisible, setInformationsVisible] = useState(false);
  const [areLightsVisible, setLightsVisible] = useState(false);

  const { refetch: refetchOnPremiseState } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });

  const [isRefreshingPoulaillerPlan, setRefreshingPoulaillerPlan] = useState(false);
  const onRefreshPoulaillerPlan = useCallback(() => {
    setRefreshingPoulaillerPlan(true);
    refetchOnPremiseState().finally(() => setRefreshingPoulaillerPlan(false));
  }, [refetchOnPremiseState]);
  const [isRefreshingPtiPoulaillerPlan, setRefreshingPtiPoulaillerPlan] = useState(false);
  const onRefreshPtiPoulaillerPlan = useCallback(() => {
    setRefreshingPtiPoulaillerPlan(true);
    refetchOnPremiseState().finally(() => setRefreshingPtiPoulaillerPlan(false));
  }, [refetchOnPremiseState]);

  const insets = useSafeAreaInsets();
  const contentInsets = useContentInsets(null, 16);
  const router = useRouter();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const planWidth = isWide ? Math.min(layoutWidth / 2, PLAN_MAX_WIDTH) : layoutWidth;
  const [headerHeight, setHeaderHeight] = useState(0);
  // iOS: native header (back, dots, buttons); Android: our RN header row
  const withNativeHeader = Platform.OS === 'ios';
  const nativeHeaderHeight = useTopBarHeight(true);
  const contentTop = withNativeHeader ? nativeHeaderHeight : headerHeight;
  const blurTargetRef = useRef<ViewInstance | null>(null);

  const tintColor = useHeaderTintColor();
  const toggleLights = () => {
    setLightsVisible(!areLightsVisible);
    setInformationsVisible(false);
  };
  const toggleInformations = () => {
    setLightsVisible(false);
    setInformationsVisible(!areInformationsVisible);
  };

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(contentTop - 16);
    }, 300);

    return () => clearTimeout(timeout);
  }, [contentTop]);

  const offset = useSharedValue(0);
  const horizontalScrollView = useRef<Animated.ScrollView>(null);

  const onHorizontalScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset }) => {
        offset.value = contentOffset.x / layoutWidth;
      },
    },
    [layoutWidth],
  );

  const { location, withInformations, withLights } = useLocalSearchParams<{
    location: string;
    withInformations: string;
    withLights: string;
  }>();

  useEffect(() => {
    if (includes(SUPPORTED_LOCATIONS, location) && layoutWidth && horizontalScrollView.current) {
      const index = SUPPORTED_LOCATIONS.indexOf(location);
      horizontalScrollView.current?.scrollTo({ x: index * layoutWidth });
    }
  }, [location, layoutWidth, horizontalScrollView]);

  useEffect(() => {
    if (withInformations === 'true') {
      setInformationsVisible(true);
      setLightsVisible(false);
    } else if (withLights === 'true') {
      setLightsVisible(true);
      setInformationsVisible(false);
    } else {
      setLightsVisible(false);
      setInformationsVisible(false);
    }
  }, [withInformations, withLights]);

  return (
    <View
      style={tw`flex-1 overflow-hidden bg-gray-100 dark:bg-black`}
      onLayout={({ nativeEvent }) => setLayoutWidth(nativeEvent.layout.width)}>
      {layoutWidth ? (
        <BlurTargetView ref={blurTargetRef} style={tw`relative flex h-full grow`}>
          <ScrollEdge>
            <Animated.ScrollView
              ref={horizontalScrollView}
              horizontal
              contentContainerStyle={tw`flex grow flex-row items-stretch justify-center`}
              pagingEnabled={!isWide}
              scrollEnabled={!isWide}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={tw`flex-1`}
              onScroll={onHorizontalScroll}>
              <ScrollEdge style={[tw`h-full`, { width: planWidth }]}>
                <ScrollView
                  contentContainerStyle={[
                    tw`w-full`,
                    {
                      paddingTop: contentTop,
                      paddingBottom: insets.bottom,
                    },
                  ]}
                  horizontal={false}
                  refreshControl={
                    <RefreshControl
                      progressViewOffset={progressViewOffset}
                      refreshing={isRefreshingPoulaillerPlan}
                      onRefresh={onRefreshPoulaillerPlan}
                    />
                  }
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}>
                  <PoulaillerPlan
                    withInformations={areInformationsVisible}
                    withLights={areLightsVisible}
                  />
                </ScrollView>
              </ScrollEdge>
              <ScrollEdge style={[tw`h-full`, { width: planWidth }]}>
                <ScrollView
                  contentContainerStyle={[
                    {
                      paddingTop: contentTop,
                      paddingBottom: insets.bottom,
                    },
                  ]}
                  horizontal={false}
                  refreshControl={
                    <RefreshControl
                      progressViewOffset={progressViewOffset}
                      refreshing={isRefreshingPtiPoulaillerPlan}
                      onRefresh={onRefreshPtiPoulaillerPlan}
                    />
                  }
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}>
                  <PtiPoulaillerPlan
                    withInformations={areInformationsVisible}
                    withLights={areLightsVisible}
                  />
                </ScrollView>
              </ScrollEdge>
            </Animated.ScrollView>
          </ScrollEdge>
        </BlurTargetView>
      ) : null}

      {withNativeHeader ? (
        <NativeHeader
          right={[
            IS_DEV && (
              <Stack.Toolbar.Button
                icon={areLightsVisible ? 'lightbulb.2.fill' : 'lightbulb.2'}
                key="lights"
                tintColor={tintColor}
                variant={areLightsVisible ? 'prominent' : 'plain'}
                onPress={toggleLights}
              />
            ),
            <Stack.Toolbar.Button
              icon="ellipsis"
              key="informations"
              tintColor={tintColor}
              variant={areInformationsVisible ? 'prominent' : 'plain'}
              onPress={toggleInformations}
            />,
          ]}
        />
      ) : (
        <Animated.View
          style={[
            tw`absolute top-0 z-10 flex w-full flex-row items-center px-4 pb-2`,
            { paddingTop: insets.top },
            contentInsets,
          ]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setHeaderHeight(nativeEvent.layout.height)
          }>
          <AppTopFader style={tw`absolute inset-x-0 top-0`} />

          <View style={tw`flex shrink grow basis-0 flex-row items-center justify-start gap-2`}>
            <AppIconButton
              blurTarget={blurTargetRef}
              icon="arrow-left"
              radius={25}
              style={tw`size-10`}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          </View>

          {!isWide && SUPPORTED_LOCATIONS.length > 1 && (
            <CarouselPaginationDots
              count={SUPPORTED_LOCATIONS.length}
              offset={offset}
              style={tw`grow-0`}
            />
          )}

          <View style={tw`flex shrink grow basis-0 flex-row items-center justify-end gap-2`}>
            {IS_DEV && (
              <AppIconButton
                active={areLightsVisible}
                blurTarget={blurTargetRef}
                icon={areLightsVisible ? 'lightbulb-group' : 'lightbulb-group-outline'}
                radius={25}
                style={tw`size-10`}
                onPress={toggleLights}
              />
            )}
            <AppIconButton
              active={areInformationsVisible}
              blurTarget={blurTargetRef}
              icon="dots-horizontal"
              radius={25}
              style={tw`size-10`}
              onPress={toggleInformations}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default OnPremise;
