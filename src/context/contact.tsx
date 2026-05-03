import * as QuickActions from 'expo-quick-actions';
import { useQuickActionCallback } from 'expo-quick-actions/hooks';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';

const ContactContext = createContext<() => void>(() => {
  /* nothing */
});

export const useAppContact = () => {
  return useContext(ContactContext);
};

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [isPresented, setPresented] = useState(false);

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
    if (action.id === 'contact' && !isPresented) {
      bottomSheetRef.current?.open();
    }
  });

  return (
    <ContactContext.Provider
      value={() => {
        bottomSheetRef.current?.open();
      }}>
      {children}
      <ContactBottomSheet
        ref={bottomSheetRef}
        onClose={() => setPresented(false)}
        onDidPresent={() => setPresented(true)}
      />
    </ContactContext.Provider>
  );
};
