import { createContext, useContext, useState } from 'react';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';

const ThemeContext = createContext<{
  selectTheme: () => void;
}>({
  selectTheme: () => { },
});

export const useAppTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSelecting, setSelecting] = useState<boolean>(false);

  return (
    <ThemeContext.Provider
      value={{
        selectTheme: () => setSelecting(true),
      }}>
      {children}
      {isSelecting ? <ThemeBottomSheet onClose={() => setSelecting(false)} /> : null}
    </ThemeContext.Provider>
  );
};
