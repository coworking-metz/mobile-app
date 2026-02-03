import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { includes } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import useAppScreen from '@/helpers/screen';
import { getOnPremiseState } from '@/services/api/services';
import { IS_DEV } from '@/services/environment';
import { onPremiseQueryKeys } from '@/services/query';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];

const OnPremise = () => {
  useDeviceContext(tw);
  const { isWide } = useAppScreen();
  const [areInformationsVisible, setInformationsVisible] = useState(false);
  const [areLightsVisible, setLightsVisible] = useState(false);

  const [isRefreshingPoulaillerPlan, setRefreshingPoulaillerPlan] = useState(false);
  const [isRefreshingPtiPoulaillerPlan, setRefreshingPtiPoulaillerPlan] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(headerHeight - 16);
    }, 300);

    return () => clearTimeout(timeout);
  }, [headerHeight]);

  const offset = useSharedValue(0);
  const horizontalScrollView = useRef<Animated.ScrollView>(null);

  const { isFetching: isFetchingOnPremiseState, refetch: refetchOnPremiseState } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

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
      style={[
        tw`flex-1 overflow-hidden bg-gray-100 dark:bg-black`,
        {
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setLayoutWidth(nativeEvent.layout.width)}>
      <Animated.View
        style={[
          tw`flex flex-row items-center absolute top-0 px-4 pb-2 w-full z-10`,
          { paddingTop: insets.top },
        ]}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setHeaderHeight(nativeEvent.layout.height)
        }>
        <AppTopFader style={tw`absolute inset-x-0 top-0`} />

        <View style={tw`grow shrink basis-0 flex flex-row items-center justify-start gap-2`}>
          <AppIconButton
            icon="arrow-left"
            style={tw`h-10 w-10`}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </View>

        {!isWide && SUPPORTED_LOCATIONS.length > 1 ? (
          <CarouselPaginationDots
            count={SUPPORTED_LOCATIONS.length}
            offset={offset}
            style={tw`grow-0 mx-auto`}
          />
        ) : null}

        <View style={tw`grow shrink basis-0 flex flex-row items-center justify-end gap-2`}>
          {IS_DEV && (
            <AppIconButton
              active={areLightsVisible}
              icon={areLightsVisible ? 'lightbulb-group' : 'lightbulb-group-outline'}
              style={tw`h-10 w-10`}
              onPress={() => {
                setLightsVisible(!areLightsVisible);
                setInformationsVisible(false);
              }}
            />
          )}

          <AppIconButton
            active={areInformationsVisible}
            icon="dots-horizontal"
            style={tw`h-10 w-10`}
            onPress={() => {
              setLightsVisible(false);
              setInformationsVisible(!areInformationsVisible);
            }}
          />
        </View>
      </Animated.View>

      {layoutWidth ? (
        <Animated.ScrollView
          ref={horizontalScrollView}
          horizontal
          contentContainerStyle={tw`flex flex-row items-stretch`}
          pagingEnabled={!isWide}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={onHorizontalScroll}>
          <ScrollView
            contentContainerStyle={[
              isWide && tw`max-w-lg`,
              { paddingTop: headerHeight, width: isWide ? layoutWidth / 2 : layoutWidth },
            ]}
            horizontal={false}
            refreshControl={
              <RefreshControl
                progressViewOffset={progressViewOffset}
                refreshing={isRefreshingPoulaillerPlan}
                onRefresh={() => {
                  setRefreshingPoulaillerPlan(true);
                  refetchOnPremiseState().finally(() => setRefreshingPoulaillerPlan(false));
                }}
              />
            }
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <PoulaillerPlan
              withInformations={areInformationsVisible}
              withLights={areLightsVisible}
            />
          </ScrollView>
          <ScrollView
            contentContainerStyle={[
              isWide && tw`max-w-lg`,
              { paddingTop: headerHeight, width: isWide ? layoutWidth / 2 : layoutWidth },
            ]}
            horizontal={false}
            refreshControl={
              <RefreshControl
                progressViewOffset={progressViewOffset}
                refreshing={isRefreshingPtiPoulaillerPlan}
                onRefresh={() => {
                  setRefreshingPtiPoulaillerPlan(true);
                  refetchOnPremiseState().finally(() => setRefreshingPtiPoulaillerPlan(false));
                }}
              />
            }
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <PtiPoulaillerPlan
              withInformations={areInformationsVisible}
              withLights={areLightsVisible}
            />
          </ScrollView>
        </Animated.ScrollView>
      ) : null}
    </View>
  );
};

export default OnPremise;
