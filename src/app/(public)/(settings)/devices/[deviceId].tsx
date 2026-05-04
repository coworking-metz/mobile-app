import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import SegmentedControl from 'react-native-segmented-control-2';
import { TextFieldRef } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppIcon from '@/components/AppIcon';
import AppRoundedButton from '@/components/AppRoundedButton';
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
import useToastStore from '@/stores/toast';

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
  const [shouldDelete, setShouldDelete] = useState(false);
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
          timeout: 3000,
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
        router.canGoBack() ? router.back() : router.replace('/devices');
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
          timeout: 3000,
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
        router.canGoBack() ? router.back() : router.replace('/devices');
      })
      .catch(handleSilentError)
      .catch((error) => noticeStore.addError(error, { message: t('devices.onDelete.fail') }))
      .finally(() => {
        setDeleting(false);
      });
  }, [router, authStore.user, device, deviceId]);

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
          onPress: () => setShouldDelete(true),
        },
      ]}
      contentStyle={tw`pt-6`}
      footer={
        shouldDelete ? (
          <AppBottomSheet onClose={() => setShouldDelete(false)}>
            <View style={tw`flex flex-col items-stretch gap-4 px-6 pt-6`}>
              <AppText
                style={tw`text-center self-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('devices.detail.delete.title')}
              </AppText>
              <AppText
                style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
                {t('devices.detail.delete.description')}
              </AppText>
              <AppRoundedButton
                loading={isDeleting}
                style={tw`w-full max-w-sm self-center`}
                suffixIcon="trash-can-outline"
                onPress={onDelete}>
                <AppText style={tw`text-base text-black font-medium`}>
                  {t('devices.detail.delete.confirm')}
                </AppText>
              </AppRoundedButton>
            </View>
          </AppBottomSheet>
        ) : null
      }
      loading={isFetchingDevices}
      title={device?.name ?? device?.macAddress ?? ''}
      onRefresh={refetchDevices}>
      <View style={tw`flex flex-col grow px-3 w-full max-w-xl mx-auto`}>
        {devicesError ? (
          <ErrorChip
            error={devicesError}
            label={t('devices.onFetch.fail')}
            style={tw`mb-4 mx-3 self-start`}
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
          <View style={tw`flex flex-row items-start gap-3 w-full overflow-hidden mb-4 px-3`}>
            <AppIcon
              color={tw.color('blue-600')}
              icon="information"
              size={24}
              style={tw`shrink-0 grow-0`}
            />

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
              style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}
            />
          </View>
        )}

        <View style={tw`flex flex-col items-start gap-1 mx-3`}>
          <AppText style={tw`text-base leading-5 font-normal text-gray-800 dark:text-neutral-500`}>
            {t('devices.detail.type.label')}
          </AppText>
          <SegmentedControl
            activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
            style={tw`basis-0 bg-gray-200 dark:bg-zinc-800 w-full`}
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
                  style={tw`text-base font-normal text-slate-600 dark:text-neutral-400 grow`}>
                  {t(`devices.detail.type.value.${deviceType}`)}
                </AppText>
              </View>
            ))}
            value={DEVICE_TYPES.findIndex((deviceType) => deviceType === type)}
            onChange={(index) => setType(DEVICE_TYPES[index])}
          />
        </View>

        <Divider style={tw`mt-6 mx-3`} />

        <ServiceRow
          description={
            device?.heartbeat &&
            (dayjs(device.heartbeat).isBefore(dayjs().subtract(1, 'hour'))
              ? dayjs(device.heartbeat).format('lll')
              : dayjs(device.heartbeat).fromNow())
          }
          label={t('devices.detail.location.label')}
          prefix={
            <View style={tw`flex flex-row items-center shrink-0 min-h-10 relative`}>
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
                  style={tw`z-20 h-3.5 w-3.5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-0 -right-1`}>
                  <View style={tw`h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
                </Animated.View>
              )}
            </View>
          }
          style={tw`px-3 mb-3`}
          onPress={() =>
            device?.location
              ? router.push({ pathname: '/on-premise', params: { location: device.location } })
              : null
          }>
          {device?.location ? (
            <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
              {t(`onPremise.location.${device.location}`)}
            </AppText>
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
              {t(`devices.detail.location.nowhere`)}
            </AppText>
          )}
        </ServiceRow>

        <View style={tw`mt-auto mx-3`}>
          <AppRoundedButton
            disabled={!device || isSubmitting}
            loading={isSubmitting}
            style={tw`w-full max-w-sm self-center`}
            suffixIcon="check"
            onPress={onSubmit}>
            <AppText style={tw`text-base font-medium text-black`}>{t('actions.apply')}</AppText>
          </AppRoundedButton>
        </View>
      </View>
    </ServiceLayout>
  );
};

export default DeviceDetail;
