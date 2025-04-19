import { createContext, useContext, useState } from 'react';
import DetectDeviceBottomSheet from '@/components/Devices/DetectDeviceBottomSheet';

const NewDeviceContext = createContext<{
  addNewDevice: () => void;
}>({
  addNewDevice: () => { },
});

export const useAppNewDevice = () => {
  return useContext(NewDeviceContext);
};

export const NewDeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNewDeviceVisible, setNewDeviceVisible] = useState<boolean>(false);

  return (
    <NewDeviceContext.Provider
      value={{
        addNewDevice: () => setNewDeviceVisible(true),
      }}>
      {children}
      {isNewDeviceVisible ? (
        <DetectDeviceBottomSheet onClose={() => setNewDeviceVisible(false)} />
      ) : null}
    </NewDeviceContext.Provider>
  );
};
