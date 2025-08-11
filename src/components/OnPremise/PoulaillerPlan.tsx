import ActionableLight from './ActionableLight';
import { useOnPremise } from './OnPremiseContext';
import AppText from '../AppText';
import ErrorBadge from '../ErrorBadge';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanDay from '@/assets/images/floorplan-day.png';
import floorPlanNight from '@/assets/images/floorplan-night.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ActionableCarbonDioxide from '@/components/OnPremise/ActionableCarbonDioxide';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import ActionablePhoneBooths from '@/components/OnPremise/ActionablePhoneBooths';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';

const PoulaillerPlan = ({ style }: { style?: StyleProp<ViewStyle>; }) => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const {
    selectCarbonDioxide,
    selectDeckDoor,
    selectDeckKeyBox,
    selectPhoneBooth,
    selectPoulaillerKeyBox,
  } = useOnPremise();

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
    return colorScheme === 'dark' ? floorPlanNight : floorPlanDay;
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
          {t('onPremise.location.poulailler')}
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
            {/* Lights */}
            {/* <ActionableLight
              id="1"
              loading={isFetchingOnPremiseState}
              style={tw`top-[22%] left-[32%]`}
            />
            <ActionableLight
              id="2"
              loading={isFetchingOnPremiseState}
              style={tw`top-[22%] left-[65%]`}
            />
            <ActionableLight
              id="3"
              loading={isFetchingOnPremiseState}
              style={tw`top-[40%] left-[32%]`}
            />
            <ActionableLight
              id="4"
              loading={isFetchingOnPremiseState}
              style={tw`top-[40%] left-[65%]`}
            />
            <ActionableLight
              id="5"
              loading={isFetchingOnPremiseState}
              style={tw`top-[68%] left-[32%]`}
            />
            <ActionableLight
              id="6"
              loading={isFetchingOnPremiseState}
              style={tw`top-[68%] left-[65%]`}
            /> */}

            {/* Door */}
            <ActionableIcon
              active={onPremiseState?.deckDoor?.unlocked}
              activeIcon="lock-open"
              inactiveIcon="lock"
              loading={isFetchingOnPremiseState}
              style={tw`top-[50%] left-[82%]`}
              onPress={selectDeckDoor}
            />

            {/* Key box */}
            <ActionableIcon
              activeIcon="key-chain"
              inactiveIcon="key-chain"
              style={tw`top-[43%] left-[89%]`}
              onPress={selectDeckKeyBox}
            />

            {/* Fans */}
            {/* <ActionableFan active id="1" style={tw`top-[19%] left-[11%]`} />
              <ActionableFan id="2" style={tw`top-[46%] left-[11%]`} /> */}

            {/* TV */}
            {/* <ActionableIcon
                disabled
                active={false}
                activeIcon="volume-high"
                inactiveIcon="volume-off"
                style={tw`top-[72%] left-[68%]`}
              /> */}

            {/* Phone booths */}
            <ActionablePhoneBooths
              activeIcon="door-closed"
              actives={[
                onPremiseState?.phoneBooths?.orange.occupied ?? null,
                onPremiseState?.phoneBooths?.blue.occupied ?? null,
              ]}
              inactiveIcon="door-open"
              loading={isFetchingOnPremiseState}
              style={tw`top-[82%] left-[12%] w-[25%] min-w-26`}
              unknownIcon="door"
              onPress={selectPhoneBooth}
            />

            {/* Key box */}
            <ActionableIcon
              activeIcon="key-chain-variant"
              inactiveIcon="key-chain-variant"
              style={tw`top-[84%] left-[56%]`}
              onPress={selectPoulaillerKeyBox}
            />

            {/* Carbon Dioxide level */}
            <ActionableCarbonDioxide
              activeIcon="leaf"
              inactiveIcon="leaf"
              level={onPremiseState?.sensors?.carbonDioxide.level || 0}
              loading={isFetchingOnPremiseState}
              style={tw`top-[32%] left-[56%]`}
              onPress={selectCarbonDioxide}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PoulaillerPlan;
