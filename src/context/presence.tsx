import { createContext, useContext, useRef, useState } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import PresenceBottomSheet from '@/components/Settings/PresenceBottomSheet';
import { ApiMemberActivity } from '@/services/api/members';

const PresenceContext = createContext<{
  selectedActivity: ApiMemberActivity | null;
  selectActivity: (activity: ApiMemberActivity) => void;
}>({
  selectedActivity: null,
  selectActivity: () => {},
});

export const useAppPresence = () => {
  return useContext(PresenceContext);
};

export const PresenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedActivity, setSelectedActivity] = useState<ApiMemberActivity | null>(null);
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <PresenceContext.Provider
      value={{
        selectedActivity: selectedActivity,
        selectActivity: (activity: ApiMemberActivity) => {
          setSelectedActivity(activity);
          bottomSheetRef.current?.open();
        },
      }}>
      {children}
      <PresenceBottomSheet
        ref={bottomSheetRef}
        selectedActivity={selectedActivity}
        onClose={() => {
          setSelectedActivity(null);
        }}
      />
    </PresenceContext.Provider>
  );
};
