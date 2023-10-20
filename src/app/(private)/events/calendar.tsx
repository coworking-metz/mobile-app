import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, useColorScheme } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';
import { type MarkedDates } from 'react-native-calendars/src/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { theme } from '@/helpers/colors';
import { type CalendarEvent } from '@/services/api/calendar';
import useCalendarStore from '@/stores/calendar';

dayjs.extend(LocalizedFormat);

const getEventCategoryLinearColors = (event: CalendarEvent): string[] => {
  switch (event.category) {
    case 'AMOUR_FOOD':
      return [tw.color('rose-300') as string, tw.color('rose-500') as string];
    case 'BLIIIDA':
      return [tw.color('neutral-500') as string, tw.color('slate-800') as string];
    case 'COWORKING':
      return [theme.peachYellow, theme.meatBrown];
    default:
      return [tw.color('gray-500') as string, tw.color('gray-800') as string];
  }
};

const AgendaItem = ({ event }: { event: CalendarEvent }) => {
  return (
    <Link asChild href={`/events/${event.id}`} style={tw`mx-3 h-24`}>
      <TouchableOpacity>
        <View
          style={[
            tw`flex flex-row items-start justify-between gap-3 pr-2 bg-gray-200 dark:bg-gray-900 rounded-2xl h-full w-full overflow-hidden`,
          ]}>
          <View style={tw`w-2 h-full bg-neutral-300 dark:bg-gray-800`}>
            <LinearGradient
              colors={getEventCategoryLinearColors(event)}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 1 }}
              style={tw`rounded-full h-full`}
            />
          </View>
          <View style={[tw`flex flex-col h-full grow basis-0 py-2`]}>
            <Text numberOfLines={1} style={[tw`text-base text-slate-500 dark:text-slate-400`]}>
              {dayjs(event.start).format('LT')} - {dayjs(event.end).format('LT')}
            </Text>
            <Text
              numberOfLines={1}
              style={[tw`text-lg font-medium text-slate-900 dark:text-gray-200`]}>
              {event.label}
            </Text>
            {event.location ? (
              <View style={[tw`flex flex-row items-center gap-1`]}>
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  iconStyle={tw`h-4 w-4 mr-0`}
                  name="map-marker-outline"
                  size={20}
                  style={tw`self-center shrink-0`}
                />
                <Text numberOfLines={1} style={[tw`text-base text-slate-500 dark:text-slate-400`]}>
                  {event.location}
                </Text>
              </View>
            ) : null}
          </View>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
            iconStyle={tw`h-6 w-6`}
            name="chevron-right"
            size={28}
            style={tw`self-center shrink-0`}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const MemoAgendaItem = React.memo(AgendaItem);

const AllEvents = () => {
  useDeviceContext(tw);
  const calendarStore = useCalendarStore();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const renderItem = useCallback(({ item }: { item: CalendarEvent }) => {
    return <MemoAgendaItem event={item} />;
  }, []);

  return (
    <Animated.View
      style={[
        tw`flex flex-col grow bg-gray-100 dark:bg-black`,
        {
          paddingTop: 16,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          ...(Platform.OS === 'android' && { paddingTop: insets.top + 16 }),
        },
      ]}>
      <Animated.Text
        entering={FadeInDown.duration(300).delay(150)}
        numberOfLines={1}
        style={[
          tw`text-base font-semibold tracking-tight mb-4 ml-6 text-slate-900 dark:text-gray-200`,
        ]}>
        {t('events.calendar.title')}
      </Animated.Text>

      <CalendarProvider
        key={colorScheme}
        date={new Date().toISOString().slice(0, 10)}
        // onDateChanged={onDateChanged}
        // onMonthChange={onMonthChange}
        // showTodayButton
        // disabledOpacity={0.6}
        // theme={todayBtnTheme.current}
        // todayBottomMargin={16}>
      >
        {/* <WeekCalendar
          allowShadow={false}
          firstDay={1}
          theme={{
            backgroundColor: tw.color('gray-100') as string,
            calendarBackground: tw.color('gray-100') as string,
            todayTextColor: theme.meatBrown,
            selectedDayBackgroundColor: theme.meatBrown,
            selectedDayTextColor: theme.charlestonGreen,
          }}
          // markedDates={marked.current}
        /> */}
        <ExpandableCalendar
          // horizontal={false}
          // hideArrows
          animateScroll
          allowShadow={false}
          firstDay={1}
          markedDates={calendarStore.events.reduce((acc, event) => {
            return {
              ...acc,
              [new Date(event.start).toISOString().slice(0, 10)]: {
                marked: true,
                dotColor: getEventCategoryLinearColors(event)[0],
              },
            };
          }, {} as MarkedDates)}
          style={tw`border-b-[1px] border-gray-200 dark:border-gray-800`}
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          // leftArrowImageSource={leftArrowIcon}
          // markedDates={marked.current}
          // theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          // rightArrowImageSource={rightArrowIcon}
          // closeOnDayPress={false}
          theme={{
            calendarBackground: tw.prefixMatch('dark')
              ? tw.color('black')
              : (tw.color('gray-100') as string),
            // calendarBackground: 'transparent',
            todayTextColor: theme.meatBrown,
            selectedDayBackgroundColor: theme.meatBrown,
            selectedDayTextColor: theme.charlestonGreen,
          }}
        />
        <AgendaList
          avoidDateUpdates
          scrollToNextEvent
          dayFormat={'MMM d, yyyy'}
          infiniteListProps={{
            itemHeight: 96,
            titleHeight: 48,
          }}
          renderItem={renderItem}
          renderSectionHeader={(date) => (
            <View style={tw`flex flex-row items-end ml-3 pb-2 h-full`}>
              <Text style={tw`text-sm text-slate-500`}>
                {capitalize(dayjs(date as unknown as string).format('dddd LL'))}
              </Text>
            </View>
          )}
          sections={calendarStore.events.map((event) => ({
            title: event.start,
            data: [event],
          }))}
        />
      </CalendarProvider>
    </Animated.View>
  );
};

export default AllEvents;
