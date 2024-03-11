import LoveCalendarAnimation from '../Animations/LoveCalendarAnimation';
import React, { type ReactNode } from 'react';
import { Text, type ViewProps } from 'react-native';
import Animated, { type AnimatedProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const CalendarEmptyState = ({
  style,
  description,
  children,
  ...props
}: AnimatedProps<ViewProps> & {
  description: string;
  style?: StyleProps | false;
  children?: ReactNode;
}) => {
  return (
    <Animated.View style={[tw`flex flex-col items-center`, style]} {...props}>
      <LoveCalendarAnimation style={tw`h-32 w-full`} />
      <Text style={tw`text-base text-center font-normal text-slate-500 dark:text-slate-400`}>
        {description}
      </Text>
      {children}
    </Animated.View>
  );
};

export default CalendarEmptyState;
