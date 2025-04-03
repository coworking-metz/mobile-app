import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import CalendarCheckAnimation from '@/components/Animations/CalendarCheckAnimation';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import { theme } from '@/helpers/colors';

const AppointmentCard = ({
  date,
  style,
  activeSince,
}: {
  date: string;
  style?: StyleProp<ViewStyle>;
  activeSince?: string;
}) => {
  const { t } = useTranslation();
  const animation = useRef<LottieView>(null);

  const isFocus = useIsFocused();

  const appointmentDate = useMemo(() => {
    if (dayjs().startOf('day').isAfter(date)) {
      return t('home.appointment.date', {
        date: new Date(date),
        formatParams: {
          date: { month: 'long', day: 'numeric' },
        },
      });
    }

    if (Math.abs(dayjs().diff(date, 'day')) < 3) return dayjs(date).calendar().split(' ')[0];
    if (Math.abs(dayjs().diff(date, 'day')) < 7) return dayjs(date).format('dddd');
    return t('home.appointment.date', {
      date: new Date(date),
      formatParams: {
        date: { month: 'long', day: 'numeric' },
      },
    });
  }, [date, t, isFocus, activeSince]);

  const appointmentTime = useMemo(() => {
    return t('home.appointment.time', {
      start: new Date(date),
      end: dayjs(date).add(30, 'minute').toDate(),
      formatParams: {
        start: { hour: 'numeric', minute: 'numeric' },
        end: { hour: 'numeric', minute: 'numeric' },
      },
    });
  }, [date, t]);

  const onAnimationPress = useCallback(() => {
    if (animation.current) animation.current.play(40, 120);
  }, [animation]);

  return (
    <View
      // eslint-disable-next-line tailwindcss/no-custom-classname
      style={[
        tw`flex flex-col items-start gap-4 rounded-2xl w-32 relative overflow-hidden p-4`,
        { backgroundColor: tw.prefixMatch('dark') ? `${theme.meatBrown}CC` : theme.meatBrown },
        style,
      ]}>
      <View style={tw`flex flex-row gap-4 items-start`}>
        <AppTouchable onPress={onAnimationPress}>
          <Animated.View
            style={tw`flex rounded-2xl bg-amber-100 bg-opacity-75 dark:bg-opacity-50 overflow-hidden h-20 w-20`}>
            <CalendarCheckAnimation ref={animation} style={tw`h-full w-full`} />
          </Animated.View>
        </AppTouchable>

        <View style={tw`flex flex-col justify-center min-h-20 grow shrink`}>
          <AppText numberOfLines={1} style={tw`text-3xl font-semibold text-zinc-900`}>
            {t('home.appointment.title')}
          </AppText>
          <AppText
            numberOfLines={2}
            style={tw`text-base font-normal text-zinc-600 dark:text-zinc-700`}>
            {t('home.appointment.description')}
          </AppText>
        </View>
      </View>

      <View
        style={tw`flex flex-row items-center justify-between bg-amber-950 bg-opacity-25 dark:bg-opacity-40 rounded-xl py-2 px-4 w-full`}>
        <View style={tw`flex flex-row items-center gap-2 grow shrink`}>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-100') : tw.color('white')}
            iconStyle={tw`h-6 w-6`}
            name="calendar-outline"
            size={24}
            style={tw`shrink-0`}
          />
          <AppText
            numberOfLines={1}
            style={[tw`text-base font-normal text-gray-100 dark:text-gray-200`]}>
            {appointmentDate}
          </AppText>
        </View>
        <View style={tw`flex flex-row items-center gap-2 grow shrink`}>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-100') : tw.color('white')}
            iconStyle={tw`h-6 w-6`}
            name="clock-time-ten-outline"
            size={24}
            style={tw`shrink-0`}
          />
          <AppText
            numberOfLines={1}
            style={[tw`text-base font-normal text-gray-100 dark:text-gray-200`]}>
            {appointmentTime}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default AppointmentCard;
