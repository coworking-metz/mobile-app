import ActionableLight from './ActionableLight';
import { useOnPremise } from './OnPremiseContext';
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
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import LoadingProgressBar from '@/components/LoadingProgressBar';
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
    selectedFlexDesk,
  } = useOnPremise();

  const {
    isPending: isPendingOnPremiseState,
    isFetching: isFetchingOnPremiseState,
    data: onPremiseState,
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
        {onPremiseStateError && !isSilentError(onPremiseStateError) && !isFetchingOnPremiseState ? (
          <ErrorBadge
            error={onPremiseStateError}
            style={tw`shrink-0 mb-2`}
            title={t('onPremise.onFetch.fail')}
            onRetry={refetchOnPremiseState}
          />
        ) : null}
      </View>
      <View
        style={[
          tw`flex flex-col items-center justify-center w-full relative`,
          !!imageWidth && !!imageHeight && { aspectRatio: imageWidth / imageHeight },
        ]}>
        {imageHeight && imageWidth ? (
          <Image
            cachePolicy="memory-disk"
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
          <>
            <ActionableLight
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="1"
              key="light-1"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[32%] left-[32%]`}
            />
            <ActionableLight
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="2"
              key="light-2"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[32%] left-[65%]`}
            />
            <ActionableLight
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="5"
              key="light-5"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[65%] left-[32%]`}
            />
            <ActionableLight
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="6"
              key="light-6"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[65%] left-[65%]`}
            />
          </>
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
              pending={isPendingOnPremiseState}
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
              pending={isPendingOnPremiseState}
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
              style={tw`top-[82%] left-[22%]`}
              onPress={selectPtiPoulaillerKeyBox}
            />
            {/* Climate */}
            <ActionableIcon
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="sun-thermometer"
              key="climate"
              loading={isPendingOnPremiseState}
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
