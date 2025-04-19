import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import SegmentedControl from 'react-native-segmented-control-2';
import { TextFieldRef } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import {
  formatMacAddress,
  getDeviceTypeIcon,
  isLocallyAdministeredMacAddress,
  isValidMacAddress,
  MAC_ADDRESS_LENGTH,
} from '@/helpers/device';
import { handleSilentError, useErrorNotice } from '@/helpers/error';
import { addMemberDevice, ApiMemberDevice, DeviceType } from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useToastStore from '@/stores/toast';

const DEVICE_TYPES = Object.values(DeviceType) as DeviceType[];

const NewDevice = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();

  const { name: queryName, macAddress: queryMacAddress } = useLocalSearchParams<{
    name?: string;
    macAddress?: string;
  }>();

  const authStore = useAuthStore();
  const router = useRouter();
  const noticeError = useErrorNotice();
  const toastStore = useToastStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>(Device.deviceName ?? '');
  const nameField = useRef<TextFieldRef>(null);
  const [macAddress, setMacAddress] = useState<string>('');
  const macAddressField = useRef<TextFieldRef>(null);
  const [type, setType] = useState<DeviceType>(DeviceType.MOBILE);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(() => {
    if (!nameField.current?.validate() || !macAddressField.current?.validate()) {
      return;
    }

    nameField.current.blur();
    macAddressField.current.blur();

    setSubmitting(true);
    addMemberDevice(
      authStore.user?.id as string,
      {
        name,
        macAddress,
        type,
      } as ApiMemberDevice,
    )
      .then(() => {
        toastStore.add({
          message: t('devices.onAdd.success', { name: name || macAddress }),
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
        noticeError(error, t('devices.onAdd.fail'));
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [
    authStore.user,
    queryClient,
    router,
    toastStore,
    nameField,
    macAddressField,
    name,
    macAddress,
    type,
  ]);

  useEffect(() => {
    if (queryName) {
      setName(queryName as string);
    }
    if (queryMacAddress) {
      setMacAddress(formatMacAddress(queryMacAddress as string));
    }
  }, [queryName, queryMacAddress]);

  return (
    <ServiceLayout contentStyle={tw`pt-6`} title={t('devices.new.title')}>
      <View style={tw`flex flex-col grow px-6 w-full max-w-xl mx-auto`}>
        <AppTextField
          ref={nameField}
          enableErrors
          showCharCounter
          validateOnChange
          label={t('devices.detail.name.label')}
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
          label={t('devices.detail.macAddress.label')}
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
          <View style={tw`flex flex-row items-start flex-gap-2 w-full overflow-hidden mb-4`}>
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

        <View style={tw`flex flex-col items-start gap-1 mb-6`}>
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
            value={DEVICE_TYPES.findIndex((t) => t === type)}
            onChange={(index) => setType(DEVICE_TYPES[index])}
          />
        </View>

        <View style={tw`mt-auto`}>
          <AppRoundedButton
            disabled={isSubmitting}
            loading={isSubmitting}
            style={tw`min-h-14 w-full max-w-md self-center`}
            suffixIcon="plus"
            onPress={onSubmit}>
            <AppText style={tw`text-base font-medium text-black`}>{t('actions.add')}</AppText>
          </AppRoundedButton>
        </View>
      </View>
    </ServiceLayout>
  );
};

export default NewDevice;
