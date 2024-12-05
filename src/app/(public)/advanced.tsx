import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TextInput } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Switch } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import { theme } from '@/helpers/colors';
import { parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useResetNavigation from '@/helpers/navigation';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const advancedLogger = log.extend(`[advanced]`);

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const queryClient = useQueryClient();
  const resetNavigation = useResetNavigation();

  const copyAccessToken = useCallback(() => {
    Clipboard.setStringAsync(authStore.accessToken as string)
      .then(() => {
        toastStore.add({
          message: t('advanced.store.accessToken.onCopy.success'),
          type: 'success',
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
          type: 'success',
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

  const onSwitchAuthStorage = useCallback(
    async (value: boolean) => {
      if (value) {
        Alert.alert(
          t('advanced.store.tokensStorage.alert.title'),
          t('advanced.store.tokensStorage.alert.message'),
          [
            {
              text: t('actions.cancel'),
              style: 'cancel',
              isPreferred: true,
            },
            {
              text: t('actions.confirm'),
              style: 'destructive',
              onPress: async () => {
                advancedLogger.warn(`Clear refresh token before switching storage`);
                await useAuthStore.getState().clear();
                advancedLogger.warn(`Switching tokens storage to AsyncStorage`);
                await useSettingsStore.setState({ areTokensInAsyncStorage: value });
                Updates.reloadAsync();
              },
            },
          ],
          { cancelable: true },
        );
      } else {
        advancedLogger.warn(`Clear refresh token before switching storage`);
        await useAuthStore.getState().clear();
        advancedLogger.warn(`Switching tokens storage to SecureStorage}`);
        await useSettingsStore.setState({ areTokensInAsyncStorage: value });
        Updates.reloadAsync();
      }
    },
    [t],
  );

  const invalidateCache = useCallback(() => {
    queryClient
      .resetQueries()
      .then(() => {
        toastStore.add({
          message: t('advanced.store.invalidate.onInvalidate.success'),
          type: 'success',
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
          type: 'success',
          timeout: 3000,
        });
        resetNavigation('/');
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
      contentStyle={tw`py-6`}
      description={t('advanced.description')}
      title={t('advanced.title')}>
      <Animated.Text
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6`]}>
        {t('advanced.services.title')}
      </Animated.Text>
      <ServiceRow
        withBottomDivider
        label={t('advanced.services.apiBaseUrl.label')}
        renderDescription={() => (
          <TextInput
            autoCapitalize="none"
            placeholder={HTTP.defaults.baseURL}
            placeholderTextColor={
              tw.prefixMatch('dark') ? tw.color('slate-400/50') : tw.color('slate-500/50')
            }
            style={tw`text-slate-500 dark:text-slate-400`}
            value={settingsStore.apiBaseUrl || ''}
            onBlur={() => queryClient.invalidateQueries()}
            onChangeText={(apiBaseUrl) => useSettingsStore.setState({ apiBaseUrl })}
          />
        )}
        style={tw`px-3 mx-3`}
      />
      <ServiceRow
        description={t('advanced.services.crash.description')}
        label={t('advanced.services.crash.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="bomb"
        onPress={() => {
          throw new Error("Don't worry, this is a test crash!");
        }}
      />

      <Animated.Text
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6 mt-6`]}>
        {t('advanced.store.title')}
      </Animated.Text>
      <ServiceRow
        withBottomDivider
        label={t('advanced.store.onboarding.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.hasOnboard}
          onColor={theme.meatBrown}
          onValueChange={(value) => useSettingsStore.setState({ hasOnboard: value })}
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        label={t('advanced.store.hasLearnPullToRefresh.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.hasLearnPullToRefresh}
          onColor={theme.meatBrown}
          onValueChange={(value) => useSettingsStore.setState({ hasLearnPullToRefresh: value })}
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        label={t('advanced.store.withNativePullToRefresh.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.withNativePullToRefresh}
          onColor={theme.meatBrown}
          onValueChange={(value) => useSettingsStore.setState({ withNativePullToRefresh: value })}
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        description={`${authStore.accessToken}`}
        disabled={!authStore.accessToken}
        label={t('advanced.store.accessToken.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="content-copy"
        onPress={copyAccessToken}
      />
      <ServiceRow
        withBottomDivider
        description={`${authStore.refreshToken}`}
        disabled={!authStore.refreshToken}
        label={t('advanced.store.refreshToken.label')}
        style={tw`px-3 mx-3`}
        suffixIcon="content-copy"
        onPress={copyRefreshToken}
      />
      <ServiceRow
        withBottomDivider
        description={t('advanced.store.tokensStorage.description')}
        label={t('advanced.store.tokensStorage.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.areTokensInAsyncStorage}
          onColor={theme.meatBrown}
          onValueChange={onSwitchAuthStorage}
        />
      </ServiceRow>
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
    </ServiceLayout>
  );
};

export default Advanced;
