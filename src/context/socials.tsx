import { createContext, useContext, useState } from 'react';
import SocialsBottomSheet from '@/components/Settings/SocialsBottomSheet';

const SocialsContext = createContext<{
  socialise: () => void;
}>({
  socialise: () => { },
});

export const useAppSocials = () => {
  return useContext(SocialsContext);
};

export const SocialsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSelecting, setSelecting] = useState<boolean>(false);

  return (
    <SocialsContext.Provider
      value={{
        socialise: () => setSelecting(true),
      }}>
      {children}
      {isSelecting ? <SocialsBottomSheet onClose={() => setSelecting(false)} /> : null}
    </SocialsContext.Provider>
  );
};
