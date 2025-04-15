import CarouselPaginationDots from './CarouselPaginationDots';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, type ImageProps } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

type ZoomableImageProps = ImageProps & {
  sources?: ImageProps['source'][];
};

const ZoomableImage = ({ source, sources, style, children, ...props }: ZoomableImageProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const offset = useSharedValue(0);
  const [isSelected, setSelected] = useState<boolean>(false);

  const sourcesCount = useMemo(() => sources?.length ?? 0, [sources]);

  if (!source) {
    return <View style={style as ViewStyle} />;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setSelected(true)}>
        <Image cachePolicy="memory-disk" source={source} style={style} {...props} />
        {children}
      </TouchableOpacity>
      <Modal
        statusBarTranslucent
        transparent
        animationType="fade"
        visible={isSelected}
        {...(Platform.OS === 'android' && { navigationBarTranslucent: true })}>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <StatusBar translucent style="light" />
        <View style={tw`flex flex-col h-full w-full bg-black`}>
          <View
            style={[
              tw`absolute top-0 z-10 flex flex-row items-center justify-end w-full px-4`,
              {
                paddingTop: insets.top,
                left: insets.left,
                right: insets.right,
              },
            ]}>
            {sourcesCount > 1 && (
              <>
                {/* fake a View with the same size as the close button to properly center pagination dots */}
                <View style={tw`size-10`} />
                <CarouselPaginationDots
                  count={sourcesCount}
                  offset={offset}
                  style={tw`mx-auto grow-0`}
                  width={width}
                />
              </>
            )}
            <MaterialCommunityIcons.Button
              backgroundColor="rgba(3,10,42,0.4)"
              borderRadius={24}
              color={tw.color('gray-200')}
              iconStyle={tw`mr-0`}
              name="close"
              size={32}
              style={tw`p-1 grow-0 shrink-0`}
              underlayColor={tw.color('gray-800')}
              onPress={() => setSelected(false)}
            />
          </View>
          <Gallery
            data={sources ?? [source]}
            renderItem={({ item, setImageDimensions }) => (
              <Image
                allowDownscaling={false}
                cachePolicy="memory-disk"
                contentFit="contain"
                source={item}
                style={tw`h-full w-full`}
                onLoad={(event) => {
                  setImageDimensions({
                    width: event.source.width,
                    height: event.source.height,
                  });
                }}
              />
            )}
            onIndexChange={(index) => {
              offset.value = withTiming(index * width, {
                easing: Easing.linear,
                duration: 300,
              });
            }}
            onSwipeToClose={() => setSelected(false)}
          />
        </View>
      </Modal>
    </>
  );
};

export default ZoomableImage;
