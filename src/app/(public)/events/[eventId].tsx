import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as Calendar from 'expo-calendar';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { isNil } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, Platform, RefreshControl, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import openMap from 'react-native-open-maps';
import Animated, {
  FadeInLeft,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppBlurView from '@/components/AppBlurView';
import AppFader from '@/components/AppFader';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ErrorState from '@/components/ErrorState';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ZoomableImage from '@/components/ZoomableImage';
import { useAppPermissions } from '@/context/permissions';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { useAppPaddingBottom } from '@/helpers/screen';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView =
  Animated.createAnimatedComponent<KeyboardAwareScrollViewProps>(KeyboardAwareScrollView);

export default function CalendarEventPage() {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const verticalScrollProgress = useSharedValue(0);
  const router = useRouter();

  const { eventId, _root } = useLocalSearchParams();
  const { t } = useTranslation();
  const renderPermissionsBottomSheet = useAppPermissions();
  const [actionHeight, setActionHeight] = useState(0);
  const paddingBottom = useAppPaddingBottom();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [titleHeight, setTitleHeight] = useState<number>(0);

  const navigationHeight = useMemo(() => {
    return NAVIGATION_HEIGHT + insets.top;
  }, [insets.top]);

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(navigationHeight + headerHeight);
    }, 300);

    return () => clearTimeout(timeout);
  }, [navigationHeight, headerHeight]);

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
      [-1, 0, headerHeight - titleHeight - 32, headerHeight - titleHeight - 16],
      [0, 0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, headerHeight]);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [0, headerHeight - titleHeight, headerHeight],
      [0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, headerHeight]);

  const {
    data: calendarEvents,
    isPending: isPendingCalendarEvents,
    isFetching: isFetchingCalendarEvents,
    error: calendarEventsError,
    refetch: refetchCalendarEvents,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    refetchOnMount: false,
  });

  const event = useMemo<CalendarEvent | null>(() => {
    return (!isNil(eventId) && (calendarEvents || [])?.find((e) => `${e.id}` === eventId)) || null;
  }, [calendarEvents, eventId]);

  const firstPicture = useMemo(() => {
    const [first] = event?.pictures || [];
    return first;
  }, [event]);

  const firstUrl = useMemo(() => {
    const [first] = event?.urls || [];
    return first;
  }, [event]);

  const onAddToCalendar = useCallback(() => {
    if (event) {
      (async () => {
        const { granted } = await Calendar.requestCalendarPermissionsAsync();
        if (granted) {
          Calendar.createEventInCalendarAsync({
            startDate: new Date(event.start),
            endDate: new Date(event.end),
            title: event.title,
            location: event.location,
            notes: event.description,
          });
        } else {
          renderPermissionsBottomSheet();
        }
      })();
    }
  }, [event]);

  return (
    <View style={[tw`flex-1 bg-gray-100 dark:bg-black`]}>
      {/* body */}
      <AnimatedKeyboardAwareScrollView
        contentContainerStyle={[tw`flex flex-col min-h-full`]}
        horizontal={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            progressViewOffset={progressViewOffset}
            refreshing={isFetchingCalendarEvents}
            onRefresh={refetchCalendarEvents}
          />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={onVerticalScroll}>
        <Animated.View
          style={[tw`relative flex flex-col justify-end h-96 max-h-1/2 w-full`]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setHeaderHeight(nativeEvent.layout.height)
          }>
          <View style={tw`absolute inset-0`}>
            <ZoomableImage
              contentFit="cover"
              source={firstPicture}
              sources={event?.pictures}
              style={tw`h-full w-full bg-gray-300 dark:bg-gray-700`}
              transition={300}>
              {event?.pictures.length && event.pictures.length > 1 && (
                <View
                  style={[
                    tw`absolute top-1.5 right-5.5 bg-black/70 py-1 px-2 rounded-lg`,
                    { marginTop: insets.top },
                  ]}>
                  <AppText style={tw`text-xs text-gray-200 font-medium`}>
                    {event.pictures.length}
                  </AppText>
                </View>
              )}
            </ZoomableImage>
          </View>
          <View
            pointerEvents="none"
            style={tw`flex flex-col px-6 pb-6`}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setTitleHeight(nativeEvent.layout.height)
            }>
            <AppFader
              position={Fader.position.BOTTOM}
              size={256}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('gray-50') || ''}
            />
            {isPendingCalendarEvents ? (
              <LoadingSkeleton height={40} width={172} />
            ) : (
              <AppText
                entering={FadeInLeft.duration(500)}
                numberOfLines={2}
                style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {event?.title}
              </AppText>
            )}
          </View>
        </Animated.View>
        <View
          style={[
            tw`flex flex-col w-full grow bg-gray-50 dark:bg-zinc-900 relative pt-4`,
            {
              paddingLeft: insets.left,
              paddingRight: insets.right,
              paddingBottom,
            },
          ]}>
          <View style={tw`w-full max-w-xl mx-auto grow`}>
            {event ? (
              <>
                <ServiceRow
                  withBottomDivider
                  description={t('events.detail.time', {
                    startTime: dayjs(event.start).format('LT'),
                    endTime: dayjs(event.end).format('LT'),
                  })}
                  label={t('events.detail.date', {
                    date: new Date(event.start),
                    formatParams: {
                      date: { weekday: 'long', month: 'long', day: 'numeric' },
                    },
                  })}
                  prefixIcon="calendar-outline"
                  style={tw`mx-3 px-3`}
                  suffixIcon="calendar-plus"
                  onPress={onAddToCalendar}
                />
                {event.location ? (
                  <ServiceRow
                    withBottomDivider
                    label={event.location}
                    prefixIcon="map-marker-outline"
                    style={tw`mx-3 px-3`}
                    suffixIcon="directions"
                    onPress={() => openMap({ query: event.location })}
                  />
                ) : null}
                {event.description ? (
                  <View style={tw`mt-3 mx-6`}>
                    <MarkdownRenderer content={event.description} />
                  </View>
                ) : null}
              </>
            ) : isFetchingCalendarEvents ? (
              <View style={tw`h-44 mx-4 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
                <LoadingSkeleton height={`100%`} width={`100%`} />
              </View>
            ) : calendarEventsError && !isSilentError(calendarEventsError) ? (
              <ErrorState error={calendarEventsError} title={t('home.calendar.onFetch.fail')} />
            ) : (
              <>
                <View style={tw`flex flex-col items-center justify-end px-4 grow basis-0`}>
                  <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
                </View>
                <View
                  style={tw`flex flex-col items-center justify-start px-4 gap-2 grow basis-0 max-w-sm mx-auto`}>
                  <AppText
                    entering={FadeInLeft.duration(500)}
                    numberOfLines={1}
                    style={tw`text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                    {t('notFound.title')}
                  </AppText>
                  <AppText
                    entering={FadeInLeft.duration(500).delay(150)}
                    numberOfLines={2}
                    style={tw`text-base font-normal text-center text-slate-500 dark:text-slate-400`}>
                    {t('notFound.description')}
                  </AppText>
                </View>
              </>
            )}
          </View>
        </View>
      </AnimatedKeyboardAwareScrollView>

      {/* <AppFader
        position={Fader.position.TOP}
        size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
        style={tw`absolute top-0 left-0 right-0 z-10`}
        tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
      /> */}

      {/* navigation bar */}
      <Animated.View
        style={[
          tw`absolute top-0 left-0 right-0 z-10 flex flex-row pb-2 items-center min-h-18`,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
            navigationBackgroundStyle,
          ]}>
          <AppBlurView style={tw`h-full w-full`} />
        </Animated.View>
        <View style={tw`flex flex-row shrink-0 min-w-10 overflow-visible basis-0 grow ml-4`}>
          <AppBlurView style={tw`rounded-full overflow-hidden`}>
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          </AppBlurView>
        </View>
        <Animated.View
          pointerEvents="none"
          style={[tw`flex flex-row justify-center shrink grow`, titleStyle]}>
          {isFetchingCalendarEvents ? (
            <LoadingSkeleton height={28} width={128} />
          ) : (
            <AppText
              numberOfLines={1}
              style={tw`text-lg tracking-tight text-slate-900 dark:text-gray-200 font-medium`}>
              {event?.title}
            </AppText>
          )}
        </Animated.View>
        <View style={tw`flex flex-row justify-end shrink basis-0 grow mr-4 min-w-10`} />
      </Animated.View>

      {/* footer */}
      {firstUrl && (
        <View
          style={[tw`flex flex-col absolute bottom-0 px-6 w-full`, { paddingBottom }]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setActionHeight(nativeEvent.layout.height)
          }>
          <AppFader
            position={Fader.position.BOTTOM}
            size={actionHeight + 32}
            style={tw`absolute inset-0`}
            tintColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('gray-50')}
          />

          <Link asChild href={firstUrl}>
            <AppRoundedButton style={tw`w-full max-w-md self-center`} suffixIcon="open-in-new">
              <AppText style={tw`text-base font-medium text-black`}>
                {t('actions.takeALook')}
              </AppText>
            </AppRoundedButton>
          </Link>
        </View>
      )}
    </View>
  );
}
