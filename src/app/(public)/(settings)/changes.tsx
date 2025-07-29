import Changelog from '../../../../CHANGELOG.md';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { fetchLocalMarkdown } from '@/services/docs';

const Changes = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    fetchLocalMarkdown(Changelog)
      .then((changelogText) => {
        setText(changelogText.replace(/^[\s\S]*?(?=^## \[unreleased\])/m, ''));
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  return (
    <ServiceLayout title={t('about.changes.title')}>
      {isFetching ? (
        <Animated.View
          exiting={FadeOut.duration(300)}
          style={tw`flex flex-row items-center justify-center h-full w-full`}>
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`h-16 w-16`}
          />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(300)} style={tw`px-6`}>
          <MarkdownRenderer content={text} />
        </Animated.View>
      )}
    </ServiceLayout>
  );
};

export default Changes;
