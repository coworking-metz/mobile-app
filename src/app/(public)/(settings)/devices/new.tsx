import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import SegmentedControl from 'react-native-segmented-control-2';
import { TextFieldRef } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppIcon from '@/components/AppIcon';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import AppTextLink from '@/components/AppTextLink';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import {
  formatMacAddress,
  getDeviceTypeIcon,
  isLocallyAdministeredMacAddress,
  isValidMacAddress,
  MAC_ADDRESS_LENGTH,
} from '@/helpers/device';
import { handleSilentError } from '@/helpers/error';
import { addMemberDevice, ApiMemberDevice, DeviceType } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useToastStore, { TOAST_SUCCESS_TIMEOUT } from '@/stores/toast';

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
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
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
        router.canGoBack() ? router.back() : router.replace('/devices');
      })
      .catch(handleSilentError)
      .catch((error) => noticeStore.addError(error, { message: t('devices.onAdd.fail') }))
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
          <View style={tw`flex flex-row items-start gap-3 w-full overflow-hidden mb-4`}>
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

        <View style={tw`flex flex-col items-start gap-1 mb-6`}>
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
                  style={tw`shrink-0`}
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

        <View style={tw`mt-auto`}>
          <AppRoundedButton
            disabled={isSubmitting}
            label={t('actions.add')}
            loading={isSubmitting}
            style={tw`w-full max-w-sm self-center`}
            suffixIcon="plus"
            onPress={onSubmit}
          />
        </View>
      </View>
    </ServiceLayout>
  );
};

export default NewDevice;
