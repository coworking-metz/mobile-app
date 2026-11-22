import { useQuery } from '@tanstack/react-query';
import { BlurTargetView } from 'expo-blur';
import { Stack, useLocalSearchParams } from 'expo-router';
import { includes } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, ScrollView, View, type ViewInstance } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import NativeHeader, {
  ScrollEdge,
  useHasSideSystemColumn,
  useHeaderTintColor,
  useNavigationHeight,
} from '@/components/Layout/NativeHeader';
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
  const navigationHeight = useNavigationHeight();
  const hasSideSystemColumn = useHasSideSystemColumn();
  // iOS insets scroll content below the transparent header itself, Android doesn't
  const contentTop = useMemo(() => {
    return (Platform.OS === 'android' ? navigationHeight : insets.top) || 16;
  }, [insets.top, navigationHeight]);
  const { t } = useTranslation();
  const [layoutWidth, setLayoutWidth] = useState(0);
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
      setProgressViewOffset(contentTop);
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

  // an array, not a fragment: Stack.Toolbar only reads its direct children
  const toolbarItems = [
    IS_DEV && (
      <Stack.Toolbar.Button
        icon={areLightsVisible ? 'lightbulb.2.fill' : 'lightbulb.2'}
        key="lights"
        tintColor={tintColor}
        // native active state: tinted when the overlay is shown
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
  ];

  return (
    // edge to edge: floor plans span the full width, under the native header items
    <View
      style={tw`flex-1 overflow-hidden bg-gray-100 dark:bg-black`}
      onLayout={({ nativeEvent }) => setLayoutWidth(nativeEvent.layout.width)}>
      {layoutWidth ? (
        <BlurTargetView ref={blurTargetRef} style={tw`relative flex h-full grow`}>
          <ScrollEdge>
            <Animated.ScrollView
              ref={horizontalScrollView}
              horizontal
              contentContainerStyle={tw`flex grow flex-row items-stretch`}
              pagingEnabled={!isWide}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={tw`flex-1`}
              onScroll={onHorizontalScroll}>
              <ScrollEdge style={tw`h-full`}>
                <ScrollView
                  contentContainerStyle={[
                    isWide && tw`max-w-lg`,
                    !isWide && { width: layoutWidth },
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
              <ScrollEdge style={tw`h-full`}>
                <ScrollView
                  contentContainerStyle={[
                    isWide && tw`max-w-lg`,
                    !isWide && { width: layoutWidth },
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

      <NativeHeader
        blurTarget={blurTargetRef}
        menu={
          Platform.OS === 'android' ? (
            <View style={tw`flex-row gap-2`}>
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
          ) : undefined
        }
        rightItems={hasSideSystemColumn ? undefined : toolbarItems}
        title={t('onPremise.title')}
        titleView={
          !isWide && SUPPORTED_LOCATIONS.length > 1 ? (
            <CarouselPaginationDots count={SUPPORTED_LOCATIONS.length} offset={offset} />
          ) : undefined
        }
      />
      {Platform.OS === 'ios' && hasSideSystemColumn && (
        // Duo side column: push our items to the bottom of the system bar, away from back
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Spacer />
          {toolbarItems}
        </Stack.Toolbar>
      )}
      <AppTopFader style={tw`absolute inset-x-0 top-0`} />
    </View>
  );
};

export default OnPremise;
