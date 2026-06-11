import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { compact } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { View } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import CoworkingLogo from '@/assets/images/icon/icon-light-1024.png';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import Divider from '@/components/Divider';
import ErrorState from '@/components/ErrorState';
import ProfilePicture from '@/components/Home/ProfilePicture';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { handleSilentError, isSilentError } from '@/helpers/error';
import {
  ApiMessage,
  archiveMemberMessage,
  getMemberMessage,
  getMemberMessages,
  restoreMemberMessage,
} from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useToastStore, { TOAST_SUCCESS_TIMEOUT } from '@/stores/toast';

export default function MessageScreen() {
  useDeviceContext(tw);
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();

  const { messageId, _root: withoutBackButton } = useLocalSearchParams();
  const { t } = useTranslation();
  const [archiving, setArchiving] = useState(false);
  const [restoring, setRestoring] = useState(false);

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
    queryFn: ({ queryKey: [_membersPath, userId, _messagesPath, keyMessageId] }) => {
      if (userId) {
        return getMemberMessage(userId, keyMessageId);
      }
      throw new Error(t('messages.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const message = useMemo(() => {
    return fullMessage ?? messageFromList;
  }, [fullMessage, messageFromList]);

  const onArchive = useCallback(() => {
    setArchiving(true);
    archiveMemberMessage(authStore.user?.id as string, messageId as string)
      .then((archivedMessage) => {
        toastStore.add({
          message: t('messages.onArchive.success', { title: archivedMessage?.title }),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.messageById(authStore.user?.id ?? '', messageId as string),
          exact: true,
        });
        queryClient.setQueryData(
          membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
          (allMessages: ApiMessage[]) => {
            if (Array.isArray(allMessages)) {
              return allMessages.map((m) =>
                m._id === archivedMessage._id ? { ...m, archived: archivedMessage.archived } : m,
              );
            }
            return allMessages;
          },
        );
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/messages');
        }
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('messages.onArchive.fail', { title: message?.title }),
        }),
      )
      .finally(() => {
        setArchiving(false);
      });
  }, [router, toastStore, queryClient, noticeStore, authStore.user, message, messageId]);

  const onRestore = useCallback(() => {
    setRestoring(true);
    restoreMemberMessage(authStore.user?.id as string, messageId as string)
      .then((restoredMessage) => {
        toastStore.add({
          message: t('messages.onRestore.success', { title: restoredMessage?.title }),
          type: 'success',
          timeout: TOAST_SUCCESS_TIMEOUT,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryKeys.messageById(authStore.user?.id ?? '', messageId as string),
          exact: true,
        });
        queryClient.setQueryData(
          membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
          (allMessages: ApiMessage[]) => {
            if (Array.isArray(allMessages)) {
              return allMessages.map((m) =>
                m._id === restoredMessage._id ? { ...m, archived: restoredMessage.archived } : m,
              );
            }
            return allMessages;
          },
        );
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/messages');
        }
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('messages.onRestore.fail', { title: message?.title }),
        }),
      )
      .finally(() => {
        setRestoring(false);
      });
  }, [router, toastStore, queryClient, noticeStore, authStore.user, message, messageId]);

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
        message?.archived
          ? {
              id: 'delete',
              title: t('messages.detail.restore'),
              onPress: onRestore,
            }
          : {
              id: 'delete',
              title: t('messages.detail.archive'),
              onPress: onArchive,
            },
      ]}
      contentStyle={tw`px-6 pb-6 pt-3`}
      loading={isFetchingFullMessage || archiving || restoring}
      title={message?.title}
      withBackButton={!withoutBackButton}
      onRefresh={refetchFullMessage}>
      {message ? (
        <>
          <Animated.View style={tw`flex flex-row`}>
            {message.author ? (
              <ProfilePicture
                name={compact([message.author.firstName, message.author.lastName]).join(' ')}
                pictureStyle={tw`rounded-full`}
                style={tw`size-12`}
                url={message.author.thumbnail}
              />
            ) : (
              <AppSquircleView
                style={tw`flex size-12 items-center justify-center overflow-hidden rounded-xl bg-zinc-300 dark:bg-zinc-700`}>
                <Image source={CoworkingLogo} style={[tw`size-full`]} />
              </AppSquircleView>
            )}

            <View style={tw`ml-4 flex flex-col justify-center`}>
              <AppText style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
                {message.author
                  ? compact([message.author.firstName, message.author.lastName]).join(' ')
                  : t('messages.detail.author.system')}
              </AppText>
              <AppText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={tw`text-xs font-light text-slate-800 dark:text-neutral-300`}>
                {dayjs(message.published).calendar()}
              </AppText>
            </View>
          </Animated.View>
          <Divider style={tw`mt-3`} />
          <Animated.View style={tw`mt-3`}>
            <MarkdownRenderer content={message.body} />
          </Animated.View>
        </>
      ) : isPendingMessageFromList && isPendingFullMessage ? (
        <>
          <Animated.View style={tw`flex flex-row`}>
            <View style={tw`overflow-hidden rounded-full`}>
              <LoadingSkeleton height={48} width={48} />
            </View>
            <View style={tw`ml-4 flex flex-col justify-center gap-2`}>
              <LoadingSkeleton height={18} width={144} />
              <LoadingSkeleton height={12} width={64} />
            </View>
          </Animated.View>
          <Divider style={tw`mt-3`} />
          <Animated.View style={tw`mt-6 flex flex-row flex-wrap gap-3`}>
            {[...Array(8).keys()].map((index) => (
              <Animated.View
                entering={FadeIn.duration(2000).delay(500 * Math.random())}
                key={`body-loading-skeleton-${index}`}
                style={tw`overflow-hidden rounded-lg`}>
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
