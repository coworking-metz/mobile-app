import { Link } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import ChatBubblesAnimation from '@/components/Animations/ChatBubblesAnimation';
import AppBottomSheet, { AppBottomSheetRef } from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ContactBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [isContactingTeam, setContactingTeam] = useState(false);
  const noticeStore = useNoticeStore();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const onContactTeamByEmail = useCallback(() => {
    setContactingTeam(true);
    Linking.openURL('mailto:contact@coworking-metz.fr')
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('settings.support.contact.mail.onOpen.fail'),
          description,
          type: 'error',
        });
        bottomSheetRef.current?.close();
      })
      .finally(() => setContactingTeam(false));
  }, []);

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      contentContainerStyle={tw`flex flex-col w-full pt-6 px-6`}
      style={style}
      onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <ChatBubblesAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('settings.support.contact.title')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
        {t('settings.support.contact.description')}
      </AppText>
      <Link asChild href="/chat">
        <AppRoundedButton
          style={tw`h-14 mt-6 w-full max-w-md self-center`}
          suffixIcon="chat-processing-outline"
          onPress={() => bottomSheetRef.current?.close()}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('settings.support.contact.conversations.label')}
          </AppText>
        </AppRoundedButton>
      </Link>
      <AppTextButton
        loading={isContactingTeam}
        style={tw`mt-4 w-full max-w-md self-center`}
        suffixIcon="email-outline"
        onPress={onContactTeamByEmail}>
        <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
          {t('settings.support.contact.mail.label')}
        </AppText>
      </AppTextButton>
    </AppBottomSheet>
  );
};

export default ContactBottomSheet;
