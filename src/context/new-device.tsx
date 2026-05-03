import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import PairDeviceBottomSheet from '@/components/Devices/PairDeviceBottomSheet';

const NewDeviceContext = createContext<{
  pairDevice: () => void;
}>({
  pairDevice: () => {},
});

export const useAppNewDevice = () => {
  return useContext(NewDeviceContext);
};

export const NewDeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <NewDeviceContext.Provider
      value={{
        pairDevice: () => bottomSheetRef.current?.open(),
      }}>
      {children}
      <PairDeviceBottomSheet ref={bottomSheetRef} />
    </NewDeviceContext.Provider>
  );
};
