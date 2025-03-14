import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { Image as RNImage, View, useColorScheme } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import floorPlanDay from '@/assets/images/floorplan-day.png';
import floorPlanNight from '@/assets/images/floorplan-night.png';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ActionableCarbonDioxide from '@/components/OnPremise/ActionableCarbonDioxide';
import ActionableIcon from '@/components/OnPremise/ActionableIcon';
import ActionablePhoneBooths from '@/components/OnPremise/ActionablePhoneBooths';
import { type OnPremiseState } from '@/services/api/services';

const PoulaillerPlan = ({
  onPremiseState,
  loading,
  onDeckDoorSelected,
  onPhoneBoothSelected,
  onKeyBoxSelected,
  onCarbonDioxideSelected,
}: {
  onPremiseState?: OnPremiseState;
  loading?: boolean;
  onDeckDoorSelected: () => void;
  onPhoneBoothSelected: () => void;
  onKeyBoxSelected: () => void;
  onCarbonDioxideSelected: () => void;
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

          {/* Door */}
          <ActionableIcon
            active={onPremiseState?.deckDoor?.unlocked}
            activeIcon="lock-open"
            inactiveIcon="lock"
            loading={loading}
            style={tw`top-[50%] left-[82%]`}
            onPress={onDeckDoorSelected}
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
            loading={loading}
            style={tw`top-[82%] left-[12%] w-[25%] min-w-26`}
            unknownIcon="door"
            onPress={onPhoneBoothSelected}
          />

          {/* Key box */}
          <ActionableIcon
            activeIcon="key-chain-variant"
            inactiveIcon="key-chain-variant"
            style={tw`top-[84%] left-[56%]`}
            onPress={onKeyBoxSelected}
          />

          {/* Carbon Dioxide level */}
          <ActionableCarbonDioxide
            activeIcon="leaf"
            inactiveIcon="leaf"
            level={onPremiseState?.sensors?.carbonDioxide.level || 0}
            loading={loading}
            style={tw`top-[32%] left-[56%]`}
            onPress={onCarbonDioxideSelected}
          />
        </>
      )}
    </View>
  );
};

export default PoulaillerPlan;
