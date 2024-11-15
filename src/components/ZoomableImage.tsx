import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, type ImageProps } from 'expo-image';
import React, { useState } from 'react';
import { Modal, Platform, TouchableOpacity, View } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

const ZoombableImage = ({ source, style, ...props }: ImageProps) => {
  const insets = useSafeAreaInsets();
  const [isSelected, setSelected] = useState<boolean>(false);

  if (!source) {
    return <View style={style} />;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setSelected(true)}>
        <Image cachePolicy="memory-disk" source={source} style={[style]} {...props}></Image>
      </TouchableOpacity>
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
          <Gallery data={[source]} onSwipeToClose={() => setSelected(false)} />
        </View>
      </Modal>
    </>
  );
};

export default ZoombableImage;
