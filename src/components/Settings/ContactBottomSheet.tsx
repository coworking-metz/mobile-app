import { Link } from 'expo-router';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, View } from 'react-native';
import tw from 'twrnc';
import ChatBubblesAnimation from '@/components/Animations/ChatBubblesAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { SUPPORT_EMAIL, WORDPRESS_BASE_URL } from '@/services/environment';
import useNoticeStore from '@/stores/notice';

const ContactBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const [isContactingTeam, setContactingTeam] = useState(false);
  const noticeStore = useNoticeStore();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const onContactTeamByEmail = useCallback(() => {
    setContactingTeam(true);
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('settings.contact.mail.onOpen.fail'),
        }),
      )
      .finally(() => setContactingTeam(false));
  }, []);

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      style={[tw`flex flex-col w-full p-6`, style]}
      onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <ChatBubblesAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('settings.contact.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full mt-4`}>
        {t('settings.contact.description')}
      </AppText>
      {/**
       * Brevo widget does not properly load inside Android webview,
       * so we redirect users to their system browser
       */}
      <Link asChild href={Platform.OS === 'ios' ? '/chat' : `${WORDPRESS_BASE_URL}#ouvrir-brevo`}>
        <AppRoundedButton
          style={tw`mt-6 w-full max-w-sm self-center`}
          suffixIcon="chat-processing-outline"
          onPress={() => bottomSheetRef.current?.close()}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('settings.contact.conversations.label')}
          </AppText>
        </AppRoundedButton>
      </Link>
      <AppTextButton
        loading={isContactingTeam}
        style={tw`mt-4 w-full max-w-sm self-center`}
        suffixIcon="email-outline"
        onPress={onContactTeamByEmail}>
        <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
          {t('settings.contact.mail.label')}
        </AppText>
      </AppTextButton>
    </AppBottomSheet>
  );
};

export default forwardRef(ContactBottomSheet);
