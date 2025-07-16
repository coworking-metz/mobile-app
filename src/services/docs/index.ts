import * as british from './en-GB';
import * as french from './fr-FR';
import { Asset } from 'expo-asset';
import { StyleProp, ViewStyle, type StyleSheet } from 'react-native';
import { type TailwindFn } from 'twrnc';
import { withAppFontFamily } from '@/helpers/text';

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

export type MarkdownStyles = StyleSheet.NamedStyles<{
  body?: StyleProp<ViewStyle>;
  heading1?: StyleProp<ViewStyle>;
  heading2?: StyleProp<ViewStyle>;
  heading3?: StyleProp<ViewStyle>;
  heading4?: StyleProp<ViewStyle>;
  heading5?: StyleProp<ViewStyle>;
  heading6?: StyleProp<ViewStyle>;
  hr?: StyleProp<ViewStyle>;
  strong?: StyleProp<ViewStyle>;
  em?: StyleProp<ViewStyle>;
  s?: StyleProp<ViewStyle>;
  blockquote?: StyleProp<ViewStyle>;
  bullet_lis?: StyleProp<ViewStyle>;
  ordered_list?: StyleProp<ViewStyle>;
  list_item?: StyleProp<ViewStyle>;
  code_inline?: StyleProp<ViewStyle>;
  code_block?: StyleProp<ViewStyle>;
  fence?: StyleProp<ViewStyle>;
  table?: StyleProp<ViewStyle>;
  thead?: StyleProp<ViewStyle>;
  tbody?: StyleProp<ViewStyle>;
  th?: StyleProp<ViewStyle>;
  tr?: StyleProp<ViewStyle>;
  td?: StyleProp<ViewStyle>;
  link?: StyleProp<ViewStyle>;
  blocklink?: StyleProp<ViewStyle>;
  image?: StyleProp<ViewStyle>;
  text?: StyleProp<ViewStyle>;
  textgroup?: StyleProp<ViewStyle>;
  paragraph?: StyleProp<ViewStyle>;
  hardbreak?: StyleProp<ViewStyle>;
  softbreak?: StyleProp<ViewStyle>;
  pre?: StyleProp<ViewStyle>;
  inline?: StyleProp<ViewStyle>;
  span?: StyleProp<ViewStyle>;
}>;

export const getMarkdownStyles = (tw: TailwindFn): MarkdownStyles => ({
  body: withAppFontFamily(tw`text-base text-gray-500`),
  strong: withAppFontFamily(tw`font-semibold text-slate-900 dark:text-gray-200`),
  heading1: withAppFontFamily(
    tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`,
  ),
  heading2: withAppFontFamily(tw`my-2 text-2xl font-semibold text-slate-900 dark:text-slate-200`),
  heading3: withAppFontFamily(
    tw`my-2 text-xl tracking-tight font-medium text-slate-800 dark:text-slate-200`,
  ),
  code_inline: withAppFontFamily(
    tw`font-mono text-slate-900 dark:text-gray-200 bg-gray-200 dark:bg-gray-800`,
  ),
  link: withAppFontFamily(tw`text-amber-500 no-underline`),
});
