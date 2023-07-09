import * as british from './en-GB';
import * as french from './fr-FR';
import { Asset } from 'expo-asset';
import { type StyleSheet } from 'react-native';
import { type TailwindFn } from 'twrnc';

export const getDocumentationFromLanguage = (language: string) => {
  switch (language) {
    case 'fr':
      return french;
    default:
      return british;
  }
};

export const fetchLocalMarkdown = async (module: string | number) => {
  const file = Asset.fromModule(module);
  await file.downloadAsync(); // Optional, saves file into cache
  return fetch(file.localUri || file.uri).then((r) => r.text());
};

export const getMarkdownStyles = (tw: TailwindFn): StyleSheet.NamedStyles<{ body: never }> => ({
  body: tw`dark:text-gray-200`,
});
