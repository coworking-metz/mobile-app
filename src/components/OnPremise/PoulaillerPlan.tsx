import ActionableFan from './ActionableFan';
import ActionableLight from './ActionableLight';
import { useOnPremise } from './OnPremiseContext';
import { useQuery } from '@tanstack/react-query';
import { BlurTargetView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeOut } from 'react-native-reanimated';
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
    <View style={[tw`flex grow flex-col items-start`, style]}>
      <View style={tw`mx-6 mb-4 flex w-full flex-row items-end gap-3`}>
        <AppText style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.location.poulailler')}
        </AppText>
        {onPremiseStateError && !isSilentError(onPremiseStateError) && !isFetchingOnPremiseState ? (
          <ErrorBadge
            error={onPremiseStateError}
            style={tw`ios:mb-2 android:mb-1 shrink-0`}
            title={t('onPremise.onFetch.fail')}
            onRetry={refetchOnPremiseState}
          />
        ) : null}
      </View>
      <View
        style={[
          tw`relative flex w-full flex-col items-center justify-center`,
          !!imageWidth && !!imageHeight && { aspectRatio: imageWidth / imageHeight },
        ]}>
        <BlurTargetView ref={blurTargetRef} style={tw`absolute inset-0`}>
          {imageHeight && imageWidth ? (
            <Image
              cachePolicy="memory-disk"
              source={backgroundImage}
              style={[tw`relative w-full`, { aspectRatio: imageWidth / imageHeight }]}
              onLoadEnd={() => setFloorplanLoaded(true)}
            />
          ) : null}

          {isFetchingOnPremiseState && (
            <LoadingProgressBar style={tw`absolute inset-x-0 top-0 z-10`} />
          )}
        </BlurTargetView>

        {!hasFloorplanLoaded ? (
          <Animated.View
            exiting={FadeOut.duration(300)}
            style={tw`absolute z-10 my-auto size-16 overflow-hidden rounded-full bg-gray-200 dark:bg-black`}>
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`size-full`}
            />
          </Animated.View>
        ) : withInformations ? (
          <>
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="volume-off"
              key="sound-off"
              selected={isSoundOffSelected}
              style={tw`left-[66%] top-[22%]`}
              onPress={selectSoundOff}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="fridge-outline"
              key="fridge"
              selected={isFridgeSelected}
              style={tw`left-[62%] top-[56%]`}
              onPress={selectFridge}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="coffee-outline"
              key="coffee-machine"
              selected={isCoffeeMachineSelected}
              style={tw`left-[77%] top-[56%]`}
              onPress={selectCoffeeMachine}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              icon="television-guide"
              key="television"
              selected={isTelevisionSelected}
              style={tw`left-[73%] top-3/4`}
              onPress={selectTelevision}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="printer-outline"
              key="printer"
              selected={isPrinterSelected}
              style={tw`left-[66%] top-[49%]`}
              onPress={selectPrinter}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="bell-ring-outline"
              key="intercom"
              selected={isIntercomSelected}
              style={tw`left-[48%] top-[32%]`}
              onPress={selectIntercom}
            />
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="account-group-outline"
              key="group-work"
              selected={isGroupWorkSelected}
              style={tw`left-[28%] top-[60%]`}
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
              style={tw`left-[32%] top-[22%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="2"
              key="light-2"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[65%] top-[22%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="3"
              key="light-3"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[32%] top-[40%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="4"
              key="light-4"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[65%] top-[40%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="5"
              key="light-5"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[32%] top-[68%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="6"
              key="light-6"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[65%] top-[68%]`}
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
              style={tw`left-[82%] top-1/2`}
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
              style={tw`left-[89%] top-[43%]`}
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
              style={tw`left-[12%] top-[82%] w-1/4 min-w-[6.5rem]`}
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
              style={tw`left-[56%] top-[84%]`}
              onPress={selectPoulaillerKeyBox}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="wifi"
              selected={isWifiSelected}
              style={tw`left-[48%] top-3/4`}
              onPress={selectWifi}
            />

            {user?.capabilities?.includes('STORAGE_KEYS_ACCESS') && (
              <ActionableIcon
                blurTarget={blurTargetRef}
                entering={BounceIn.duration(750).delay(Math.random() * 500)}
                exiting={BounceOut.duration(750)}
                icon="key-chain-variant"
                key="storage-key-box"
                selected={isStorageKeyBoxSelected}
                style={tw`left-1/2 top-[95%]`}
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
              style={tw`left-[56%] top-[32%]`}
              onPress={selectCarbonDioxide}
            />

            <ActionableFan
              active={onPremiseState?.airConditioners?.south?.active}
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              key="air-conditioning-south"
              selected={isAirConditioningSelected}
              style={tw`left-[11%] top-[19%]`}
              onPress={selectAirConditioning}
            />
            <ActionableFan
              active={onPremiseState?.airConditioners?.north?.active}
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              key="air-conditioning-north"
              selected={isAirConditioningSelected}
              style={tw`left-[11%] top-[46%]`}
              onPress={selectAirConditioning}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PoulaillerPlan;
