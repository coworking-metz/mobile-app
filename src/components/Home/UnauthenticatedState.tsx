import LoveCalendarAnimation from '../Animations/LoveCalendarAnimation';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  type ViewProps,
} from 'react-native';
import Animated, { type AnimatedProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import unlock from '@/assets/images/undraw/unlock.svg';
import { useAppAuth } from '@/context/auth';

const UnauthenticatedState = ({
  style,
  ...props
}: AnimatedProps<ViewProps> & {
  style?: StyleProps | false;
}) => {
  const { t } = useTranslation();
  const { login } = useAppAuth();

  return (
    <Animated.View style={[tw`flex flex-col gap-4 px-4 items-center`, style]} {...props}>
      <Image
        blurRadius={16}
        contentFit="contain"
        contentPosition="left center"
        source={unlock}
        style={[tw`w-full h-32`]}
      />
      <View style={tw`flex flex-col w-full gap-3 grow shrink`}>
        <Text style={tw`text-xl text-left font-medium text-slate-900 dark:text-gray-200`}>
          {t('auth.onUnauthenticated.title')}
        </Text>
        <Text
          style={tw`text-base text-left max-w-80 font-normal text-slate-500 dark:text-slate-400`}>
          {t('auth.onUnauthenticated.description')}
        </Text>
        <TouchableNativeFeedback onPress={login}>
          <Text style={tw`text-base font-normal leading-5 text-left text-amber-500 min-w-[16]`}>
            {t('auth.onUnauthenticated.login')}
          </Text>
        </TouchableNativeFeedback>
      </View>
    </Animated.View>
  );
};

export default UnauthenticatedState;
