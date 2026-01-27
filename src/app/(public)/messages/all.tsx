import { MaterialCommunityIcons } from '@expo/vector-icons';
import uFuzzy from '@leeoniya/ufuzzy';
import Markdown, { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { compact } from 'lodash';
import MarkdownItPlainText from 'markdown-it-plain-text';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import LoveLetterAnimation from '@/components/Animations/LoveLetterAnimation';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import MessageCard from '@/components/Messages/MessageCard';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { ApiMessage, getMemberMessages } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const CHARACTERS_BEFORE_HIGHLIGHT = 16;
const MAX_DESCRIPTION_LENGTH = 80;
const fuzzy = new uFuzzy();

const markdownHighlighter = (part: string, matched: boolean) => (matched ? `**${part}**` : part);

type MessageListItem = ApiMessage & {
  description: string; // a stripped down version of the body to highlight search results
};

const AllMessages = ({ from }: { from?: string }) => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const [search, setSearch] = useState('');

  const {
    isPending: isPendingMessages,
    isFetching: isFetchingMessages,
    data: messages,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberMessages(userId);
      }
      throw new Error(t('messages.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const allMessagesWithMarkdownRendered = useMemo<MessageListItem[]>(() => {
    return (
      messages?.map((m) => {
        const markdown = new MarkdownIt().use(MarkdownItPlainText);
        markdown.render(m.body);
        return { ...m, description: markdown.plainText ?? '' };
      }) ?? []
    );
  }, [messages]);

  const filteredMessages = useMemo<MessageListItem[]>(() => {
    if (search) {
      const haystack = allMessagesWithMarkdownRendered.map(({ description }) => description) || [];
      const indexes = fuzzy.filter(haystack, search);

      if (indexes) {
        const info = fuzzy.info(indexes, haystack, search);
        const order = fuzzy.sort(info, haystack, search);

        const highlightedItems = order.map((infoIndex) => {
          const itemIndex = info.idx[infoIndex];
          const message = allMessagesWithMarkdownRendered[itemIndex];
          const ranges = info.ranges[infoIndex];
          const [start] = ranges;

          const description = uFuzzy.highlight(
            message.description,
            info.ranges[infoIndex],
            markdownHighlighter,
          );

          return {
            ...message,
            description: compact([
              start > CHARACTERS_BEFORE_HIGHLIGHT && '…',
              description.slice(Math.max(start - CHARACTERS_BEFORE_HIGHLIGHT, 0)),
            ]).join(''),
          } as MessageListItem;
        });
        return highlightedItems;
      }
    }
    return allMessagesWithMarkdownRendered;
  }, [search, allMessagesWithMarkdownRendered]);

  return (
    <>
      <ServiceLayout
        contentStyle={tw`py-4`}
        from={from}
        loading={isFetchingMessages}
        title={t('messages.list.title')}
        onRefresh={refetchMessages}>
        <AppTextField
          containerStyle={tw`flex flex-row items-center bg-gray-200 dark:bg-neutral-800 mx-6 rounded-lg`}
          enterKeyHint="search"
          leadingAccessory={
            <MaterialCommunityIcons
              color={tw.color('zinc-500')}
              iconStyle={tw`h-6 w-6`}
              name="magnify"
              size={24}
              style={tw`shrink-0`}
            />
          }
          placeholder={t('messages.list.search.placeholder')}
          style={tw`mx-2 dark:text-gray-200`}
          trailingAccessory={
            search ? (
              <MaterialCommunityIcons.Button
                aria-label={t('actions.close')}
                backgroundColor="transparent"
                borderRadius={20}
                color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
                iconStyle={tw`mr-0`}
                name="close"
                size={20}
                style={tw`p-0.5 shrink-0`}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-700') : tw.color('gray-300')}
                onPress={() => setSearch('')}
              />
            ) : (
              <></>
            )
          }
          value={search}
          onChangeText={setSearch}
        />

        <Animated.View exiting={FadeOut.duration(500)} style={tw`mt-3 mx-3 flex flex-col`}>
          {filteredMessages?.length ? (
            <>
              {filteredMessages.map((message) => (
                <Link asChild href={`/messages/${message._id}`} key={`message-card-${message._id}`}>
                  <MessageCard
                    author={message.author}
                    loading={isFetchingMessages}
                    published={message.published}
                    renderDescription={() =>
                      search ? (
                        <Markdown
                          style={{
                            body: tw`text-sm text-slate-500 dark:text-neutral-500`,
                            strong: tw`font-semibold text-gray-900 dark:text-gray-100`,
                            paragraph: tw`mt-1`, // https://github.com/iamacup/react-native-markdown-display/issues/155#issuecomment-1034175229
                          }}>
                          {compact([
                            message.description.slice(0, MAX_DESCRIPTION_LENGTH),
                            message.description.length > MAX_DESCRIPTION_LENGTH && '…',
                          ]).join('')}
                        </Markdown>
                      ) : (
                        <AppText
                          numberOfLines={2}
                          style={tw`mt-1 text-sm text-slate-500 dark:text-neutral-500`}>
                          {message.description}
                        </AppText>
                      )
                    }
                    title={message?.title}>
                    <MaterialCommunityIcons
                      color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                      name="chevron-right"
                      size={24}
                      style={tw`self-center shrink-0 ml-auto w-4`}
                    />
                  </MessageCard>
                </Link>
              ))}
            </>
          ) : isPendingMessages ? (
            <>
              <MessageCard pending style={tw`h-44`} />
              <MessageCard pending style={tw`h-44 mt-8`} />
            </>
          ) : messagesError && !isSilentError(messagesError) ? (
            <ErrorState error={messagesError} title={t('messages.list.onFetch.fail')} />
          ) : (
            <Animated.View style={tw`flex flex-col items-center w-full h-full mt-4`}>
              <LoveLetterAnimation autoPlay loop={false} style={tw`h-56 -my-12 w-full`} />
              <AppText
                style={tw`text-base text-center font-normal text-slate-500 dark:text-neutral-500`}>
                {t('messages.list.empty')}
              </AppText>
            </Animated.View>
          )}
        </Animated.View>
      </ServiceLayout>
    </>
  );
};

export default AllMessages;
