import AppBottomSheet from '../AppBottomSheet';
import ZoombableImage from '../ZoomableImage';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { type CalendarEvent } from '@/services/api/calendar';

const CalendarEventBottomSheet = ({
  event,
  style,
  onClose,
}: {
  event?: CalendarEvent | null;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      {event && (
        <View style={tw`flex flex-col items-center justify-between gap-4 p-6 w-full`}>
          <Text
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('home.calendar.date', {
              date: new Date(event.start),
              formatParams: {
                date: { weekday: 'long', month: 'long', day: 'numeric' },
              },
            })}
          </Text>
          <ZoombableImage
            contentFit="cover"
            source={event.picture}
            style={tw`h-40 min-w-full rounded-2xl bg-gray-200 dark:bg-gray-900`}
            transition={300}
          />
          {event.description ? (
            <Text style={tw`text-center text-base text-slate-500 dark:text-slate-400`}>
              {event.description}
            </Text>
          ) : null}
          <Button
            backgroundColor={theme.darkVanilla}
            style={tw`min-h-14 self-stretch`}
            onPress={() => router.push(event.url)}>
            <Text style={tw`text-base font-medium`}>{t('actions.takeALook')}</Text>
          </Button>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default CalendarEventBottomSheet;
