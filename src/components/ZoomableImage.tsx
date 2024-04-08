import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, type ImageProps } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Image as RNImage, TouchableOpacity, View } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
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
  const [isLoading, setLoading] = useState<boolean>(true);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!source) return;
    Image.prefetch(source as string)
      .then(() => {
        RNImage.getSize(source as string, (imageWidth, imageHeight) => {
          setWidth(imageWidth);
          setHeight(imageHeight);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [source]);

  if (isLoading)
    return (
      <View style={[tw`overflow-hidden`, style]}>
        <Skeleton
          backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
          height={`100%`}
          width={`100%`}
        />
      </View>
    );

  if (!width || !height) return <View style={[tw`bg-gray-200 dark:bg-gray-900`, style]} />;

  return (
    <>
      {source && (
        <TouchableOpacity onPress={() => setSelected(true)}>
          <Image
            source={source}
            style={[withAspectRatio && { aspectRatio: width / height }, style]}
            {...props}
          />
        </TouchableOpacity>
      )}
      <Modal transparent animationType="fade" visible={isSelected}>
        <View style={tw`flex flex-col h-full w-full bg-black`}>
          <View
            style={[
              tw`absolute z-10 flex flex-row items-center justify-end w-full p-4`,
              {
                top: Platform.OS === 'ios' && insets.top,
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
          <Gallery
            data={[source]}
            onIndexChange={(newIndex) => {
              console.log(newIndex);
            }}
            onSwipeToClose={() => setSelected(false)}
          />
        </View>
      </Modal>
    </>
  );
};

export default ZoombableImage;
