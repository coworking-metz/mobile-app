import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { includes } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppBlurView from '@/components/AppBlurView';
import AppFader from '@/components/AppFader';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import { OnPremiseProvider } from '@/components/OnPremise/OnPremiseContext';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import { theme } from '@/helpers/colors';
import useAppScreen from '@/helpers/screen';
import { IS_DEV } from '@/services/environment';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];

const OnPremise = () => {
  useDeviceContext(tw);
  const { isWide } = useAppScreen();
  const [areInformationsVisible, setInformationsVisible] = useState(false);
  const [areLightsVisible, setLightsVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

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
      style={[
        tw`overflow-hidden bg-gray-100 dark:bg-black`,
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
        <AppFader
          position={Fader.position.TOP}
          size={headerHeight}
          style={tw`absolute inset-0`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
        />

        <View style={tw`grow shrink basis-0 flex flex-row items-center justify-start gap-2`}>
          <View style={tw`relative`}>
            <Animated.View
              style={tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`}>
              <AppBlurView style={tw`h-full w-full`} />
            </Animated.View>
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={32}
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          </View>
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
            <View style={tw`relative`}>
              <Animated.View
                style={[
                  tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`,
                  areLightsVisible && { backgroundColor: theme.meatBrown },
                ]}>
                <AppBlurView style={tw`h-full w-full`} />
              </Animated.View>
              <MaterialCommunityIcons.Button
                backgroundColor="transparent"
                borderRadius={32}
                color={
                  areLightsVisible || !tw.prefixMatch('dark')
                    ? theme.charlestonGreen
                    : tw.color('gray-400')
                }
                iconStyle={{ marginRight: 0 }}
                name={areLightsVisible ? 'lightbulb-group' : 'lightbulb-group-outline'}
                size={32}
                style={tw`p-1 shrink-0`}
                underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
                onPress={() => {
                  setLightsVisible(!areLightsVisible);
                  setInformationsVisible(false);
                }}
              />
            </View>
          )}

          <View style={tw`relative`}>
            <Animated.View
              style={[
                tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`,
                areInformationsVisible && { backgroundColor: theme.meatBrown },
              ]}>
              {<AppBlurView style={tw`h-full w-full`} />}
            </Animated.View>
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={32}
              color={
                areInformationsVisible || !tw.prefixMatch('dark')
                  ? theme.charlestonGreen
                  : tw.color('gray-400')
              }
              iconStyle={{ marginRight: 0 }}
              name={areInformationsVisible ? 'help-circle' : 'help-circle-outline'}
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() => {
                setLightsVisible(false);
                setInformationsVisible(!areInformationsVisible);
              }}
            />
          </View>
        </View>
      </Animated.View>

      <OnPremiseProvider>
        {layoutWidth ? (
          <View style={tw`relative h-full flex grow flex-col`}>
            <AppFader
              position={Fader.position.TOP}
              size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
              style={tw`absolute top-0 inset-x-0 z-10`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
            />

            <Animated.ScrollView
              ref={horizontalScrollView}
              horizontal
              pagingEnabled
              contentContainerStyle={tw`flex flex-row items-stretch`}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              onScroll={onHorizontalScroll}>
              <ScrollView
                contentContainerStyle={[
                  isWide && tw`max-w-md`,
                  { paddingTop: headerHeight, width: layoutWidth },
                ]}
                horizontal={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                <PoulaillerPlan
                  withInformations={areInformationsVisible}
                  withLights={areLightsVisible}
                />
              </ScrollView>
              <ScrollView
                contentContainerStyle={[
                  isWide && tw`max-w-md`,
                  { paddingTop: headerHeight, width: layoutWidth },
                ]}
                horizontal={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                <PtiPoulaillerPlan
                  withInformations={areInformationsVisible}
                  withLights={areLightsVisible}
                />
              </ScrollView>
            </Animated.ScrollView>
          </View>
        ) : null}
      </OnPremiseProvider>
    </View>
  );
};

export default OnPremise;
