import AppIcon from '../AppIcon';
import AppShimmerText from '../AppShimmerText';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useIsFocused } from 'expo-router';
import { compact } from 'lodash';
import { forwardRef, ForwardRefRenderFunction, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import tw from 'twrnc';
import CoworkingLogo from '@/assets/images/icon/icon-light-1024.png';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import ProfilePicture from '@/components/Home/ProfilePicture';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { ApiMessage } from '@/services/api/members';

export type MessageCardProps = TouchableHighlightProps & {
  author?: ApiMessage['author'];
  title?: string;
  unread?: boolean;
  published?: string;
  renderDescription?: () => ReactNode;
  loading?: boolean;
  pending?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const MessageCard: ForwardRefRenderFunction<typeof TouchableHighlight, MessageCardProps> = (
  {
    author,
    title,
    unread,
    published,
    renderDescription,
    loading = false,
    pending = false,
    disabled = false,
    style,
    onPress,
  },
  ref,
) => {
  const { i18n } = useTranslation();
  const isFocus = useIsFocused();
  const activeSince = useAppState();

  const publishedAt = useMemo(() => {
    if (!published) return null;

    const today = dayjs().startOf('day');

    if (today.isSame(published, 'day')) {
      return dayjs(published).format('LT');
    }

    const yesterday = today.subtract(1, 'day');
    const tomorrow = today.add(1, 'day');
    if (dayjs(published).isBetween(yesterday, tomorrow, 'minute', '[]')) {
      const [firstWord] = dayjs(published).calendar().split(' ');
      if (firstWord) return firstWord;
    }

    if (today.isSame(published, 'week')) {
      return dayjs(published).format('dddd');
    }

    return new Date(published).toLocaleDateString(i18n.language, {
      month: 'short',
      day: 'numeric',
    });
  }, [published, i18n.language, isFocus, activeSince]);

  return (
    <TouchableHighlight
      ref={ref as never}
      disabled={disabled || pending || !onPress}
      style={[tw`flex flex-col pt-2 pl-1 pb-3 pr-6`, style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}>
      <Animated.View style={[tw`flex flex-row items-start w-full`]}>
        {pending ? (
          <>
            <View style={tw`h-12 w-12 rounded-full self-center overflow-hidden mt-1.5`}>
              <LoadingSkeleton height={`100%`} width={`100%`} />
            </View>
            <View
              style={tw`flex flex-col gap-2 items-start justify-center min-h-12 ml-3 self-stretch mt-0.5`}>
              <LoadingSkeleton height={21} width={128} />
              <LoadingSkeleton height={14} width={192} />
            </View>
          </>
        ) : (
          <>
            <View style={tw`self-center w-5 rounded-full flex items-center justify-center`}>
              {unread && (
                <Animated.View
                  entering={BounceIn.duration(1000)}
                  exiting={BounceOut.duration(1000)}
                  style={tw`h-3 w-3 bg-blue-600 dark:bg-blue-700 rounded-full`}
                />
              )}
            </View>

            {author ? (
              <ProfilePicture
                name={compact([author.firstName, author.lastName]).join(' ')}
                pending={pending}
                pictureStyle={tw`rounded-full`}
                style={tw`h-12 w-12 self-center`}
                url={author.thumbnail}
              />
            ) : (
              <AppSquircleView
                style={tw`h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-300 dark:bg-zinc-700`}>
                <Image source={CoworkingLogo} style={[tw`h-full w-full`]} />
              </AppSquircleView>
            )}

            <View
              style={tw`flex flex-col items-start min-h-12 ml-3 self-stretch shrink grow basis-0`}>
              <View style={tw`flex flex-row items-center gap-1 justify-between w-full`}>
                <View style={tw`shrink grow basis-0`}>
                  <AppShimmerText
                    active={loading}
                    activeColor={
                      tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('gray-100')
                    }
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
                    {title}
                  </AppShimmerText>
                </View>

                <AppText
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={tw`text-xs font-light text-slate-800 dark:text-neutral-300 shrink-0`}>
                  {publishedAt}
                </AppText>
              </View>

              <View style={tw`flex flex-row items-start justify-between`}>
                {renderDescription?.()}

                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  icon="chevron-right"
                  size={24}
                  style={tw`shrink-0 w-4`}
                />
              </View>
            </View>
          </>
        )}
      </Animated.View>
    </TouchableHighlight>
  );
};

export default forwardRef(MessageCard);
