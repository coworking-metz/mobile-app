import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  type ViewStyle,
  type ViewProps,
  type StyleProp,
} from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorChip = ({
  label,
  error,
  style,
  ...props
}: AnimatedProps<ViewProps> & {
  label: string;
  error?: Error;
  style?: StyleProp<ViewStyle>;
}) => {
  const [description, setDescription] = useState<string | null>(null);
  const noticeStore = useNoticeStore();

  useEffect(() => {
    if (error) {
      (async () => {
        const errorMessage = await parseErrorText(error);
        setDescription(errorMessage);
      })();
    }
  }, [error]);

  const onPress = useCallback(() => {
    noticeStore.add({
      message: label,
      type: 'error',
      ...(description && { description }),
    });
  }, [noticeStore, label, description]);

  return (
    <TouchableOpacity style={[tw`shrink`, style]} onPress={onPress}>
      <Animated.View
        style={[
          tw`flex flex-row items-center gap-0.5 p-0.5 pr-1.5 rounded-full border-[0.5px] bg-red-50 border-red-700 dark:bg-red-950 dark:border-red-400`,
        ]}
        {...props}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('red-400') : tw.color('red-700')}
          name={'alert-circle'}
          size={16}
        />
        <Text
          numberOfLines={1}
          style={tw`text-xs font-normal shrink leading-4 text-red-700 dark:text-red-400`}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ErrorChip;
