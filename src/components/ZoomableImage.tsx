/* eslint-disable tailwindcss/no-custom-classname */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { Image, type ImageProps } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Modal, Image as RNImage, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

const ZoombableImage = ({
  source,
  withAspectRatio = false,
  style,
  ...props
}: ImageProps & { withAspectRatio?: boolean }) => {
  const insets = useSafeAreaInsets();
  const [isSelected, setSelected] = useState<boolean>(false);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    Image.prefetch(source as string);
    RNImage.getSize(source as string, (imageWidth, imageHeight) => {
      setWidth(imageWidth);
      setHeight(imageHeight);
    });
  }, []);

  if (!width || !height) return null;

  return (
    <>
      <TouchableOpacity onPress={() => setSelected(true)}>
        <Image
          source={source}
          style={[withAspectRatio && { aspectRatio: width / height }, style]}
          {...props}
        />
      </TouchableOpacity>
      <Modal transparent animationType="fade" visible={isSelected}>
        <StatusBar style="light" />
        <View style={tw`flex flex-col h-full w-full bg-black`}>
          <View
            style={[
              tw`absolute z-10 flex flex-row items-center justify-end w-full px-4`,
              {
                top: insets.top,
                left: insets.left,
                right: insets.right,
              },
            ]}>
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
          <ReactNativeZoomableView
            bindToBorders
            contentHeight={height}
            contentWidth={width}
            initialZoom={1}
            maxZoom={3}
            minZoom={1}
            style={tw`grow-0`}
            zoomStep={0.5}>
            <Image
              source={source}
              style={{ aspectRatio: width / height, width: '100%' }}
              {...props}
            />
          </ReactNativeZoomableView>
        </View>
      </Modal>
    </>
  );
};

export default ZoombableImage;