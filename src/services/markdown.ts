import { Asset } from 'expo-asset';
import { StyleProp, TextStyle, ViewStyle, type StyleSheet } from 'react-native';
import { type TailwindFn } from 'twrnc';
import { withAppFontFamily } from '@/helpers/text';

export const fetchLocalMarkdown = async (module: string | number) => {
  const file = Asset.fromModule(module);
  await file.downloadAsync(); // Optional, saves file into cache
  return fetch(file.localUri || file.uri).then((r) => r.text());
};

export type MarkdownStyles = StyleSheet.NamedStyles<{
  body?: StyleProp<TextStyle>;
  heading1?: StyleProp<TextStyle>;
  heading2?: StyleProp<TextStyle>;
  heading3?: StyleProp<TextStyle>;
  heading4?: StyleProp<TextStyle>;
  heading5?: StyleProp<TextStyle>;
  heading6?: StyleProp<TextStyle>;
  hr?: StyleProp<ViewStyle>;
  strong?: StyleProp<TextStyle>;
  em?: StyleProp<TextStyle>;
  s?: StyleProp<TextStyle>;
  blockquote?: StyleProp<TextStyle>;
  bullet_lis?: StyleProp<TextStyle>;
  ordered_list?: StyleProp<TextStyle>;
  list_item?: StyleProp<TextStyle>;
  code_inline?: StyleProp<TextStyle>;
  code_block?: StyleProp<TextStyle>;
  fence?: StyleProp<TextStyle>;
  table?: StyleProp<ViewStyle>;
  thead?: StyleProp<TextStyle>;
  tbody?: StyleProp<TextStyle>;
  th?: StyleProp<TextStyle>;
  tr?: StyleProp<TextStyle>;
  td?: StyleProp<TextStyle>;
  link?: StyleProp<TextStyle>;
  blocklink?: StyleProp<TextStyle>;
  image?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
  textgroup?: StyleProp<TextStyle>;
  paragraph?: StyleProp<TextStyle>;
  hardbreak?: StyleProp<ViewStyle>;
  softbreak?: StyleProp<ViewStyle>;
  pre?: StyleProp<TextStyle>;
  inline?: StyleProp<TextStyle>;
  span?: StyleProp<TextStyle>;
}>;

export const getMarkdownStyles = (tw: TailwindFn) =>
  ({
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
      tw`font-mono text-slate-900 dark:text-gray-200 bg-gray-200 dark:bg-zinc-800`,
    ),
    link: withAppFontFamily(tw`text-amber-500 no-underline`),
    hr: tw`border-b-gray-300 dark:border-b-neutral-600 border-b-[1px]`,
  }) as MarkdownStyles;
