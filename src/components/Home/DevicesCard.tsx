import LoadingSkeleton from '../LoadingSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimatedProps, BounceIn, BounceOut } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const DevicesCard = ({
  count,
  pending,
  style,
}: AnimatedProps<ViewProps> & {
  count?: number;
  pending?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();

  return (
    <Animated.View
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-200 dark:bg-gray-900 rounded-2xl w-32 relative pl-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        name="devices"
        size={40}
      />

      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>
        {t('home.profile.devices.description')}
      </AppText>

      {pending ? (
        <LoadingSkeleton height={24} width={80} />
      ) : (
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={1}
          style={[
            tw`mt-auto text-2xl font-normal w-full`,
            count ? tw`text-slate-900 dark:text-gray-200` : tw`text-gray-400 dark:text-slate-600`,
          ]}>
          {t('home.profile.devices.count', { count: count ?? 0 })}
        </AppText>
      )}

      <View style={tw`absolute top-0 bottom-0 right-0 z-1 rounded-2xl overflow-hidden w-16`}>
        <Fader
          position={Fader.position.END}
          size={16}
          tintColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
        />
      </View>

      {count === 0 && (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -top-1 -right-1`}>
          <View style={tw`h-3 w-3 bg-red-600 dark:bg-red-700 rounded-full`} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default DevicesCard;
