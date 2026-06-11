import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import AppWheelPicker from '@/components/AppWheelPicker';
import useSettingsStore from '@/stores/settings';

const UpcomingEventsPeriodBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<AppBottomSheetProps, 'children'>
> = ({ style, ...props }, forwardedRef) => {
  const { t } = useTranslation();
  const upcomingEventsPeriod = useSettingsStore((state) => state.upcomingEventsPeriod);

  return (
    <AppBottomSheet ref={forwardedRef} {...props} style={[tw`px-6 pt-6`, style]}>
      <AppText style={tw`text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('settings.home.upcomingEventsPeriod.label')}
      </AppText>
      <AppText
        style={tw`-mb-5 mt-5 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('settings.home.upcomingEventsPeriod.description')}
      </AppText>
      <View style={tw`flex flex-row items-start justify-center gap-2`}>
        <AppWheelPicker
          enableScrollByTapOnItem
          data={[...Array(10).keys()].map((index) => ({
            label: `${index + 1}`,
            value: index + 1,
          }))}
          itemTextStyle={tw`pr-2 text-right font-medium text-slate-900 dark:text-gray-200`}
          style={tw`max-w-40 shrink grow basis-0`}
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
              label: t('settings.home.upcomingEventsPeriod.options.day', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'day',
            },
            {
              label: t('settings.home.upcomingEventsPeriod.options.week', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'week',
            },
            {
              label: t('settings.home.upcomingEventsPeriod.options.month', {
                count: upcomingEventsPeriod.count,
              }),
              value: 'month',
            },
          ]}
          itemTextStyle={tw`pl-2 text-left font-normal text-slate-600 dark:text-neutral-400`}
          style={tw`max-w-40 shrink grow basis-0`}
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

export default forwardRef(UpcomingEventsPeriodBottomSheet);
