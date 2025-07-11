import React, { ReactNode } from 'react';
import { type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft, type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const SectionTitle = ({
  title,
  count,
  style,
  children,
  ...props
}: AnimatedProps<ViewProps> & {
  title: string;
  count?: number | null;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) => {
  return (
    <Animated.View style={[tw`flex flex-row items-center gap-2`, style]} {...props}>
      <AppText
        ellipsizeMode={'tail'}
        numberOfLines={1}
        style={tw`text-sm font-normal uppercase text-slate-500 shrink`}>
        {title}
      </AppText>
      {count && (
        <Animated.View
          entering={FadeInLeft}
          exiting={FadeOutLeft}
          style={tw`bg-gray-400/25 dark:bg-gray-700/50 py-1 px-2 rounded-full`}>
          <AppText style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
            {count}
          </AppText>
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

export default SectionTitle;
