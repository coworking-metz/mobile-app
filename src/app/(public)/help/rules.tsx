import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MarkdownRenderer from '@/components/Help/MarkdownRenderer';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { fetchLocalMarkdown, getDocumentationFromLanguage } from '@/services/docs';

const Rules = () => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    if (i18n.language) {
      const { rules } = getDocumentationFromLanguage(i18n.language);
      fetchLocalMarkdown(rules).then(setText);
    }
  }, [i18n.language]);

  return (
    <ServiceLayout title={t('help.rules.title')}>
      <MarkdownRenderer content={text} />
    </ServiceLayout>
  );
};

export default Rules;
