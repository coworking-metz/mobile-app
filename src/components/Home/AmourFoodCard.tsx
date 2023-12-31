import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme, type LayoutChangeEvent } from 'react-native';
// import { getColors } from 'react-native-image-colors';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import { invertColor } from '@/helpers/colors';
import { type AmourFoodMenu } from '@/services/api/amourFood';

type TextColor = 'black' | 'white';

const AmourFoodCard = ({
  menu = null,
  loading = false,
  style,
}: {
  menu?: AmourFoodMenu | null;
  loading?: boolean;
  style?: StyleProps;
}) => {
  const { t } = useTranslation();
  const [backgroundColor, setBackgroundColor] = React.useState<string | null>(null);
  const [textColor, setTextColor] = React.useState<TextColor | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const initialColor = (
      colorScheme === 'dark' ? tw.color('gray-900') : tw.color('gray-200')
    ) as string;
    setBackgroundColor(initialColor);
    setTextColor(invertColor(initialColor, true, true) as TextColor);
  }, [colorScheme]);

  // useEffect(() => {
  //   getColors(menu.picture, {
  //     cache: true,
  //     key: menu.picture,
  //   }).then((imageColors) => {
  //     if (imageColors.platform === 'android') {
  //       setBackgroundColor(imageColors.average);
  //       setTextColor(invertColor(imageColors.average, true, true) as TextColor);
  //     } else if (imageColors.platform === 'ios') {
  //       setBackgroundColor(imageColors.background);
  //       setTextColor(invertColor(imageColors.background, true, true) as TextColor);
  //     }
  //   });
  // }, [menu.picture]);

  return (
    <View
      style={[
        tw`flex flex-row items-start justify-between bg-gray-200 dark:bg-gray-900 rounded-2xl min-h-24 self-stretch overflow-hidden`,
        style,
      ]}>
      {loading ? (
        <View style={tw`flex flex-col gap-[1.5] p-3`}>
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={16}
            show={loading}
            width={96}
          />
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={22}
            show={loading}
            width={172}
          />
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={22}
            show={loading}
            width={144}
          />
        </View>
      ) : menu ? (
        <>
          <View
            style={[
              tw`h-full pl-3 py-2 max-w-1/2`,
              { ...(backgroundColor && { backgroundColor }) },
            ]}>
            <Text
              numberOfLines={1}
              style={[
                tw`text-base`,
                {
                  ...(textColor && {
                    color: tw.color(textColor === 'black' ? 'slate-500' : 'slate-400'),
                  }),
                },
              ]}>
              {t('home.amourFood.date', {
                date: new Date(menu.date),
                formatParams: {
                  date: { weekday: 'long', month: 'long', day: 'numeric' },
                },
              })}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                tw`text-xl`,
                {
                  ...(textColor && {
                    color: tw.color(textColor === 'black' ? 'slate-900' : 'gray-200'),
                  }),
                },
              ]}>
              {menu.label}
            </Text>
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
                size={containerWidth}
                tintColor={backgroundColor || ''}
              />
            </View>
            <Image contentFit="cover" source={menu.picture} style={tw`h-full`} transition={1000} />
          </View>
        </>
      ) : null}
    </View>
  );
};

export default AmourFoodCard;
