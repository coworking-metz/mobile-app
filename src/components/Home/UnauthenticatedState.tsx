import AppText from '../AppText';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TouchableNativeFeedback, View, ViewStyle, type ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import unlock from '@/assets/images/undraw/unlock.svg';
import { useAppAuth } from '@/context/auth';

const UnauthenticatedState = ({
  style,
  ...props
}: AnimatedProps<ViewProps> & {
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const { login } = useAppAuth();

  return (
    <Animated.View style={[tw`flex flex-col gap-4 items-center`, style]} {...props}>
      <Image
        blurRadius={16}
        contentFit="contain"
        contentPosition="left center"
        source={unlock}
        style={[tw`w-full h-32`]}
      />
      <View style={tw`flex flex-col w-full gap-3 grow shrink`}>
        <TouchableNativeFeedback onPress={login}>
          <AppText style={tw`text-xl text-left font-medium text-amber-500`}>
            {t('auth.onUnauthenticated.title')}
          </AppText>
        </TouchableNativeFeedback>
        <AppText
          style={tw`text-base text-left max-w-80 font-normal text-slate-500 dark:text-slate-400`}>
          {t('auth.onUnauthenticated.description')}
        </AppText>
      </View>
    </Animated.View>
  );
};

export default UnauthenticatedState;
