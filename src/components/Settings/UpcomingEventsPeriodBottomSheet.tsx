import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, { type AppBottomSheetProps } from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import AppWheelPicker from '@/components/AppWheelPicker';
import useSettingsStore from '@/stores/settings';

const UpcomingEventsPeriodBottomSheet = (props: Omit<AppBottomSheetProps, 'children'>) => {
  const { t } = useTranslation();
  const upcomingEventsPeriod = useSettingsStore((state) => state.upcomingEventsPeriod);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`pb-0 px-6`}
      enableContentPanningGesture={false}
      {...props}>
      <AppText style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mt-6`}>
        {t('settings.general.home.upcomingEventsPeriod.label')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 mt-5 -mb-5`}>
        {t('settings.general.home.upcomingEventsPeriod.description')}
      </AppText>
      <View style={tw`flex flex-row items-start justify-center gap-2`}>
        <AppWheelPicker
          enableScrollByTapOnItem
          data={[...Array(11).keys()].map((index) => ({ label: `${index}`, value: index }))}
          itemTextStyle={tw`text-right pr-2 font-normal text-slate-900 dark:text-gray-200`}
          style={tw`grow shrink basis-0 max-w-40`}
          value={upcomingEventsPeriod.count}
          onValueChanging={({ item: { value } }) =>
            useSettingsStore.setState({
              upcomingEventsPeriod: {
                ...upcomingEventsPeriod,
                count: Number(value),
              },
            })
          }
        />
        <AppWheelPicker
          data={[
            {
              label: t('settings.general.home.upcomingEventsPeriod.options.day', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'day',
            },
            {
              label: t('settings.general.home.upcomingEventsPeriod.options.week', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'week',
            },
            {
              label: t('settings.general.home.upcomingEventsPeriod.options.month', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'month',
            },
          ]}
          itemTextStyle={tw`text-left pl-2 font-normal text-slate-500 dark:text-slate-400`}
          style={tw`grow shrink basis-0 max-w-40`}
          value={upcomingEventsPeriod.unit}
          onValueChanged={({ item: { value } }) =>
            useSettingsStore.setState({
              upcomingEventsPeriod: {
                ...upcomingEventsPeriod,
                unit: `${value}` as 'day' | 'week' | 'month',
              },
            })
          }
        />
      </View>
    </AppBottomSheet>
  );
};

export default UpcomingEventsPeriodBottomSheet;
