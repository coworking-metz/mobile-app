import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { ReactNode, useCallback } from 'react';
import { TouchableOpacity, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { AnyError, parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorBadge = ({
  title,
  error,
  style,
}: {
  title: string;
  error?: AnyError;
  style?: StyleProp<ViewStyle>;
}) => {
  const noticeStore = useNoticeStore();

  const onPress = useCallback(async () => {
    const description = error ? await parseErrorText(error) : null;
    noticeStore.add({
      message: title,
      type: 'error',
      ...(description && { description }),
    });
  }, [noticeStore, title, error]);

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('red-700') : tw.color('red-700')}
        name={'alert-circle-outline'}
        size={20}
      />
    </TouchableOpacity>
  );
};

export default ErrorBadge;
