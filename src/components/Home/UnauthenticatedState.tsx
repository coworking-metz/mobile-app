import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TouchableNativeFeedback, View, ViewStyle, type ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import unlock from '@/assets/images/undraw/unlock.svg';
import AppText from '@/components/AppText';
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
    <Animated.View style={[tw`flex flex-col items-center gap-4`, style]} {...props}>
      <Image
        contentFit="contain"
        contentPosition="left center"
        source={unlock}
        style={tw`h-32 w-full`}
      />
      <View style={tw`flex w-full shrink grow flex-col gap-3`}>
        <TouchableNativeFeedback onPress={login}>
          <AppText style={tw`text-left text-xl font-medium text-amber-500`}>
            {t('auth.onUnauthenticated.title')}
          </AppText>
        </TouchableNativeFeedback>
        <AppText
          style={tw`max-w-80 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('auth.onUnauthenticated.description')}
        </AppText>
      </View>
    </Animated.View>
  );
};

export default UnauthenticatedState;
