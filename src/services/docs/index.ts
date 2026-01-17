import * as british from './en-GB';
import * as french from './fr-FR';

export const getDocumentationFromLanguage = (language: string) => {
  switch (language) {
    case 'fr':
      return french;
    default:
      return british;
  }
};
