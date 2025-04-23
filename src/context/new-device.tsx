import { createContext, useContext, useState } from 'react';
import PairDeviceBottomSheet from '@/components/Devices/PairDeviceBottomSheet';

const NewDeviceContext = createContext<{
  pairDevice: () => void;
}>({
  pairDevice: () => { },
});

export const useAppNewDevice = () => {
  return useContext(NewDeviceContext);
};

export const NewDeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPairDeviceVisible, setPairDeviceVisible] = useState<boolean>(false);

  return (
    <NewDeviceContext.Provider
      value={{
        pairDevice: () => setPairDeviceVisible(true),
      }}>
      {children}
      {isPairDeviceVisible ? (
        <PairDeviceBottomSheet onClose={() => setPairDeviceVisible(false)} />
      ) : null}
    </NewDeviceContext.Provider>
  );
};
