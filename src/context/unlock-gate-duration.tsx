import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import UnlockGateDurationBottomSheet from '@/components/Settings/UnlockGateDurationBottomSheet';

const UnlockGateDurationContext = createContext<{
  selectUnlockGateDuration: () => void;
}>({
  selectUnlockGateDuration: () => {},
});

export const useAppUnlockGateDuration = () => {
  return useContext(UnlockGateDurationContext);
};

export const UnlockGateDurationProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <UnlockGateDurationContext.Provider
      value={{
        selectUnlockGateDuration: () => bottomSheetRef.current?.open(),
      }}>
      {children}
      <UnlockGateDurationBottomSheet ref={bottomSheetRef} />
    </UnlockGateDurationContext.Provider>
  );
};
