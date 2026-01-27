import AppShimmerText from '../AppShimmerText';
import React, { ReactNode } from 'react';
import { type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const SectionTitle = ({
  title,
  count,
  style,
  children,
  loading,
  ...props
}: AnimatedProps<ViewProps> & {
  title: string;
  count?: number | null;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  children?: ReactNode;
}) => {
  return (
    <Animated.View style={[tw`flex flex-row items-center gap-2`, style]} {...props}>
      <AppShimmerText
        active={loading}
        activeColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('gray-100')}
        ellipsizeMode={'tail'}
        numberOfLines={1}
        style={tw`text-sm font-normal uppercase text-slate-500 dark:text-stone-500 shrink min-h-5.5`}>
        {title}
      </AppShimmerText>

      {count && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={tw`flex items-center justify-center overflow-hidden h-5.5 px-1 min-w-5.5 bg-gray-400/25 dark:bg-stone-700/50 rounded-full`}>
          <AppText style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
            {count ?? 0}
          </AppText>
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

export default SectionTitle;
