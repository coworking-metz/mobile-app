import AirConditioningBottomSheet from './AirConditioningBottomSheet';
import CarbonDioxideBottomSheet from './CarbonDioxideBottomSheet';
import CoffeeMachineBottomSheet from './CoffeeMachineBottomSheet';
import DeckKeyBoxBottomSheet from './DeckKeyBoxBottomSheet';
import FlexDeskBottomSheet from './FlexDeskBottomSheet';
import FridgeBottomSheet from './FridgeBottomSheet';
import GroupWorkBottomSheet from './GroupWorkBottomSheet';
import IntercomBottomSheet from './IntercomBottomSheet';
import MeetingRoomHubBottomSheet from './MeetingRoomHubBottomSheet';
import PhoneBoothBottomSheet from './PhoneBoothBottomSheet';
import PoulaillerKeyBoxBottomSheet from './PoulaillerKeyBoxBottomSheet';
import PrinterBottomSheet from './PrinterBottomSheet';
import PtiPoulaillerClimateBottomSheet from './PtiPoulaillerClimateBottomSheet';
import PtiPoulaillerKeyBoxBottomSheet from './PtiPoulaillerKeyBoxBottomSheet';
import StorageKeyBoxBottomSheet from './StorageKeyBoxBottomSheet';
import TelevisionBottomSheet from './TelevisionBottomSheet';
import UnlockDeckDoorBottomSheet from './UnlockDeckDoorBottomSheet';
import WifiBottomSheet from './WifiBottomSheet';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { getOnPremiseState, OnPremiseFlexDesk } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

type SelectedFlexDesk = OnPremiseFlexDesk & { id: string };

const OnPremiseContext = createContext<{
  isDeckDoorSelected: boolean;
  selectDeckDoor: () => void;
  isPhoneBoothSelected: boolean;
  selectPhoneBooth: () => void;
  isPoulaillerKeyBoxSelected: boolean;
  selectPoulaillerKeyBox: () => void;
  isStorageKeyBoxSelected: boolean;
  selectStorageKeyBox: () => void;
  isDeckKeyBoxSelected: boolean;
  selectDeckKeyBox: () => void;
  isCarbonDioxideSelected: boolean;
  selectCarbonDioxide: () => void;
  isPtiPoulaillerKeyBoxSelected: boolean;
  selectPtiPoulaillerKeyBox: () => void;
  isPtiPoulaillerClimateSelected: boolean;
  selectPtiPoulaillerClimate: () => void;
  selectedFlexDesk: SelectedFlexDesk | null;
  selectFlexDesk: (desk?: SelectedFlexDesk) => void;
  isTelevisionSelected?: boolean;
  selectTelevision?: () => void;
  isCoffeeMachineSelected?: boolean;
  selectCoffeeMachine?: () => void;
  isPrinterSelected?: boolean;
  selectPrinter?: () => void;
  isFridgeSelected?: boolean;
  selectFridge?: () => void;
  isAirConditioningSelected?: boolean;
  selectAirConditioning?: () => void;
  isWifiSelected?: boolean;
  selectWifi?: () => void;
  isIntercomSelected?: boolean;
  selectIntercom?: () => void;
  isGroupWorkSelected?: boolean;
  selectGroupWork?: () => void;
  isMeetingRoomHubSelected?: boolean;
  selectMeetingRoomHub?: () => void;
}>({
  isDeckDoorSelected: false,
  selectDeckDoor: () => {},
  isPhoneBoothSelected: false,
  selectPhoneBooth: () => {},
  isPoulaillerKeyBoxSelected: false,
  selectPoulaillerKeyBox: () => {},
  isStorageKeyBoxSelected: false,
  selectStorageKeyBox: () => {},
  isDeckKeyBoxSelected: false,
  selectDeckKeyBox: () => {},
  isCarbonDioxideSelected: false,
  selectCarbonDioxide: () => {},
  isPtiPoulaillerKeyBoxSelected: false,
  selectPtiPoulaillerKeyBox: () => {},
  isPtiPoulaillerClimateSelected: false,
  selectPtiPoulaillerClimate: () => {},
  selectedFlexDesk: null,
  selectFlexDesk: (_desk?: OnPremiseFlexDesk) => {},
  isTelevisionSelected: false,
  selectTelevision: () => {},
  isCoffeeMachineSelected: false,
  selectCoffeeMachine: () => {},
  isPrinterSelected: false,
  selectPrinter: () => {},
  isFridgeSelected: false,
  selectFridge: () => {},
  isAirConditioningSelected: false,
  selectAirConditioning: () => {},
  isWifiSelected: false,
  selectWifi: () => {},
  isIntercomSelected: false,
  selectIntercom: () => {},
  isGroupWorkSelected: false,
  selectGroupWork: () => {},
  isMeetingRoomHubSelected: false,
  selectMeetingRoomHub: () => {},
});

