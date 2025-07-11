import LoadingSkeleton from '../LoadingSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const MembershipCard = ({
  lastMembershipYear,
  valid,
  active,
  loading = false,
  style,
}: {
  lastMembershipYear?: number;
  valid?: boolean;
  active?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-200 dark:bg-gray-900 rounded-2xl w-32 relative pl-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        name={active ? 'card-account-details-star-outline' : 'badge-account-horizontal-outline'}
        size={40}
      />

      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>
        {t('home.profile.membership.label')}
      </AppText>
      {loading ? (
        <LoadingSkeleton height={28} width={96} />
      ) : (
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={1}
          style={[
            tw`text-2xl font-normal w-full`,
            lastMembershipYear
              ? tw`text-slate-900 dark:text-gray-200`
              : tw`text-gray-400 dark:text-slate-600`,
          ]}>
          {lastMembershipYear || t('home.profile.membership.status.none')}
        </AppText>
      )}

      <View style={tw`absolute top-0 bottom-0 right-0 z-1 rounded-2xl overflow-hidden w-16`}>
        <Fader
          position={Fader.position.END}
          size={16}
          tintColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
        />
      </View>

      {valid ? (
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('emerald-700') : tw.color('emerald-600')}
          name="check-circle"
          size={20}
          style={tw`absolute top-3 right-3 z-10`}
        />
      ) : valid === false ? (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -top-1 -right-1`}>
          <View style={tw`h-3 w-3 bg-red-600 dark:bg-red-700 rounded-full`} />
        </Animated.View>
      ) : null}
    </View>
  );
};

export default MembershipCard;
