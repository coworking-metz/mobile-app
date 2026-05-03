import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import SocialsBottomSheet from '@/components/Settings/SocialsBottomSheet';

const SocialsContext = createContext<{
  socialise: () => void;
}>({
  socialise: () => {},
});

export const useAppSocials = () => {
  return useContext(SocialsContext);
};

export const SocialsProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <SocialsContext.Provider
      value={{
        socialise: () => bottomSheetRef.current?.open(),
      }}>
      {children}
      <SocialsBottomSheet ref={bottomSheetRef} />
    </SocialsContext.Provider>
  );
};
