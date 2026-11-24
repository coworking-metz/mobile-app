import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import { AppBottomSheetProps } from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import NoticeBottomSheet, { NoticeDescription } from '@/components/NoticeBottomSheet';
import { parseErrorText } from '@/helpers/error';
import { type ErrorsNotice } from '@/stores/notice';

const NoticeErrorBottomSheet = ({
  notice: { errors, ...notice },
  ...props
}: AppBottomSheetProps & {
  notice: ErrorsNotice;
}) => {
  const { t } = useTranslation();
  const [descriptions, setDescriptions] = useState<(string | null)[] | null>(null);

  useEffect(() => {
    Promise.all(errors.map(({ error }) => (error ? parseErrorText(error) : null))).then(
      setDescriptions,
    );
  }, [errors]);

  const [single] = errors;
  const isSingleTitled = errors.length === 1 && !!single.title;
  // a list of errors reads better left-aligned
  const textAlign = errors.length > 1 ? tw`text-left` : tw`text-center`;

  // present once parsed so the auto detent fits the final content
  if (!descriptions) return null;

  return (
    <NoticeBottomSheet
      {...props}
      notice={{
        ...notice,
        title: isSingleTitled
          ? (single.title as string)
          : t('errors.multiple', { count: errors.length }),
      }}>
      {errors.map(({ title, date }, index) => (
        <View key={`notice-error-${index}`} style={tw`mt-4 flex w-full flex-col`}>
          <View style={tw`flex w-full flex-row items-baseline justify-center gap-2`}>
            {/* single title is already the sheet title */}
            {title && !isSingleTitled ? (
              <AppText
                style={[
                  tw`flex-1 text-lg font-semibold text-slate-900 dark:text-gray-200`,
                  textAlign,
                ]}>
                {title}
              </AppText>
            ) : null}
            {date && errors.length > 1 ? (
              <AppText style={tw`text-sm text-slate-400 dark:text-neutral-600`}>
                {dayjs(date).format('LT')}
              </AppText>
            ) : null}
          </View>
          {descriptions[index] ? (
            <NoticeDescription description={descriptions[index]} style={textAlign} />
          ) : null}
        </View>
      ))}
    </NoticeBottomSheet>
  );
};

export default NoticeErrorBottomSheet;
