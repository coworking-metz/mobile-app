import { MaterialCommunityIcons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { useNavigation, useRouter } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
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
import { theme } from '@/helpers/colors';
import { getPresenceByDay, type ApiPresence } from '@/services/api/presence';

const MAX_HEADER_HEIGHT = 144;
const MIN_HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 56;
const INTERPOLATE_INPUT_RANGE = [
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

const PresenceByDay = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const verticalScrollProgress = useSharedValue(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(1);

  const {
    data: hourlyPresence,
    dataUpdatedAt: hourlyPresenceUpdatedAt,
    isFetching: isFetchingHourlyPresence,
    error: hourlyPresenceError,
  } = useQuery({
    queryKey: ['hourlyPresence'],
    refetchOnMount: false,
    queryFn: getPresenceByDay,
  });

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

  const canGoBack = useMemo(() => {
    return navigation.getState().index > 0;
  }, [navigation]);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT_RANGE, [
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
    const opacity = interpolate(
      verticalScrollProgress.value,
      INTERPOLATE_INPUT_RANGE,
      [0, 0, 1, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, insets]);

  const headerTextStyle = useAnimatedStyle(() => {
    const leftDestination = 64;
    const marginLeft = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT_RANGE, [
      24,
      24,
      leftDestination,
      leftDestination,
    ]);

    const fontSize = interpolate(
      verticalScrollProgress.value,
      INTERPOLATE_INPUT_RANGE,
      [24, 24, 16, 16],
    );

    return {
      marginLeft,
      fontSize,
    };
  }, [verticalScrollProgress, insets]);

  const getPresenceFromTypeIndex = useCallback(
    (typeIndex: number) => {
      const type = PRESENCE_TYPES[typeIndex];
      switch (type) {
        case PresenceType.PREVIOUS:
          return hourlyPresence?.previous ?? null;
        case PresenceType.CURRENT:
          return hourlyPresence?.current ?? null;
        default:
          return null;
      }
    },
    [hourlyPresence],
  );

  const presence = useMemo<ApiPresence | null>(() => {
    return getPresenceFromTypeIndex(selectedTypeIndex);
  }, [hourlyPresence, selectedTypeIndex]);

  return (
    <Animated.View style={tw`bg-gray-100 dark:bg-black`}>
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
        <View style={tw`flex flex-col gap-3 grow`}>
          <PresenceCard
            color="amber"
            history={presence?.timeline.map(({ date, value }) => ({
              date: new Date(date),
              value,
            }))}
            loading={isFetchingHourlyPresence}
            style={tw`h-48 mx-4`}
            type="hour"
          />
          <Animated.View entering={FadeInUp.duration(400).delay(400)} style={tw`mx-4`}>
            <SegmentedControl
              selectedIndex={selectedTypeIndex}
              values={PRESENCE_TYPES.map((type, index) => {
                if (
                  getPresenceFromTypeIndex(index)?.from &&
                  dayjs().isSame(dayjs(getPresenceFromTypeIndex(index)?.from), 'day')
                ) {
                  return t(`presence.byDay.type.TODAY`);
                }
                return t(`presence.byDay.type.${type}`, {
                  // TODO: should capitalize depending on the locale
                  // https://github.com/i18next/i18next/issues/765#issuecomment-1355630324
                  day: capitalize(dayjs(getPresenceFromTypeIndex(index)?.from).format('dddd')),
                });
              })}
              onChange={(event) => {
                setSelectedTypeIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(400).delay(400)}
            style={tw`flex flex-col bg-white dark:bg-zinc-900 grow`}>
            <Animated.Text style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
              {t('presence.byDay.list.title')}
            </Animated.Text>
            {presence?.timeline.map((item, index) => (
              <ServiceRow
                key={`day-presence-${item.date}`}
                label={t('presence.byDay.list.label', {
                  end: dayjs(item.date).format('H'),
                  start: dayjs(item.date).subtract(1, 'hour').format('H'),
                })}
                style={tw`px-3 mx-3`}
                withBottomDivider={index < presence.timeline.length - 1}>
                {dayjs(hourlyPresenceUpdatedAt).add(1, 'hour').isBefore(item.date) ? (
                  <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
                    <Animated.Text style={tw`text-xs text-slate-900 dark:text-gray-200 `}>
                      {t('presence.byDay.list.forecast')}
                    </Animated.Text>
                  </View>
                ) : null}
                <Animated.Text
                  style={tw`text-base text-slate-900 dark:text-gray-200 w-7 text-right`}>
                  {item.value}
                </Animated.Text>
              </ServiceRow>
            ))}
          </Animated.View>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[
          tw`absolute flex flex-row justify-between items-start w-full pt-3`,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
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

        <View
          style={[
            tw`ml-4 mt-3 absolute z-10`,
            { left: insets.left },
            Platform.OS === 'android' && { top: insets.top, marginTop: 4 },
          ]}>
          <MaterialCommunityIcons.Button
            backgroundColor="transparent"
            borderRadius={24}
            color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
            iconStyle={{ height: 32, width: 32, marginRight: 0 }}
            name="arrow-left"
            size={32}
            style={tw`p-1 shrink-0`}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
            onPress={() => (canGoBack ? router.back() : router.replace('/presence/by-week'))}
          />
        </View>
        <Animated.Text
          entering={FadeInDown.duration(300).delay(150)}
          numberOfLines={1}
          style={[
            tw`text-2xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-gray-200 self-end`,
            headerTextStyle,
          ]}>
          {t('presence.byDay.title', {
            day: dayjs(presence?.from).format('dddd'),
          })}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default PresenceByDay;
