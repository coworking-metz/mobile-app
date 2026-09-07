import dayjs from 'dayjs';
import { Link, useIsFocused } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import useAppState from '@/helpers/app-state';
import { clearLogFiles, listLogFiles } from '@/helpers/logger';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AllLogs = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const activeSince = useAppState();
  const [logFiles, setLogFiles] = useState(() => listLogFiles());

  const refreshLogFiles = useCallback(() => {
    setLogFiles(listLogFiles());
    return Promise.resolve();
  }, []);

  useEffect(() => {
    if (isFocused) {
      refreshLogFiles();
    }
  }, [isFocused, activeSince, refreshLogFiles]);

  return (
    <ServiceLayout
      actions={[
        {
          id: 'delete',
          title: t('advanced.logs.clear'),
          onPress: () => {
            clearLogFiles();
            refreshLogFiles();
          },
          attributes: {
            destructive: true,
          },
        },
      ]}
      contentStyle={tw`p-3`}
      description={t('advanced.logs.description')}
      title={t('advanced.logs.title')}
      onRefresh={refreshLogFiles}>
      {logFiles.length ? (
        <Animated.View entering={FadeIn.duration(300)} style={tw`mx-auto w-full max-w-xl`}>
          {logFiles.map(({ date, size, modified }, index) => (
            <Link asChild href={`/logs/${date}`} key={date}>
              <ServiceRow
                description={formatFileSize(size)}
                label={capitalize(dayjs(modified).format('LLLL'))}
                style={tw`px-3`}
                suffixIcon="chevron-right"
                withBottomDivider={index < logFiles.length - 1}
              />
            </Link>
          ))}
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(300)} style={tw`px-6 py-2`}>
          <AppText style={tw`text-center text-base text-slate-500 dark:text-neutral-500`}>
            {t('advanced.logs.empty')}
          </AppText>
        </Animated.View>
      )}
    </ServiceLayout>
  );
};

export default AllLogs;
