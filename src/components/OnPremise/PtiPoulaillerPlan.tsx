import { useOnPremise } from './OnPremiseContext';
import AppText from '../AppText';
import ErrorBadge from '../ErrorBadge';
import LoadingProgressBar from '../LoadingProgressBar';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import { BounceIn, BounceOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanPtiPoulaillerDay from '@/assets/images/floorplans/floorplan-pti-poulailler-01-06-2023-19-00.png';
import floorPlanPtiPoulaillerNight from '@/assets/images/floorplans/floorplan-pti-poulailler-01-06-2023-22-30.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

const PtiPoulaillerPlan = ({
  style,
  withInformations = false,
  withLights = false,
}: {
  style?: StyleProp<ViewStyle>;
  withInformations?: boolean;
  withLights?: boolean;
}) => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const {
    selectFlexDesk,
    selectPtiPoulaillerKeyBox,
    selectPtiPoulaillerClimate,
    selectWifi,
    selectTelevision,
    isWifiSelected,
    isTelevisionSelected,
    isPtiPoulaillerClimateSelected,
    isPtiPoulaillerKeyBoxSelected,
    selectedFlexDesk,
  } = useOnPremise();

  const {
    data: onPremiseState,
    isFetching: isFetchingOnPremiseState,
    error: onPremiseStateError,
    refetch: refetchOnPremiseState,
  } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
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
          numberOfLines={2}
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

        {isFetchingOnPremiseState && (
          <LoadingProgressBar style={tw`absolute top-0 inset-x-0 z-1`} />
        )}

        {!hasFloorplanLoaded ? (
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`absolute h-16 w-16 z-10 my-auto bg-gray-200 dark:bg-black rounded-full`}
          />
        ) : withInformations ? (
          <>
            <ActionableIcon
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="television-guide"
              selected={isTelevisionSelected}
              style={tw`top-[71%] left-[50%]`}
              onPress={selectTelevision}
            />

            <ActionableIcon
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="wifi"
              selected={isWifiSelected}
              style={tw`top-[73%] left-[17%]`}
              onPress={selectWifi}
            />
          </>
        ) : withLights ? (
          <></>
        ) : (
          <>
            {/* Flexispot A */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.a.occupied}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="desk"
              key="flex-desk-a"
              loading={isFetchingOnPremiseState}
              selected={selectedFlexDesk?.id === 'a'}
              style={tw`top-[25%] left-[43%]`}
              onPress={() =>
                selectFlexDesk?.({ id: 'a', occupied: onPremiseState?.flexDesks?.a.occupied })
              }
            />
            {/* Flexispot B */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.b.occupied}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="desk"
              key="flex-desk-b"
              loading={isFetchingOnPremiseState}
              selected={selectedFlexDesk?.id === 'b'}
              style={tw`top-[25%] left-[30%]`}
              onPress={() =>
                selectFlexDesk({ id: 'b', occupied: onPremiseState?.flexDesks?.b.occupied })
              }
            />
            {/* Key box */}
            <ActionableIcon
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="key-chain-variant"
              key="key-box"
              selected={isPtiPoulaillerKeyBoxSelected}
              style={tw`top-[82%] left-[22%]`}
              onPress={selectPtiPoulaillerKeyBox}
            />
            {/* Climate */}
            <ActionableIcon
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="sun-thermometer"
              key="climate"
              loading={isFetchingOnPremiseState}
              selected={isPtiPoulaillerClimateSelected}
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
