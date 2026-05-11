import ActionableLight from './ActionableLight';
import { useOnPremise } from './OnPremiseContext';
import { useQuery } from '@tanstack/react-query';
import { BlurTargetView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import { BounceIn, BounceOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanDay from '@/assets/images/floorplans/floorplan-poulailler-01-12-2023-13-30.png';
import floorPlanNight from '@/assets/images/floorplans/floorplan-poulailler-01-12-2023-20-30.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import ActionableCarbonDioxide from '@/components/OnPremise/ActionableCarbonDioxide';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import ActionablePhoneBooths from '@/components/OnPremise/ActionablePhoneBooths';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const PoulaillerPlan = ({
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
  const user = useAuthStore((s) => s.user);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const blurTargetRef = useRef<View | null>(null);
  const {
    selectCarbonDioxide,
    selectDeckDoor,
    selectDeckKeyBox,
    selectPhoneBooth,
    selectPoulaillerKeyBox,
    selectStorageKeyBox,
    selectTelevision,
    selectCoffeeMachine,
    selectPrinter,
    selectFridge,
    selectAirConditioning,
    selectWifi,
    selectIntercom,
    selectGroupWork,
    selectSoundOff,
    isWifiSelected,
    isTelevisionSelected,
    isCarbonDioxideSelected,
    isDeckKeyBoxSelected,
    isPoulaillerKeyBoxSelected,
    isStorageKeyBoxSelected,
    isCoffeeMachineSelected,
    isPrinterSelected,
    isFridgeSelected,
    isIntercomSelected,
    isAirConditioningSelected,
    isGroupWorkSelected,
    isSoundOffSelected,
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
        <AppText style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.location.poulailler')}
        </AppText>
        {onPremiseStateError && !isSilentError(onPremiseStateError) && !isFetchingOnPremiseState ? (
          <ErrorBadge
            error={onPremiseStateError}
            style={tw`shrink-0 ios:mb-2 android:mb-1`}
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
        <BlurTargetView ref={blurTargetRef} style={tw`absolute inset-0`}>
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
        </BlurTargetView>

        {!hasFloorplanLoaded ? (
          <View
            style={tw`absolute h-16 w-16 z-10 my-auto bg-gray-200 dark:bg-black rounded-full overflow-hidden`}>
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`h-full w-full`}
            />
          </View>
        ) : withInformations ? (
          <>
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="volume-off"
              key="sound-off"
              selected={isSoundOffSelected}
              style={tw`top-[22%] left-[66%]`}
              onPress={selectSoundOff}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="fridge-outline"
              key="fridge"
              selected={isFridgeSelected}
              style={tw`top-[56%] left-[62%]`}
              onPress={selectFridge}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="coffee-outline"
              key="coffee-machine"
              selected={isCoffeeMachineSelected}
              style={tw`top-[56%] left-[77%]`}
              onPress={selectCoffeeMachine}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              icon="television-guide"
              key="television"
              selected={isTelevisionSelected}
              style={tw`top-[75%] left-[73%]`}
              onPress={selectTelevision}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="printer-outline"
              key="printer"
              selected={isPrinterSelected}
              style={tw`top-[49%] left-[66%]`}
              onPress={selectPrinter}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="bell-ring-outline"
              key="intercom"
              selected={isIntercomSelected}
              style={tw`top-[32%] left-[48%]`}
              onPress={selectIntercom}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="fan"
              key="air-conditioning-1"
              selected={isAirConditioningSelected}
              style={tw`top-[19%] left-[11%]`}
              onPress={selectAirConditioning}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="fan"
              key="air-conditioning-2"
              selected={isAirConditioningSelected}
              style={tw`top-[46%] left-[11%]`}
              onPress={selectAirConditioning}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="wifi"
              selected={isWifiSelected}
              style={tw`top-[75%] left-[48%]`}
              onPress={selectWifi}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="account-group-outline"
              key="group-work"
              selected={isGroupWorkSelected}
              style={tw`top-[60%] left-[28%]`}
              onPress={selectGroupWork}
            />
          </>
        ) : withLights ? (
          <>
            {/* Lights */}
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="1"
              key="light-1"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[22%] left-[32%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="2"
              key="light-2"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[22%] left-[65%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="3"
              key="light-3"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[40%] left-[32%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="4"
              key="light-4"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[40%] left-[65%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="5"
              key="light-5"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[68%] left-[32%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="6"
              key="light-6"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[68%] left-[65%]`}
            />
          </>
        ) : (
          <>
            {/* Door */}
            <ActionableIcon
              active={onPremiseState?.deckDoor?.unlocked}
              activeIcon="lock-open"
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="lock"
              key="deck-door"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`top-[50%] left-[82%]`}
              onPress={selectDeckDoor}
            />

            {/* Key box */}
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="key-chain"
              key="deck-key-box"
              selected={isDeckKeyBoxSelected}
              style={tw`top-[43%] left-[89%]`}
              onPress={selectDeckKeyBox}
            />

            {/* Phone booths */}
            <ActionablePhoneBooths
              activeIcon="door-closed"
              actives={[
                onPremiseState?.phoneBooths?.orange.occupied ?? null,
                onPremiseState?.phoneBooths?.blue.occupied ?? null,
              ]}
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="door-open"
              key="phone-booths"
              loading={isPendingOnPremiseState}
              style={tw`top-[82%] left-[12%] w-[25%] min-w-26`}
              unknownIcon="door"
              onPress={selectPhoneBooth}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="key-chain-variant"
              key="poulailler-key-box"
              selected={isPoulaillerKeyBoxSelected}
              style={tw`top-[84%] left-[56%]`}
              onPress={selectPoulaillerKeyBox}
            />

            {user?.capabilities?.includes('STORAGE_KEYS_ACCESS') && (
              <ActionableIcon
                blurTarget={blurTargetRef}
                entering={BounceIn.duration(750).delay(Math.random() * 500)}
                exiting={BounceOut.duration(750)}
                icon="key-chain-variant"
                key="storage-key-box"
                selected={isStorageKeyBoxSelected}
                style={tw`top-[95%] left-[50%]`}
                onPress={selectStorageKeyBox}
              />
            )}

            <ActionableCarbonDioxide
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="leaf"
              key="carbon-dioxide-level"
              level={onPremiseState?.sensors?.carbonDioxide.level || 0}
              loading={isFetchingOnPremiseState}
              selected={isCarbonDioxideSelected}
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
