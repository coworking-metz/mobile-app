import Changelog from '../../../../CHANGELOG.md';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import tw, { useDeviceContext } from 'twrnc';
import MarkdownRenderer from '@/components/Help/MarkdownRenderer';
import ModalLayout from '@/components/Layout/ModalLayout';
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
      <MarkdownRenderer content={text} />
    </ModalLayout>
  );
};

export default Changes;
