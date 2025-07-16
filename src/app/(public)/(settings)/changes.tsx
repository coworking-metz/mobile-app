import Changelog from '../../../../CHANGELOG.md';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import ModalLayout from '@/components/Layout/ModalLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { fetchLocalMarkdown } from '@/services/docs';

const Changes = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    fetchLocalMarkdown(Changelog).then((changelogText) => {
      setText(changelogText.replace(/^[\s\S]*?(?=^## \[unreleased\])/m, ''));
    });
  }, []);

  return (
    <ModalLayout title={t('about.changes.title')}>
      <View style={tw`px-6`}>
        <MarkdownRenderer content={text} />
      </View>
    </ModalLayout>
  );
};

export default Changes;
