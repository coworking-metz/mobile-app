import CalendarEmptyState from './CalendarEmptyState';
import { PeriodType } from '../Events/PeriodBottomSheet';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { sample } from 'lodash';
import React, { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle, type ViewProps } from 'react-native';
import { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import { CalendarEvent } from '@/services/api/calendar';

const HomeCalendarEmptyState = ({
  lastFetch,
  events,
  ...props
}: AnimatedProps<ViewProps> & {
  lastFetch?: number;
  events?: CalendarEvent[];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();

  const firstPeriodWithEvents: PeriodType = useMemo(() => {
    const [nextEvent] = events?.filter(({ end }) => dayjs().isBefore(end)) || [];
    if (nextEvent) {
      if (dayjs(nextEvent.start).isSame(dayjs(), 'week')) {
        return 'week';
      } else if (dayjs(nextEvent.start).isSame(dayjs(), 'month')) {
        return 'month';
      }
    }
    return null;
  }, [events]);

  const description = useMemo(() => {
    const i18nDescription = t('home.calendar.empty.description', {
      returnObjects: true,
    });
    return Array.isArray(i18nDescription) ? sample(i18nDescription) : i18nDescription;
  }, [t, lastFetch]);

  const action = useMemo(() => {
    const i18nAction = t('home.calendar.empty.action', {
      returnObjects: true,
    });
    return Array.isArray(i18nAction) ? sample(i18nAction) : i18nAction;
  }, [t, lastFetch]);

  return (
    <CalendarEmptyState description={description} {...props}>
      <Link
        asChild
        href={['/events', firstPeriodWithEvents && `period=${firstPeriodWithEvents}`]
          .filter(Boolean)
          .join('?')}>
        <AppText style={tw`text-base font-normal text-amber-500 text-center mt-4`}>
          {action}
        </AppText>
      </Link>
    </CalendarEmptyState>
  );
};

export default HomeCalendarEmptyState;
