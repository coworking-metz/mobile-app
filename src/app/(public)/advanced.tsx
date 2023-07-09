import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import { parseErrorText } from '@/helpers/error';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const router = useRouter();
  const toastStore = useToastStore();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();

  const copyAccessToken = useCallback(() => {
    Clipboard.setStringAsync(authStore.accessToken as string)
      .then(() => {
        toastStore.add({
          message: t('advanced.store.accessToken.onCopy.message'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
      })
      .catch(async (error: Error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
      });
  }, [authStore.accessToken]);

  const copyRefreshToken = useCallback(() => {
    Clipboard.setStringAsync(authStore.refreshToken as string)
      .then(() => {
        toastStore.add({
          message: t('advanced.store.refreshToken.onCopy.message'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
      })
      .catch(async (error: Error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
      });
  }, [authStore.refreshToken]);

  const clearEverything = useCallback(() => {
    Promise.all([authStore.clear(), settingsStore.clear()])
      .then(() => {
        toastStore.add({
          message: t('advanced.store.clear.onSuccess.message'),
          type: ToastPresets.SUCCESS,
          timeout: 3000,
        });
        router.push('/login');
      })
      .catch(async (error: Error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
      });
  }, [authStore.clear, settingsStore.clear]);

  return (
    <ServiceLayout description={t('advanced.description')} title={t('advanced.title')}>
      <Animated.Text
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6`]}>
        {t('advanced.store.title')}
      </Animated.Text>

      <ServiceRow
        withBottomDivider
        label={t('advanced.store.onboarding.label')}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base text-slate-500 ml-auto`}>{`${settingsStore.hasOnboard}`}</Text>
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
        description={HTTP.defaults.baseURL}
        label={t('advanced.services.apiBaseUrl.label')}
        style={tw`px-3 mx-3`}
      />
    </ServiceLayout>
  );
};

export default Advanced;
