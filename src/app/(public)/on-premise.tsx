import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import ErrorChip from '@/components/ErrorChip';
import CarbonDioxideBottomSheet from '@/components/OnPremise/CarbonDioxideBottomSheet';
import FlexDeskBottomSheet from '@/components/OnPremise/FlexDeskBottomSheet';
import KeyBoxBottomSheet from '@/components/OnPremise/KeyBoxBottomSheet';
import PhoneBoothBottomSheet from '@/components/OnPremise/PhoneBoothBottomSheet';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerClimateBottomSheet from '@/components/OnPremise/PtiPoulaillerClimateBottomSheet';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import UnlockDeckDoorBottomSheet from '@/components/OnPremise/UnlockDeckDoorBottomSheet';
import { SelectableChip } from '@/components/SelectableChip';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState, OnPremiseFlexDesk } from '@/services/api/services';

const SUPPORTED_LOCATIONS = ['poulailler', 'pti-poulailler'];

const OnPremise = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { location } = useLocalSearchParams<{ location: string }>();
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isPhoneBoothSelected, setPhoneBoothSelected] = useState<boolean>(false);
  const [isKeyBoxSelected, setKeyBoxSelected] = useState<boolean>(false);
  const [isCarbonDioxideSelected, setCarbonDioxideSelected] = useState<boolean>(false);
  const [isPtiPoulaillerClimateSelected, setPtiPoulaillerClimateSelected] =
    useState<boolean>(false);
  const [selectedFlexDesk, setSelectedFlexDesk] = useState<OnPremiseFlexDesk | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'poulailler' | 'pti-poulailler'>(
    (SUPPORTED_LOCATIONS.includes(location) ? location : 'poulailler') as never,
  );

  const {
    data: onPremiseState,
    isPending: isPendingOnPremiseState,
    isFetching: isFetchingOnPremiseState,
    error: onPremiseStateError,
    refetch: refetchOnPremiseState,
  } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: getOnPremiseState,
    retry: false,
  });

  return (
    <>
      <ServiceLayout
        contentStyle={tw`bg-transparent`}
        title={t('onPremise.title')}
        onRefresh={refetchOnPremiseState}>
        <View style={tw`mb-4`}>
          <ScrollView
            contentContainerStyle={tw`flex flex-row items-center gap-4 px-4`}
            horizontal={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={tw`w-full`}>
            <SelectableChip
              label={t('onPremise.location.poulailler')}
              selected={selectedLocation === 'poulailler'}
              onPress={() => setSelectedLocation('poulailler')}
            />
            <SelectableChip
              label={t('onPremise.location.pti-poulailler')}
              selected={selectedLocation === 'pti-poulailler'}
              onPress={() => setSelectedLocation('pti-poulailler')}
            />
          </ScrollView>
        </View>

        {onPremiseStateError && !isSilentError(onPremiseStateError) ? (
          <ErrorChip
            error={onPremiseStateError}
            label={t('onPremise.onFetch.fail')}
            style={tw`mx-4 mb-4 self-start`}
          />
        ) : null}

        {selectedLocation === 'poulailler' && (
          <Animated.View entering={FadeInLeft.duration(350)} exiting={FadeOutLeft.duration(350)}>
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

        {selectedLocation === 'pti-poulailler' && (
          <Animated.View entering={FadeInRight.duration(350)} exiting={FadeOutRight.duration(350)}>
            <PtiPoulaillerPlan
              loading={isFetchingOnPremiseState}
              onClimateSelected={() => setPtiPoulaillerClimateSelected(true)}
              onFlexDeskSelected={(d) => setSelectedFlexDesk(d ?? null)}
              onKeyBoxSelected={() => setKeyBoxSelected(true)}
              onPremiseState={onPremiseState}
            />
          </Animated.View>
        )}
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
