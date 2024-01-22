import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Switch, ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import { theme } from '@/helpers/colors';
import { parseErrorText } from '@/helpers/error';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const router = useRouter();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const queryClient = useQueryClient();

  const copyAccessToken = useCallback(() => {
    Clipboard.setStringAsync(authStore.accessToken as string)
      .then(() => {
        toastStore.add({
          message: t('advanced.store.accessToken.onCopy.success'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.accessToken.onCopy.fail'),
          description,
          type: 'error',
        });
      });
  }, [authStore.accessToken, toastStore, noticeStore]);

  const copyRefreshToken = useCallback(() => {
    Clipboard.setStringAsync(authStore.refreshToken as string)
      .then(() => {
        toastStore.add({
          message: t('advanced.store.refreshToken.onCopy.success'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.refreshToken.onCopy.fail'),
          description,
          type: 'error',
        });
      });
  }, [authStore.refreshToken, toastStore, noticeStore]);

  const invalidateCache = useCallback(() => {
    queryClient
      .invalidateQueries()
      .then(() => {
        toastStore.add({
          message: t('advanced.store.invalidate.onInvalidate.success'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.invalidate.onInvalidate.fail'),
          description,
          type: 'error',
        });
      });
  }, [queryClient, toastStore, noticeStore]);

  const clearEverything = useCallback(() => {
    Promise.all([authStore.clear(), settingsStore.clear()])
      .then(() => queryClient.clear())
      .then(() => {
        toastStore.add({
          message: t('advanced.store.clear.onClear.success'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
        router.push('/login');
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.clear.onClear.fail'),
          description,
          type: 'error',
        });
      });
  }, [queryClient, authStore.clear, settingsStore.clear, toastStore, noticeStore]);

  return (
    <ServiceLayout
      description={t('advanced.description')}
      style={tw`py-6`}
      title={t('advanced.title')}>
      <Animated.Text
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6`]}>
        {t('advanced.store.title')}
      </Animated.Text>

      <ServiceRow
        withBottomDivider
        label={t('advanced.store.onboarding.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.hasOnboard}
          onColor={theme.meatBrown}
          onValueChange={(value) => settingsStore.setOnboard(value)}
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        description={`${authStore.accessToken}`}
        label={t('advanced.store.accessToken.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="content-copy"
        onPress={copyAccessToken}
      />
      <ServiceRow
        withBottomDivider
        description={`${authStore.refreshToken}`}
        label={t('advanced.store.refreshToken.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="content-copy"
        onPress={copyRefreshToken}
      />
      <ServiceRow
        withBottomDivider
        description={t('advanced.store.invalidate.description')}
        label={t('advanced.store.invalidate.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="cloud-sync-outline"
        onPress={invalidateCache}
      />
      <ServiceRow
        label={t('advanced.store.clear.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="nuke"
        onPress={clearEverything}
      />

      <Animated.Text
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6 mt-6`]}>
        {t('advanced.services.title')}
      </Animated.Text>
      <ServiceRow
        label={t('advanced.services.apiBaseUrl.label')}
        renderDescription={() => (
          <TextInput
            autoCapitalize="none"
            placeholder={HTTP.defaults.baseURL}
            style={tw`text-slate-500 dark:text-slate-400`}
            value={settingsStore.apiBaseUrl || ''}
            onChangeText={settingsStore.setApiBaseUrl}
          />
        )}
        style={tw`px-3 mx-3`}></ServiceRow>
    </ServiceLayout>
  );
};

export default Advanced;
