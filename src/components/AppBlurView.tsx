import { BlurView } from '@sbaiahmed1/react-native-blur';
import { type BlurViewProps } from 'expo-blur';
import React from 'react';
import { Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';

const AppBlurView = ({ children, style, tint, intensity, ...props }: BlurViewProps) => {
  return (
    <Animated.View style={[tw`relative`, style]}>
      {Platform.OS === 'android' ? (
        <View
          // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
          style={[
            tw`absolute inset-0`,
            {
              backgroundColor:
                tint === 'dark'
                  ? `rgba(0, 0, 0, ${0.1 + (intensity || 0) / 100})`
                  : `rgba(255, 255, 255, ${0.65 + (intensity || 0) / 300})`,
            },
          ]}
        />
      ) : (
        <BlurView
          blurAmount={intensity} // intensity → blurAmount (same scale)
          blurType={tint} // tint → blurType (same options + more)
          style={tw`absolute inset-0`}
          {...props}
          // NEW: Advanced features
          // type="liquidGlass"            // Liquid glass effects
          // glassType="regular"           // iOS 26+ materials
          // glassTintColor="#007AFF"      // Glass tint color
          // glassOpacity={0.8}            // Glass opacity (0-1)
          // isInteractive={true}          // Touch interaction support
          // No experimental props needed - real blur by default
        />
      )}
      {children}
    </Animated.View>
  );
  // if (Platform.OS === 'android') {
  //   return (
  //     <View
  //       // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
  //       style={[
  //         {
  //           backgroundColor:
  //             tint === 'dark'
  //               ? `rgba(0, 0, 0, ${0.1 + (intensity || 0) / 100})`
  //               : `rgba(255, 255, 255, ${0.65 + (intensity || 0) / 300})`,
  //         },
  //         style,
  //       ]}
  //       {...props}>
  //       {children}
  //     </View>
  //   );
  // }
  // return (
  //   <BlurView intensity={intensity} style={style} tint={tint} {...props}>
  //     {children}
  //   </BlurView>
  // );
};

export default AppBlurView;
