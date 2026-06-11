import dayjs from 'dayjs';
import Constants from 'expo-constants';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
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
      <View style={tw`mx-auto mb-6 w-full max-w-xl`}>
        <SectionTitle style={tw`mx-6`} title={t('about.legal.title')} />
        <ServiceRow withBottomDivider label={t('about.legal.license.label')} style={tw`mx-3 px-3`}>
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            MIT
          </AppText>
        </ServiceRow>
        <ServiceRowLink
          withBottomDivider
          href="https://coworking-metz.fr"
          label={t('about.legal.author.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://coworking-metz.fr/donnees/"
          label={t('about.legal.privacyPolicy.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />

        <SectionTitle style={tw`mx-6 mt-6`} title={t('about.technical.title')} />
        <ServiceRow
          withBottomDivider
          label={t('about.technical.environment.label')}
          style={tw`mx-3 px-3`}>
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {APP_ENVIRONMENT}
          </AppText>
        </ServiceRow>
        <Link asChild href="/changes">
          <ServiceRow
            withBottomDivider
            label={t('about.technical.version.label')}
            style={tw`mx-3 px-3`}>
            <AppText style={tw`text-right text-base font-normal text-amber-500`}>
              {APP_VERSION}
            </AppText>
          </ServiceRow>
        </Link>
        <ServiceRow
          withBottomDivider
          label={t('about.technical.buildDate.label')}
          style={tw`mx-3 px-3`}>
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {dayjs(Constants.expoConfig?.extra?.buildDate).format('L LT')}
          </AppText>
        </ServiceRow>
        <ServiceRow label={t('about.technical.executionEnvironment.label')} style={tw`mx-3 px-3`}>
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {Constants.executionEnvironment}
          </AppText>
        </ServiceRow>

        <SectionTitle style={tw`mx-6 mt-6`} title={t('about.credits.title')} />
        <ServiceRowLink
          withBottomDivider
          href="https://lottiefiles.com/page/license"
          label={t('about.credits.lottiefiles.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />
        <ServiceRowLink
          withBottomDivider
          href="https://lordicon.com/licenses"
          label={t('about.credits.lordicon.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://rive.app/docs/legal/terms-of-service"
          label={t('about.credits.rive.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />

        <SectionTitle style={tw`mx-6 mt-6`} title={t('about.opensource.title')} />
        <ServiceRowLink
          withBottomDivider
          href="https://github.com/coworking-metz"
          label={t('about.opensource.github.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />
        <ServiceRowLink
          href="https://gitlab.com/coworking-metz-poulailler/"
          label={t('about.opensource.gitlab.label')}
          style={tw`mx-3 px-3`}
          target="_blank"
        />
      </View>
    </ServiceLayout>
  );
};

export default About;
