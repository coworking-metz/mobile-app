import { Platform, TextStyle } from 'react-native';

// as font-weight isn't supported with custom font
// we map the font-weight to the closest available font
// https://github.com/expo/expo/issues/27647#issuecomment-2138495439

export type FontFamilyForWeight = Record<NonNullable<TextStyle['fontWeight']>, string>;

const fontFamilyForWeight = Platform.select({
  android: {
    '100': 'InterTight_100Thin',
    '200': 'InterTight_200ExtraLight',
    '300': 'InterTight_300Light',
    '400': 'InterTight_400Regular',
    '500': 'InterTight_500Medium',
    '600': 'InterTight_600SemiBold',
    '700': 'InterTight_700Bold',
    '800': 'InterTight_800ExtraBold',
    '900': 'InterTight_900Black',
    normal: 'InterTight_400Regular',
    bold: 'InterTight_700Bold',
  },
  ios: {
    '100': 'InterTight-Thin',
    '200': 'InterTight-ExtraLight',
    '300': 'InterTight-Light',
    '400': 'InterTight-Regular',
    '500': 'InterTight-Medium',
    '600': 'InterTight-SemiBold',
    '700': 'InterTight-Bold',
    '800': 'InterTight-ExtraBold',
    '900': 'InterTight-Black',
    normal: 'InterTight-Regular',
    bold: 'InterTight-Bold',
  },
}) as FontFamilyForWeight;

export const getFamilyForWeight = (fontWeight: TextStyle['fontWeight']) =>
  fontFamilyForWeight[fontWeight ?? '400'];
