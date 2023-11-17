import { version } from '../../../package.json';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import tw from 'twrnc';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
dayjs.extend(LocalizedFormat);

const About = () => {
  const { t } = useTranslation();

  return (
    <ServiceLayout description={t('about.description')} title={t('about.title')}>
      <Text style={tw`text-sm uppercase text-slate-500 mx-6`}>{t('about.legal.title')}</Text>
      <ServiceRow label={t('about.legal.license.label')} style={tw`px-3 mx-3`}>
        <Text style={tw`text-base text-slate-500 grow text-right`}>MIT</Text>
      </ServiceRow>

      <Text style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
        {t('about.technical.title')}
      </Text>
      <ServiceRow
        withBottomDivider
        label={t('about.technical.version.label')}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base text-slate-500 grow text-right`}>{version}</Text>
      </ServiceRow>
      <ServiceRow label={t('about.technical.buildDate.label')} style={tw`px-3 mx-3`}>
        <Text style={tw`text-base text-slate-500 grow text-right`}>
          {dayjs(Constants.expoConfig?.extra?.buildDate).format('L LT')}
        </Text>
      </ServiceRow>

      <Text style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>{t('about.credits.title')}</Text>
      <Link asChild href="https://lottiefiles.com/">
        <ServiceRow
          description="https://lottiefiles.com/"
          label={t('about.credits.lottiefiles.label')}
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
      </Link>
      <Link asChild href="https://lordicon.com/">
        <ServiceRow
          description="https://lordicon.com/"
          label={t('about.credits.lordicon.label')}
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
      </Link>

      <Text style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
        {t('about.opensource.title')}
      </Text>
      <Link asChild href="https://gitlab.com/coworking-metz-poulailler/">
        <ServiceRow
          withBottomDivider
          description="https://gitlab.com/coworking-metz-poulailler/"
          label={t('about.opensource.gitlab.label')}
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
      </Link>
      <Link asChild href="https://github.com/coworking-metz">
        <ServiceRow
          description="https://github.com/coworking-metz"
          label={t('about.opensource.github.label')}
          style={tw`px-3 mx-3`}
          suffixIcon="open-in-new"
        />
      </Link>
    </ServiceLayout>
  );
};

export default About;
