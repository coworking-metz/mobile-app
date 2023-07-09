import AppBottomSheet from '../AppBottomSheet';
import ZoombableImage from '../ZoomableImage';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { type AmourFoodMenu } from '@/services/api/amourFood';

const AmourFoodBottomSheet = ({
  menu,
  style,
  onClose,
}: {
  menu?: AmourFoodMenu | null;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      {menu && (
        <View style={tw`flex flex-col items-center justify-between gap-4 p-6 w-full`}>
          <Text
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('home.amourFood.date', {
              date: new Date(menu.date),
              formatParams: {
                date: { weekday: 'long', month: 'long', day: 'numeric' },
              },
            })}
          </Text>
          <ZoombableImage
            contentFit="cover"
            source={menu.picture}
            style={tw`h-40 min-w-full rounded-2xl bg-gray-200 dark:bg-gray-900`}
            transition={300}
          />
          {menu.description ? (
            <Text style={tw`text-center text-base text-slate-500 dark:text-slate-400`}>
              {menu.description}
            </Text>
          ) : null}
          <Button
            backgroundColor={theme.darkVanilla}
            style={tw`min-h-14 self-stretch`}
            onPress={() => router.push(menu.url)}>
            <Text style={tw`text-base font-medium`}>{t('home.amourFood.order')}</Text>
          </Button>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default AmourFoodBottomSheet;
