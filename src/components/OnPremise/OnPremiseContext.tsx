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
import SoundOffBottomSheet from './SoundOffBottomSheet';
import StorageKeyBoxBottomSheet from './StorageKeyBoxBottomSheet';
import TelevisionBottomSheet from './TelevisionBottomSheet';
import UnlockDeckDoorBottomSheet from './UnlockDeckDoorBottomSheet';
import WifiBottomSheet from './WifiBottomSheet';
import { AppBottomSheetRef } from '../AppBottomSheet';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useRef, useState } from 'react';
import {
  getOnPremiseState,
  OnPremiseAirConditioner,
  OnPremiseFlexDesk,
} from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

type SelectedFlexDesk = OnPremiseFlexDesk & { id: string };
type SelectedAirConditioner = OnPremiseAirConditioner & { id: 'north' | 'south' };

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
  selectedAirConditioner: SelectedAirConditioner | null;
  selectAirConditioner: (airConditioner?: SelectedAirConditioner) => void;
  isWifiSelected?: boolean;
  selectWifi?: () => void;
  isIntercomSelected?: boolean;
  selectIntercom?: () => void;
  isGroupWorkSelected?: boolean;
  selectGroupWork?: () => void;
  isMeetingRoomHubSelected?: boolean;
  selectMeetingRoomHub?: () => void;
  isSoundOffSelected?: boolean;
  selectSoundOff?: () => void;
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
  selectedAirConditioner: null,
  selectAirConditioner: (_airConditioner?: SelectedAirConditioner) => {},
  isWifiSelected: false,
  selectWifi: () => {},
  isIntercomSelected: false,
  selectIntercom: () => {},
  isGroupWorkSelected: false,
  selectGroupWork: () => {},
  isMeetingRoomHubSelected: false,
  selectMeetingRoomHub: () => {},
  isSoundOffSelected: false,
  selectSoundOff: () => {},
});

export const useOnPremise = () => {
  return useContext(OnPremiseContext);
};

