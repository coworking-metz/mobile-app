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
import KeyBoxBottomSheet from '@/components/OnPremise/KeyBoxBottomSheet';
import PhoneBoothBottomSheet from '@/components/OnPremise/PhoneBoothBottomSheet';
import PoulaillerPlan from '@/components/OnPremise/PoulaillerPlan';
import PtiPoulaillerPlan from '@/components/OnPremise/PtiPoulaillerPlan';
import UnlockDeckDoorBottomSheet from '@/components/OnPremise/UnlockDeckDoorBottomSheet';
import { SelectableChip } from '@/components/SelectableChip';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState } from '@/services/api/services';
import useAuthStore from '@/stores/auth';

const OnPremise = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { location } = useLocalSearchParams<{ location: string }>();
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isPhoneBoothSelected, setPhoneBoothSelected] = useState<boolean>(false);
  const [isKeyBoxSelected, setKeyBoxSelected] = useState<boolean>(false);
  const [isCarbonDioxideSelected, setCarbonDioxideSelected] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'poulailler' | 'pti-poulailler'>(
    (location || 'poulailler') as never,
  );

  const {
    data: onPremiseState,
    isFetching: isFetchingOnPremiseState,
    error: onPremiseStateError,
    refetch: refetchOnPremiseState,
  } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: getOnPremiseState,
    retry: false,
    enabled: !!user,
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
            />
          </Animated.View>
        )}

        {selectedLocation === 'pti-poulailler' && (
          <Animated.View entering={FadeInRight.duration(350)} exiting={FadeOutRight.duration(350)}>
            <PtiPoulaillerPlan onKeyBoxSelected={() => setKeyBoxSelected(true)} />
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
          level={onPremiseState?.sensors?.carbonDioxide.level || 0}
          loading={isFetchingOnPremiseState}
          onClose={() => setCarbonDioxideSelected(false)}
        />
      )}
    </>
  );
};

export default OnPremise;
