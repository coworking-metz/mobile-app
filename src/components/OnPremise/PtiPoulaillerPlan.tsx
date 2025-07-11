import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { Image as RNImage, View, useColorScheme } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanPtiPoulaillerDay from '@/assets/images/floorplan-pti-poulailler-day.png';
import floorPlanPtiPoulaillerNight from '@/assets/images/floorplan-pti-poulailler-night.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import { OnPremiseFlexDesk, type OnPremiseState } from '@/services/api/services';

const PtiPoulaillerPlan = ({
  loading,
  onPremiseState,
  onPtiPoulaillerKeyBoxSelected,
  onClimateSelected,
  onFlexDeskSelected,
}: {
  onPremiseState?: OnPremiseState;
  loading?: boolean;
  onPtiPoulaillerKeyBoxSelected: () => void;
  onClimateSelected: () => void;
  onFlexDeskSelected?: (desk?: OnPremiseFlexDesk) => void;
}) => {
  useDeviceContext(tw);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);

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
    <View
      style={[
        tw`flex flex-col items-center justify-center w-full relative`,
        !!imageWidth && !!imageHeight && { aspectRatio: imageWidth / imageHeight },
      ]}>
      {imageHeight && imageWidth ? (
        <Image
          blurRadius={!hasFloorplanLoaded ? 16 : 0}
          cachePolicy="memory-disk"
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
            loading={loading}
            style={tw`top-[25%] left-[43%]`}
            onPress={() =>
              onFlexDeskSelected?.({ occupied: onPremiseState?.flexDesks?.a.occupied })
            }
          />
          {/* Flexispot B */}
          <ActionableIcon
            active={onPremiseState?.flexDesks?.b.occupied}
            activeIcon="desk"
            inactiveIcon="desk"
            loading={loading}
            style={tw`top-[25%] left-[30%]`}
            onPress={() =>
              onFlexDeskSelected?.({ occupied: onPremiseState?.flexDesks?.b.occupied })
            }
          />
          {/* Key box */}
          <ActionableIcon
            activeIcon="key-chain-variant"
            inactiveIcon="key-chain-variant"
            style={tw`top-[82%] left-[22%]`}
            onPress={onPtiPoulaillerKeyBoxSelected}
          />
          {/* Climate */}
          <ActionableIcon
            activeIcon="leaf"
            inactiveIcon="leaf"
            loading={loading}
            style={tw`top-[68%] left-[45%]`}
            onPress={onClimateSelected}
          />
        </>
      )}
    </View>
  );
};

export default PtiPoulaillerPlan;
