import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { compact } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { View } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import Divider from '@/components/Divider';
import ErrorState from '@/components/ErrorState';
import ProfilePicture from '@/components/Home/ProfilePicture';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { ApiMessage, getMemberMessage, getMemberMessages } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

export default function MessageScreen() {
  useDeviceContext(tw);
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  const { messageId, _root: withoutBackButton } = useLocalSearchParams();
  const { t } = useTranslation();

  const { isPending: isPendingMessageFromList, data: messageFromList } = useQuery({
    queryKey: membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberMessages(userId);
      }
      throw new Error(t('messages.onFetch.missing'));
    },
    enabled: false,
    select: (allMessages) => allMessages?.find((message) => message._id === messageId),
  });

  const {
    isPending: isPendingFullMessage,
    isFetching: isFetchingFullMessage,
    data: fullMessage,
    error: fullMessageError,
    refetch: refetchFullMessage,
  } = useQuery({
    queryKey: membersQueryKeys.messageById(authStore.user?.id ?? '', messageId as string),
    queryFn: ({ queryKey: [_membersPath, userId, _messagesPath, messageId] }) => {
      if (userId) {
        return getMemberMessage(userId, messageId);
      }
      throw new Error(t('messages.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const message = useMemo(() => {
    return fullMessage ?? messageFromList;
  }, [fullMessage, messageFromList]);

  useEffect(() => {
    if (fullMessage && fullMessage?.read !== messageFromList?.read) {
      queryClient.setQueryData(
        membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
        (allMessages: ApiMessage[]) => {
          if (Array.isArray(allMessages)) {
            return allMessages.map((m) =>
              m._id === fullMessage._id ? { ...m, read: fullMessage.read } : m,
            );
          }
          return allMessages;
        },
      );
    }
  }, [messageFromList, fullMessage]);

  return (
    <ServiceLayout
      actions={[
        {
          id: 'delete',
          title: t('messages.detail.archive.confirm'),
          onPress: () => {},
        },
      ]}
      contentStyle={tw`px-6 pt-3 pb-6`}
      loading={isFetchingFullMessage}
      title={message?.title}
      withBackButton={!withoutBackButton}
      onRefresh={refetchFullMessage}>
      {message ? (
        <>
          <Animated.View style={tw`flex flex-row`}>
            {message.author ? (
              <ProfilePicture
                name={compact([message.author.firstName, message.author.lastName]).join(' ')}
                style={tw`h-12 w-12`}
                url={message.author.thumbnail}
              />
            ) : (
              <AppSquircleView
                style={tw`h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-300 dark:bg-zinc-700`}>
                <MaterialCommunityIcons
                  backgroundColor="transparent"
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : theme.charlestonGreen}
                  iconStyle={{ marginRight: 0 }}
                  name="bullhorn-outline"
                  size={32}
                  style={[tw``]}
                />
              </AppSquircleView>
            )}

            <View style={tw`flex flex-col ml-4 justify-center`}>
              <AppText style={tw`text-lg font-semibold text-gray-900 dark:text-gray-200`}>
                {message.author
                  ? compact([message.author.firstName, message.author.lastName]).join(' ')
                  : t('messages.detail.author.system')}
              </AppText>
              <AppText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={tw`text-xs font-light text-slate-800 dark:text-slate-300`}>
                {dayjs(message.published).calendar()}
              </AppText>
            </View>
          </Animated.View>
          <Divider style={tw`mt-3`} />
          <Animated.View style={tw`mt-6`}>
            <MarkdownRenderer content={message.body} />
          </Animated.View>
        </>
      ) : isPendingMessageFromList && isPendingFullMessage ? (
        <>
          <Animated.View style={tw`flex flex-row`}>
            <View style={tw`rounded-full overflow-hidden`}>
              <LoadingSkeleton height={64} width={64} />
            </View>
            <View style={tw`flex flex-col ml-4 gap-2 justify-center`}>
              <LoadingSkeleton height={18} width={144} />
              <LoadingSkeleton height={12} width={64} />
            </View>
          </Animated.View>
          <Divider style={tw`mt-3`} />
          <Animated.View style={tw`flex flex-row flex-wrap gap-3 mt-6`}>
            {[...Array(8).keys()].map((index) => (
              <Animated.View
                entering={FadeIn.duration(2000).delay(500 * Math.random())}
                key={`body-loading-skeleton-${index}`}
                style={tw`rounded-lg overflow-hidden`}>
                <LoadingSkeleton height={18} width={Math.random() * 256 + 24} />
              </Animated.View>
            ))}
          </Animated.View>
        </>
      ) : fullMessageError && !isSilentError(fullMessageError) ? (
        <ErrorState error={fullMessageError} title={t('messages.detail.onFetch.fail')} />
      ) : null}
    </ServiceLayout>
  );
}
