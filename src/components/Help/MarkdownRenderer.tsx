import ZoombableImage from '../ZoomableImage';
import Markdown from '@ronradtke/react-native-markdown-display';
import * as Linking from 'expo-linking';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { getMarkdownStyles } from '@/services/docs';

const MarkdownRenderer = ({ content }: { content: string }) => {
  useDeviceContext(tw);

  const onLinkPress = useCallback((url: string) => {
    if (url.startsWith('/')) {
      Linking.openURL(Linking.createURL(url));
      return false;
    }
    return true;
  }, []);

  return (
    <Markdown
      rules={{
        image: (node) => {
          return (
            <View key={node.key}>
              <ZoombableImage withAspectRatio source={node.attributes.src} style={tw`w-full`} />
            </View>
          );
        },
      }}
      style={{
        ...getMarkdownStyles(tw),
        body: {
          ...getMarkdownStyles(tw).body,
          ...tw`px-6`,
        },
      }}
      onLinkPress={onLinkPress}>
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
