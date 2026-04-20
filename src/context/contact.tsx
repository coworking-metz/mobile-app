import * as QuickActions from 'expo-quick-actions';
import { useQuickActionCallback } from 'expo-quick-actions/hooks';
import { isNil } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';

const ContactContext = createContext<() => void>(() => {
  /* nothing */
});

export const useAppContact = () => {
  return useContext(ContactContext);
};

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [isContactBottomSheetVisible, setContactBottomSheetVisible] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    QuickActions.setItems([
      {
        title: t('settings.contact.onQuickAction.title'),
        subtitle: t('settings.contact.onQuickAction.description'),
        icon: Platform.OS === 'ios' ? 'symbol:person.crop.circle.badge.questionmark' : undefined,
        id: 'contact',
      },
    ]);
  }, [t]);

  useQuickActionCallback((action) => {
    console.log('Quick action received:', action);
    if (action.id === 'contact' && isNil(isContactBottomSheetVisible)) {
      setContactBottomSheetVisible(true);
    }
  });

  return (
    <ContactContext.Provider
      value={() => {
        setContactBottomSheetVisible(true);
      }}>
      {children}
      {isContactBottomSheetVisible ? (
        <ContactBottomSheet onClose={() => setContactBottomSheetVisible(false)} />
      ) : null}
    </ContactContext.Provider>
  );
};
