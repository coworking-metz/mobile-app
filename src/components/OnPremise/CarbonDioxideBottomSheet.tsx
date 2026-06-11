import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import { isNil, sample } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ReanimatedText from '@/components/ReanimatedText';
import useAppState from '@/helpers/app-state';
import { CARBON_DIOXIDE_RANGES, getOnPremiseState } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

const ANIMATION_DURATION = 1_000;

const CarbonDioxideBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    loading?: boolean;
    level?: number;
    temperatureLevel?: number;
    humidityLevel?: number;
    noiseLevel?: number;
  }
> = (
  { loading = false, level, temperatureLevel, humidityLevel, noiseLevel, style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const animatedLevel = useSharedValue<number>(0);
  const colorScheme = useColorScheme();
  const activeSince = useAppState();
  const isFocus = useIsFocused();
  const [isVisible, setVisible] = useState<boolean>(false);

  const { dataUpdatedAt: onPremiseStateUpdatedAt } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return onPremiseStateUpdatedAt ? dayjs().diff(onPremiseStateUpdatedAt, 'second') : null;
  }, [onPremiseStateUpdatedAt, isFocus, activeSince]);

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
    if (!isNil(level)) {
      if (isVisible) {
        animatedLevel.value = withTiming(level, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        });
      } else {
        animatedLevel.value = 0;
      }
    }
  }, [level, isVisible]);

  const formattedAnimatedLevel = useDerivedValue(() => {
    return `${animatedLevel.value.toFixed(0)}`;
  }, [animatedLevel]);

  const levelDescription = useMemo(() => {
    if (!level)
      return sample(t('onPremise.climate.carbonDioxide.level.unknown', { returnObjects: true }));
    const [_, medium, high, excessive] = ranges;
    if (level < Number(medium)) {
      return sample(t('onPremise.climate.carbonDioxide.level.low', { returnObjects: true }));
    } else if (level < Number(high)) {
      return sample(t('onPremise.climate.carbonDioxide.level.medium', { returnObjects: true }));
    } else if (level < Number(excessive)) {
      return sample(t('onPremise.climate.carbonDioxide.level.high', { returnObjects: true }));
    } else {
      return sample(t('onPremise.climate.carbonDioxide.level.excessive', { returnObjects: true }));
    }
  }, [t, ranges, level]);

  const levelColor = useMemo(() => {
    if (!level) return tw.color('gray-400/25');
    const [_, medium, high, excessive] = ranges;
    const [lowSegment, mediumSegment, highSegment, excessiveSegment] = segments;
    if (level < Number(medium)) {
      return lowSegment.filledColor;
    } else if (level < Number(high)) {
      return mediumSegment.filledColor;
    } else if (level < Number(excessive)) {
      return highSegment.filledColor;
    } else {
      return excessiveSegment.filledColor;
    }
  }, [ranges, segments, level]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch gap-5 p-6`, style]}
      onClose={() => {
        setVisible(false);
        onClose?.();
      }}
      onWillPresent={() => {
        setVisible(true);
      }}>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.climate.carbonDioxide.label')}
      </AppText>
      <View style={tw`relative`}>
        <SegmentedArc
          showArcRanges
          animationDelay={300}
          animationDuration={ANIMATION_DURATION}
          capInnerColor={levelColor}
          capOuterColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
          fillValue={(((level ?? 0) - 400) / 1600) * 100}
          isAnimated={true}
          key={`segmented-arc-${level}`}
          ranges={ranges}
          rangesTextColor={tw.prefixMatch('dark') ? tw.color('neutral-500') : tw.color('slate-500')}
          rangesTextStyle={tw`text-xs font-normal`}
          segments={segments}
        />
        <View
          style={tw`absolute inset-x-0 bottom-0 flex w-full flex-col items-center justify-center`}>
          <View style={tw`mx-auto flex w-full max-w-40 flex-row items-end justify-end gap-1.5`}>
            {loading ? (
              <View style={tw`mb-0.5 h-8 w-24 overflow-hidden rounded-2xl`}>
                <LoadingSkeleton height={`100%`} width={`100%`} />
              </View>
            ) : !isNil(level) ? (
              <ReanimatedText
                style={tw`ios:-mb-1 android:h-10 grow text-right text-4xl font-semibold text-slate-900 dark:text-gray-200`}
                text={formattedAnimatedLevel}
              />
            ) : (
              <AppText
                style={tw`ios:-mb-1 android:h-10 grow text-right text-4xl font-semibold text-slate-900 dark:text-gray-200`}>
                ?
              </AppText>
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500`}>
              ppm
            </AppText>
          </View>
        </View>
      </View>
      <Animated.View
        entering={FadeInUp.duration(1000).delay(900)}
        style={tw`mx-auto flex flex-row items-center gap-1.5 self-start`}>
        <View style={[tw`size-2 rounded-full`, { backgroundColor: levelColor }]} />
        {loading ? (
          <View style={tw`my-0.5 h-4 w-32 overflow-hidden rounded-2xl`}>
            <LoadingSkeleton height={`100%`} width={`100%`} />
          </View>
        ) : (
          <AppText
            numberOfLines={1}
            style={tw`shrink text-sm font-normal text-gray-900 dark:text-gray-200`}>
            {levelDescription}
          </AppText>
        )}
      </Animated.View>
      <AppText style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.climate.carbonDioxide.description')}
      </AppText>

      <View style={tw`flex w-full flex-col`}>
        <SectionTitle loading={loading} title={t('onPremise.climate.label')}>
          {!isNil(durationSinceLastFetch) && durationSinceLastFetch > 300 && (
            <AppText
              style={tw`ml-auto text-right text-xs font-normal leading-5 text-slate-500 dark:text-neutral-500`}>
              {durationSinceLastFetch > 3_600
                ? dayjs(onPremiseStateUpdatedAt).calendar()
                : dayjs(onPremiseStateUpdatedAt).fromNow()}
            </AppText>
          )}
        </SectionTitle>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.temperature.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(temperatureLevel) ? (
            <AppText
              style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-400`}>
              {t('onPremise.climate.temperature.level', { level: temperatureLevel })}
            </AppText>
          ) : null}
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.humidity.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(humidityLevel) ? (
            <AppText
              style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-400`}>
              {t('onPremise.climate.humidity.level', { level: humidityLevel })}
            </AppText>
          ) : null}
        </ServiceRow>
        <ServiceRow label={t('onPremise.climate.noise.label')} style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(noiseLevel) ? (
            <AppText
              style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-400`}>
              {t('onPremise.climate.noise.level', { level: noiseLevel })}
            </AppText>
          ) : null}
        </ServiceRow>
      </View>
    </AppBottomSheet>
  );
};

export default forwardRef(CarbonDioxideBottomSheet);
