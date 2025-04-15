import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import * as Updates from 'expo-updates';
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TextInput } from 'react-native';
import { FadeInLeft } from 'react-native-reanimated';
import { Switch } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
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
  const [isClearingCache, setClearingCache] = useState(false);
  const [isResetting, setResetting] = useState(false);

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

  const clearCache = useCallback(() => {
    setClearingCache(true);
    Promise.all([
      Image.clearDiskCache(),
      Image.clearMemoryCache(),
      authStore.refreshAccessToken().then(() => queryClient.resetQueries()),
    ])
      .then(() => {
        toastStore.add({
          message: t('advanced.store.clearCache.onCleared.success'),
          type: 'success',
          timeout: 3_000,
        });
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.clearCache.onCleared.fail'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setClearingCache(false);
      });
  }, [queryClient, toastStore, noticeStore]);

  const reset = useCallback(() => {
    setResetting(true);
    Promise.all([authStore.clear(), settingsStore.clear()])
      .then(() =>
        Promise.all([queryClient.clear(), Image.clearDiskCache(), Image.clearMemoryCache()]),
      )
      .then(() => {
        toastStore.add({
          message: t('advanced.store.reset.onReset.success'),
          type: 'success',
          timeout: 3000,
        });
        resetNavigation('/home');
      })
      .catch(async (error: Error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('advanced.store.reset.onReset.fail'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setResetting(false);
      });
  }, [queryClient, authStore.clear, settingsStore.clear, toastStore, noticeStore]);

  const confirmReset = useCallback(() => {
    Alert.alert(
      t('advanced.store.reset.confirm.title'),
      t('advanced.store.reset.confirm.message'),
      [
        {
          text: t('actions.cancel'),
          style: 'cancel',
          isPreferred: true,
        },
        {
          text: t('actions.confirm'),
          style: 'destructive',
          onPress: reset,
        },
      ],
      { cancelable: true },
    );
  }, [t]);

  return (
    <ServiceLayout
      contentStyle={tw`py-6`}
      description={t('advanced.description')}
      title={t('advanced.title')}>
      <AppText
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6`]}>
        {t('advanced.services.title')}
      </AppText>
      <ServiceRow
        withBottomDivider
        description={HTTP.defaults.baseURL}
        label={t('advanced.services.apiBaseUrl.label')}
        renderDescription={() => (
          <TextInput
            autoCapitalize="none"
            keyboardType="url"
            placeholder={HTTP.defaults.baseURL}
            placeholderTextColor={
              tw.prefixMatch('dark') ? tw.color('slate-400/50') : tw.color('slate-500/50')
            }
            style={tw`text-slate-500 dark:text-slate-400`}
            value={settingsStore.apiBaseUrl || ''}
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

      <AppText
        entering={FadeInLeft.duration(300)}
        style={[tw`text-sm uppercase text-slate-500 mx-6 mt-6`]}>
        {t('advanced.store.title')}
      </AppText>
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
        label={t('advanced.store.hasSeenBirthdayPresentAt.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={!isNil(settingsStore.hasSeenBirthdayPresentAt)}
          onColor={theme.meatBrown}
          onValueChange={(value) =>
            useSettingsStore.setState({
              hasSeenBirthdayPresentAt: value ? dayjs().toISOString() : null,
            })
          }
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        label={t('advanced.store.hasBeenInvitedToReview.label')}
        style={tw`px-3 mx-3`}>
        <Switch
          value={settingsStore.hasBeenInvitedToReview}
          onColor={theme.meatBrown}
          onValueChange={(value) => useSettingsStore.setState({ hasBeenInvitedToReview: value })}
        />
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        description={`${authStore.accessToken}`}
        label={t('advanced.store.accessToken.label')}
        renderDescription={() => (
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            placeholder={isNil(authStore.accessToken) ? `${authStore.accessToken}` : ''}
            placeholderTextColor={
              tw.prefixMatch('dark') ? tw.color('slate-400/50') : tw.color('slate-500/50')
            }
            style={tw`text-slate-500 dark:text-slate-400`}
            value={authStore.accessToken || ''}
            onChangeText={(accessToken) =>
              useAuthStore.setState({ accessToken: accessToken || null })
            }
          />
        )}
        style={tw`px-3 mx-3`}
      />
      <ServiceRow
        withBottomDivider
        description={`${authStore.refreshToken}`}
        label={t('advanced.store.refreshToken.label')}
        renderDescription={() => (
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            placeholder={isNil(authStore.refreshToken) ? `${authStore.refreshToken}` : ''}
            placeholderTextColor={
              tw.prefixMatch('dark') ? tw.color('slate-400/50') : tw.color('slate-500/50')
            }
            style={tw`text-slate-500 dark:text-slate-400`}
            value={authStore.refreshToken || ''}
            onChangeText={(refreshToken) =>
              useAuthStore.setState({ refreshToken: refreshToken || null })
            }
          />
        )}
        style={tw`px-3 mx-3`}
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
        description={t('advanced.store.clearCache.description')}
        label={t('advanced.store.clearCache.label')}
        loading={isClearingCache}
        style={tw`px-3 mx-3`}
        suffixIcon="trash-can-outline"
        onPress={clearCache}
      />
      <ServiceRow
        label={t('advanced.store.reset.label')}
        loading={isResetting}
        style={tw`px-3 mx-3`}
        suffixIcon="nuke"
        onPress={confirmReset}
      />
    </ServiceLayout>
  );
};

export default Advanced;
