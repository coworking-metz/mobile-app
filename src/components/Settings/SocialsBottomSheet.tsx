import { BliiidaIcon, CoworkingIcon } from '../Home/CalendarEventCard';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import SocialMediaReactionsAnimation from '@/components/Animations/SocialMediaReactionsAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRowLink from '@/components/Layout/ServiceRowLink';
import useAuthStore from '@/stores/auth';

const SocialsBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`py-6`, style]} onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <SocialMediaReactionsAnimation
          backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
          style={tw`h-56 w-full`}
        />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4 px-6`}>
        {t('settings.socials.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full my-4 px-6`}>
        {t('settings.socials.description')}
      </AppText>
      <ServiceRowLink
        withBottomDivider
        href="https://us6.campaign-archive.com/home/?u=4406f25257&id=82ab4f380b"
        label={t('settings.socials.newsletter.label')}
        prefix={
          <View style={tw`flex flex-row items-center shrink-0 min-h-10`}>
            <CoworkingIcon style={tw`h-6 w-6 p-0`} />
          </View>
        }
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
        label={t('settings.socials.bliiidaNewsletter.label')}
        prefix={
          <View style={tw`flex flex-row items-center shrink-0 min-h-10`}>
            <BliiidaIcon style={tw`h-6 w-6 p-0`} />
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
          label={t('settings.socials.signal.label')}
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
        label={t('settings.socials.instagram.label')}
        prefixIcon="instagram"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        withBottomDivider
        description="CoworkingMetz"
        href="https://www.facebook.com/CoworkingMetz/"
        label={t('settings.socials.facebook.label')}
        prefixIcon="facebook"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        withBottomDivider
        description="CoworkingMetz"
        href="https://twitter.com/CoworkingMetz"
        label={t('settings.socials.twitter.label')}
        prefixIcon="twitter"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
      <ServiceRowLink
        description="le-poulailler-coworking-metz"
        href="https://fr.linkedin.com/company/le-poulailler-coworking-metz"
        label={t('settings.socials.linkedin.label')}
        prefixIcon="linkedin"
        style={tw`px-3 mx-3`}
        suffixIcon="open-in-new"
        target="_blank"
      />
    </AppBottomSheet>
  );
};

export default forwardRef(SocialsBottomSheet);
