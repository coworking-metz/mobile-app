import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import { fetchLocalMarkdown, getDocumentationFromLanguage } from '@/services/docs';

const Furniture = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    if (i18n.language) {
      const { furniture } = getDocumentationFromLanguage(i18n.language);
      fetchLocalMarkdown(furniture).then(setText);
    }
  }, [i18n.language]);

  return (
    <ServiceLayout title={t('help.furniture.title')}>
      <MarkdownRenderer content={text} />
    </ServiceLayout>
  );
};

export default Furniture;
