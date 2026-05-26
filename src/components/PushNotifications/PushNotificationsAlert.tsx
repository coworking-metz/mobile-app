import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AppIcon from '@/components/AppIcon';
import AppPressable from '@/components/AppPressable';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import { useAppPushNotifications } from '@/context/push-notifications';
import { theme } from '@/helpers/colors';
import useSettingsStore from '@/stores/settings';

const PushNotificationsAlert = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { t } = useTranslation();
  const { openPushNotificationsBottomSheet } = useAppPushNotifications();
  const onClear = useCallback(() => {
    useSettingsStore.setState({ hidePushNotificationsAlert: true });
  }, []);

  return (
    <AppPressable onPress={openPushNotificationsBottomSheet}>
      <AppSquircleView
        style={[
          tw`flex flex-row items-start gap-4 bg-gray-300/60 dark:bg-neutral-800/80 rounded-2xl pl-3 pt-2 pb-4`,
          style,
        ]}>
        <AppIcon
          color={tw.prefixMatch('dark') ? tw.color('gray-200') : theme.charlestonGreen}
          icon="bell-alert-outline"
          size={24}
          style={tw`mt-2`}
        />
        <View style={tw`flex flex-col gap-1 shrink grow basis-0 overflow-hidden mt-2`}>
          <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('pushNotifications.enable.title')}
          </AppText>
          <AppText
            numberOfLines={2}
            style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
            {t('pushNotifications.enable.description')}
          </AppText>
        </View>

        <AppPressable onPress={onClear}>
          <AppIcon
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : theme.charlestonGreen}
            icon="close"
            size={24}
            style={[tw`p-2 mr-2 shrink-0 overflow-hidden rounded-full`]}
          />
        </AppPressable>
      </AppSquircleView>
    </AppPressable>
  );
};

export default PushNotificationsAlert;
