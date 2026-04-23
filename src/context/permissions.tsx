import { createContext, useContext, useState } from 'react';
import PermissionsBottomSheet from '@/components/Settings/PermissionsBottomSheet';

const PermissionsContext = createContext<() => void>(() => {});

export const useAppPermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPermissionsBottomSheetVisible, setPermissionsBottomSheetVisible] =
    useState<boolean>(false);

  return (
    <PermissionsContext.Provider
      value={() => {
        setPermissionsBottomSheetVisible(true);
      }}>
      {children}
      {isPermissionsBottomSheetVisible ? (
        <PermissionsBottomSheet onClose={() => setPermissionsBottomSheetVisible(false)} />
      ) : null}
    </PermissionsContext.Provider>
  );
};
