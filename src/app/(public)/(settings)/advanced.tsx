import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppIconButton from '@/components/AppIconButton';
import AppSwitch from '@/components/AppSwitch';
import AppTextField from '@/components/AppTextField';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useNotificationStore from '@/stores/notification';
import useSettingsStore from '@/stores/settings';
import useToastStore, { TOAST_SUCCESS_TIMEOUT } from '@/stores/toast';

const advancedLogger = log.extend(`[advanced]`);

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const notificationsStore = useNotificationStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isClearingCache, setClearingCache] = useState(false);
  const [isResetting, setResetting] = useState(false);

  const onSwitchAuthStorage = useCallback(
    async (value: boolean) => {
      if (value) {
        Alert.alert(
          t('advanced.support.switchTokensStorage.onWarn.title'),
          t('advanced.support.switchTokensStorage.onWarn.description'),
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
                advancedLogger.warn(`Clear tokens before switching storage`);
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
        advancedLogger.warn(`Clear tokens before switching storage`);
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
      (!!authStore.user ? authStore.refreshAccessToken() : Promise.resolve()).then(() =>
        queryClient.resetQueries(),
      ),
    ])
      .then(() => {
        toastStore.add({
          message: t('advanced.support.clearCache.onCleared.success'),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
      })
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('advanced.support.clearCache.onCleared.fail'),
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
          message: t('advanced.support.reset.onReset.success'),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
        router.dismissTo('/');
      })
      .catch((error) =>
        noticeStore.addError(error, { message: t('advanced.support.reset.onReset.fail') }),
      )
      .finally(() => {
        setResetting(false);
      });
  }, [queryClient, authStore.clear, settingsStore.clear, toastStore, noticeStore]);

  const confirmReset = useCallback(() => {
    Alert.alert(
      t('advanced.support.reset.confirm.title'),
      t('advanced.support.reset.confirm.message'),
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

  const onCopyToClipboard = useCallback(
    (text: string) => {
      Clipboard.setStringAsync(text)
        .then(() => {
          toastStore.add({
            message: t('advanced.onCopyToClipboard.success'),
            type: 'success',
            timeout: TOAST_SUCCESS_TIMEOUT,
          });
        })
        .catch((error) =>
          noticeStore.addError(error, { message: t('advanced.onCopyToClipboard.fail') }),
        );
    },
    [toastStore, t],
  );

  return (
    <ServiceLayout
      contentStyle={tw`pt-6`}
      description={t('advanced.description')}
      title={t('advanced.title')}
      withBackButton={!_root}>
      <View style={tw`mx-auto mb-6 w-full max-w-xl`}>
        <SectionTitle style={tw`mx-6`} title={t('advanced.support.title')} />

        <Link asChild href="/logs/all-logs">
          <ServiceRow
            withBottomDivider
            label={t('advanced.logs.title')}
            style={tw`mx-3 px-3`}
            suffixIcon="chevron-right"
          />
        </Link>
        <ServiceRow
          withBottomDivider
          description={t('advanced.support.clearCache.description')}
          label={t('advanced.support.clearCache.label')}
          loading={isClearingCache}
          style={tw`mx-3 px-3`}
          suffixIcon="trash-can-outline"
          onPress={clearCache}
        />
        <ServiceRow
          withBottomDivider
          description={t('advanced.support.crash.description')}
          label={t('advanced.support.crash.label')}
          style={tw`mx-3 px-3`}
          suffixIcon="bomb"
          onPress={() => {
            throw new Error("Don't worry, this is a test crash!");
          }}
        />
        <ServiceRow
          label={t('advanced.support.reset.label')}
          loading={isResetting}
          style={tw`mx-3 px-3`}
          suffixIcon="nuke"
          onPress={confirmReset}
        />

        <SectionTitle style={tw`mx-6 mt-6`} title={t('advanced.settings.title')} />

        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.introduction.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.hasSeenIntroduction}
            onValueChange={(value) => useSettingsStore.setState({ hasSeenIntroduction: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.hasLearnPullToRefresh.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.hasLearnPullToRefresh}
            onValueChange={(value) => useSettingsStore.setState({ hasLearnPullToRefresh: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.withNativePullToRefresh.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.withNativePullToRefresh}
            onValueChange={(value) => useSettingsStore.setState({ withNativePullToRefresh: value })}
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.withBottomSheetFullHeight.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.withBottomSheetFullHeight}
            onValueChange={(value) =>
              useSettingsStore.setState({ withBottomSheetFullHeight: value })
            }
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.hasSeenBirthdayPresentAt.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={!isNil(settingsStore.hasSeenBirthdayPresentAt)}
            onValueChange={(value) =>
              useSettingsStore.setState({
                hasSeenBirthdayPresentAt: value ? dayjs().toISOString() : null,
              })
            }
          />
        </ServiceRow>

        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.hasReadOnboardingInstructionsAt.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={!isNil(settingsStore.hasReadOnboardingInstructionsAt)}
            onValueChange={(value) =>
              useSettingsStore.setState({
                hasReadOnboardingInstructionsAt: value ? dayjs().toISOString() : null,
              })
            }
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.hidePushNotificationsAlert.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.hidePushNotificationsAlert}
            onValueChange={(value) =>
              useSettingsStore.setState({ hidePushNotificationsAlert: value })
            }
          />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('advanced.settings.hasBeenInvitedToReview.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.hasBeenInvitedToReview}
            onValueChange={(value) => useSettingsStore.setState({ hasBeenInvitedToReview: value })}
          />
        </ServiceRow>

        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mx-6 mt-3`}
          keyboardType="url"
          label={t('advanced.settings.apiBaseUrl.label')}
          placeholder={HTTP.defaults.baseURL}
          value={settingsStore.apiBaseUrl ?? ''}
          onChangeText={(apiBaseUrl) => useSettingsStore.setState({ apiBaseUrl })}
        />
        <AppTextField
          readOnly
          autoCapitalize="none"
          containerStyle={tw`mx-6`}
          keyboardType="default"
          label={t('advanced.settings.pushNotificationsToken.label')}
          value={notificationsStore.expoPushToken ?? ''}
          onChangeText={(expoPushToken) => useNotificationStore.setState({ expoPushToken })}
          {...(notificationsStore.expoPushToken && {
            trailingAccessory: (
              <AppIconButton
                icon="content-copy"
                iconSize={20}
                style={tw`absolute right-2 size-8 shrink-0`}
                onPress={() => onCopyToClipboard(notificationsStore.expoPushToken ?? '')}
              />
            ),
          })}
        />
        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mx-6`}
          keyboardType="default"
          label={t('advanced.settings.accessToken.label')}
          placeholder={authStore.accessToken ?? ''}
          value={`${authStore.accessToken}`}
          onChangeText={(accessToken) =>
            useAuthStore.setState({ accessToken: accessToken || null })
          }
          {...(authStore.accessToken && {
            trailingAccessory: (
              <AppIconButton
                icon="content-copy"
                iconSize={20}
                style={tw`absolute right-2 size-8 shrink-0`}
                onPress={() => onCopyToClipboard(authStore.accessToken ?? '')}
              />
            ),
          })}
        />
        <AppTextField
          autoCapitalize="none"
          containerStyle={tw`mx-6`}
          keyboardType="default"
          label={t('advanced.settings.refreshToken.label')}
          placeholder={authStore.refreshToken ?? ''}
          value={`${authStore.refreshToken}`}
          onChangeText={(refreshToken) =>
            useAuthStore.setState({ refreshToken: refreshToken || null })
          }
          {...(authStore.refreshToken && {
            trailingAccessory: (
              <AppIconButton
                icon="content-copy"
                iconSize={20}
                style={tw`absolute right-2 size-8 shrink-0`}
                onPress={() => onCopyToClipboard(authStore.refreshToken ?? '')}
              />
            ),
          })}
        />
        <Divider style={tw`mx-6`} />
        <ServiceRow
          description={t('advanced.support.switchTokensStorage.description')}
          label={t('advanced.support.switchTokensStorage.label')}
          style={tw`mx-3 px-3`}>
          <AppSwitch
            value={settingsStore.areTokensInAsyncStorage}

            onValueChange={onSwitchAuthStorage}
          />
        </ServiceRow>
      </View>
    </ServiceLayout>
  );
};

export default Advanced;
