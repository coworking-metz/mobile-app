import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image, type ImageProps } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import AppBlurView from './AppBlurView';
import AppFader from './AppFader';
import CarouselPaginationDots from './CarouselPaginationDots';

type ZoomableImageProps = Omit<ImageProps, 'source'> & {
  source?: string;
  sources?: string[];
};

const ZoomableImage = ({ source, sources, style, children, ...props }: ZoomableImageProps) => {
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);
  const [isSelected, setSelected] = useState<boolean>(false);
  const { t } = useTranslation();

  const sourcesCount = useMemo(() => sources?.length ?? 0, [sources]);

  if (!source) {
    return <View style={style as ViewStyle} />;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setSelected(true)}>
        <Image
          cachePolicy="memory"
          source={{
            uri: source,
            cacheKey: `${source}-${dayjs().format('YYYY-MM-DD')}`,
          }}
          style={style}
          {...props}
        />
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
              tw`absolute top-0 z-10 flex flex-row items-center justify-start w-full px-4 pb-2`,
              {
                paddingTop: insets.top,
                left: insets.left,
                right: insets.right,
              },
            ]}>
            <AppFader
              position={Fader.position.TOP}
              size={(insets.top || (Platform.OS === 'android' ? 16 : 0)) + 64}
              style={tw`absolute inset-x-0 top-0`}
              tintColor={tw.color('black/25')}
            />
            <View style={tw`relative`}>
              <Animated.View
                style={[
                  tw`absolute top-0 left-0 bottom-0 right-0 rounded-full overflow-hidden`,
                ]}>
                <AppBlurView
                  intensity={64}
                  style={tw`h-full w-full`}
                  tint='dark'
                />
              </Animated.View>
              <MaterialCommunityIcons.Button
                aria-label={t('actions.close')}
                backgroundColor="transparent"
                borderRadius={24}
                name="window-close"
                color={tw.color('gray-400')}
                iconStyle={{ marginRight: 0 }}
                size={32}
                style={tw`p-1 shrink-0`}
                underlayColor={tw.color('zinc-800')}
                onPress={() => setSelected(false)}
              />
            </View>
            {sourcesCount > 1 && (
              <>
                <CarouselPaginationDots
                  count={sourcesCount}
                  offset={offset}
                  style={tw`mx-auto grow-0`}
                />
                {/* fake a View with the same size as the close button to properly center pagination dots */}
                <View style={tw`size-10`} />
              </>
            )}
          </View>
          <Gallery
            data={sources ?? [source]}
            renderItem={({ item, setImageDimensions }) => (
              <Image
                allowDownscaling={false}
                cachePolicy="memory"
                contentFit="contain"
                source={{
                  uri: item,
                  cacheKey: `${item}-${dayjs().format('YYYY-MM-DD')}`,
                }}
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
              offset.value = withTiming(index, {
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
