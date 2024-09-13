import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as RNImage, View, useColorScheme } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanDay from '@/assets/images/floorplan-day.png';
import floorPlanNight from '@/assets/images/floorplan-night.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ErrorChip from '@/components/ErrorChip';
import ActionableCarbonDioxide from '@/components/OnPremise/ActionableCarbonDioxide';
import ActionableFan from '@/components/OnPremise/ActionableFan';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import ActionablePhoneBooths from '@/components/OnPremise/ActionablePhoneBooths';
import CarbonDioxideBottomSheet from '@/components/OnPremise/CarbonDioxideBottomSheet';
import KeyBoxBottomSheet from '@/components/OnPremise/KeyBoxBottomSheet';
import PhoneBoothBottomSheet from '@/components/OnPremise/PhoneBoothBottomSheet';
import UnlockDeckDoorBottomSheet from '@/components/OnPremise/UnlockDeckDoorBottomSheet';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { type OnPremiseState, getOnPremiseState } from '@/services/api/services';
import useAuthStore from '@/stores/auth';

const PtiPoulaillerPlan = ({
  onPremiseState,
  loading,
  onKeyBoxSelected,
}: {
  onPremiseState?: OnPremiseState;
  loading?: boolean;
  onKeyBoxSelected: () => void;
}) => {
  useDeviceContext(tw);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);

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
    <View
      style={[
        tw`flex flex-col grow items-center justify-center w-full relative`,
        !!imageWidth && !!imageHeight && { aspectRatio: imageWidth / imageHeight },
      ]}>
      {imageHeight && imageWidth ? (
        <Image
          blurRadius={!hasFloorplanLoaded ? 16 : 0}
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
          {/* <ActionableLight id="1" style={tw`top-[19%] left-[21%]`} />
              <ActionableLight active id="2" style={tw`top-[19%] left-[49%]`} />
              <ActionableLight id="3" style={tw`top-[19%] left-[67%]`} />
              <ActionableLight id="4" style={tw`top-[36%] left-[49%]`} />
              <ActionableLight id="5" style={tw`top-[36%] left-[67%]`} />
              <ActionableLight id="6" style={tw`top-[31%] left-[21%]`} />
              <ActionableLight active id="7" style={tw`top-[42%] left-[21%]`} />
              <ActionableLight id="8" style={tw`top-[58%] left-[25%]`} />
              <ActionableLight id="9" style={tw`top-[70%] left-[25%]`} /> */}

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

          {/* Key box */}
          <ActionableIcon
            activeIcon="key-chain-variant"
            inactiveIcon="key-chain-variant"
            style={tw`top-[84%] left-[56%]`}
            onPress={onKeyBoxSelected}
          />
        </>
      )}
    </View>
  );
};

export default PtiPoulaillerPlan;
