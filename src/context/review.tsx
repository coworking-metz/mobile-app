import { createContext, useContext, useRef } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import ReviewBottomSheet from '@/components/Settings/ReviewBottomSheet';

const ReviewContext = createContext<() => void>(() => {});

export const useAppReview = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  return (
    <ReviewContext.Provider
      value={() => {
        bottomSheetRef.current?.open();
      }}>
      {children}
      <ReviewBottomSheet ref={bottomSheetRef} />
    </ReviewContext.Provider>
  );
};
