import { Fader } from '@ddx0510/react-native-ui-lib';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type LayoutChangeEvent, Text, View, type ViewProps } from 'react-native';
import Animated, { type AnimateProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const BalanceCard = ({
  loading = false,
  style,
  ...props
}: AnimateProps<ViewProps> & {
  loading?: boolean;
  style?: StyleProps | false;
}) => {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  return (
    <Animated.View
      style={[
        tw`flex flex-col gap-2 items-center h-24 rounded-2xl self-stretch overflow-hidden`,
        style,
      ]}
      {...props}>
      {loading ? (
        <View
          style={tw`flex flex-row justify-between items-start h-full w-full bg-gray-200 dark:bg-gray-900 pl-3`}>
          <View style={tw`flex flex-col gap-2 mt-3`}>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={16}
              width={128}
            />
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={28}
              width={192}
            />
          </View>
          <View
            style={[tw`h-full grow relative`]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setContainerWidth(nativeEvent.layout.width)
            }>
            <View style={tw`absolute left-0 top-0 bottom-0 z-10`}>
              <Fader
                visible
                position={Fader.position.START}
                size={containerWidth / 4}
                tintColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
              />
            </View>

            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height="100%"
              radius={'square'}
              width={'100%'}
            />
          </View>
        </View>
      ) : (
        <>
          <Image
            contentFit="contain"
            source={require('@/assets/images/calendar-outline-washed-out.svg')}
            style={[tw`h-16 w-full`]}
          />
          <Text style={tw`text-base text-slate-500 dark:text-slate-400`}>
            {t('home.calendar.empty.label')}
          </Text>
        </>
      )}
    </Animated.View>
  );
};

export default BalanceCard;
