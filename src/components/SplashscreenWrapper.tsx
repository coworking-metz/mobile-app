import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import Animated, { Easing, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import { log } from '@/helpers/logger';

const logger = log.extend(`[splashscreen-wrapper]`);

// @see https://www.youtube.com/watch?v=hTmkjdKO3_M
const WAVES_COUNT = 3;
const WAVES_DURATION_IN_MS = 2000;
const WAVES_DELAY_IN_MS = 300;

// TODO: show whats going on during splashscreen
// in development mode only ?
export default function SplashscreenWrapper({
  ready,
  children,
}: {
  ready: boolean;
  children: React.ReactNode;
}) {
  const [isImageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isImageLoaded) {
      logger.debug('Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [isImageLoaded]);

  return (
    <>
      {children}

      {!(ready && isImageLoaded) && (
        <Animated.View
          exiting={FadeOut.duration(500).delay(300)}
          style={[
            tw`absolute inset-x-0 inset-y-0 z-10`,
            {
              flex: 1,
              backgroundColor: Constants.expoConfig?.splash?.backgroundColor,
            },
          ]}>
          {[...Array(WAVES_COUNT).keys()].map((index) => (
            <MotiView
              animate={{ opacity: 0, scale: 32 }}
              from={{ opacity: 0.7, scale: 1 }}
              key={`background-wave-${index}`}
              style={tw`absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-900`}
              transition={{
                type: 'timing',
                duration: WAVES_DURATION_IN_MS,
                easing: Easing.out(Easing.ease),
                delay: index * WAVES_DELAY_IN_MS,
                repeatReverse: false,
                loop: true,
              }}
            />
          ))}
          <Image
            source={require('@/assets/images/splash.png')}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            style={[
              tw`absolute h-full w-full`,
              {
                contentFit: Constants.expoConfig?.splash?.resizeMode || 'contain',
              },
            ]}
            onLoadEnd={() => setImageLoaded(true)}
          />
        </Animated.View>
      )}
    </>
  );
}
