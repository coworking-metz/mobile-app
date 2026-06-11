import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import { AnyError, parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorChip = ({
  label,
  error,
  style,
  onRetry,
  ...props
}: AnimatedProps<ViewProps> & {
  label: string;
  error?: AnyError;
  style?: StyleProp<ViewStyle>;
  onRetry?: () => void;
}) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();

  const onPress = useCallback(async () => {
    const description = error ? await parseErrorText(error) : null;
    noticeStore.add({
      message: label,
      type: 'error',
      ...(description && { description }),
      ...(onRetry && {
        action: {
          label: t('actions.retry'),
          onPress: onRetry,
          suffixIcon: 'reload',
        },
      }),
    });
  }, [noticeStore, label, error]);

  return (
    <TouchableOpacity style={[tw`shrink`, style]} onPress={onPress}>
      <Animated.View
        style={[
          tw`flex flex-row items-center gap-0.5 rounded-full border-[0.5px] border-red-300 bg-red-50 p-0.5 pr-1.5 dark:border-red-900 dark:bg-red-950`,
        ]}
        {...props}>
        <AppIcon
          color={tw.prefixMatch('dark') ? tw.color('red-400') : tw.color('red-700')}
          icon="alert-circle-outline"
          size={16}
        />
        <AppText
          numberOfLines={1}
          style={tw`shrink grow text-xs font-normal leading-4 text-red-700 dark:text-red-400`}>
          {label}
        </AppText>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ErrorChip;