export const useOnPremise = () => {
  return useContext(OnPremiseContext);
};

export const OnPremiseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDeckDoorSelected, setDeckDoorSelected] = useState<boolean>(false);
  const [isPhoneBoothSelected, setPhoneBoothSelected] = useState<boolean>(false);
  const [isPoulaillerKeyBoxSelected, setPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const [isStorageKeyBoxSelected, setStorageKeyBoxSelected] = useState<boolean>(false);
  const [isDeckKeyBoxSelected, setDeckKeyBoxSelected] = useState<boolean>(false);
  const [isCarbonDioxideSelected, setCarbonDioxideSelected] = useState<boolean>(false);
  const [isPtiPoulaillerKeyBoxSelected, setPtiPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const [isPtiPoulaillerClimateSelected, setPtiPoulaillerClimateSelected] =
    useState<boolean>(false);
  const [selectedFlexDesk, setSelectedFlexDesk] = useState<SelectedFlexDesk | null>(null);

  const [isTelevisionSelected, setTelevisionSelected] = useState<boolean>(false);
  const [isCoffeeMachineSelected, setCoffeeMachineSelected] = useState<boolean>(false);
  const [isPrinterSelected, setPrinterSelected] = useState<boolean>(false);
  const [isFridgeSelected, setFridgeSelected] = useState<boolean>(false);
  const [isAirConditioningSelected, setAirConditioningSelected] = useState<boolean>(false);
  const [isWifiSelected, setWifiSelected] = useState<boolean>(false);
  const [isIntercomSelected, setIntercomSelected] = useState<boolean>(false);
  const [isGroupWorkSelected, setGroupWorkSelected] = useState<boolean>(false);
  const [isMeetingRoomHubSelected, setMeetingRoomHubSelected] = useState<boolean>(false);

  const { data: onPremiseState, isFetching: isFetchingOnPremiseState } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  return (
    <OnPremiseContext.Provider
      value={{
        isDeckDoorSelected,
        selectDeckDoor: () => setDeckDoorSelected(true),
        isPhoneBoothSelected,
        selectPhoneBooth: () => setPhoneBoothSelected(true),
        isPoulaillerKeyBoxSelected,
        selectPoulaillerKeyBox: () => setPoulaillerKeyBoxSelected(true),
        isStorageKeyBoxSelected,
        selectStorageKeyBox: () => setStorageKeyBoxSelected(true),
        isDeckKeyBoxSelected,
        selectDeckKeyBox: () => setDeckKeyBoxSelected(true),
        isCarbonDioxideSelected,
        selectCarbonDioxide: () => setCarbonDioxideSelected(true),
        isPtiPoulaillerKeyBoxSelected,
        selectPtiPoulaillerKeyBox: () => setPtiPoulaillerKeyBoxSelected(true),
        isPtiPoulaillerClimateSelected,
        selectPtiPoulaillerClimate: () => setPtiPoulaillerClimateSelected(true),
        selectedFlexDesk,
        selectFlexDesk: (desk?: SelectedFlexDesk) => setSelectedFlexDesk(desk || null),
        isTelevisionSelected,
        selectTelevision: () => setTelevisionSelected(true),
        isCoffeeMachineSelected,
        selectCoffeeMachine: () => setCoffeeMachineSelected(true),
        isPrinterSelected,
        selectPrinter: () => setPrinterSelected(true),
        isFridgeSelected,
        selectFridge: () => setFridgeSelected(true),
        isAirConditioningSelected,
        selectAirConditioning: () => setAirConditioningSelected(true),
        isWifiSelected,
        selectWifi: () => setWifiSelected(true),
        isIntercomSelected,
        selectIntercom: () => setIntercomSelected(true),
        isGroupWorkSelected,
        selectGroupWork: () => setGroupWorkSelected(true),
        isMeetingRoomHubSelected,
        selectMeetingRoomHub: () => setMeetingRoomHubSelected(true),
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

      {isStorageKeyBoxSelected && (
        <StorageKeyBoxBottomSheet onClose={() => setStorageKeyBoxSelected(false)} />
      )}

      {isPtiPoulaillerKeyBoxSelected && (
        <PtiPoulaillerKeyBoxBottomSheet onClose={() => setPtiPoulaillerKeyBoxSelected(false)} />
      )}

      {isDeckKeyBoxSelected && (
        <DeckKeyBoxBottomSheet onClose={() => setDeckKeyBoxSelected(false)} />
      )}

      {isCarbonDioxideSelected && (
        <CarbonDioxideBottomSheet
          humidityLevel={onPremiseState?.sensors?.humidity.level}
          level={onPremiseState?.sensors?.carbonDioxide.level}
          loading={isFetchingOnPremiseState}
          noiseLevel={onPremiseState?.sensors?.noise.level}
          temperatureLevel={onPremiseState?.sensors?.temperature.level}
          onClose={() => setCarbonDioxideSelected(false)}
        />
      )}

      {isPtiPoulaillerClimateSelected && (
        <PtiPoulaillerClimateBottomSheet
          humidityLevel={onPremiseState?.sensors?.humidity.ptiPoulaillerLevel}
          loading={isFetchingOnPremiseState}
          temperatureLevel={onPremiseState?.sensors?.temperature.ptiPoulaillerLevel}
          onClose={() => setPtiPoulaillerClimateSelected(false)}
        />
      )}

      {!!selectedFlexDesk && (
        <FlexDeskBottomSheet
          occupied={selectedFlexDesk?.occupied}
          onClose={() => setSelectedFlexDesk(null)}
        />
      )}

      {isTelevisionSelected && (
        <TelevisionBottomSheet onClose={() => setTelevisionSelected(false)} />
      )}
      {isCoffeeMachineSelected && (
        <CoffeeMachineBottomSheet onClose={() => setCoffeeMachineSelected(false)} />
      )}
      {isPrinterSelected && <PrinterBottomSheet onClose={() => setPrinterSelected(false)} />}
      {isFridgeSelected && <FridgeBottomSheet onClose={() => setFridgeSelected(false)} />}
      {isAirConditioningSelected && (
        <AirConditioningBottomSheet onClose={() => setAirConditioningSelected(false)} />
      )}
      {isWifiSelected && <WifiBottomSheet onClose={() => setWifiSelected(false)} />}
      {isIntercomSelected && <IntercomBottomSheet onClose={() => setIntercomSelected(false)} />}
      {isGroupWorkSelected && <GroupWorkBottomSheet onClose={() => setGroupWorkSelected(false)} />}
      {isMeetingRoomHubSelected && (
        <MeetingRoomHubBottomSheet onClose={() => setMeetingRoomHubSelected(false)} />
      )}
    </OnPremiseContext.Provider>
  );
};
