import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { fetchLocalMarkdown, getDocumentationFromLanguage } from '@/services/docs';

const Operating = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    if (i18n.language) {
      const { operating } = getDocumentationFromLanguage(i18n.language);
      fetchLocalMarkdown(operating).then(setText);
    }
  }, [i18n.language]);

  return (
    <ServiceLayout title={t('help.operating.title')}>
      <MarkdownRenderer content={text} />
    </ServiceLayout>
  );
};

export default Operating;
