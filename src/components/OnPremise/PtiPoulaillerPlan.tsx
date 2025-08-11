import { useOnPremise } from './OnPremiseContext';
import AppText from '../AppText';
import ErrorBadge from '../ErrorBadge';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanPtiPoulaillerDay from '@/assets/images/floorplan-pti-poulailler-day.png';
import floorPlanPtiPoulaillerNight from '@/assets/images/floorplan-pti-poulailler-night.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';

const PtiPoulaillerPlan = ({ style }: { style?: StyleProp<ViewStyle>; }) => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const { selectFlexDesk, selectPtiPoulaillerKeyBox, selectPtiPoulaillerClimate } = useOnPremise();

  const {
    data: onPremiseState,
    isFetching: isFetchingOnPremiseState,
    error: onPremiseStateError,
    refetch: refetchOnPremiseState,
  } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: getOnPremiseState,
    retry: false,
  });

  const colorScheme = useColorScheme();
  const backgroundImage = useMemo(() => {
    return colorScheme === 'dark' ? floorPlanPtiPoulaillerNight : floorPlanPtiPoulaillerDay;
  }, [colorScheme]);

  useEffect(() => {
    const { width, height } = RNImage.resolveAssetSource(backgroundImage);
    setImageHeight(height);
    setImageWidth(width);
  }, [backgroundImage]);

  return (
    <View style={[tw`flex flex-col grow items-start`, style]}>
      <View style={tw`flex flex-row gap-3 items-end w-full mx-6 mb-4`}>
        <AppText
          numberOfLines={1}
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.location.pti-poulailler')}
        </AppText>
        {onPremiseStateError && !isSilentError(onPremiseStateError) && (
          <ErrorBadge
            error={onPremiseStateError}
            style={tw`shrink-0 mb-2`}
            title={t('onPremise.onFetch.fail')}
            onRetry={refetchOnPremiseState}
          />
        )}
      </View>
      <View
        style={[
          tw`flex flex-col items-center justify-center w-full relative`,
          !!imageWidth && !!imageHeight && { aspectRatio: imageWidth / imageHeight },
        ]}>
        {imageHeight && imageWidth ? (
          <Image
            blurRadius={!hasFloorplanLoaded ? 16 : 0}
            cachePolicy="memory"
            source={backgroundImage}
            style={[tw`w-full relative`, { aspectRatio: imageWidth / imageHeight }]}
            onLoadEnd={() => setFloorplanLoaded(true)}
          />
        ) : null}

        {!hasFloorplanLoaded ? (
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`absolute h-16 w-16 z-10 my-auto bg-gray-200 dark:bg-black rounded-full`}
          />
        ) : (
          <>
            {/* Flexispot A */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.a.occupied}
              activeIcon="desk"
              inactiveIcon="desk"
              loading={isFetchingOnPremiseState}
              style={tw`top-[25%] left-[43%]`}
              onPress={() => selectFlexDesk?.({ occupied: onPremiseState?.flexDesks?.a.occupied })}
            />
            {/* Flexispot B */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.b.occupied}
              activeIcon="desk"
              inactiveIcon="desk"
              loading={isFetchingOnPremiseState}
              style={tw`top-[25%] left-[30%]`}
              onPress={() => selectFlexDesk({ occupied: onPremiseState?.flexDesks?.b.occupied })}
            />
            {/* Key box */}
            <ActionableIcon
              activeIcon="key-chain-variant"
              inactiveIcon="key-chain-variant"
              style={tw`top-[82%] left-[22%]`}
              onPress={selectPtiPoulaillerKeyBox}
            />
            {/* Climate */}
            <ActionableIcon
              activeIcon="leaf"
              inactiveIcon="leaf"
              loading={isFetchingOnPremiseState}
              style={tw`top-[68%] left-[45%]`}
              onPress={selectPtiPoulaillerClimate}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PtiPoulaillerPlan;
