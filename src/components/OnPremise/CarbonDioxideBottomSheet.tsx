import LoadingSkeleton from '../LoadingSkeleton';
import ReanimatedText from '../ReanimatedText';
import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import Animated, {
  Easing,
  FadeInUp,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { CARBON_DIOXIDE_RANGES } from '@/services/api/services';

const ANIMATION_DURATION = 1_000;

const CarbonDioxideBottomSheet = ({
  loading = false,
  level = 0,
  temperatureLevel = 0,
  humidityLevel = 0,
  noiseLevel = 0,
  style,
  onClose,
}: {
  loading?: boolean;
  level?: number;
  temperatureLevel?: number;
  humidityLevel?: number;
  noiseLevel?: number;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const animatedLevel = useSharedValue<number>(0);
  const colorScheme = useColorScheme();
  const segments = useMemo(
    () => [
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('emerald-700/80') : tw.color('emerald-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.climate.carbonDioxide.level.low') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('lime-700/80') : tw.color('lime-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.climate.carbonDioxide.level.normal') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('yellow-600/80') : tw.color('yellow-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.climate.carbonDioxide.level.high') },
      },
      {
        scale: 0.25,
        filledColor: colorScheme === 'dark' ? tw.color('red-600/80') : tw.color('red-500'),
        emptyColor: tw.color('gray-400/25'),
        data: { label: t('onPremise.climate.carbonDioxide.level.excessive') },
      },
    ],
    [],
  );

  const ranges = [...CARBON_DIOXIDE_RANGES.map((rangeAsNumber) => `${rangeAsNumber}`), ''];

  useEffect(() => {
    animatedLevel.value = withTiming(level, {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [level]);

  const formattedAnimatedLevel = useDerivedValue(() => {
    return `${animatedLevel.value.toFixed(0)}`;
  }, [animatedLevel]);

  const levelDescription = useMemo(() => {
    if (!level) return t('onPremise.climate.carbonDioxide.level.unknown');
    const [_, normal, high, excessive] = ranges;
    if (level < Number(normal)) {
      return t('onPremise.climate.carbonDioxide.level.low');
    } else if (level < Number(high)) {
      return t('onPremise.climate.carbonDioxide.level.normal');
    } else if (level < Number(excessive)) {
      return t('onPremise.climate.carbonDioxide.level.high');
    } else {
      return t('onPremise.climate.carbonDioxide.level.excessive');
    }
  }, [t, ranges, level]);

  const levelColor = useMemo(() => {
    if (!level) return tw.color('gray-400/25');
    const [_, normal, high, excessive] = ranges;
    const [lowSegment, normalSegment, highSegment, excessiveSegment] = segments;
    if (level < Number(normal)) {
      return lowSegment.filledColor;
    } else if (level < Number(high)) {
      return normalSegment.filledColor;
    } else if (level < Number(excessive)) {
      return highSegment.filledColor;
    } else {
      return excessiveSegment.filledColor;
    }
  }, [ranges, segments, level]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch gap-5 p-6`}
      style={style}
      onClose={onClose}>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.climate.carbonDioxide.label')}
      </AppText>
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
          segments={segments}
        />
        <View
          style={tw`absolute bottom-0 left-0 right-0 w-full flex flex-col items-center justify-center`}>
          <View style={tw`flex flex-row items-end gap-1.5 justify-end w-full mx-auto max-w-40`}>
            {loading ? (
              <View
                style={tw`h-8 mb-0.5 w-24 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
                <LoadingSkeleton height={`100%`} width={`100%`} />
              </View>
            ) : (
              <ReanimatedText
                style={tw`text-4xl font-semibold text-slate-900 dark:text-gray-200 ios:-mb-1 android:-mb-2`}
                text={formattedAnimatedLevel}
              />
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
              ppm
            </AppText>
          </View>
        </View>
      </View>
      <Animated.View
        entering={FadeInUp.duration(1000).delay(900)}
        style={tw`self-start flex flex-row mx-auto items-center gap-1.5 px-2 py-1 rounded-full border-[0.5px] border-gray-300 dark:border-gray-700`}>
        <View style={[tw`h-2 w-2 rounded-full`, { backgroundColor: levelColor }]} />
        {loading ? (
          <View
            style={tw`h-4 my-0.5 w-32 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
            <LoadingSkeleton height={`100%`} width={`100%`} />
          </View>
        ) : (
          <AppText
            numberOfLines={1}
            style={tw`text-sm font-normal shrink text-gray-900 dark:text-gray-200`}>
            {levelDescription}
          </AppText>
        )}
      </Animated.View>
      <ReadMore
        numberOfLines={2}
        renderRevealedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.hide')}
          </AppText>
        )}
        renderTruncatedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.readMore')}
          </AppText>
        )}>
        <AppText style={tw`text-left text-base font-normal text-slate-500`}>
          {t('onPremise.climate.carbonDioxide.description')}
        </AppText>
      </ReadMore>

      <View style={tw`flex flex-col w-full`}>
        <AppText style={tw`text-sm font-normal uppercase text-slate-500`}>
          {t('onPremise.climate.label')}
        </AppText>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.temperature.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
              {t('onPremise.climate.temperature.level', { level: temperatureLevel })}
            </AppText>
          )}
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.humidity.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
              {t('onPremise.climate.humidity.level', { level: humidityLevel })}
            </AppText>
          )}
        </ServiceRow>
        <ServiceRow label={t('onPremise.climate.noise.label')} style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
              {t('onPremise.climate.noise.level', { level: noiseLevel })}
            </AppText>
          )}
        </ServiceRow>
      </View>
    </AppBottomSheet>
  );
};

export default CarbonDioxideBottomSheet;
