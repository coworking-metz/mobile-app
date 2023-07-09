import Color from 'color';
import set from 'lodash.set';

// https://www.color-name.com/
export const theme = {
  meatBrown: '#EAB234',
  maizeCrayola: '#EEC15D',
  peachYellow: '#F7E0AE',
  papayaWhip: '#FBF0D6',
  darkVanilla: '#D9CB9E',
  onyx: '#374140',
  charlestonGreen: '#2A2C2B',
  silverSand: '#BDC3C7',
  blueCrayola: '#2962FF',
  frenchSkyBlue: '#7FA1FF',
  babyBlueEyes: '#A9C0FF',
  azureishWhite: '#D4E0FF',
};

// https://github.com/lottie-react-native/lottie-react-native/issues/671#issuecomment-823157024
// https://github.com/Noitidart/Colorize-Lottie
export const colouriseLottie = (json: unknown, colorByPath: { [k: string]: string }) => {
  const nextJson = JSON.parse(JSON.stringify(json));

  Object.entries(colorByPath).forEach(([path, color]) => {
    // incase undefined/null/falsy is passed to color
    if (!color) return;
    const rgbValues = Color(color).object();
    const rFraction = rgbValues.r / 255;
    const gFraction = rgbValues.g / 255;
    const bFraction = rgbValues.b / 255;

    const pathParts = path.split('.');
    set(nextJson, [...pathParts, 0], rFraction);
    set(nextJson, [...pathParts, 1], gFraction);
    set(nextJson, [...pathParts, 2], bFraction);
  });

  return nextJson;
};

// https://stackoverflow.com/a/35970186/15183871
export const padZero = (str: string, paddingLength?: string) => {
  const minimumLength = paddingLength || 2;
  const zeros = new Array(minimumLength).join('0');
  return (zeros + str).slice(-minimumLength);
};

export const invertColor = (hex: string, blackOrWhite?: boolean, named?: boolean): string => {
  let hexadecimalColor = hex;
  if (hexadecimalColor.indexOf('#') === 0) {
    hexadecimalColor = hexadecimalColor.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hexadecimalColor.length === 3) {
    hexadecimalColor =
      hexadecimalColor[0] +
      hexadecimalColor[0] +
      hexadecimalColor[1] +
      hexadecimalColor[1] +
      hexadecimalColor[2] +
      hexadecimalColor[2];
  }

  if (hexadecimalColor.length !== 6) {
    throw new Error(`Invalid HEX color ${hexadecimalColor}`);
  }
  const r = parseInt(hexadecimalColor.slice(0, 2), 16);
  const g = parseInt(hexadecimalColor.slice(2, 4), 16);
  const b = parseInt(hexadecimalColor.slice(4, 6), 16);

  if (blackOrWhite) {
    // https://stackoverflow.com/a/3943023/112731
    const isBlack = r * 0.299 + g * 0.587 + b * 0.114 > 186;
    if (named) {
      return isBlack ? 'black' : 'white';
    }
    return isBlack ? '#000000' : '#FFFFFF';
  }

  // invert color components
  const red = (255 - r).toString(16);
  const green = (255 - g).toString(16);
  const blue = (255 - b).toString(16);

  // pad each with zeros and return
  return `#${padZero(red)}${padZero(green)}${padZero(blue)}`;
};
