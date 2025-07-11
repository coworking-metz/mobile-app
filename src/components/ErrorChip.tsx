import AppText from './AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { TouchableOpacity, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { AnyError, parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorChip = ({
  label,
  error,
  style,
  ...props
}: AnimatedProps<ViewProps> & {
  label: string;
  error?: AnyError;
  style?: StyleProp<ViewStyle>;
}) => {
  const noticeStore = useNoticeStore();

  const onPress = useCallback(async () => {
    const description = error ? await parseErrorText(error) : null;
    noticeStore.add({
      message: label,
      type: 'error',
      ...(description && { description }),
    });
  }, [noticeStore, label, error]);

  return (
    <TouchableOpacity style={[tw`shrink`, style]} onPress={onPress}>
      <Animated.View
        style={[
          tw`flex flex-row items-center gap-0.5 p-0.5 pr-1.5 rounded-full border-[0.5px] bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-900`,
        ]}
        {...props}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('red-400') : tw.color('red-700')}
          name={'alert-circle-outline'}
          size={16}
        />
        <AppText
          numberOfLines={1}
          style={tw`text-xs font-normal shrink grow leading-4 text-red-700 dark:text-red-400`}>
          {label}
        </AppText>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ErrorChip;
