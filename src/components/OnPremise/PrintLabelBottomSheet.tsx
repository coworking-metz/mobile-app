import { Slider } from '@expo/ui/community/slider';
import { Canvas, FilterMode, Image, MipmapMode, useTypeface } from '@shopify/react-native-skia';
import * as Device from 'expo-device';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { compact } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import tw from 'twrnc';
import EvelethClean from '@/assets/fonts/EvelethClean.ttf';
import EvelethCleanThin from '@/assets/fonts/EvelethCleanThin.ttf';
import LobsterTwoBold from '@/assets/fonts/LobsterTwo-Bold.ttf';
import AppAlert from '@/components/AppAlert';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppSegmentedControl from '@/components/AppSegmentedControl';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import AppTextField from '@/components/AppTextField';
import ServiceRow from '@/components/Layout/ServiceRow';
import {
  connectLabelPrinter,
  DEFAULT_LETTER_SPACING,
  disconnectLabelPrinter,
  dotsToMm,
  FEED_STRETCH,
  HEAD_DOTS,
  LABEL_MAX_LENGTH_MM,
  mmToDots,
  printLabel,
  renderLabel,
  useLabelPrinterStore,
  type ScannedPrinter,
} from '@/helpers/label-printer';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useToastStore, { TOAST_SUCCESS_TIMEOUT } from '@/stores/toast';

const FONTS = {
  'Eveleth Clean': EvelethClean,
  'Eveleth Clean Thin': EvelethCleanThin,
  // SIL Open Font License, see `LobsterTwo-OFL.txt`
  'Lobster Two': LobsterTwoBold,
};
const FONT_FAMILIES = Object.keys(FONTS) as (keyof typeof FONTS)[];

const MIN_HEIGHT_MM = 1;
const MAX_HEIGHT_MM = Math.floor(dotsToMm(HEAD_DOTS) * 10) / 10;
const MAX_LETTER_SPACING_PERCENT = 50;
/** Preview height, in points */
const PREVIEW_HEIGHT = 64;

/** "Firstname L." */
const getDefaultText = (name?: string) => {
  const [firstName, ...otherNames] = name?.trim().split(/\s+/) ?? [];
  const lastName = otherNames.at(-1);
  return compact([firstName, lastName && `${lastName[0].toUpperCase()}.`]).join(' ');
};

const PrintLabelBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const userName = useAuthStore((state) => state.user?.name);
  const { isScanning, isConnecting, isPrinting, deviceName, printers, error } =
    useLabelPrinterStore();
  // font names are displayed in their own font
  useFonts(FONTS);
  const typefaces = {
    'Eveleth Clean': useTypeface(FONTS['Eveleth Clean']),
    'Eveleth Clean Thin': useTypeface(FONTS['Eveleth Clean Thin']),
    'Lobster Two': useTypeface(FONTS['Lobster Two']),
  };

  const [text, setText] = useState(() => getDefaultText(userName));
  const [fontFamily, setFontFamily] = useState<keyof typeof FONTS>('Eveleth Clean');
  const [heightMm, setHeightMm] = useState(MAX_HEIGHT_MM);
  const [letterSpacingPercent, setLetterSpacingPercent] = useState(DEFAULT_LETTER_SPACING * 100);

  useEffect(() => {
    setText(getDefaultText(userName));
  }, [userName]);

  const typeface = typefaces[fontFamily];
  const label = useMemo(
    () =>
      typeface && text.trim()
        ? renderLabel(text, {
            typeface,
            size: mmToDots(heightMm),
            letterSpacing: letterSpacingPercent / 100,
          })
        : null,
    [typeface, text, heightMm, letterSpacingPercent],
  );
  const previewScale = PREVIEW_HEIGHT / HEAD_DOTS;

  const notifyError = () => {
    const { error: printerError } = useLabelPrinterStore.getState();
    if (!printerError) return;
    // the hint becomes the notice description
    noticeStore.addError(
      new Error(
        t(`labelPrinter.errors.byCode.${printerError.code}.hint`, {
          defaultValue: printerError.message ?? '',
        }),
      ),
      {
        title: t(`labelPrinter.errors.byCode.${printerError.code}.title`, {
          defaultValue: t('labelPrinter.errors.byCode.unknown.title'),
        }),
      },
    );
  };

  const onPrint = async (target?: ScannedPrinter) => {
    if (!label) return;
    if (!(await connectLabelPrinter(target))) return notifyError();
    if (!(await printLabel(label))) return notifyError();
    toastStore.add({
      message: t('labelPrinter.onPrint.success'),
      type: 'success',
      timeout: TOAST_SUCCESS_TIMEOUT,
    });
  };

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={() => {
        // do not keep the printer bound to this phone once the sheet is gone
        disconnectLabelPrinter();
        onClose?.();
      }}>
      <AppText
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('labelPrinter.title')}
      </AppText>

      <View style={tw`mt-6 flex flex-col gap-1`}>
        <ScrollView
          horizontal
          contentContainerStyle={tw`p-2`}
          showsHorizontalScrollIndicator={false}
          style={tw`rounded-xl border border-gray-300 bg-white dark:border-zinc-700`}>
          <Canvas
            style={{
              width: ((label?.width ?? 1) / FEED_STRETCH) * previewScale,
              height: PREVIEW_HEIGHT,
            }}>
            {label && (
              <Image
                fit="fill"
                height={PREVIEW_HEIGHT}
                image={label.image}
                // keep the printed dots crisp
                sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }}
                width={(label.width / FEED_STRETCH) * previewScale}
                x={0}
                y={0}
              />
            )}
          </Canvas>
        </ScrollView>
        <AppText style={tw`text-right text-xs text-slate-500 dark:text-neutral-500`}>
          {t('labelPrinter.length', {
            length: Math.ceil(label?.lengthMm ?? 0),
            max: LABEL_MAX_LENGTH_MM,
          })}
        </AppText>
      </View>

      <AppTextField
        containerStyle={tw`mt-4`}
        label={t('labelPrinter.text.label')}
        value={text}
        onChangeText={setText}
      />

      <AppText style={tw`min-h-5 text-base text-slate-500 dark:text-neutral-500`}>
        {t('labelPrinter.font.label')}
      </AppText>
      <AppSegmentedControl
        activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
        style={tw`mt-1 h-12 w-full bg-gray-200 dark:bg-zinc-800`}
        tabs={FONT_FAMILIES.map((family) => (
          <Text
            key={family}
            numberOfLines={1}
            style={[tw`text-base text-slate-900 dark:text-gray-200`, { fontFamily: family }]}>
            {family}
          </Text>
        ))}
        value={FONT_FAMILIES.indexOf(fontFamily)}
        onChange={(index) => setFontFamily(FONT_FAMILIES[index])}
      />

      <View style={tw`mt-4 flex flex-row justify-between`}>
        <AppText style={tw`min-h-5 text-base text-slate-500 dark:text-neutral-500`}>
          {t('labelPrinter.size.label')}
        </AppText>
        <AppText style={tw`text-base text-slate-900 dark:text-gray-200`}>
          {`${heightMm.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${t('labelPrinter.size.unit')}`}
        </AppText>
      </View>
      <Slider
        maximumValue={MAX_HEIGHT_MM}
        minimumValue={MIN_HEIGHT_MM}
        step={0.1}
        style={tw`mt-1`}
        value={heightMm}
        onValueChange={setHeightMm}
      />

      <View style={tw`mt-4 flex flex-row justify-between`}>
        <AppText style={tw`min-h-5 text-base text-slate-500 dark:text-neutral-500`}>
          {t('labelPrinter.letterSpacing.label')}
        </AppText>
        <AppText style={tw`text-base text-slate-900 dark:text-gray-200`}>
          {`${Math.round(letterSpacingPercent)} ${t('labelPrinter.letterSpacing.unit')}`}
        </AppText>
      </View>
      <Slider
        maximumValue={MAX_LETTER_SPACING_PERCENT}
        minimumValue={0}
        step={1}
        style={tw`mt-1`}
        value={letterSpacingPercent}
        onValueChange={setLetterSpacingPercent}
      />

      {printers.length > 1 && (
        <View style={tw`mt-4 flex flex-col`}>
          <AppText style={tw`mb-1 min-h-5 text-base text-slate-500 dark:text-neutral-500`}>
            {t('labelPrinter.choosePrinter')}
          </AppText>
          {printers.map((printer, index) => (
            <ServiceRow
              disabled={isConnecting || isPrinting}
              key={printer.id}
              label={printer.name}
              prefixIcon="printer"
              withBottomDivider={index < printers.length - 1}
              onPress={() => onPrint(printer)}
            />
          ))}
        </View>
      )}

      {error?.code === 'permission_denied' && (
        <AppTextButton style={tw`mt-4`} onPress={() => Linking.openSettings()}>
          {t('labelPrinter.openSettings')}
        </AppTextButton>
      )}

      {deviceName && (
        <AppText style={tw`mt-4 text-sm text-slate-500 dark:text-neutral-500`}>
          {t('labelPrinter.connectedTo', { name: deviceName })}
        </AppText>
      )}

      {Device.isDevice ? (
        <AppRoundedButton
          disabled={!label}
          label={t('labelPrinter.print')}
          loading={isScanning || isConnecting || isPrinting}
          style={tw`mt-6`}
          onPress={() => onPrint()}
        />
      ) : (
        <AppAlert description={t('labelPrinter.unavailable')} style={tw`mt-6`} type="warning" />
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(PrintLabelBottomSheet);
