import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import PermissionsBottomSheet from '@/components/Settings/PermissionsBottomSheet';

const PermissionsContext = createContext<() => void>(() => {});

export const useAppPermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <PermissionsContext.Provider
      value={() => {
        bottomSheetRef.current?.open();
      }}>
      {children}
      <PermissionsBottomSheet ref={bottomSheetRef} />
    </PermissionsContext.Provider>
  );
};
