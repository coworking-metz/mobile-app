import { createContext, useContext, useState } from 'react';
import PermissionsBottomSheet from '@/components/Settings/PermissionsBottomSheet';
import ReviewBottomSheet from '@/components/Settings/ReviewBottomSheet';

const ReviewContext = createContext<() => void>(() => { });

export const useAppReview = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReviewing, setReviewing] = useState<boolean>(false);

  return (
    <ReviewContext.Provider
      value={() => {
        setReviewing(true);
      }}>
      {children}
      {isReviewing ? <ReviewBottomSheet onClose={() => setReviewing(false)} /> : null}
    </ReviewContext.Provider>
  );
};
