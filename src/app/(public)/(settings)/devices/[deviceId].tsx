import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import { TextFieldRef } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppAlert from '@/components/AppAlert';
import AppIcon from '@/components/AppIcon';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppSegmentedControl from '@/components/AppSegmentedControl';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import AppTextLink from '@/components/AppTextLink';
import Divider from '@/components/Divider';
import ErrorChip from '@/components/ErrorChip';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import {
  formatMacAddress,
  getDeviceTypeIcon,
  isLocallyAdministeredMacAddress,
  isValidMacAddress,
  MAC_ADDRESS_LENGTH,
} from '@/helpers/device';
import { handleSilentError } from '@/helpers/error';
import {
  ApiMemberDevice,
  deleteMemberDevice,
  DeviceType,
  getMemberDevices,
  updateMemberDevice,
} from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useToastStore, { TOAST_SUCCESS_TIMEOUT } from '@/stores/toast';

const DEVICE_TYPES = Object.values(DeviceType) as DeviceType[];

const DeviceDetail = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const router = useRouter();
  const noticeStore = useNoticeStore();
  const queryClient = useQueryClient();
  const { deviceId } = useLocalSearchParams();
  const [name, setName] = useState<string>('');
  const nameField = useRef<TextFieldRef>(null);
  const [macAddress, setMacAddress] = useState<string>('');
  const macAddressField = useRef<TextFieldRef>(null);
  const [type, setType] = useState<DeviceType>(DeviceType.MOBILE);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const {
    isFetching: isFetchingDevices,
    data: devices,
    error: devicesError,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberDevices(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const device = useMemo(() => {
    return devices?.find(({ _id }) => `${deviceId}` === `${_id}`) ?? null;
  }, [devices, deviceId]);

  const onSubmit = useCallback(() => {
    if (!nameField.current?.validate() || !macAddressField.current?.validate()) {
      return;
    }

    nameField.current.blur();
    macAddressField.current.blur();

    setSubmitting(true);
    updateMemberDevice(
      authStore.user?.id as string,
      device?._id as string,
      {
        ...device,
        name,
        macAddress,
        type,
      } as ApiMemberDevice,
    )
      .then(() => {
        toastStore.add({
          message: t('devices.onUpdate.success', { name: name || macAddress }),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.attending(),
          exact: true,
        });
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/devices');
        }
      })
      .catch(handleSilentError)
      .catch((error) => noticeStore.addError(error, { message: t('devices.onUpdate.fail') }))
      .finally(() => {
        setSubmitting(false);
      });
  }, [
    authStore.user,
    queryClient,
    router,
    toastStore,
    device,
    nameField,
    macAddressField,
    name,
    macAddress,
    type,
  ]);

  const onDelete = useCallback(() => {
    setDeleting(true);
    deleteMemberDevice(authStore.user?.id as string, deviceId as string)
      .then(() => {
        toastStore.add({
          message: t('devices.onDelete.success', { name: device?.name || device?.macAddress }),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.attending(),
          exact: true,
        });
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/devices');
        }
      })
      .catch(handleSilentError)
      .catch((error) => noticeStore.addError(error, { message: t('devices.onDelete.fail') }))
      .finally(() => {
        setDeleting(false);
      });
  }, [router, authStore.user, device, deviceId]);

  const onConfirmDelete = useCallback(() => {
    Alert.alert(
      t('devices.detail.delete.title'),
      t('devices.detail.delete.description'),
      [
        {
          text: t('actions.cancel'),
          style: 'cancel',
          isPreferred: true,
        },
        {
          text: t('devices.detail.delete.confirm'),
          style: 'destructive',
          onPress: onDelete,
        },
      ],
      { cancelable: true },
    );
  }, [t, onDelete]);

  useEffect(() => {
    if (device) {
      setName(device.name ?? '');
      setMacAddress(formatMacAddress(device.macAddress));
      if (DEVICE_TYPES.includes(device.type as DeviceType)) {
        setType(device.type as DeviceType);
      } else {
        setType(DeviceType.UNKNOWN);
      }
    }
  }, [device]);

  return (
    <ServiceLayout
      actions={[
        {
          id: 'delete',
          title: t('devices.detail.delete.confirm'),
          attributes: {
            destructive: true,
          },
          onPress: onConfirmDelete,
        },
      ]}
      contentStyle={tw`pt-6`}
      loading={isFetchingDevices || isDeleting}
      title={device?.name ?? device?.macAddress ?? ''}
      onRefresh={refetchDevices}>
      <View style={tw`mx-auto flex w-full max-w-xl grow flex-col px-3`}>
        {devicesError ? (
          <ErrorChip
            error={devicesError}
            label={t('devices.onFetch.fail')}
            style={tw`mx-3 mb-4 self-start`}
            onRetry={refetchDevices}
          />
        ) : null}
        <AppTextField
          ref={nameField}
          enableErrors
          showCharCounter
          validateOnChange
          containerStyle={tw`mx-3`}
          label={t('devices.detail.name.label')}
          loading={isFetchingDevices}
          validate={['required']}
          validationMessage={[t('validations.required')]}
          value={name}
          onChangeText={setName}
        />
        <AppTextField
          ref={macAddressField}
          enableErrors
          showCharCounter
          validateOnChange
          containerStyle={tw`mx-3`}
          label={t('devices.detail.macAddress.label')}
          loading={isFetchingDevices}
          maxLength={MAC_ADDRESS_LENGTH}
          placeholder={t('devices.detail.macAddress.placeholder')}
          validate={['required', isValidMacAddress]}
          validationMessage={[t('validations.required'), t('validations.macAddress')]}
          value={macAddress}
          onChangeText={(newMacAddress) => {
            setMacAddress(formatMacAddress(newMacAddress));
          }}
        />
        {isLocallyAdministeredMacAddress(macAddress) && (
          <AppAlert style={tw`mb-4 px-3`} type="info">
            <Trans
              components={[
                <AppTextLink
                  href={`${WORDPRESS_BASE_URL}/comment-desactiver-les-adresses-mac-aleatoires/`}
                  key="how-to-disable-random-mac-addresses-link"
                  style={tw`text-amber-500`}
                  target="_blank"
                />,
              ]}
              defaults={t('devices.detail.macAddress.locallyAdministered')}
              parent={AppText}
              style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
            />
          </AppAlert>
        )}

        <View style={tw`mx-3 flex flex-col items-start gap-1`}>
          <AppText style={tw`text-base font-normal leading-5 text-gray-800 dark:text-neutral-500`}>
            {t('devices.detail.type.label')}
          </AppText>
          <AppSegmentedControl
            activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
            style={tw`w-full basis-0 bg-gray-200 dark:bg-zinc-800`}
            tabs={DEVICE_TYPES.map((deviceType) => (
              <View key={`device-type-${deviceType}`} style={tw`flex flex-col items-center gap-1`}>
                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                  icon={getDeviceTypeIcon(deviceType)}
                  size={20}
                  style={tw``}
                />
                <AppText
                  numberOfLines={1}
                  style={tw`grow text-base font-normal text-slate-600 dark:text-neutral-400`}>
                  {t(`devices.detail.type.value.${deviceType}`)}
                </AppText>
              </View>
            ))}
            value={DEVICE_TYPES.findIndex((deviceType) => deviceType === type)}
            onChange={(index) => setType(DEVICE_TYPES[index])}
          />
        </View>

        <Divider style={tw`mx-3 mt-6`} />

        <ServiceRow
          description={
            device?.heartbeat &&
            (dayjs(device.heartbeat).isBefore(dayjs().subtract(1, 'hour'))
              ? dayjs(device.heartbeat).format('lll')
              : dayjs(device.heartbeat).fromNow())
          }
          label={t('devices.detail.location.label')}
          prefix={
            <View style={tw`relative flex min-h-10 shrink-0 flex-row items-center`}>
              <AppIcon
                color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
                icon="map-marker-outline"
                size={24}
                style={tw`shrink-0`}
              />

              {device?.attending && (
                <Animated.View
                  entering={BounceIn.duration(1000)}
                  exiting={BounceOut.duration(1000)}
                  style={tw`absolute -bottom-0 -right-1 z-20 flex size-3.5 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-900`}>
                  <View style={tw`size-2.5 rounded-full bg-emerald-600 dark:bg-emerald-700`} />
                </Animated.View>
              )}
            </View>
          }
          style={tw`mb-3 px-3`}
          onPress={() =>
            device?.location
              ? router.push({ pathname: '/on-premise', params: { location: device.location } })
              : null
          }>
          {device?.location ? (
            <AppText style={tw`text-right text-base font-normal text-amber-500`}>
              {t(`onPremise.location.${device.location}`)}
            </AppText>
          ) : (
            <AppText
              style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {t(`devices.detail.location.nowhere`)}
            </AppText>
          )}
        </ServiceRow>

        <View style={tw`mx-3 mt-auto`}>
          <AppRoundedButton
            disabled={!device || isSubmitting || isDeleting}
            label={t('actions.apply')}
            loading={isSubmitting || isDeleting}
            style={tw`w-full max-w-sm self-center`}
            suffixIcon="check"
            onPress={onSubmit}
          />
        </View>
      </View>
    </ServiceLayout>
  );
};

export default DeviceDetail;
