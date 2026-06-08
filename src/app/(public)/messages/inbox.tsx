import { MaterialCommunityIcons } from '@expo/vector-icons';
import uFuzzy from '@leeoniya/ufuzzy';
import Markdown, { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useIsFocused } from 'expo-router';
import { capitalize, compact, isNil, sample } from 'lodash';
import MarkdownItPlainText from 'markdown-it-plain-text';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeOut,
  FadeOutLeft,
  FadeOutUp,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import LoveLetterAnimation from '@/components/Animations/LoveLetterAnimation';
import AppIcon from '@/components/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import AppTextField from '@/components/AppTextField';
import ErrorBadge from '@/components/ErrorBadge';
import ErrorState from '@/components/ErrorState';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import MessageCard from '@/components/Messages/MessageCard';
import PushNotificationsAlert from '@/components/PushNotifications/PushNotificationsAlert';
import { useAppPushNotifications } from '@/context/push-notifications';
import useAppState from '@/helpers/app-state';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { ApiMessage, getMemberMessages } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const CHARACTERS_BEFORE_HIGHLIGHT = 16;
const MAX_DESCRIPTION_LENGTH = 80;
const fuzzy = new uFuzzy();

const markdownHighlighter = (part: string, matched: boolean) => (matched ? `**${part}**` : part);

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<MessageListItem>);

type MessageListItem = ApiMessage & {
  description: string; // a stripped down version of the body to highlight search results
};

const InboxScreen = ({ from }: { from?: string }) => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const { arePushNotificationsEnabled } = useAppPushNotifications();
  const activeSince = useAppState();
  const isFocus = useIsFocused();
  const [search, setSearch] = useState('');

  const {
    isPending: isPendingMessages,
    isFetching: isFetchingMessages,
    data: messages,
    error: messagesError,
    refetch: refetchMessages,
    dataUpdatedAt: messagesUpdatedAt,
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

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return messagesUpdatedAt ? dayjs().diff(messagesUpdatedAt, 'second') : null;
  }, [messagesUpdatedAt, isFocus, activeSince]);

  const loadingText = useMemo(() => {
    const i18nLoading = t('home.refresh.loading', { returnObjects: true });
    return Array.isArray(i18nLoading) ? sample(i18nLoading) : i18nLoading;
  }, [t, durationSinceLastFetch]);

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
        contentStyle={tw`pb-6`}
        from={from}
        loading={isFetchingMessages}
        // menu={<AppIconButton icon="magnify" iconSize={24} />}
        title={t('messages.list.title')}
        onRefresh={refetchMessages}>
        {/* <AppTextField
          containerStyle={tw`flex flex-row items-center bg-gray-200 dark:bg-neutral-800 mx-6 rounded-lg`}
          enterKeyHint="search"
          leadingAccessory={
            <AppIcon color={tw.color('zinc-500')} icon="magnify" size={24} style={tw`shrink-0`} />
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
        /> */}

        {!arePushNotificationsEnabled && !settingsStore.hidePushNotificationsAlert && (
          <Animated.View exiting={FadeOutUp.duration(500)}>
            <PushNotificationsAlert style={tw`mx-6 my-4`} />
          </Animated.View>
        )}

        <View style={tw`flex flex-row items-center gap-2 min-h-6 px-6 mt-4 mb-2`}>
          <AppShimmerText
            active={isFetchingMessages}
            numberOfLines={1}
            style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
            {!isNil(durationSinceLastFetch)
              ? capitalize(
                  durationSinceLastFetch > 3_600
                    ? dayjs(messagesUpdatedAt).calendar()
                    : dayjs(messagesUpdatedAt).fromNow(),
                )
              : messagesError && !isSilentError(messagesError)
                ? t('messages.list.onFetch.fail')
                : loadingText}
          </AppShimmerText>
          {messagesError && !isSilentError(messagesError) ? (
            <ErrorBadge
              error={messagesError}
              title={t('messages.list.onFetch.fail')}
              onRetry={refetchMessages}
            />
          ) : null}
        </View>

        {filteredMessages?.length ? (
          <AnimatedFlashList
            data={filteredMessages}
            decelerationRate="fast"
            horizontal={false}
            keyExtractor={(message) => message._id}
            renderItem={({ item: message }) => (
              <Link asChild href={`/messages/${message._id}`}>
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
                          paragraph: tw`shrink grow basis-0`, // https://github.com/iamacup/react-native-markdown-display/issues/155#issuecomment-1034175229
                        }}>
                        {compact([
                          message.description.slice(0, MAX_DESCRIPTION_LENGTH),
                          message.description.length > MAX_DESCRIPTION_LENGTH && '…',
                        ]).join('')}
                      </Markdown>
                    ) : (
                      <View style={tw` shrink grow basis-0`}>
                        <AppText
                          numberOfLines={2}
                          style={tw`text-sm text-slate-500 dark:text-neutral-500`}>
                          {message.description}
                        </AppText>
                      </View>
                    )
                  }
                  title={message.title}
                  unread={!message.read}
                />
              </Link>
            )}
          />
        ) : isPendingMessages ? (
          <Animated.View exiting={FadeOut.duration(500)} style={tw`mx-3 flex flex-col`}>
            <MessageCard pending style={tw``} />
            <MessageCard pending style={tw``} />
          </Animated.View>
        ) : (
          <Animated.View style={tw`flex flex-col items-center w-full h-full mt-4 px-6`}>
            <LoveLetterAnimation autoPlay loop={false} style={tw`h-56 -mb-12 w-full`} />
            <AppText
              style={tw`text-base text-center font-normal text-slate-500 dark:text-neutral-500`}>
              {t('messages.list.empty.title')}
            </AppText>
          </Animated.View>
        )}
      </ServiceLayout>
    </>
  );
};

export default InboxScreen;
