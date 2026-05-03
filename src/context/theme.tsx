import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';

const ThemeContext = createContext<{
  selectTheme: () => void;
}>({
  selectTheme: () => {},
});

export const useAppTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <ThemeContext.Provider
      value={{
        selectTheme: () => {
          bottomSheetRef.current?.open();
        },
      }}>
      {children}
      <ThemeBottomSheet ref={bottomSheetRef} />
    </ThemeContext.Provider>
  );
};
