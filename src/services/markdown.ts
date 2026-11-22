import { type MarkdownStyleMap } from '@ronradtke/react-native-markdown-display';
import { Asset } from 'expo-asset';
import { type TailwindFn } from 'twrnc';
import { withAppFontFamily } from '@/helpers/text';

export const fetchLocalMarkdown = async (module: string | number) => {
  const file = Asset.fromModule(module);
  await file.downloadAsync(); // Optional, saves file into cache
  return fetch(file.localUri || file.uri).then((r) => r.text());
};

export type MarkdownStyles = MarkdownStyleMap;

export const getMarkdownStyles = (tw: TailwindFn) =>
  ({
    body: withAppFontFamily(tw`text-base text-gray-500 dark:text-neutral-500`),
    strong: withAppFontFamily(tw`font-semibold text-slate-900 dark:text-gray-200`),
    heading1: withAppFontFamily(
      tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`,
    ),
    heading2: withAppFontFamily(tw`my-2 text-2xl font-semibold text-slate-900 dark:text-slate-200`),
    heading3: withAppFontFamily(
      tw`my-2 text-xl font-medium tracking-tight text-slate-800 dark:text-slate-200`,
    ),
    code_inline: withAppFontFamily(
      tw`bg-gray-200 font-mono text-slate-900 dark:bg-zinc-800 dark:text-gray-200`,
    ),
    link: withAppFontFamily(tw`text-amber-500 no-underline`),
    hr: tw`border-b border-b-gray-300 dark:border-b-neutral-600`,
    em: withAppFontFamily(tw`italic`),
  }) as MarkdownStyles;