export const OnPremiseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDeckDoorSelected] = useState<boolean>(false);
  const deckDoorBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPhoneBoothSelected] = useState<boolean>(false);
  const phoneBoothBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const poulaillerKeyBoxBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isStorageKeyBoxSelected] = useState<boolean>(false);
  const storageKeyBoxBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isDeckKeyBoxSelected] = useState<boolean>(false);
  const deckKeyBoxBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isCarbonDioxideSelected] = useState<boolean>(false);
  const carbonDioxideBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPtiPoulaillerKeyBoxSelected] = useState<boolean>(false);
  const ptiPoulaillerKeyBoxBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPtiPoulaillerClimateSelected] = useState<boolean>(false);
  const ptiPoulaillerClimateBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [selectedFlexDesk, setSelectedFlexDesk] = useState<SelectedFlexDesk | null>(null);
  const flexDeskBottomSheetRef = useRef<AppBottomSheetRef>(null);

  const [isTelevisionSelected] = useState<boolean>(false);
  const televisionBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isCoffeeMachineSelected] = useState<boolean>(false);
  const coffeeMachineBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPrinterSelected] = useState<boolean>(false);
  const printerBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isFridgeSelected] = useState<boolean>(false);
  const fridgeBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [selectedAirConditioner, setSelectedAirConditioner] =
    useState<SelectedAirConditioner | null>(null);
  const airConditioningBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isWifiSelected] = useState<boolean>(false);
  const wifiBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isIntercomSelected] = useState<boolean>(false);
  const intercomBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isGroupWorkSelected] = useState<boolean>(false);
  const groupWorkBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isMeetingRoomHubSelected] = useState<boolean>(false);
  const meetingRoomHubBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isSoundOffSelected] = useState<boolean>(false);
  const soundOffBottomSheetRef = useRef<AppBottomSheetRef>(null);

  const { data: onPremiseState, isFetching: isFetchingOnPremiseState } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  return (
    <OnPremiseContext.Provider
      value={{
        isDeckDoorSelected,
        selectDeckDoor: () => deckDoorBottomSheetRef.current?.open(),
        isPhoneBoothSelected,
        selectPhoneBooth: () => phoneBoothBottomSheetRef.current?.open(),
        isPoulaillerKeyBoxSelected,
        selectPoulaillerKeyBox: () => poulaillerKeyBoxBottomSheetRef.current?.open(),
        isStorageKeyBoxSelected,
        selectStorageKeyBox: () => storageKeyBoxBottomSheetRef.current?.open(),
        isDeckKeyBoxSelected,
        selectDeckKeyBox: () => deckKeyBoxBottomSheetRef.current?.open(),
        isCarbonDioxideSelected,
        selectCarbonDioxide: () => carbonDioxideBottomSheetRef.current?.open(),
        isPtiPoulaillerKeyBoxSelected,
        selectPtiPoulaillerKeyBox: () => ptiPoulaillerKeyBoxBottomSheetRef.current?.open(),
        isPtiPoulaillerClimateSelected,
        selectPtiPoulaillerClimate: () => ptiPoulaillerClimateBottomSheetRef.current?.open(),
        selectedFlexDesk,
        selectFlexDesk: (desk?: SelectedFlexDesk) => {
          setSelectedFlexDesk(desk || null);
          flexDeskBottomSheetRef.current?.open();
        },
        isTelevisionSelected,
        selectTelevision: () => televisionBottomSheetRef.current?.open(),
        isCoffeeMachineSelected,
        selectCoffeeMachine: () => coffeeMachineBottomSheetRef.current?.open(),
        isPrinterSelected,
        selectPrinter: () => printerBottomSheetRef.current?.open(),
        isFridgeSelected,
        selectFridge: () => fridgeBottomSheetRef.current?.open(),
        selectedAirConditioner,
        selectAirConditioner: (airConditioner?: SelectedAirConditioner) => {
          setSelectedAirConditioner(airConditioner || null);
          airConditioningBottomSheetRef.current?.open();
        },
        isWifiSelected,
        selectWifi: () => wifiBottomSheetRef.current?.open(),
        isIntercomSelected,
        selectIntercom: () => intercomBottomSheetRef.current?.open(),
        isGroupWorkSelected,
        selectGroupWork: () => groupWorkBottomSheetRef.current?.open(),
        isMeetingRoomHubSelected,
        selectMeetingRoomHub: () => meetingRoomHubBottomSheetRef.current?.open(),
        isSoundOffSelected,
        selectSoundOff: () => soundOffBottomSheetRef.current?.open(),
      }}>
      {children}

      <UnlockDeckDoorBottomSheet
        ref={deckDoorBottomSheetRef}
        unlocked={onPremiseState?.deckDoor?.unlocked}
      />

      <PhoneBoothBottomSheet
        ref={phoneBoothBottomSheetRef}
        blueOccupied={onPremiseState?.phoneBooths.blue.occupied}
        loading={isFetchingOnPremiseState}
        orangeOccupied={onPremiseState?.phoneBooths.orange.occupied}
      />

      <PoulaillerKeyBoxBottomSheet ref={poulaillerKeyBoxBottomSheetRef} />

      <StorageKeyBoxBottomSheet ref={storageKeyBoxBottomSheetRef} />

      <PtiPoulaillerKeyBoxBottomSheet ref={ptiPoulaillerKeyBoxBottomSheetRef} />

      <DeckKeyBoxBottomSheet ref={deckKeyBoxBottomSheetRef} />

      <CarbonDioxideBottomSheet
        ref={carbonDioxideBottomSheetRef}
        humidityLevel={onPremiseState?.sensors?.humidity.level}
        level={onPremiseState?.sensors?.carbonDioxide.level}
        loading={isFetchingOnPremiseState}
        noiseLevel={onPremiseState?.sensors?.noise.level}
        temperatureLevel={onPremiseState?.sensors?.temperature.level}
      />

      <PtiPoulaillerClimateBottomSheet
        ref={ptiPoulaillerClimateBottomSheetRef}
        humidityLevel={onPremiseState?.sensors?.humidity.ptiPoulaillerLevel}
        loading={isFetchingOnPremiseState}
        temperatureLevel={onPremiseState?.sensors?.temperature.ptiPoulaillerLevel}
      />

      <FlexDeskBottomSheet
        ref={flexDeskBottomSheetRef}
        occupied={selectedFlexDesk?.occupied}
        onClose={() => setSelectedFlexDesk(null)}
      />

      <TelevisionBottomSheet ref={televisionBottomSheetRef} />
      <CoffeeMachineBottomSheet ref={coffeeMachineBottomSheetRef} />
      <PrinterBottomSheet ref={printerBottomSheetRef} />
      <FridgeBottomSheet ref={fridgeBottomSheetRef} />

      <AirConditioningBottomSheet
        ref={airConditioningBottomSheetRef}
        airConditioner={selectedAirConditioner}
        loading={isFetchingOnPremiseState}
        onClose={() => setSelectedAirConditioner(null)}
      />
      <WifiBottomSheet ref={wifiBottomSheetRef} />
      <IntercomBottomSheet ref={intercomBottomSheetRef} />
      <GroupWorkBottomSheet ref={groupWorkBottomSheetRef} />
      <MeetingRoomHubBottomSheet ref={meetingRoomHubBottomSheetRef} />
      <SoundOffBottomSheet ref={soundOffBottomSheetRef} />
    </OnPremiseContext.Provider>
  );
};
