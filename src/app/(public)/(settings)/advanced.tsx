import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppTextField from '@/components/AppTextField';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { theme } from '@/helpers/colors';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const advancedLogger = log.extend(`[advanced]`);

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isClearingCache, setClearingCache] = useState(false);
  const [isResetting, setResetting] = useState(false);

  const onSwitchAuthStorage = useCallback(
    async (value: boolean) => {
      if (value) {
        Alert.alert(
          t('advanced.actions.switchTokensStorage.alert.title'),
          t('advanced.actions.switchTokensStorage.alert.message'),
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
                await authStore.clear();
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
        await authStore.clear();
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
          message: t('advanced.actions.clearCache.onCleared.success'),
          type: 'success',
          timeout: 3_000,
        });
      })
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('advanced.actions.clearCache.onCleared.fail'),
        }),
      )
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
          message: t('advanced.actions.reset.onReset.success'),
          type: 'success',
          timeout: 3000,
        });
        router.dismissTo('/');
      })
      .catch((error) =>
        noticeStore.addError(error, { message: t('advanced.actions.reset.onReset.fail') }),
      )
      .finally(() => {
        setResetting(false);
      });
  }, [queryClient, authStore.clear, settingsStore.clear, toastStore, noticeStore]);

  const confirmReset = useCallback(() => {
    Alert.alert(
      t('advanced.actions.reset.confirm.title'),
      t('advanced.actions.reset.confirm.message'),
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
      contentStyle={tw`pt-6`}
      description={t('advanced.description')}
      title={t('advanced.title')}
      withBackButton={!_root}>
      <View style={tw`w-full max-w-xl mx-auto mb-6`}>
        <SectionTitle style={tw`mx-6`} title={t('advanced.actions.title')} />

        <ServiceRow
          withBottomDivider
          description={t('advanced.actions.clearCache.description')}
          label={t('advanced.actions.clearCache.label')}
          loading={isClearingCache}
          style={tw`px-3 mx-3`}
          suffixIcon="trash-can-outline"
          onPress={clearCache}
        />
        <ServiceRow
          withBottomDivider
          description={t('advanced.actions.crash.description')}
          label={t('advanced.actions.crash.label')}
          style={tw`px-3 mx-3`}
          suffixIcon="bomb"
          onPress={() => {
            throw new Error("Don't worry, this is a test crash!");
          }}
        />
        <ServiceRow
          label={t('advanced.actions.reset.label')}
          loading={isResetting}
          style={tw`px-3 mx-3`}
          suffixIcon="nuke"
          onPress={confirmReset}
        />

        <SectionTitle style={tw`mx-6 mt-6`} title={t('advanced.variables.title')} />

        <ServiceRow
          withBottomDivider
          label={t('advanced.variables.onboarding.label')}
          style={tw`px-3 mx-3`}>
          <Switch
            value={settingsStore.hasOnboard}
            onColor={theme.meatBrown}
            onValueChange={(value) => useSettingsStore.setState({ hasOnboard: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.variables.hasLearnPullToRefresh.label')}
          style={tw`px-3 mx-3`}>
          <Switch
            value={settingsStore.hasLearnPullToRefresh}
            onColor={theme.meatBrown}
            onValueChange={(value) => useSettingsStore.setState({ hasLearnPullToRefresh: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.variables.withNativePullToRefresh.label')}
          style={tw`px-3 mx-3`}>
          <Switch
            value={settingsStore.withNativePullToRefresh}
            onColor={theme.meatBrown}
            onValueChange={(value) => useSettingsStore.setState({ withNativePullToRefresh: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.variables.hasSeenBirthdayPresentAt.label')}
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
          label={t('advanced.variables.hasBeenInvitedToReview.label')}
          style={tw`px-3 mx-3`}>
          <Switch
            value={settingsStore.hasBeenInvitedToReview}
            onColor={theme.meatBrown}
            onValueChange={(value) => useSettingsStore.setState({ hasBeenInvitedToReview: value })}
          />
        </ServiceRow>
        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mt-3 mx-6`}
          keyboardType="url"
          label={t('advanced.variables.apiBaseUrl.label')}
          placeholder={HTTP.defaults.baseURL}
          value={settingsStore.apiBaseUrl || ''}
          onChangeText={(apiBaseUrl) => useSettingsStore.setState({ apiBaseUrl })}
        />
        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mx-6`}
          keyboardType="default"
          label={t('advanced.variables.accessToken.label')}
          placeholder={isNil(authStore.accessToken) ? `${authStore.accessToken}` : ''}
          value={`${authStore.accessToken}`}
          onChangeText={(accessToken) =>
            useAuthStore.setState({ accessToken: accessToken || null })
          }
        />
        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mx-6`}
          keyboardType="default"
          label={t('advanced.variables.refreshToken.label')}
          placeholder={isNil(authStore.refreshToken) ? `${authStore.refreshToken}` : ''}
          value={`${authStore.refreshToken}`}
          onChangeText={(refreshToken) =>
            useAuthStore.setState({ refreshToken: refreshToken || null })
          }
        />
        <Divider style={tw`mx-6`} />
        <ServiceRow
          description={t('advanced.actions.switchTokensStorage.description')}
          label={t('advanced.actions.switchTokensStorage.label')}
          style={tw`px-3 mx-3`}>
          <Switch
            value={settingsStore.areTokensInAsyncStorage}
            onColor={theme.meatBrown}
            onValueChange={onSwitchAuthStorage}
          />
        </ServiceRow>
      </View>
    </ServiceLayout>
  );
};

export default Advanced;
