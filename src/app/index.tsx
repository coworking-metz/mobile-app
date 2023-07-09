import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import { useAppAuth } from '@/context/auth';
import { log } from '@/helpers/logger';

const indexLogger = log.extend(`[${__filename.split('/').pop()}]`);

// TODO: show whats going on during splashscreen
// in development mode only ?
export default function Splashscreen() {
  const { ready } = useAppAuth();
  const onImageLoaded = useCallback(() => {
    indexLogger.debug('Hiding splash screen');
    SplashScreen.hideAsync();
  }, []);

  if (ready) {
    return <Redirect href="/home" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Constants.expoConfig?.splash?.backgroundColor,
      }}>
      <Image
        source={require('@/assets/images/splash.png')}
        // eslint-disable-next-line tailwindcss/no-custom-classname
        style={[
          tw`absolute h-full w-full`,
          {
            contentFit: Constants.expoConfig?.splash?.resizeMode || 'contain',
          },
        ]}
        onLoadEnd={onImageLoaded}
      />
      <SafeAreaView style={tw`flex flex-col grow items-center justify-end`}>
        <VerticalLoadingAnimation color={tw.color(`black`)} style={tw`h-16`} />
      </SafeAreaView>
    </View>
  );
}
