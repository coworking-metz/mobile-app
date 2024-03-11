import ChatBubblesAnimation from '../Animations/ChatBubblesAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import AppTextButton from '../AppTextButton';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ContactBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
  const { t } = useTranslation();
  const [isContactingTeam, setContactingTeam] = useState(false);
  const noticeStore = useNoticeStore();

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
      })
      .finally(() => setContactingTeam(false));
  }, []);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full justify-between pt-6 px-6 pb-4`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ChatBubblesAnimation style={tw`h-56 w-full`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('settings.support.contact.title')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('settings.support.contact.description')}
        </Text>
        <Link
          asChild
          href="https://conversations-widget.brevo.com/?hostId=65324d6bf96d92531b4091f8">
          <AppRoundedButton prefixIcon="chat-processing-outline" style={tw`h-14 self-stretch mt-6`}>
            <Text style={tw`text-base text-black font-medium`}>
              {t('settings.support.contact.conversations.label')}
            </Text>
          </AppRoundedButton>
        </Link>
        <AppTextButton
          loading={isContactingTeam}
          prefixIcon="email-outline"
          style={tw`mt-4`}
          onPress={onContactTeamByEmail}>
          <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('settings.support.contact.mail.label')}
          </Text>
        </AppTextButton>
      </View>
    </AppBottomSheet>
  );
};

export default ContactBottomSheet;
