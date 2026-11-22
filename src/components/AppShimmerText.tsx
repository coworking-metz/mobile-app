import RNMaskedView from '@react-native-masked-view/masked-view';
import { type ComponentType, type ReactElement, ReactNode, useMemo, useState } from 'react';
import { StyleSheet, TextStyle, View, type StyleProp, type ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import AppText, { AppTextProps } from '@/components/AppText';

// its mixin class typings don't satisfy React 19's JSX element check
const MaskedView = RNMaskedView as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

// inspired by https://github.com/furkananter/react-native-shimmer-text
const AppShimmerText = ({
  active,
  activeColor,
  style,
  children,
  ...props
}: Omit<AppTextProps, 'style' | 'children'> & {
  active?: boolean;
  activeColor?: string;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
}) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const textColor = useMemo(() => {
    const flattenedStyle = StyleSheet.flatten(style);
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
      <View
        style={[active && tw`opacity-0`]}
        onLayout={(e) => {
          setHeight(e.nativeEvent.layout.height);
          setWidth(e.nativeEvent.layout.width);
        }}>
        <AppText style={style} {...props}>
          {children}
        </AppText>
      </View>

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
