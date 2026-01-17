import dayjs from 'dayjs';
import Constants from 'expo-constants';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import ServiceRowLink from '@/components/Layout/ServiceRowLink';
import { APP_ENVIRONMENT, APP_VERSION } from '@/services/environment';

const About = () => {
  useDeviceContext(tw);
  const { _root } = useLocalSearchParams();
  const { t } = useTranslation();

  return (
    <ServiceLayout
      contentStyle={tw`pt-6`}
      description={t('about.description')}
      title={t('about.title')}
      withBackButton={!_root}>
      <View style={tw`w-full max-w-xl mx-auto mb-6`}>
        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6`}>
          {t('about.legal.title')}
        </AppText>
        <ServiceRow withBottomDivider label={t('about.legal.license.label')} style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            MIT
          </AppText>
        </ServiceRow>
        <ServiceRowLink
          withBottomDivider
          href="https://coworking-metz.fr"
          label={t('about.legal.author.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://coworking-metz.fr/donnees/"
          label={t('about.legal.privacyPolicy.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />

        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
          {t('about.technical.title')}
        </AppText>
        <ServiceRow
          withBottomDivider
          label={t('about.technical.environment.label')}
          style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {APP_ENVIRONMENT}
          </AppText>
        </ServiceRow>
        <Link asChild href="/changes">
          <ServiceRow
            withBottomDivider
            label={t('about.technical.version.label')}
            style={tw`px-3 mx-3`}>
            <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
              {APP_VERSION}
            </AppText>
          </ServiceRow>
        </Link>
        <ServiceRow
          withBottomDivider
          label={t('about.technical.buildDate.label')}
          style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {dayjs(Constants.expoConfig?.extra?.buildDate).format('L LT')}
          </AppText>
        </ServiceRow>
        <ServiceRow label={t('about.technical.executionEnvironment.label')} style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {Constants.executionEnvironment}
          </AppText>
        </ServiceRow>

        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
          {t('about.credits.title')}
        </AppText>
        <ServiceRowLink
          withBottomDivider
          href="https://lottiefiles.com/page/license"
          label={t('about.credits.lottiefiles.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />
        <ServiceRowLink
          withBottomDivider
          href="https://lordicon.com/licenses"
          label={t('about.credits.lordicon.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://rive.app/docs/legal/terms-of-service"
          label={t('about.credits.rive.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />

        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
          {t('about.opensource.title')}
        </AppText>
        <ServiceRowLink
          withBottomDivider
          href="https://github.com/coworking-metz"
          label={t('about.opensource.github.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://gitlab.com/coworking-metz-poulailler/"
          label={t('about.opensource.gitlab.label')}
          style={tw`px-3 mx-3`}
          target="_blank"
        />
      </View>
    </ServiceLayout>
  );
};

export default About;
