import { createContext, useContext, useState } from 'react';
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

  return (
    <PresenceContext.Provider
      value={{
        selectedActivity: selectedActivity,
        selectActivity: (activity: ApiMemberActivity) => {
          setSelectedActivity(activity);
        },
      }}>
      {children}
      {selectedActivity ? (
        <PresenceBottomSheet
          activity={selectedActivity}
          onClose={() => {
            setSelectedActivity(null);
          }}
        />
      ) : null}
    </PresenceContext.Provider>
  );
};
