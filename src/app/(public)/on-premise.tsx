import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { uniq } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import BouncingBallOnDeskAnimation from '@/components/Animations/BouncingBallOnDeskAnimation';
import AppText from '@/components/AppText';
import ErrorChip from '@/components/ErrorChip';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import CarbonDioxideBottomSheet from '@/components/OnPremise/CarbonDioxideBottomSheet';
import FlexDeskBottomSheet from '@/components/OnPremise/FlexDeskBottomSheet';
import KeyBoxBottomSheet from '@/components/OnPremise/KeyBoxBottomSheet';
import PhoneBoothBottomSheet from '@/components/OnPremise/PhoneBoothBottomSheet';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerClimateBottomSheet from '@/components/OnPremise/PtiPoulaillerClimateBottomSheet';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import UnlockDeckDoorBottomSheet from '@/components/OnPremise/UnlockDeckDoorBottomSheet';
import { SelectableChip } from '@/components/SelectableChip';
import { isSilentError } from '@/helpers/error';
import useAppScreen from '@/helpers/screen';
import { getOnPremiseState, OnPremiseFlexDesk } from '@/services/api/services';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];
type SupportedLocation = (typeof SUPPORTED_LOCATIONS)[number];

const OnPremise = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { isWide } = useAppScreen();
  const { location } = useLocalSearchParams<{ location: string }>();
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isPhoneBoothSelected, setPhoneBoothSelected] = useState<boolean>(false);
  const [isKeyBoxSelected, setKeyBoxSelected] = useState<boolean>(false);
  const [isCarbonDioxideSelected, setCarbonDioxideSelected] = useState<boolean>(false);
  const [isPtiPoulaillerClimateSelected, setPtiPoulaillerClimateSelected] =
    useState<boolean>(false);
  const [selectedFlexDesk, setSelectedFlexDesk] = useState<OnPremiseFlexDesk | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<SupportedLocation[]>([]);

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

  const toggleLocation = useCallback(
    (toggledLocation: SupportedLocation) => {
      if (isWide) {
        if (selectedLocations.includes(toggledLocation)) {
          setSelectedLocations((prev) => prev.filter((l) => l !== toggledLocation));
        } else if (SUPPORTED_LOCATIONS.includes(toggledLocation)) {
          setSelectedLocations((prev) => uniq([...prev, toggledLocation]) as SupportedLocation[]);
        }
      } else if (SUPPORTED_LOCATIONS.includes(toggledLocation)) {
        setSelectedLocations([toggledLocation]);
      }
    },
    [selectedLocations, isWide],
  );

  useEffect(() => {
    if (!isWide) {
      toggleLocation(location || 'poulailler');
    } else {
      setSelectedLocations(SUPPORTED_LOCATIONS);
    }
  }, [location, isWide]);

  return (
    <>
      <ServiceLayout
        contentStyle={tw`bg-transparent pb-0 flex flex-col grow`}
        title={t('onPremise.title')}
        onRefresh={refetchOnPremiseState}>
        {onPremiseStateError && !isSilentError(onPremiseStateError) ? (
          <ErrorChip
            error={onPremiseStateError}
            label={t('onPremise.onFetch.fail')}
            style={tw`mx-6 mb-4 self-start`}
          />
        ) : null}

        <View style={tw`mb-4`}>
          <ScrollView
            contentContainerStyle={tw`flex flex-row items-center gap-4 px-4`}
            horizontal={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={tw`w-full`}>
            <SelectableChip
              label={t('onPremise.location.poulailler')}
              selected={selectedLocations.includes('poulailler')}
              onPress={() => toggleLocation('poulailler')}
            />
            <SelectableChip
              label={t('onPremise.location.pti-poulailler')}
              selected={selectedLocations.includes('pti-poulailler')}
              onPress={() => toggleLocation('pti-poulailler')}
            />
          </ScrollView>
        </View>

        <View style={tw`w-full grow overflow-hidden`}>
          {selectedLocations.length ? (
            <ScrollView
              contentContainerStyle={[
                isWide ? tw`flex flex-row items-start gap-4 px-4` : tw`w-full`,
              ]}
              horizontal={true}
              scrollEnabled={isWide}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={[tw`grow`]}>
              {selectedLocations.includes('poulailler') && (
                <Animated.View
                  entering={FadeInLeft.duration(350)}
                  exiting={FadeOutLeft.duration(350)}
                  style={[tw`w-full`, isWide && tw`max-w-md`]}>
                  <PoulaillerPlan
                    loading={isFetchingOnPremiseState}
                    onCarbonDioxideSelected={() => setCarbonDioxideSelected(true)}
                    onDeckDoorSelected={() => setDeckDoorSelected(true)}
                    onKeyBoxSelected={() => setKeyBoxSelected(true)}
                    onPhoneBoothSelected={() => setPhoneBoothSelected(true)}
                    onPremiseState={onPremiseState}
                  />
                </Animated.View>
              )}

              {selectedLocations.includes('pti-poulailler') && (
                <Animated.View
                  entering={FadeInRight.duration(350)}
                  exiting={FadeOutRight.duration(350)}
                  style={[tw`w-full`, isWide && tw`max-w-md`]}>
                  <PtiPoulaillerPlan
                    loading={isFetchingOnPremiseState}
                    onClimateSelected={() => setPtiPoulaillerClimateSelected(true)}
                    onFlexDeskSelected={(d) => setSelectedFlexDesk(d ?? null)}
                    onKeyBoxSelected={() => setKeyBoxSelected(true)}
                    onPremiseState={onPremiseState}
                  />
                </Animated.View>
              )}
            </ScrollView>
          ) : (
            <Animated.View
              style={tw`flex flex-col gap-2 grow items-center w-full px-6 max-w-md self-center`}>
              <BouncingBallOnDeskAnimation style={tw`h-48 w-full`} />
              <AppText
                numberOfLines={1}
                style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('onPremise.empty.title')}
              </AppText>
              <AppText
                style={tw`text-base text-center font-normal text-slate-500 dark:text-slate-400 mb-auto`}>
                {t('onPremise.empty.description')}
              </AppText>
            </Animated.View>
          )}
        </View>
      </ServiceLayout>

      {isDeckDoorSelected && (
        <UnlockDeckDoorBottomSheet onClose={() => setDeckDoorSelected(false)} />
      )}

      {isPhoneBoothSelected && (
        <PhoneBoothBottomSheet
          blueOccupied={onPremiseState?.phoneBooths.blue.occupied}
          loading={isFetchingOnPremiseState}
          orangeOccupied={onPremiseState?.phoneBooths.orange.occupied}
          onClose={() => setPhoneBoothSelected(false)}
        />
      )}

      {isKeyBoxSelected && <KeyBoxBottomSheet onClose={() => setKeyBoxSelected(false)} />}

      {isCarbonDioxideSelected && (
        <CarbonDioxideBottomSheet
          humidityLevel={onPremiseState?.sensors?.humidity.level || 0}
          level={onPremiseState?.sensors?.carbonDioxide.level || 0}
          loading={isFetchingOnPremiseState}
          noiseLevel={onPremiseState?.sensors?.noise.level || 0}
          temperatureLevel={onPremiseState?.sensors?.temperature.level || 0}
          onClose={() => setCarbonDioxideSelected(false)}
        />
      )}

      {isPtiPoulaillerClimateSelected && (
        <PtiPoulaillerClimateBottomSheet
          humidityLevel={onPremiseState?.sensors?.humidity.ptiPoulaillerLevel || 0}
          loading={isFetchingOnPremiseState}
          temperatureLevel={onPremiseState?.sensors?.temperature.ptiPoulaillerLevel || 0}
          onClose={() => setPtiPoulaillerClimateSelected(false)}
        />
      )}

      {!!selectedFlexDesk && (
        <FlexDeskBottomSheet
          occupied={selectedFlexDesk?.occupied}
          onClose={() => setSelectedFlexDesk(null)}
        />
      )}
    </>
  );
};

export default OnPremise;
