import * as QuickActions from 'expo-quick-actions';
import { useQuickActionCallback } from 'expo-quick-actions/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';

const ContactContext = createContext<() => void>(() => {});

export const useAppContact = () => {
  return useContext(ContactContext);
};

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [shouldRenderContactBottomSheet, setRenderContactBottomSheet] = useState<boolean>(false);

  useEffect(() => {
    QuickActions.setItems([
      {
        title: t('settings.support.contact.onQuickAction.title'),
        subtitle: t('settings.support.contact.onQuickAction.description'),
        icon: Platform.OS === 'ios' ? 'symbol:person.crop.circle.badge.questionmark' : undefined,
        id: 'contact',
      },
    ]);
  }, [t]);

  useQuickActionCallback((action) => {
    if (action.id === 'contact') {
      setRenderContactBottomSheet(true);
    }
  });

  return (
    <ContactContext.Provider
      value={() => {
        console.log('contact');
        setRenderContactBottomSheet(true);
      }}>
      {children}
      {shouldRenderContactBottomSheet ? (
        <ContactBottomSheet onClose={() => setRenderContactBottomSheet(false)} />
      ) : null}
    </ContactContext.Provider>
  );
};
