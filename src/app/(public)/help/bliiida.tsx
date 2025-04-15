import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MarkdownRenderer from '@/components/Help/MarkdownRenderer';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import { fetchLocalMarkdown, getDocumentationFromLanguage } from '@/services/docs';

const Bliiida = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    if (i18n.language) {
      const { bliiida } = getDocumentationFromLanguage(i18n.language);
      fetchLocalMarkdown(bliiida).then(setText);
    }
  }, [i18n.language]);

  return (
    <ServiceLayout title={t('help.bliiida.title')}>
      <MarkdownRenderer content={text} />
    </ServiceLayout>
  );
};

export default Bliiida;
