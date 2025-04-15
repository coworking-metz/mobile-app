import { MaterialCommunityIcons } from '@expo/vector-icons';
import uFuzzy from '@leeoniya/ufuzzy';
import Markdown, { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import { Link } from 'expo-router';
import MarkdownItPlainText from 'markdown-it-plain-text';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  FadeOutUp,
} from 'react-native-reanimated';
import { TextField } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppText from '@/components/AppText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { theme } from '@/helpers/colors';
import { log } from '@/helpers/logger';
import { fetchLocalMarkdown, getDocumentationFromLanguage } from '@/services/docs';

interface HelpItem {
  label: string;
  to: string;
  text: string;
  markdownDescription?: string;
}

const CHARACTERS_BEFORE_HIGHLIGHT = 16;
const fuzzy = new uFuzzy({
  intraMode: 1,
  intraIns: 1,
  intraSub: 1,
  intraTrn: 1,
  intraDel: 1,
});

const markdownHighlighter = (part: string, matched: boolean) => (matched ? `**${part}**` : part);

const helpLogger = log.extend(`[help]`);

const Help = () => {
  useDeviceContext(tw);
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const docs = getDocumentationFromLanguage(i18n.language);
    const rawHelpItems: Promise<HelpItem>[] = [
      {
        label: t('help.rules.title'),
        to: '/help/rules',
        document: docs.rules,
      },
      {
        label: t('help.operating.title'),
        to: '/help/operating',
        document: docs.operating,
      },
      {
        label: t('help.furniture.title'),
        to: '/help/furniture',
        document: docs.furniture,
      },
      {
        label: t('help.access.title'),
        to: '/help/access',
        document: docs.access,
        markdownDescription: 'parking',
      },
      {
        label: t('help.bliiida.title'),
        to: '/help/bliiida',
        document: docs.bliiida,
      },
      {
        label: t('help.issue.title'),
        to: '/help/issue',
        document: docs.issue,
      },
    ].map((item) => {
      const markdown = MarkdownIt().use(MarkdownItPlainText);
      return fetchLocalMarkdown(item.document)
        .then((text) => {
          markdown.render(text);
          return {
            ...item,
            text: markdown.plainText,
          };
        })
        .catch((err) => {
          helpLogger.error(err);
          return Promise.resolve({
            ...item,
            text: '',
          });
        });
    });

    setReady(false);
    Promise.all(rawHelpItems)
      .then((rawHelpItemsWithText) => {
        setHelpItems(rawHelpItemsWithText);
      })
      .finally(() => {
        setReady(true);
      });
  }, [i18n.language]);

  const filteredHelpItems = useMemo<HelpItem[]>(() => {
    if (search) {
      const haystack = helpItems.map(({ text }) => text);
      const indexes = fuzzy.filter(haystack, search);

      if (indexes) {
        const info = fuzzy.info(indexes, haystack, search);
        const order = fuzzy.sort(info, haystack, search);

        const highlightedHelpItems = order.map((infoIndex) => {
          const itemIndex = info.idx[infoIndex];
          const ranges = info.ranges[infoIndex];
          const [start] = ranges;

          const description = uFuzzy.highlight(
            helpItems[itemIndex].text,
            info.ranges[infoIndex],
            markdownHighlighter,
          );
          return {
            ...helpItems[itemIndex],
            markdownDescription: `${start > CHARACTERS_BEFORE_HIGHLIGHT ? '...' : ''
              }${description.slice(Math.max(start - CHARACTERS_BEFORE_HIGHLIGHT, 0))}`,
          } as HelpItem;
        });
        return highlightedHelpItems;
      }
    }
    return helpItems;
  }, [search, helpItems]);

  return (
    <ServiceLayout description={t('help.description')} title={t('help.title')}>
      <TextField
        containerStyle={tw`flex flex-row items-center bg-gray-200 dark:bg-neutral-800 mx-3 my-3 rounded-lg px-3 min-h-10`}
        enterKeyHint="search"
        floatingPlaceholderStyle={tw`text-gray-700`}
        leadingAccessory={
          <MaterialCommunityIcons
            color={tw.color('slate-500')}
            iconStyle={tw`h-6 w-6`}
            name="magnify"
            size={24}
            style={tw`shrink-0`}
          />
        }
        placeholder={t('help.search.placeholder')}
        style={tw`mx-2 dark:text-gray-200`}
        trailingAccessory={
          search ? (
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="close"
              size={24}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              onPress={() => setSearch('')}
            />
          ) : (
            <></>
          )
        }
        value={search}
        onChangeText={setSearch}
      />
      {!isReady ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={tw`flex items-center justify-center grow`}>
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`h-16 w-16`}
          />
        </Animated.View>
      ) : search && !filteredHelpItems.length ? (
        <AppText
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          style={tw`text-base mt-3 mx-auto dark:text-gray-200`}>
          {t('help.search.empty')}
        </AppText>
      ) : (
        filteredHelpItems.map(({ label, to, markdownDescription }) => (
          <Animated.View
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            key={to}>
            <Link asChild href={to}>
              <ServiceRow
                withBottomDivider
                label={label}
                renderDescription={() =>
                  markdownDescription && (
                    <Markdown
                      style={{
                        body: tw`text-sm text-slate-500 dark:text-slate-400`,
                        strong: tw`font-semibold text-slate-600 dark:text-slate-300`,
                        paragraph: tw`my-1`, // https://github.com/iamacup/react-native-markdown-display/issues/155#issuecomment-1034175229
                      }}>
                      {markdownDescription}
                    </Markdown>
                  )
                }
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
          </Animated.View>
        ))
      )}
    </ServiceLayout>
  );
};

export default Help;
