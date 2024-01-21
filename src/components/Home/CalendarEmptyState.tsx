import LoveCalendarAnimation from '../Animations/LoveCalendarAnimation';
import { Link } from 'expo-router';
import React, { Children, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, type ViewProps } from 'react-native';
import Animated, { type AnimateProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const CalendarEmptyState = ({
  style,
  description,
  children,
  ...props
}: AnimateProps<ViewProps> & {
  description: string;
  loading?: boolean;
  style?: StyleProps | false;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <Animated.View style={[tw`flex flex-col items-center`, style]} {...props}>
      <LoveCalendarAnimation style={tw`h-32`} />
      <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
        {description}
      </Text>
      {children}
    </Animated.View>
  );
};

export default CalendarEmptyState;
