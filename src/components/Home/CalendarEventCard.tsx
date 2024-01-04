import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, useColorScheme, type LayoutChangeEvent } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import { type CalendarEvent } from '@/services/api/calendar';

const CalendarEventCard = ({
  event = null,
  style,
}: {
  event?: CalendarEvent | null;
  style?: StyleProps | false;
}) => {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        tw`flex flex-row items-start justify-between bg-gray-200 dark:bg-gray-900 rounded-2xl self-stretch overflow-hidden`,
        style,
      ]}>
      {event ? (
        <>
          <View style={tw`h-full pl-3 py-2 max-w-2/3 shrink-0`}>
            <Text numberOfLines={1} style={tw`text-base text-slate-500 dark:text-slate-400`}>
              {t('home.calendar.event.date', {
                date: new Date(event.start),
                formatParams: {
                  date: { weekday: 'long', month: 'long', day: 'numeric' },
                },
              })}
            </Text>
            <Text numberOfLines={2} style={tw`text-xl grow text-gray-900 dark:text-gray-200`}>
              {event.label}
            </Text>
          </View>
          <View
            style={[tw`h-full grow relative shrink`]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setContainerWidth(nativeEvent.layout.width)
            }>
            <View style={tw`absolute left-0 top-0 bottom-0 z-10`}>
              <Fader
                visible
                position={Fader.position.START}
                size={containerWidth}
                tintColor={colorScheme === 'dark' ? tw.color('gray-900') : tw.color('gray-200')}
              />
            </View>
            <Image contentFit="cover" source={event.picture} style={tw`h-full`} transition={1000} />
          </View>
        </>
      ) : null}
    </View>
  );
};

export default CalendarEventCard;
