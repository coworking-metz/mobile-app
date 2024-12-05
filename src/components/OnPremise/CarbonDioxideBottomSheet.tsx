import AppBottomSheet from '../AppBottomSheet';
import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';
import { Skeleton } from 'moti/skeleton';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, useColorScheme } from 'react-native';
import AnimatedNumber from 'react-native-animated-number';
import Animated, { FadeInUp, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { CARBON_DIOXIDE_RANGES } from '@/services/api/services';

const ANIMATION_DURATION = 1_000;

const CarbonDioxideBottomSheet = ({
  loading = false,
  level = 0,
  style,
  onClose,
}: {
  loading?: boolean;
  level?: number;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const colorScheme = useColorScheme();
  const segments = useMemo(
    () => [
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('emerald-700/80') : tw.color('emerald-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.carbonDioxide.level.low') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('lime-700/80') : tw.color('lime-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.carbonDioxide.level.normal') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('yellow-600/80') : tw.color('yellow-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.carbonDioxide.level.high') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('red-600/80') : tw.color('red-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.carbonDioxide.level.excessive') },
      },
    ],
    [],
  );

  const ranges = [...CARBON_DIOXIDE_RANGES.map((rangeAsNumber) => `${rangeAsNumber}`), ''];

  useLayoutEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  const levelDescription = useMemo(() => {
    if (!level) return t('onPremise.carbonDioxide.level.unknown');
    const [_, normal, high, excessive] = ranges;
    if (level < Number(normal)) {
      return t('onPremise.carbonDioxide.level.low');
    } else if (level < Number(high)) {
      return t('onPremise.carbonDioxide.level.normal');
    } else if (level < Number(excessive)) {
      return t('onPremise.carbonDioxide.level.high');
    } else {
      return t('onPremise.carbonDioxide.level.excessive');
    }
  }, [t, ranges, level]);

  const levelColor = useMemo(() => {
    if (!level) return tw.color('gray-400/25');
    const [_, normal, high, excessive] = ranges;
    const [lowSegment, normalSegment, highSegment, excessiveSegment] = segments;
    if (currentLevel < Number(normal)) {
      return lowSegment.filledColor;
    } else if (currentLevel < Number(high)) {
      return normalSegment.filledColor;
    } else if (currentLevel < Number(excessive)) {
      return highSegment.filledColor;
    } else {
      return excessiveSegment.filledColor;
    }
  }, [ranges, segments, level]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch gap-5 p-6`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <Text
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.carbonDioxide.label')}
      </Text>
      <View style={tw`relative`}>
        <SegmentedArc
          showArcRanges
          animationDelay={300}
          animationDuration={ANIMATION_DURATION}
          capInnerColor={tw.prefixMatch('dark') ? tw.color('white') : tw.color('zinc-900')}
          capOuterColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
          fillValue={((level - 400) / 1600) * 100}
          isAnimated={true}
          key={`segmented-arc-${level}`}
          ranges={ranges}
          rangesTextColor={tw.prefixMatch('dark') ? tw.color('slate-400') : tw.color('slate-500')}
          rangesTextStyle={tw`text-xs font-normal`}
          segments={segments}></SegmentedArc>
        <View
          style={tw`absolute bottom-0 left-0 right-0 w-full flex flex-col items-center justify-center`}>
          <View style={tw`flex flex-row items-end gap-1.5 justify-end w-full mx-auto max-w-40`}>
            {loading ? (
              <View
                style={tw`h-8 mb-0.5 w-24 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
                <Skeleton
                  backgroundColor={
                    tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                  }
                  colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                  height={`100%`}
                  width={`100%`}
                />
              </View>
            ) : (
              <AnimatedNumber
                steps={ANIMATION_DURATION / 16}
                style={[
                  tw`text-4xl font-semibold text-slate-900 dark:text-gray-200 -mb-1`,
                  Platform.OS === 'android' && tw`-mb-2`,
                ]}
                time={16} // milliseconds between each steps
                value={currentLevel}
              />
            )}
            <Text
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
              ppm
            </Text>
          </View>
        </View>
      </View>
      <Animated.View
        entering={FadeInUp.duration(1000).delay(900)}
        style={[
          tw`self-start flex flex-row items-center gap-1.5 px-2 py-1 rounded-full border-[0.5px] border-gray-300 dark:border-gray-700`,
        ]}>
        <View style={[tw`h-2 w-2 rounded-full`, { backgroundColor: levelColor }]} />
        {loading ? (
          <View
            style={tw`h-4 my-0.5 w-32 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={`100%`}
              width={`100%`}
            />
          </View>
        ) : (
          <Text
            numberOfLines={1}
            style={tw`text-sm font-normal shrink text-gray-900 dark:text-gray-200`}>
            {levelDescription}
          </Text>
        )}
      </Animated.View>
      <Text style={tw`text-left text-base font-normal text-slate-500`}>
        {t('onPremise.carbonDioxide.description')}
      </Text>
    </AppBottomSheet>
  );
};

export default CarbonDioxideBottomSheet;
