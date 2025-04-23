import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import SegmentedControl from 'react-native-segmented-control-2';
import { TextFieldRef } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
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
import { handleSilentError, useErrorNotice } from '@/helpers/error';
import {
  ApiMemberDevice,
  deleteMemberDevice,
  DeviceType,
  getMemberDevice,
  updateMemberDevice,
} from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useToastStore from '@/stores/toast';

const DEVICE_TYPES = Object.values(DeviceType) as DeviceType[];

const DeviceDetail = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const router = useRouter();
  const noticeError = useErrorNotice();
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
    data: device,
    isPending: isPendingDevice,
    isFetching: isFetchingDevice,
    error: deviceError,
    refetch: refetchDevice,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'devices', `${deviceId}`],
    queryFn: ({ queryKey: [_members, userId, _devices, id] }) => {
      if (userId) {
        if (id) {
          return getMemberDevice(userId, id as string);
        }
        throw new Error(t('devices.onFetch.missing'));
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    retry: false,
    enabled: !!authStore.user?.id && !!deviceId,
    staleTime: 300_000,
  });

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
          queryKey: ['members', authStore.user?.id, 'devices'],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['members', authStore.user?.id],
          exact: true,
        });
        router.canGoBack() ? router.back() : router.replace('/devices');
      })
      .catch(handleSilentError)
      .catch(async (error) => {
        noticeError(error, t('devices.onUpdate.fail'));
      })
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
          queryKey: ['members', authStore.user?.id, 'devices'],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['members', authStore.user?.id],
          exact: true,
        });
        router.canGoBack() ? router.back() : router.replace('/devices');
      })
      .catch(handleSilentError)
      .catch((error) => {
        noticeError(error, t('devices.onDelete.fail'));
      })
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
          image: Platform.select({
            ios: 'trash',
            android: 'ic_menu_delete',
          }),
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
                style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400`}>
                {t('devices.detail.delete.description')}
              </AppText>
              <AppRoundedButton
                loading={isDeleting}
                style={tw`h-14 w-full max-w-md self-center`}
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
      loading={isPendingDevice}
      title={device?.name ?? device?.macAddress ?? ''}
      onRefresh={refetchDevice}>
      <View style={tw`flex flex-col grow px-3 w-full max-w-xl mx-auto`}>
        {deviceError && (
          <ErrorChip error={deviceError} label={t('devices.onFetch.fail')} style={tw`mb-6 mx-3`} />
        )}
        <AppTextField
          ref={nameField}
          enableErrors
          showCharCounter
          validateOnChange
          containerStyle={tw`mx-3`}
          label={t('devices.detail.name.label')}
          loading={isFetchingDevice}
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
          loading={isFetchingDevice}
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
          <View style={tw`flex flex-row items-start flex-gap-2 w-full overflow-hidden mb-4 mx-3`}>
            <MaterialCommunityIcons
              color={tw.color('blue-600')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="information"
              size={24}
              style={tw`shrink-0 grow-0`}
            />

            <AppText
              style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400 shrink grow basis-0`}>
              {t('devices.detail.macAddress.locallyAdministered')}
            </AppText>
          </View>
        )}

        <View style={tw`flex flex-col items-start gap-1 mx-3`}>
          <AppText style={tw`text-base leading-5 font-normal dark:text-gray-200`}>
            {t('devices.detail.type.label')}
          </AppText>
          <SegmentedControl
            activeTabColor={tw.prefixMatch('dark') ? tw.color('slate-700') : tw.color('white')}
            style={tw`basis-0 bg-gray-200 dark:bg-slate-800 w-full`}
            tabs={DEVICE_TYPES.map((deviceType) => (
              <View key={`device-type-${deviceType}`} style={tw`flex flex-col items-center gap-1`}>
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                  iconStyle={{ height: 12, width: 12, marginRight: 0 }}
                  name={getDeviceTypeIcon(deviceType)}
                  size={20}
                  style={tw``}
                />
                <AppText
                  numberOfLines={1}
                  style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>
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
          description={device?.heartbeat && dayjs(device?.heartbeat).format('lll')}
          label={t('devices.detail.location.label')}
          prefixIcon="map-marker-outline"
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
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
              {t(`devices.detail.location.nowhere`)}
            </AppText>
          )}
        </ServiceRow>

        <View style={tw`mt-auto mx-3`}>
          <AppRoundedButton
            disabled={!device || isSubmitting}
            loading={isSubmitting}
            style={tw`min-h-14 w-full max-w-md self-center`}
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
