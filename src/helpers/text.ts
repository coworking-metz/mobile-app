import { Platform, TextStyle } from 'react-native';

// as font-weight isn't supported with custom font
// we map the font-weight to the closest available font
// https://github.com/expo/expo/issues/27647#issuecomment-2138495439

export type FontFamilyForWeight = Record<NonNullable<TextStyle['fontWeight']>, string>;

const fontFamilyForWeight = Platform.select({
  android: {
    '100': 'NotoSans_100Thin',
    '200': 'NotoSans_200ExtraLight',
    '300': 'NotoSans_300Light',
    '400': 'NotoSans_400Regular',
    '500': 'NotoSans_500Medium',
    '600': 'NotoSans_600SemiBold',
    '700': 'NotoSans_700Bold',
    '800': 'NotoSans_800ExtraBold',
    '900': 'NotoSans_900Black',
    normal: 'NotoSans_400Regular',
    bold: 'NotoSans_700Bold',
  },
  ios: {
    '100': 'NotoSans-Thin',
    '200': 'NotoSans-ExtraLight',
    '300': 'NotoSans-Light',
    '400': 'NotoSans-Regular',
    '500': 'NotoSans-Medium',
    '600': 'NotoSans-SemiBold',
    '700': 'NotoSans-Bold',
    '800': 'NotoSans-ExtraBold',
    '900': 'NotoSans-Black',
    normal: 'NotoSans-Regular',
    bold: 'NotoSans-Bold',
  },
}) as FontFamilyForWeight;

export const getFamilyForWeight = (fontWeight: TextStyle['fontWeight']) =>
  fontFamilyForWeight[fontWeight ?? '400'];
