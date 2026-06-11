import ActionableLight from './ActionableLight';
import { useOnPremise } from './OnPremiseContext';
import { useQuery } from '@tanstack/react-query';
import { BlurTargetView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeOut } from 'react-native-reanimated';
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
  const blurTargetRef = useRef<View | null>(null);
  const {
    selectFlexDesk,
    selectPtiPoulaillerKeyBox,
    selectPtiPoulaillerClimate,
    selectWifi,
    selectTelevision,
    selectMeetingRoomHub,
    selectSoundOff,
    isWifiSelected,
    isTelevisionSelected,
    isMeetingRoomHubSelected,
    isSoundOffSelected,
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
    <View style={[tw`flex grow flex-col items-start`, style]}>
      <View style={tw`mx-6 mb-4 flex w-full flex-row items-end gap-3`}>
        <AppText
          numberOfLines={2}
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.location.pti-poulailler')}
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
        </BlurTargetView>

        {isFetchingOnPremiseState && (
          <LoadingProgressBar style={tw`absolute inset-x-0 top-0 z-10`} />
        )}

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
              style={tw`left-1/2 top-[40%]`}
              onPress={selectSoundOff}
            />

            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="television-guide"
              selected={isTelevisionSelected}
              style={tw`left-1/2 top-[71%]`}
              onPress={selectTelevision}
            />
          </>
        ) : withLights ? (
          <>
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="1"
              key="light-1"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[32%] top-[32%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="2"
              key="light-2"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[65%] top-[32%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="5"
              key="light-5"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[32%] top-[65%]`}
            />
            <ActionableLight
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              id="6"
              key="light-6"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              style={tw`left-[65%] top-[65%]`}
            />
          </>
        ) : (
          <>
            {/* Flexispot A */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.a.occupied}
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="desk"
              key="flex-desk-a"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              selected={selectedFlexDesk?.id === 'a'}
              style={tw`left-[43%] top-1/4`}
              onPress={() =>
                selectFlexDesk?.({ id: 'a', occupied: onPremiseState?.flexDesks?.a.occupied })
              }
            />
            {/* Flexispot B */}
            <ActionableIcon
              active={onPremiseState?.flexDesks?.b.occupied}
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="desk"
              key="flex-desk-b"
              loading={isFetchingOnPremiseState}
              pending={isPendingOnPremiseState}
              selected={selectedFlexDesk?.id === 'b'}
              style={tw`left-[30%] top-1/4`}
              onPress={() =>
                selectFlexDesk({ id: 'b', occupied: onPremiseState?.flexDesks?.b.occupied })
              }
            />
            {/* Wifi */}
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="wifi"
              selected={isWifiSelected}
              style={tw`left-[17%] top-[73%]`}
              onPress={selectWifi}
            />
            {/* Key box */}
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="key-chain-variant"
              key="key-box"
              style={tw`left-[30%] top-[82%]`}
              onPress={selectPtiPoulaillerKeyBox}
            />
            {/* Climate */}
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="sun-thermometer"
              key="climate"
              loading={isPendingOnPremiseState}
              style={tw`left-[45%] top-[68%]`}
              onPress={selectPtiPoulaillerClimate}
            />
            {/* Hub key box */}
            <ActionableIcon
              blurTarget={blurTargetRef}
              entering={BounceIn.duration(750).delay(Math.random() * 500)}
              exiting={BounceOut.duration(750)}
              icon="key-chain-variant"
              key="hub-key-box"
              selected={isMeetingRoomHubSelected}
              style={tw`left-[7%] top-[32%]`}
              onPress={selectMeetingRoomHub}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PtiPoulaillerPlan;
