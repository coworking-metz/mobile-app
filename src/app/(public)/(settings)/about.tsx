import { version } from '../../../../package.json';
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
import { APP_ENVIRONMENT } from '@/services/environment';

const About = () => {
  useDeviceContext(tw);
  const { _root } = useLocalSearchParams();
  const { t } = useTranslation();

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12`}
      description={t('about.description')}
      title={t('about.title')}
      withBackButton={!_root}>
      <View style={tw`w-full max-w-xl mx-auto`}>
        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6`}>
          {t('about.legal.title')}
        </AppText>
        <ServiceRow withBottomDivider label={t('about.legal.license.label')} style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            MIT
          </AppText>
        </ServiceRow>
        <Link asChild href="https://coworking-metz.fr">
          <ServiceRow
            withBottomDivider
            description="coworking-metz.fr"
            label={t('about.legal.author.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>
        <Link asChild href="https://www.coworking-metz.fr/donnees/">
          <ServiceRow
            description="coworking-metz.fr/donnees"
            label={t('about.legal.privacyPolicy.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>

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
            <AppText style={tw`text-base font-normal text-amber-500 text-right`}>{version}</AppText>
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
        <Link asChild href="https://lottiefiles.com/page/license">
          <ServiceRow
            withBottomDivider
            description="lottiefiles.com/page/license"
            label={t('about.credits.lottiefiles.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>
        <Link asChild href="https://lordicon.com/license-terms#license-rights">
          <ServiceRow
            withBottomDivider
            description="lordicon.com/license-terms#license-rights"
            label={t('about.credits.lordicon.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>
        <Link asChild href="https://rive.app/community/doc/terms-of-service/docG7vv2lLg8">
          <ServiceRow
            description="rive.app/community/doc/terms-of-service/docG7vv2lLg8"
            label={t('about.credits.rive.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>

        <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
          {t('about.opensource.title')}
        </AppText>
        <Link asChild href="https://gitlab.com/coworking-metz-poulailler/">
          <ServiceRow
            withBottomDivider
            description="gitlab.com/coworking-metz-poulailler"
            label={t('about.opensource.gitlab.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>
        <Link asChild href="https://github.com/coworking-metz">
          <ServiceRow
            description="github.com/coworking-metz"
            label={t('about.opensource.github.label')}
            style={tw`px-3 mx-3`}
            suffixIcon="open-in-new"
          />
        </Link>
      </View>
    </ServiceLayout>
  );
};

export default About;
