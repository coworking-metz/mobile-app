import Markdown from '@ronradtke/react-native-markdown-display';
import * as Linking from 'expo-linking';
import { merge } from 'lodash';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import ZoomableImage from '@/components/ZoomableImage';
import { getMarkdownStyles, MarkdownStyles } from '@/services/docs';

const MarkdownRenderer = ({ content, style }: { content: string; style?: MarkdownStyles }) => {
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
            <View style={tw`w-full h-40`}>
              <ZoomableImage
                contentFit="cover"
                key={node.key}
                source={node.attributes.src}
                style={tw`w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-900`}
                transition={300}
              />
            </View>
          );
        },
      }}
      style={merge(getMarkdownStyles(tw), style)}
      onLinkPress={onLinkPress}>
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
