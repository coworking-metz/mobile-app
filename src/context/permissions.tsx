import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PermissionsBottomSheet from '@/components/Settings/PermissionsBottomSheet';

const PermissionsContext = createContext<() => void>(() => { });

export const useAppPermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPermissionsBottomSheetVisible, setPermissionsContactBottomSheetVisible] =
    useState<boolean>(false);

  return (
    <PermissionsContext.Provider
      value={() => {
        setPermissionsContactBottomSheetVisible(true);
      }}>
      {children}
      {isPermissionsBottomSheetVisible ? (
        <PermissionsBottomSheet onClose={() => setPermissionsContactBottomSheetVisible(false)} />
      ) : null}
    </PermissionsContext.Provider>
  );
};
