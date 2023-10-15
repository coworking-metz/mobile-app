import SegmentedControl from '@react-native-segmented-control/segmented-control';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import PresenceCard from '@/components/Home/PresenceCard';
import ServiceRow from '@/components/Settings/ServiceRow';
import { type ApiPresence } from '@/services/api/presence';
import usePresenceStore from '@/stores/presence';

dayjs.extend(LocalizedFormat);

const MAX_HEADER_HEIGHT = 144;
const MIN_HEADER_HEIGHT = 64;
const INTERPOLATE_INPUT = [
  -1,
  0,
  MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT,
  MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT,
];

enum PresenceType {
  PREVIOUS = 'PREVIOUS',
  CURRENT = 'CURRENT',
}

const PRESENCE_TYPES = [PresenceType.PREVIOUS, PresenceType.CURRENT];

const PresenceByWeek = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const verticalScrollProgress = useSharedValue(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(1);
  const weekPresence = usePresenceStore((state) => state.weekPresence);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const maxHeaderHeight = useMemo(() => {
    return MAX_HEADER_HEIGHT + (Platform.OS === 'android' ? insets.top : 0);
  }, [insets]);

  const minHeaderHeight = useMemo(() => {
    return MIN_HEADER_HEIGHT + (Platform.OS === 'android' ? insets.top : 0);
  }, [insets]);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [
      maxHeaderHeight + 1,
      maxHeaderHeight,
      minHeaderHeight,
      minHeaderHeight,
    ]);

    return {
      height,
    };
  }, [verticalScrollProgress, insets]);

  const headerBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [0, 0, 1, 1]);

    return {
      opacity,
    };
  }, [verticalScrollProgress, insets]);

  const headerTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [24, 24, 16, 16]);

    return {
      // marginLeft,
      fontSize,
    };
  }, [verticalScrollProgress, insets]);

  const presence = useMemo<ApiPresence | null>(() => {
    const type = PRESENCE_TYPES[selectedTypeIndex];
    switch (type) {
      case PresenceType.PREVIOUS:
        return weekPresence?.previous ?? null;
      case PresenceType.CURRENT:
        return weekPresence?.current ?? null;
      default:
        return null;
    }
  }, [weekPresence, selectedTypeIndex]);

  return (
    <Animated.View style={tw`dark:bg-black`}>
      <Animated.ScrollView
        contentContainerStyle={[
          tw`flex flex-col grow`,
          {
            paddingTop: maxHeaderHeight,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom + 16,
          },
        ]}
        horizontal={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={tw`w-full h-full`}
        onScroll={onVerticalScroll}>
        <View style={tw`flex flex-col gap-3`}>
          <PresenceCard
            color="blue"
            history={presence?.timeline.map(({ date, value }) => ({
              date: new Date(date),
              value,
            }))}
            style={tw`h-48 mx-4`}
            type="day"
          />
          <Animated.View entering={FadeInUp.duration(400).delay(400)} style={tw`mx-4`}>
            <SegmentedControl
              selectedIndex={selectedTypeIndex}
              values={PRESENCE_TYPES.map((type) => t(`presence.byWeek.type.${type}`))}
              onChange={(event) => {
                setSelectedTypeIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(400).delay(400)}
            style={tw`flex flex-col bg-white dark:bg-zinc-900 grow-0`}>
            <Animated.Text style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
              {t('presence.byWeek.list.title')}
            </Animated.Text>
            {presence?.timeline.map(({ date, value }, index) => (
              <View key={`week-presence-${date}`}>
                <Link asChild href="/presence/by-day">
                  <ServiceRow
                    description={dayjs(date).format('LL')}
                    label={capitalize(dayjs(date).format('dddd'))}
                    style={tw`px-3 mx-3`}
                    suffixIcon="chevron-right"
                    withBottomDivider={index < presence.timeline.length - 1}>
                    {dayjs(weekPresence?.at).isBefore(date) ? (
                      <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
                        <Animated.Text style={tw`text-xs text-slate-900 dark:text-gray-200 `}>
                          {t('presence.byWeek.list.forecast')}
                        </Animated.Text>
                      </View>
                    ) : null}
                    <Animated.Text
                      style={tw`text-base text-slate-900 dark:text-gray-200 w-7 text-right`}>
                      {value}
                    </Animated.Text>
                  </ServiceRow>
                </Link>
              </View>
            ))}
          </Animated.View>
        </View>
        <View style={[tw`w-full min-h-14 grow`]}></View>
      </Animated.ScrollView>

      <Animated.View
        style={[
          tw`absolute flex flex-row justify-between items-start w-full pt-3`,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingTop: Platform.OS === 'android' ? insets.top + 4 : 12,
          },
          headerStyle,
        ]}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
            headerBackgroundStyle,
          ]}>
          <BlurView
            intensity={64}
            style={tw`h-full w-full`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
          />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.duration(300).delay(150)}
          numberOfLines={1}
          style={[
            tw`text-base font-semibold tracking-tight mb-4 ml-6 text-slate-900 dark:text-gray-200 self-end`,
            headerTextStyle,
          ]}>
          {t('presence.byWeek.title')}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default PresenceByWeek;
