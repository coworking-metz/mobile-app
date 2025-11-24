import { createContext, useContext, useState } from 'react';
import UpcomingEventsPeriodBottomSheet from '@/components/Settings/UpcomingEventsPeriodBottomSheet';

const UpcomingEventsContext = createContext<{
  selectUpcomingEventsPeriod: () => void;
}>({
  selectUpcomingEventsPeriod: () => {},
});

export const useAppUpcomingEvents = () => {
  return useContext(UpcomingEventsContext);
};

export const UpcomingEventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  return (
    <UpcomingEventsContext.Provider
      value={{
        selectUpcomingEventsPeriod: () => setVisible(true),
      }}>
      {children}
      {isVisible ? <UpcomingEventsPeriodBottomSheet onClose={() => setVisible(false)} /> : null}
    </UpcomingEventsContext.Provider>
  );
};
