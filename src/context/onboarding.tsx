import { createContext, useContext, useState } from 'react';
import OnboardingBottomSheet from '@/components/Onboarding/OnboardingBottomSheet';

const OnboardingContext = createContext<() => void>(() => {});

export const useAppOnboarding = () => {
  return useContext(OnboardingContext);
};

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnboardingBottomSheetVisible, setOnboardinBottomSheetVisible] = useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={() => {
        setOnboardinBottomSheetVisible(true);
      }}>
      {children}
      {isOnboardingBottomSheetVisible ? (
        <OnboardingBottomSheet onClose={() => setOnboardinBottomSheetVisible(false)} />
      ) : null}
    </OnboardingContext.Provider>
  );
};
