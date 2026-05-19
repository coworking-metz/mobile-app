import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BlurTargetView } from 'expo-blur';
import * as Calendar from 'expo-calendar';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { isNil } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, RefreshControl, TouchableNativeFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import openMap from 'react-native-open-maps';
import ReadMore from 'react-native-read-more-text';
import Animated, {
  FadeInLeft,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import HandwrittenParchmentAnimation from '@/components/Animations/HandwrittenParchmentAnimation';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppFader, { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ErrorState from '@/components/ErrorState';
import { AmourFoodIcon, BliiidaIcon, CoworkingIcon } from '@/components/Home/CalendarEventCard';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ZoomableImage from '@/components/ZoomableImage';
import { useAppPermissions } from '@/context/permissions';
import { isSilentError } from '@/helpers/error';
import { useAppPaddingBottom } from '@/helpers/screen';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';
import { eventsQueryKeys } from '@/services/query';

const NAVIGATION_HEIGHT = 48;

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

export default function CalendarEventPage() {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const verticalScrollProgress = useSharedValue(0);
  const router = useRouter();

  const { eventId, _root: withoutBackButton } = useLocalSearchParams();
  const { t } = useTranslation();
  const renderPermissionsBottomSheet = useAppPermissions();
  const [actionHeight, setActionHeight] = useState(0);
  const paddingBottom = useAppPaddingBottom();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const blurTargetRef = useRef<View | null>(null);

  const navigationHeight = useMemo(() => {
    return NAVIGATION_HEIGHT + insets.top;
  }, [insets.top]);

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(headerHeight);
    }, 300);

    return () => clearTimeout(timeout);
  }, [headerHeight]);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const {
    isPending: isPendingCalendarEvents,
    isFetching: isFetchingCalendarEvents,
    data: calendarEvents,
    error: calendarEventsError,
    refetch: refetchCalendarEvents,
  } = useQuery({
    queryKey: eventsQueryKeys.all(),
    queryFn: getCalendarEvents,
    refetchOnMount: false,
  });

  const event = useMemo<CalendarEvent | null>(() => {
    return (!isNil(eventId) && (calendarEvents || [])?.find((e) => `${e.id}` === eventId)) || null;
  }, [calendarEvents, eventId]);

  const eventIcon = useMemo(() => {
    switch (event?.calendar) {
      case 'AMOUR_FOOD':
        return <AmourFoodIcon style={tw`h-6 w-6 self-center rounded-md`} />;
      case 'COWORKING':
        return <CoworkingIcon style={tw`h-6 w-6 self-center rounded-md`} />;
      case 'BLIIIDA':
        return <BliiidaIcon style={tw`h-6 w-6 self-center rounded-md`} />;
    }
    return null;
  }, [event]);

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
    <View style={[tw`flex-1 bg-gray-50 dark:bg-zinc-900 relative`]}>
      <BlurTargetView ref={blurTargetRef} style={tw`flex-1`}>
        <View style={[tw`absolute inset-0 flex flex-col items-stretch`]}>
          <Animated.View
            style={[
              tw`relative flex flex-col justify-end h-64 max-h-1/3 w-full`,
              !event?.pictures.length && { height: navigationHeight },
            ]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setHeaderHeight(nativeEvent.layout.height)
            }>
            {event?.pictures.length ? (
              <View style={tw`absolute inset-0`}>
                <ZoomableImage
                  contentFit="cover"
                  source={firstPicture}
                  sources={event?.pictures}
                  style={tw`h-full w-full bg-gray-300 dark:bg-zinc-700 `}
                  transition={300}
                  zoomed={isGalleryVisible}
                  onZoomChange={(zoomed) => setGalleryVisible(zoomed)}>
                  {event?.pictures.length && event.pictures.length > 1 && (
                    <>
                      <View
                        style={[
                          tw`absolute bottom-4 right-3 bg-black border border-transparent h-6 w-6 rounded-md`,
                        ]}
                      />
                      <View
                        style={[
                          tw`absolute bottom-3.5 right-3.5 flex items-center justify-center bg-black border border-gray-600 h-6 w-6 rounded-md`,
                        ]}>
                        <AppText style={tw`text-xs text-gray-200 font-medium`}>
                          {event.pictures.length}
                        </AppText>
                      </View>
                    </>
                  )}
                </ZoomableImage>
              </View>
            ) : null}
          </Animated.View>

          {isFetchingCalendarEvents && (
            <LoadingProgressBar
              style={[
                tw`absolute inset-x-0 z-10`,
                {
                  top: headerHeight,
                },
              ]}
            />
          )}
        </View>

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
          {
            /* transparent view to fake a touch on the header link, should mimic as much as possible the header */
            <TouchableNativeFeedback onPress={() => setGalleryVisible(true)}>
              <Animated.View
                style={[
                  tw`flex flex-col items-end self-center w-full relative`,
                  { height: headerHeight },
                ]}
              />
            </TouchableNativeFeedback>
          }
          <View
            style={[
              tw`flex flex-col w-full grow bg-gray-50 dark:bg-zinc-900 relative`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingBottom: actionHeight || paddingBottom,
              },
            ]}>
            <View style={tw`w-full max-w-xl mx-auto grow`}>
              {event ? (
                <>
                  {event.title ? (
                    <Animated.View
                      entering={FadeInLeft.duration(500)}
                      style={[tw`mx-6`, !!event?.pictures.length && tw`mt-6 mb-4`]}>
                      <ReadMore
                        numberOfLines={2}
                        renderRevealedFooter={(handlePress) => (
                          <AppText
                            style={tw`text-base font-normal text-amber-500 text-left`}
                            onPress={handlePress}>
                            {t('actions.hide')}
                          </AppText>
                        )}
                        renderTruncatedFooter={(handlePress) => (
                          <AppText
                            style={tw`text-base font-normal text-amber-500 text-left`}
                            onPress={handlePress}>
                            {t('actions.readMore')}
                          </AppText>
                        )}>
                        <AppText
                          style={[
                            tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`,
                          ]}>
                          {event.title}
                        </AppText>
                      </ReadMore>
                    </Animated.View>
                  ) : null}
                  <Link
                    asChild
                    dismissTo
                    href={{
                      pathname: '/events/calendar',
                      params: { calendar: event.calendar },
                    }}>
                    <ServiceRow
                      withBottomDivider
                      label={t(`events.detail.author.byCalendar.${event.calendar}`)}
                      prefix={eventIcon}
                      style={tw`mx-3 px-3`}
                      suffixIcon="chevron-right"
                    />
                  </Link>
                  <ServiceRow
                    withBottomDivider
                    description={
                      dayjs(event.start).diff(event.end, 'hours', true) % 24 === 0
                        ? t('events.detail.until', {
                            date: new Date(dayjs(event.end).subtract(1, 'second').toString()),
                            formatParams: {
                              date: { weekday: 'long', month: 'long', day: 'numeric' },
                            },
                          })
                        : t('events.detail.time', {
                            startTime: dayjs(event.start).format('LT'),
                            endTime: dayjs(event.end).format('LT'),
                          })
                    }
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
                    <View style={[tw`mt-3 mx-6`, !!actionHeight && tw`mb-6`]}>
                      <MarkdownRenderer content={event.description} />
                    </View>
                  ) : (
                    <Animated.View style={tw`flex flex-col items-center mx-6`}>
                      <HandwrittenParchmentAnimation autoPlay loop style={tw`h-64 w-full`} />
                      <AppText
                        style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                        {t('events.detail.description.empty.title')}
                      </AppText>
                      <AppText
                        style={tw`text-base text-center font-normal text-slate-500 dark:text-neutral-500 mt-3`}>
                        {t('events.detail.description.empty.description')}
                      </AppText>
                    </Animated.View>
                  )}
                </>
              ) : isPendingCalendarEvents ? (
                <View
                  style={tw`h-8 m-4 w-64 overflow-hidden rounded-2xl bg-gray-200 dark:bg-zinc-900`}>
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
                      style={tw`text-base font-normal text-center text-slate-500 dark:text-neutral-500`}>
                      {t('notFound.description')}
                    </AppText>
                  </View>
                </>
              )}
            </View>
          </View>
        </AnimatedKeyboardAwareScrollView>

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
              <AppRoundedButton
                label={t('actions.takeALook')}
                style={tw`w-full max-w-sm self-center`}
                suffixIcon="open-in-new"
              />
            </Link>
          </View>
        )}
      </BlurTargetView>

      <AppTopFader style={tw`absolute inset-x-0 top-0`} />

      {!withoutBackButton && (
        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 z-10`,
            {
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          <AppIconButton
            blurTarget={blurTargetRef}
            icon="arrow-left"
            radius={25}
            style={tw`ml-4`}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </Animated.View>
      )}
    </View>
  );
}
