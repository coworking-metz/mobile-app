import FloatingSocialsAnimation from '../Animations/FloatingSocialsAnimation';
import ServiceRow from '../Layout/ServiceRow';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import useAuthStore from '@/stores/auth';
import ServiceRowLink from '../Layout/ServiceRowLink';

const SocialsBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full py-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <FloatingSocialsAnimation speed={0.75} style={tw`h-56 w-full`} />
        </View>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4 px-6`}>
          {t('settings.support.socials.title')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full my-4 px-6`}>
          {t('settings.support.socials.description')}
        </AppText>
        <ServiceRowLink
          withBottomDivider
          href="https://us6.campaign-archive.com/home/?u=4406f25257&id=82ab4f380b"
          label={t('settings.support.socials.newsletter.label')}
          prefixIcon="email-newsletter"
          target="_blank"
          suffixIcon="open-in-new"
          style={tw`px-3 mx-3`}
          renderDescription={(d) => (
            <AppText numberOfLines={1} style={tw`text-sm font-normal text-amber-500`}>{d}</AppText>
          )}
        />
        {authStore.user?.id && (
          <ServiceRowLink
            withBottomDivider
            href="https://signal.group/#CjQKICGvCmD9n9SJSW6z_g5FmRg5rRUj4hWpC1X5XxOexGwrEhDxUfX0r6UQ_blpMGz938M9"
            label={t('settings.support.socials.signal.label')}
            prefixIcon="chat-outline"
            target="_blank"
            renderDescription={(d) => (
              <AppText numberOfLines={1} style={tw`text-sm font-normal text-amber-500`}>{d}</AppText>
            )}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        )}
        <ServiceRowLink
          href="https://www.instagram.com/coworkingmetz/" target="_blank"
          withBottomDivider
          description="coworkingmetz"
          label={t('settings.support.socials.instagram.label')}
          prefixIcon="instagram"
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
        <ServiceRowLink
          withBottomDivider
          href="https://www.facebook.com/CoworkingMetz/" target="_blank"
          description="CoworkingMetz"
          label={t('settings.support.socials.facebook.label')}
          prefixIcon="facebook"
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
        <ServiceRowLink
          href="https://twitter.com/CoworkingMetz" target="_blank"
          withBottomDivider
          description="CoworkingMetz"
          label={t('settings.support.socials.twitter.label')}
          prefixIcon="twitter"
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
        <ServiceRowLink
          href="https://fr.linkedin.com/company/le-poulailler-coworking-metz"
          target="_blank"
          description="le-poulailler-coworking-metz"
          label={t('settings.support.socials.linkedin.label')}
          prefixIcon="linkedin"
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
      </View>
    </AppBottomSheet>
  );
};

export default SocialsBottomSheet;
