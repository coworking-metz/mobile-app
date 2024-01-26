import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, type ViewProps } from 'react-native';
import Animated, { type AnimateProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorChip = ({
  label,
  error,
  style,
  ...props
}: AnimateProps<ViewProps> & {
  label: string;
  error?: Error;
  style?: StyleProps;
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
    <TouchableOpacity style={tw`shrink`} onPress={onPress}>
      <Animated.View
        style={[
          tw`flex flex-row items-center gap-0.5 px-1 py-0.5 rounded-full border-[0.5px] bg-red-50 border-red-700 dark:bg-red-950 dark:border-red-400`,
          style,
        ]}
        {...props}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('red-400') : tw.color('red-700')}
          name={'alert-circle-outline'}
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
