import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import UnlockGateOptionsBottomSheet from '@/components/Settings/UnlockGateOptionsBottomSheet';

const UnlockGateOptionsContext = createContext<{
  selectUnlockGateOptions: () => void;
}>({
  selectUnlockGateOptions: () => {},
});

export const useAppUnlockGateOptions = () => {
  return useContext(UnlockGateOptionsContext);
};

export const UnlockGateOptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <UnlockGateOptionsContext.Provider
      value={{
        selectUnlockGateOptions: () => bottomSheetRef.current?.open(),
      }}>
      {children}
      <UnlockGateOptionsBottomSheet ref={bottomSheetRef} />
    </UnlockGateOptionsContext.Provider>
  );
};
