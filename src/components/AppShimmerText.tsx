import MaskedView from '@react-native-masked-view/masked-view';
import { ReactNode, useMemo, useState } from 'react';
import { StyleSheet, TextStyle, type StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import AppText, { AppTextProps } from '@/components/AppText';

// inspired by https://github.com/furkananter/react-native-shimmer-text
const AppShimmerText = ({
  active,
  activeColor,
  style,
  children,
  ...props
}: AppTextProps & {
  active?: boolean;
  activeColor?: string;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
}) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const textColor = useMemo(() => {
    const flattenedStyle = StyleSheet.flatten<TextStyle>(style);
    return flattenedStyle?.color ? flattenedStyle.color.toString() : tw.color('black');
  }, [style]);

  return (
    <MaskedView
      maskElement={
        <AppText style={style} {...props}>
          {children}
        </AppText>
      }
      style={[tw`relative overflow-hidden`]}>
      <AppText
        style={[style, active && { opacity: 0 }]}
        onLayout={(e) => {
          setHeight(e.nativeEvent.layout.height);
          setWidth(e.nativeEvent.layout.width);
        }}
        {...props}>
        {children}
      </AppText>

      {active && (
        <Animated.View
          style={[
            tw`absolute -inset-x-full`,
            {
              height,
              width: width * 4,
              marginHorizontal: '-100%',
              experimental_backgroundImage: `linear-gradient(
              105deg,
              ${textColor} 0%,
              ${textColor} 40%,
              ${activeColor ?? '#000000'} 50%,
              ${textColor} 60%,
              ${textColor} 100%
            )`,
              animationName: {
                from: {
                  transform: [{ translateX: '-25%' }],
                },
                to: {
                  transform: [{ translateX: '25%' }],
                },
              },
              animationDuration: '2s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            } as never,
          ]}
        />
      )}
    </MaskedView>
  );
};

export default AppShimmerText;
