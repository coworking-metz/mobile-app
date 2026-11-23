import CarouselPaginationDots from './CarouselPaginationDots';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import dayjs from 'dayjs';
import { BlurTargetView } from 'expo-blur';
import { Image, type ImageProps } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { isNil } from 'lodash';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
  type ViewInstance,
} from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import { StandaloneNativeHeader } from '@/components/Layout/NativeHeader';

// in case we need to migrate off 'react-native-awesome-gallery'
// https://github.com/saseungmin/react-native-gesture-image-viewer

type ZoomableImageProps = Omit<ImageProps, 'source'> & {
  source?: string;
  sources?: string[];
  zoomed?: boolean;
  children?: ReactNode;
  onZoomChange?: (zoomed: boolean) => void;
};

const ZoomableImage = ({
  source,
  sources,
  zoomed,
  style,
  children,
  onZoomChange,
  ...props
}: ZoomableImageProps) => {
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);
  const [isGalleryVisible, setGalleryVisible] = useState<boolean>(false);
  const blurTargetRef = useRef<ViewInstance | null>(null);

  const sourcesCount = useMemo(() => sources?.length ?? 0, [sources]);

  useEffect(() => {
    onZoomChange?.(isGalleryVisible);
  }, [isGalleryVisible]);

  useEffect(() => {
    if (!isNil(zoomed) && isGalleryVisible !== zoomed) {
      setGalleryVisible(zoomed);
    }
  }, [zoomed]);

  if (!source) {
    return <View style={style as ViewStyle} />;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setGalleryVisible(true)}>
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
        visible={isGalleryVisible}
        {...(Platform.OS === 'android' && { navigationBarTranslucent: true })}>
        {/* iOS: close lives in a native bar (the iPhone Duo's side column) */}
        <StandaloneNativeHeader
          left={[
            {
              type: 'button',
              icon: { type: 'sfSymbol', name: 'xmark' },
              // no tint on iOS 26+: the glass adapts to the photo behind
              ...(!isLiquidGlassSupported && { tintColor: 'white' }),
              onPress: () => setGalleryVisible(false),
            },
          ]}>
          <>
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <StatusBar style="light" />
            <BlurTargetView ref={blurTargetRef} style={tw`flex size-full flex-col bg-black`}>
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
                    style={tw`size-full`}
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
                onSwipeToClose={() => setGalleryVisible(false)}
              />
            </BlurTargetView>

            <View
              style={[
                tw`absolute top-0 z-10 flex w-full flex-row items-center justify-start px-4 pb-2`,
                {
                  paddingTop: insets.top,
                  left: insets.left,
                  right: insets.right,
                },
              ]}>
              <AppTopFader style={tw`absolute inset-x-0 top-0`} tintColor={tw.color('black/25')} />

              {Platform.OS !== 'ios' && (
                <AppIconButton
                  blurTarget={blurTargetRef}
                  icon="window-close"
                  radius={25}
                  onPress={() => setGalleryVisible(false)}
                  {...(!isLiquidGlassSupported && { theme: 'dark' })}
                />
              )}
            </View>

            {sourcesCount > 1 && (
              <View
                pointerEvents="none"
                style={[
                  tw`absolute inset-x-0 bottom-0 items-center`,
                  { paddingBottom: insets.bottom || 16 },
                ]}>
                <CarouselPaginationDots count={sourcesCount} offset={offset} style={tw`grow-0`} />
              </View>
            )}
          </>
        </StandaloneNativeHeader>
      </Modal>
    </>
  );
};

export default ZoomableImage;
