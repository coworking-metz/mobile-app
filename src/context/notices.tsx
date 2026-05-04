import { createContext, useContext, useMemo } from 'react';
import NoticeBottomSheet from '@/components/NoticeBottomSheet';
import useNoticeStore from '@/stores/notice';

const NoticesContext = createContext<{
  dismissAll: () => void;
}>({
  dismissAll: () => {},
});

export const useAppNotices = () => {
  return useContext(NoticesContext);
};

export const NoticesProvider = ({ children }: { children: React.ReactNode }) => {
  const noticeStore = useNoticeStore();
  const undismissedNotices = useMemo(() => {
    return noticeStore.history.filter((n) => !n.dismissed);
  }, [noticeStore.history]);

  return (
    <NoticesContext.Provider
      value={{
        dismissAll: () => noticeStore.dismissAll(),
      }}>
      {children}
      {undismissedNotices.map((notice) => (
        <NoticeBottomSheet
          key={`notice-${notice.id}`}
          notice={notice}
          onClose={() => {
            notice.onClose?.();
            noticeStore.dismiss(notice.id);
          }}
        />
      ))}
    </NoticesContext.Provider>
  );
};
