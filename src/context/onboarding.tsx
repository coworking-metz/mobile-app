import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import OnboardingBottomSheet from '@/components/Onboarding/OnboardingBottomSheet';

const OnboardingContext = createContext<() => void>(() => {});

export const useAppOnboarding = () => {
  return useContext(OnboardingContext);
};

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <OnboardingContext.Provider value={() => bottomSheetRef.current?.open()}>
      {children}
      <OnboardingBottomSheet ref={bottomSheetRef} />
    </OnboardingContext.Provider>
  );
};
