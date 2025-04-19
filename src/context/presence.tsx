import { createContext, useContext, useState } from 'react';
import DetectDeviceBottomSheet from '@/components/Devices/DetectDeviceBottomSheet';
import PresenceBottomSheet from '@/components/Settings/PresenceBottomSheet';
import { ApiMemberActivity } from '@/services/api/members';

const PresenceContext = createContext<{
  selectedActivity: ApiMemberActivity | null;
  selectActivity: (activity: ApiMemberActivity, nonCompliantActivity?: ApiMemberActivity) => void;
}>({
  selectedActivity: null,
  selectActivity: () => { },
});

export const useAppPresence = () => {
  return useContext(PresenceContext);
};

export const PresenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedActivity, setSelectedActivity] = useState<ApiMemberActivity | null>(null);
  const [nonCompliantActivity, setNonCompliantActivity] = useState<ApiMemberActivity>();

  return (
    <PresenceContext.Provider
      value={{
        selectedActivity: selectedActivity,
        selectActivity: (activity: ApiMemberActivity, nonCompliant?: ApiMemberActivity) => {
          setSelectedActivity(activity);
          setNonCompliantActivity(nonCompliant);
        },
      }}>
      {children}
      {selectedActivity ? (
        <PresenceBottomSheet
          activity={selectedActivity}
          nonCompliant={nonCompliantActivity}
          onClose={() => {
            setSelectedActivity(null);
            setNonCompliantActivity(undefined);
          }}
        />
      ) : null}
    </PresenceContext.Provider>
  );
};
