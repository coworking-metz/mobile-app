import AppBlurView from '@/components/AppBlurView';
import AppFader from '@/components/AppFader';
import AppMenu from '@/components/AppMenu';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import { OnPremiseProvider } from '@/components/OnPremise/OnPremiseContext';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import { theme } from '@/helpers/colors';
import useAppScreen from '@/helpers/screen';
import { getOnPremiseState } from '@/services/api/services';
import { IS_DEV } from '@/services/environment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { includes } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, ScrollView, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];

const OnPremise = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { isWide } = useAppScreen();
  const [areInformationsVisible, setInformationsVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const offset = useSharedValue(0);
  const horizontalScrollView = useRef<Animated.ScrollView>(null);

  const onHorizontalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      offset.value = contentOffset.x / layoutWidth;
    },
  }, [layoutWidth]);

  const { location } = useLocalSearchParams<{ location: string }>();

  const { refetch: refetchOnPremiseState } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: getOnPremiseState,
    retry: false,
  });

  useEffect(() => {
    if (includes(SUPPORTED_LOCATIONS, location) && layoutWidth && horizontalScrollView.current) {
      const index = SUPPORTED_LOCATIONS.indexOf(location);
      horizontalScrollView.current?.scrollTo({ x: index * layoutWidth });
    }
  }, [location, layoutWidth, horizontalScrollView]);

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

        <View style={tw`relative`}>
          <Animated.View
            style={tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`}>
            <AppBlurView
              intensity={64}
              style={tw`h-full w-full`}
              tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
            />
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
            onPress={() => router.canGoBack()
              ? router.back()
              : router.replace('/')}
          />
        </View>

        {!isWide && SUPPORTED_LOCATIONS.length > 1 ? (
          <View style={tw`grow`}>
            <CarouselPaginationDots
              count={SUPPORTED_LOCATIONS.length}
              offset={offset}
              style={tw`grow-0 mx-auto`}
            />
          </View>
        ) : null}

        <View style={tw`relative ml-auto w-10`}>
          {IS_DEV && <>
            <Animated.View
              style={tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`}>
              <AppBlurView
                intensity={64}
                style={tw`h-full w-full`}
                tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
              />
            </Animated.View>
            <AppMenu
              actions={[
                {
                  id: 'refetch',
                  title: t('onPremise.actions.refetch'),
                  image: Platform.select({
                    ios: 'goforward', // https://github.com/andrewtavis/sf-symbols-online
                    android: 'ic_popup_sync', // https://developer.android.com/reference/android/R.drawable
                  }),
                  onPress: refetchOnPremiseState,
                },
                {
                  id: 'info',
                  title: t('onPremise.actions.info'),
                  image: Platform.select({
                    ios: 'info.circle', // https://github.com/andrewtavis/sf-symbols-online
                    android: 'ic_menu_info_details', // https://developer.android.com/reference/android/R.drawable
                  }),
                  onPress: () => setInformationsVisible(true),
                },
              ]}
            />
          </>
          }
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
              contentContainerStyle={[
                tw`flex flex-row items-stretch`,
              ]}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              onScroll={onHorizontalScroll}
              showsHorizontalScrollIndicator={false}>
              <ScrollView
                contentContainerStyle={[
                  isWide && tw`max-w-md`,
                  { paddingTop: headerHeight, width: layoutWidth },
                ]}
                horizontal={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                <PoulaillerPlan />
              </ScrollView>
              <ScrollView
                contentContainerStyle={[
                  isWide && tw`max-w-md`,
                  { paddingTop: headerHeight, width: layoutWidth },
                ]}
                horizontal={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                <PtiPoulaillerPlan />
              </ScrollView>
            </Animated.ScrollView>
          </View>
        ) : null}
      </OnPremiseProvider>
    </View>
  );
};

export default OnPremise;
