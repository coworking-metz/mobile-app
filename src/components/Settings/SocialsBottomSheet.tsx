import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import BliiidaSquareLogo from '@/assets/images/bliiida-square.png';
import SocialMediaReactionsAnimation from '@/components/Animations/SocialMediaReactionsAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRowLink from '@/components/Layout/ServiceRowLink';
import useAuthStore from '@/stores/auth';

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
    <AppBottomSheet contentContainerStyle={tw`pt-6`} style={style} onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <SocialMediaReactionsAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4 px-6`}>
        {t('settings.support.socials.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full my-4 px-6`}>
        {t('settings.support.socials.description')}
      </AppText>
      <ServiceRowLink
        withBottomDivider
        href="https://us6.campaign-archive.com/home/?u=4406f25257&id=82ab4f380b"
        label={t('settings.support.socials.newsletter.label')}
        prefixIcon="email-newsletter"
        renderDescription={(d) => (
          <AppText numberOfLines={1} style={tw`text-sm font-normal text-amber-500`}>
            {d}
          </AppText>
        )}
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        withBottomDivider
        href="https://mailchi.mp/5c18c8c3d655/newsletter-interne-bliiida"
        label={t('settings.support.socials.bliiidaNewsletter.label')}
        prefix={
          <View style={tw`flex flex-row items-center shrink-0 min-h-10`}>
            <View style={tw`h-6 w-6 bg-gray-700 dark:bg-zinc-400 rounded-lg overflow-hidden`}>
              <Image source={BliiidaSquareLogo} style={[tw`h-full w-full`]} />
            </View>
          </View>
        }
        prefixIcon="email-newsletter"
        renderDescription={(d) => (
          <AppText numberOfLines={1} style={tw`text-sm font-normal text-amber-500`}>
            {d}
          </AppText>
        )}
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      {authStore.user?.id && (
        <ServiceRowLink
          withBottomDivider
          href="https://signal.group/#CjQKICGvCmD9n9SJSW6z_g5FmRg5rRUj4hWpC1X5XxOexGwrEhDxUfX0r6UQ_blpMGz938M9"
          label={t('settings.support.socials.signal.label')}
          prefixIcon="chat-outline"
          renderDescription={(d) => (
            <AppText numberOfLines={1} style={tw`text-sm font-normal text-amber-500`}>
              {d}
            </AppText>
          )}
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
          target="_blank"
        />
      )}
      <ServiceRowLink
        withBottomDivider
        description="coworkingmetz"
        href="https://www.instagram.com/coworkingmetz/"
        label={t('settings.support.socials.instagram.label')}
        prefixIcon="instagram"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        withBottomDivider
        description="CoworkingMetz"
        href="https://www.facebook.com/CoworkingMetz/"
        label={t('settings.support.socials.facebook.label')}
        prefixIcon="facebook"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        withBottomDivider
        description="CoworkingMetz"
        href="https://twitter.com/CoworkingMetz"
        label={t('settings.support.socials.twitter.label')}
        prefixIcon="twitter"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        description="le-poulailler-coworking-metz"
        href="https://fr.linkedin.com/company/le-poulailler-coworking-metz"
        label={t('settings.support.socials.linkedin.label')}
        prefixIcon="linkedin"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
    </AppBottomSheet>
  );
};

export default SocialsBottomSheet;
