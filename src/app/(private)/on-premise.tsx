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
import ActionablePhoneBooths from '@/components/OnPremise/ActionablePhoneBooths';
import ActionableIcon from '@/components/OnPremise/ActionbleIcon';
import PhoneBoothBottomSheet from '@/components/OnPremise/PhoneBoothBottomSheet';
import UnlockDeckDoorBottomSheet from '@/components/OnPremise/UnlockDeckDoorBottomSheet';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';
import useAuthStore from '@/stores/auth';

const OnPremise = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isBluePhoneBoothSelected, setBluePhoneBoothSelected] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);

  const colorScheme = useColorScheme();

  const backgroundImage = useMemo(() => {
    return colorScheme === 'dark' ? floorPlanNight : floorPlanDay;
  }, [colorScheme]);

  useEffect(() => {
    const { width, height } = RNImage.resolveAssetSource(backgroundImage);
    setImageHeight(height);
    setImageWidth(width);
  }, [backgroundImage]);

  const {
    data: onPremiseState,
    isFetching: isFetchingOnPremiseState,
    error: onPremiseStateError,
  } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: () => getOnPremiseState(),
    retry: false,
    enabled: !!user,
  });

  return (
    <>
      <ServiceLayout contentStyle={tw`bg-transparent`} title={t('onPremise.title')}>
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

          {onPremiseStateError && !isSilentError(onPremiseStateError) ? (
            <ErrorChip
              error={onPremiseStateError}
              label={t('onPremise.onFetch.fail')}
              style={tw`absolute z-10 top-0 left-0 mx-6 my-4`}
            />
          ) : null}

          {!hasFloorplanLoaded ? (
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`absolute h-16 z-10 my-auto bg-gray-200 dark:bg-black rounded-full`}
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
              {/* <ActionableIcon
                active={false}
                activeIcon="lock-open"
                inactiveIcon="lock"
                loading={isFetchingOnPremiseState}
                style={tw`top-[50%] left-[82%]`}
                onPress={() => setDeckDoorSelected(true)}
              /> */}

              {/* Fans */}
              {/* <ActionableFan active id="1" style={tw`top-[16%] left-[5%]`} />
              <ActionableFan id="2" style={tw`top-[43%] left-[5%]`} /> */}

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
                  onPremiseState?.phoneBooths.orange.occupied ?? null,
                  onPremiseState?.phoneBooths.blue.occupied ?? null,
                ]}
                inactiveIcon="door-open"
                loading={isFetchingOnPremiseState}
                style={tw`top-[82%] left-[12%] w-[25%] min-w-26`}
                unknownIcon="door"
                onPress={() => setBluePhoneBoothSelected(true)}
              />
            </>
          )}
        </View>
      </ServiceLayout>

      {isDeckDoorSelected ? (
        <UnlockDeckDoorBottomSheet onClose={() => setDeckDoorSelected(false)} />
      ) : null}

      {isBluePhoneBoothSelected ? (
        <PhoneBoothBottomSheet
          blueOccupied={onPremiseState?.phoneBooths.blue.occupied}
          loading={isFetchingOnPremiseState}
          orangeOccupied={onPremiseState?.phoneBooths.orange.occupied}
          onClose={() => setBluePhoneBoothSelected(false)}
        />
      ) : null}
    </>
  );
};

export default OnPremise;
