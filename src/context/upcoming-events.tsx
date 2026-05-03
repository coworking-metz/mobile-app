import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
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
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <UpcomingEventsContext.Provider
      value={{
        selectUpcomingEventsPeriod: () => bottomSheetRef.current?.open(),
      }}>
      {children}
      <UpcomingEventsPeriodBottomSheet ref={bottomSheetRef} />
    </UpcomingEventsContext.Provider>
  );
};
