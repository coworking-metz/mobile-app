import CarbonDioxideBottomSheet from './CarbonDioxideBottomSheet';
import DeckKeyBoxBottomSheet from './DeckKeyBoxBottomSheet';
import FlexDeskBottomSheet from './FlexDeskBottomSheet';
import PhoneBoothBottomSheet from './PhoneBoothBottomSheet';
import PoulaillerKeyBoxBottomSheet from './PoulaillerKeyBoxBottomSheet';
import PtiPoulaillerClimateBottomSheet from './PtiPoulaillerClimateBottomSheet';
import PtiPoulaillerKeyBoxBottomSheet from './PtiPoulaillerKeyBoxBottomSheet';
import UnlockDeckDoorBottomSheet from './UnlockDeckDoorBottomSheet';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import { getOnPremiseState, OnPremiseFlexDesk } from '@/services/api/services';

const OnPremiseContext = createContext<{
  selectDeckDoor: () => void;
  selectPhoneBooth: () => void;
  selectPoulaillerKeyBox: () => void;
  selectDeckKeyBox: () => void;
  selectCarbonDioxide: () => void;
  selectPtiPoulaillerKeyBox: () => void;
  selectPtiPoulaillerClimate: () => void;
  selectFlexDesk: (desk?: OnPremiseFlexDesk) => void;
}>({
  selectDeckDoor: () => { },
  selectPhoneBooth: () => { },
  selectPoulaillerKeyBox: () => { },
  selectDeckKeyBox: () => { },
  selectCarbonDioxide: () => { },
  selectPtiPoulaillerKeyBox: () => { },
  selectPtiPoulaillerClimate: () => { },
  selectFlexDesk: (_desk?: OnPremiseFlexDesk) => { },
});

export const useOnPremise = () => {
  return useContext(OnPremiseContext);
};

export const OnPremiseProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isPhoneBoothSelected, setPhoneBoothSelected] = useState<boolean>(false);
  const [isPoulaillerKeyBoxSelected, setPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const [isDeckKeyBoxSelected, setDeckKeyBoxSelected] = useState<boolean>(false);
  const [isCarbonDioxideSelected, setCarbonDioxideSelected] = useState<boolean>(false);
  const [isPtiPoulaillerKeyBoxSelected, setPtiPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const [isPtiPoulaillerClimateSelected, setPtiPoulaillerClimateSelected] =
    useState<boolean>(false);
  const [selectedFlexDesk, setSelectedFlexDesk] = useState<OnPremiseFlexDesk | null>(null);

  const { data: onPremiseState, isFetching: isFetchingOnPremiseState } = useQuery({
    queryKey: ['on-premise-state'],
    queryFn: getOnPremiseState,
    retry: false,
  });

  return (
    <OnPremiseContext.Provider
      value={{
        selectDeckDoor: () => setDeckDoorSelected(true),
        selectPhoneBooth: () => setPhoneBoothSelected(true),
        selectPoulaillerKeyBox: () => setPoulaillerKeyBoxSelected(true),
        selectDeckKeyBox: () => setDeckKeyBoxSelected(true),
        selectCarbonDioxide: () => setCarbonDioxideSelected(true),
        selectPtiPoulaillerKeyBox: () => setPtiPoulaillerKeyBoxSelected(true),
        selectPtiPoulaillerClimate: () => setPtiPoulaillerClimateSelected(true),
        selectFlexDesk: (desk?: OnPremiseFlexDesk) => setSelectedFlexDesk(desk || null),
      }}>
      {children}
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

      {isPoulaillerKeyBoxSelected && (
        <PoulaillerKeyBoxBottomSheet onClose={() => setPoulaillerKeyBoxSelected(false)} />
      )}

      {isPtiPoulaillerKeyBoxSelected && (
        <PtiPoulaillerKeyBoxBottomSheet onClose={() => setPtiPoulaillerKeyBoxSelected(false)} />
      )}

      {isDeckKeyBoxSelected && (
        <DeckKeyBoxBottomSheet onClose={() => setDeckKeyBoxSelected(false)} />
      )}

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
    </OnPremiseContext.Provider>
  );
};
