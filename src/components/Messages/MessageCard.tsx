import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { compact } from 'lodash';
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import CoworkingLogo from '@/assets/images/icon/icon-light-1024.png';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import ProfilePicture from '@/components/Home/ProfilePicture';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { ApiMessage } from '@/services/api/members';

export type MessageCardProps = TouchableHighlightProps & {
  author?: ApiMessage['author'];
  title?: string;
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
    published,
    renderDescription,
    loading = false,
    pending = false,
    disabled = false,
    style,
    children,
    onPress,
  },
  ref,
) => {
  return (
    <TouchableHighlight
      ref={ref as never}
      disabled={disabled || pending || !onPress}
      style={[tw`flex flex-col p-3 rounded-xl`, style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}>
      <Animated.View style={[tw`flex flex-row items-start w-full`]}>
        {pending ? (
          <>
            <View style={tw`h-12 w-12 rounded-full overflow-hidden`}>
              <LoadingSkeleton height={`100%`} width={`100%`} />
            </View>
            <View
              style={tw`flex flex-col gap-2 items-start justify-center min-h-12 ml-3 self-stretch`}>
              <LoadingSkeleton height={24} width={128} />
              <LoadingSkeleton height={18} width={192} />
            </View>
          </>
        ) : (
          <>
            {author ? (
              <ProfilePicture
                loading={loading}
                name={compact([author.firstName, author.lastName]).join(' ')}
                pending={pending}
                style={tw`h-12 w-12`}
                url={author.thumbnail}
              />
            ) : (
              <AppSquircleView
                style={tw`h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-300 dark:bg-zinc-700`}>
                <Image source={CoworkingLogo} style={[tw`h-full w-full`]} />
              </AppSquircleView>
            )}

            <View
              style={tw`flex flex-col items-start justify-center min-h-12 ml-3 self-stretch shrink grow basis-0`}>
              <AppText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
                {title}
              </AppText>
              <AppText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={tw`text-xs font-light text-slate-800 dark:text-slate-300`}>
                {dayjs(published).calendar()}
              </AppText>

              {renderDescription?.()}
            </View>
            {children}
          </>
        )}
      </Animated.View>
    </TouchableHighlight>
  );
};

export default forwardRef(MessageCard);
