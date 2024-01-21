import LoveCalendarAnimation from '../Animations/LoveCalendarAnimation';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, type ViewProps } from 'react-native';
import Animated, { type AnimateProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const CalendarEmptyState = ({
  style,
  ...props
}: AnimateProps<ViewProps> & {
  loading?: boolean;
  style?: StyleProps | false;
}) => {
  const { t } = useTranslation();

  return (
    <Animated.View style={[tw`flex flex-col items-center`, style]} {...props}>
      <LoveCalendarAnimation style={tw`h-32`} />
      <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
        {t('home.calendar.empty.label')}
      </Text>
      <Link asChild href="/events/calendar">
        <Text style={tw`text-base font-normal text-amber-500 text-center mt-4`}>
          {t('home.calendar.empty.action')}
        </Text>
      </Link>
    </Animated.View>
  );
};

export default CalendarEmptyState;
